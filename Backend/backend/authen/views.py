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

    def get(self, request):
        code = request.GET.get('code')
        if not code:
            return Response({
                'status': 'error',
                'message': 'No authorization code provided'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Log pour debug
            print("Code reçu:", code)
            print("Client ID utilisé:", settings.FT_CLIENT_ID)
            print("Redirect URI utilisé:", settings.FT_REDIRECT_URI)

            token_response = requests.post(
                'https://api.intra.42.fr/oauth/token',
                data={
                    'grant_type': 'authorization_code',
                    'client_id': settings.FT_CLIENT_ID,
                    'client_secret': settings.FT_CLIENT_SECRET,
                    'code': code,
                    'redirect_uri': settings.FT_REDIRECT_URI
                },
                headers={
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            )

            print("Response complète:", token_response.text)
            print("Status code:", token_response.status_code)

            if token_response.status_code != 200:
                return Response({
                    'status': 'error',
                    'message': f'Token exchange failed: {token_response.text}'
                }, status=status.HTTP_400_BAD_REQUEST)

            token_data = token_response.json()
            user_response = requests.get(
                'https://api.intra.42.fr/v2/me',
                headers={
                    'Authorization': f"Bearer {token_data['access_token']}"
                }
            )

            if user_response.status_code != 200:
                return Response({
                    'status': 'error',
                    'message': f'Failed to fetch user data: {user_response.text}'
                }, status=status.HTTP_400_BAD_REQUEST)

            user_data = user_response.json()
            
            # Créer ou récupérer l'utilisateur
            try:
                user = User.objects.get(username=user_data['login'])
            except User.DoesNotExist:
                user = User.objects.create(
                    username=user_data['login'],
                    email=user_data.get('email', '')
                )

            # Mettre à jour ou créer le profil
            UserProfile.objects.update_or_create(
                user=user,
                defaults={
                    'intra_id': str(user_data['id']),
                    'avatar': user_data.get('image_url', ''),
                    'display_name': user_data['login']
                }
            )

            # Générer les tokens
            refresh = RefreshToken.for_user(user)
            tokens = {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }

            # Rediriger vers le frontend
            return redirect(
                f"{settings.FRONTEND_URL}/auth/two-factor?token={tokens['access']}&refresh_token={tokens['refresh']}"
            )

        except Exception as e:
            print("Error during authentication:", str(e))  # Log pour debug
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)