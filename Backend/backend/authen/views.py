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
import os
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile


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
        state = request.GET.get('state', 'signin')
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

            user_response = requests.get(
                f'{settings.FT_API_URL}/v2/me',
                headers={'Authorization': f'Bearer {token_data["access_token"]}'}
            )
            user_data = user_response.json()
            user, created = User.objects.get_or_create(
                username=user_data['login'],
                defaults={
                    'email': user_data.get('email', ''),
                    'first_name': user_data.get('first_name', ''),
                    'last_name': user_data.get('last_name', ''),
                },
            )

            profile, _ = UserProfile.objects.get_or_create(
                user=user,
                defaults={
                    'intra_id': user_data['login'],
                    'avatar': user_data.get('image', {}).get('link', ''),
                    'display_name': user_data.get('displayname', user_data['login']),
                    'status': 'online'
                }
            )

            if not _:
                # profile.avatar = user_data.get('image', {}).get('link', profile.avatar)
                profile.status = 'online'
                profile.save()

            refresh = RefreshToken.for_user(user)
            
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
        try:
            profile = UserProfile.objects.get(user=request.user)
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request):
        try:
            profile = UserProfile.objects.get(user=request.user)
            
            # Update user fields directly
            user = profile.user
            user.first_name = request.data.get('first_name', user.first_name)
            user.last_name = request.data.get('last_name', user.last_name)
            user.save()
            
            # Update profile fields
            if 'two_factor_enabled' in request.data:
                profile.two_factor_enabled = request.data['two_factor_enabled']
                profile.save()
            
            return Response(UserProfileSerializer(profile).data)
        except Exception as e:
            print("Update error:", str(e))
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'status': 'success'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os
from rest_framework_simplejwt.authentication import JWTAuthentication

class UpdateAvatarView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print("=== Starting avatar upload ===")
        try:
            print("Files in request:", request.FILES)
            
            if 'avatar' not in request.FILES:
                print("No avatar file found in request")
                return Response(
                    {'error': 'No image file provided'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            image_file = request.FILES['avatar']
            print(f"File type: {image_file.content_type}")
            print(f"File size: {image_file.size}")
            
            # Vérifier le type de fichier
            allowed_types = ['image/jpeg', 'image/png', 'image/gif']
            if image_file.content_type not in allowed_types:
                print(f"Invalid file type: {image_file.content_type}")
                return Response(
                    {'error': f'Invalid file type: {image_file.content_type}. Only JPEG, PNG and GIF are allowed.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Créer le chemin du fichier
            file_extension = os.path.splitext(image_file.name)[1].lower()
            if not file_extension:
                file_extension = '.jpg'  # Default extension
            
            file_path = f'avatars/user_{request.user.id}{file_extension}'
            print(f"Saving to path: {file_path}")

            try:
                # Sauvegarder le fichier
                path = default_storage.save(file_path, ContentFile(image_file.read()))
                print(f"File saved successfully at: {path}")
                
                # Construire l'URL complète
                file_url = f"/media/{path}"
                print(f"File URL: {file_url}")

                # Mettre à jour le profil utilisateur
                profile = request.user.userprofile
                profile.avatar = file_url
                profile.save()
                print("Profile updated successfully")

                return Response({
                    'status': 'success',
                    'avatarUrl': file_url
                })

            except Exception as e:
                print(f"Error saving file: {str(e)}")
                raise

        except Exception as e:
            print(f"Error handling avatar upload: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )