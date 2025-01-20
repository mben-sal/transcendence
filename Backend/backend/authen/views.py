from django.shortcuts import redirect
from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
import requests
from .models import UserProfile
from .serializers import UserSerializer, LoginSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework_simplejwt.tokens import RefreshToken


class LoginView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        request_body=LoginSerializer,
        responses={
            200: openapi.Response(
                description="Success",
                examples={
                    "application/json": {
                        "status": "success",
                        "token": "jwt.token.here",
                        "user": {
                            "id": 1,
                            "username": "user",
                            "email": "user@example.com"
                        }
                    }
                }
            ),
            400: "Invalid data",
            401: "Invalid credentials"
        }
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            try:
                user = User.objects.get(email=email)
                if user.check_password(password):
                    refresh = RefreshToken.for_user(user)
                    return Response({
                        'status': 'success',
                        'token': str(refresh.access_token),
                        'refresh_token': str(refresh),
                        'user': UserSerializer(user).data
                    })
            except User.DoesNotExist:
                pass
            
            return Response({
                'status': 'error',
                'message': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FortyTwoLoginView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Initiate OAuth2 login flow with 42",
        responses={302: "Redirect to 42 authentication page"}
    )
    def get(self, request):
        auth_url = "https://api.intra.42.fr/oauth/authorize"
        params = {
            'client_id': settings.FT_CLIENT_ID,
            'redirect_uri': settings.FT_REDIRECT_URI,
            'response_type': 'code',
            'scope': 'public'
        }
        auth_url = f"{auth_url}?{'&'.join(f'{k}={v}' for k, v in params.items())}"
        return redirect(auth_url)


class FortyTwoCallbackView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                'code',
                openapi.IN_QUERY,
                description="Authorization code from 42",
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        responses={
            200: openapi.Response(
                description="Success",
                examples={
                    "application/json": {
                        "status": "success",
                        "token": "jwt.token.here",
                        "user": {
                            "id": 1,
                            "username": "42user",
                            "email": "42user@example.com"
                        }
                    }
                }
            ),
            400: "Invalid code or authorization failed"
        }
    )
    def get(self, request):
        code = request.GET.get('code')
        if not code:
            return Response({
                'status': 'error',
                'message': 'No authorization code provided'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Exchange code for access token
            token_response = requests.post(
                "https://api.intra.42.fr/oauth/token",
                data={
                    'grant_type': 'authorization_code',
                    'client_id': settings.FT_CLIENT_ID,
                    'client_secret': settings.FT_CLIENT_SECRET,
                    'code': code,
                    'redirect_uri': settings.FT_REDIRECT_URI
                }
            )
            token_data = token_response.json()
            
            if 'error' in token_data:
                return Response({
                    'status': 'error',
                    'message': token_data.get('error_description', 'Failed to obtain access token')
                }, status=status.HTTP_400_BAD_REQUEST)

            access_token = token_data.get('access_token')
            
            # Get user info from 42 API
            user_response = requests.get(
                'https://api.intra.42.fr/v2/me',
                headers={'Authorization': f'Bearer {access_token}'}
            )
            user_data = user_response.json()

            if 'error' in user_data:
                return Response({
                    'status': 'error',
                    'message': 'Failed to get user information'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Create or get user
            user, _ = User.objects.get_or_create(
                username=user_data['login'],
                defaults={'email': user_data.get('email', '')}
            )

            # Create or update user profile
            profile, _ = UserProfile.objects.get_or_create(
                user=user,
                defaults={
                    'intra_id': str(user_data['id']),
                    'avatar': user_data.get('image_url', ''),
                    'display_name': user_data['login']
                }
            )

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            response_data = {
                'status': 'success',
                'token': str(refresh.access_token),
                'refresh_token': str(refresh),
                'user': UserSerializer(user).data
            }

            # Redirect to frontend with tokens as URL parameters
            frontend_url = settings.FRONTEND_URL  # Add this to your settings.py
            redirect_url = f"{frontend_url}?token={response_data['token']}&refresh_token={response_data['refresh_token']}"
            return redirect(redirect_url)

        except requests.RequestException as e:
            return Response({
                'status': 'error',
                'message': f'Network error: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'Unexpected error: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)