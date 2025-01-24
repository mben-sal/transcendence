from django.shortcuts import redirect
from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
import requests
from .models import UserProfile
from .serializers import UserSerializer, LoginSerializer, UserProfileSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework_simplejwt.tokens import RefreshToken
from urllib.parse import urlencode

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

    def get(self, request):
        state = request.GET.get('state', 'signin')  # Pour différencier signin/signup
        auth_params = {
            'client_id': settings.FT_CLIENT_ID,
            'redirect_uri': settings.FT_REDIRECT_URI,
            'response_type': 'code',
            'scope': 'public',
            'state': state
        }
        
        auth_url = f"https://api.intra.42.fr/oauth/authorize?{urlencode(auth_params)}"
        return redirect(auth_url)

class FortyTwoCallbackView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        print("=== Starting FortyTwoCallbackView ===")
        code = request.GET.get('code')
        state = request.GET.get('state', 'signin')
        print(f"Received code: {code}, state: {state}")

        try:
            # Token exchange with 42 API
            token_response = requests.post(
                settings.FT_TOKEN_URL,
                data={
                    'grant_type': 'authorization_code',
                    'client_id': settings.FT_CLIENT_ID,
                    'client_secret': settings.FT_CLIENT_SECRET,
                    'code': code,
                    'redirect_uri': settings.FT_REDIRECT_URI
                }
            )
            token_data = token_response.json()

            # Get user info from 42 API
            user_response = requests.get(
                f'{settings.FT_API_URL}/v2/me',
                headers={'Authorization': f'Bearer {token_data["access_token"]}'}
            )
            user_data = user_response.json()

            # Create or update user and profile
            user, created = User.objects.get_or_create(
                username=user_data['login'],
                defaults={'email': user_data.get('email', '')}
            )

            # Create or update the profile
            profile, _ = UserProfile.objects.get_or_create(
                user=user,
                defaults={
                    'intra_id': user_data['login'],
                    'avatar': user_data.get('image', {}).get('link', ''),
                    'display_name': user_data.get('displayname', user_data['login']),
                    'status': 'online'
                }
            )

            # Update profile fields if not created
            if not _:
                profile.avatar = user_data.get('image', {}).get('link', profile.avatar)
                profile.status = 'online'
                profile.save()

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            # Construct redirect URL with tokens
            redirect_url = (
                f"{settings.FRONTEND_URL}/auth/callback"
                f"?access_token={str(refresh.access_token)}"
                f"&refresh_token={str(refresh)}"
                f"&is_new_user={str(created).lower()}"
            )
            
            return redirect(redirect_url)

        except requests.exceptions.RequestException as e:
            print(f"API Request error: {str(e)}")
            return Response({
                'status': 'error',
                'message': f"API Request error: {str(e)}"
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            print(f"Error type: {type(e)}")
            import traceback
            traceback.print_exc()
            return Response({
                'status': 'error',
                'message': f"Unexpected error: {str(e)}"
            }, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get the profile of the authenticated user"""
        try:
            profile = UserProfile.objects.get(user=request.user)
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response({
                'error': 'Profile not found'
            }, status=status.HTTP_404_NOT_FOUND)

    def put(self, request):
        try:
            profile = UserProfile.objects.get(user=request.user)
            print("Received data:", request.data)  # Debug log

            serializer = UserProfileSerializer(
                profile,
                data=request.data
            )
            if serializer.is_valid():
                updated_profile = serializer.save()
                print("Updated profile:", UserProfileSerializer(updated_profile).data)  # Debug log
                return Response(UserProfileSerializer(updated_profile).data)
                
            print("Validation errors:", serializer.errors)  # Debug log
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print("Update error:", str(e))  # Debug log
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        """Delete user account and profile"""
        try:
            user = request.user
            user.delete()  # This will also delete the associated profile due to CASCADE
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)