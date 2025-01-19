from django.shortcuts import redirect
from django.conf import settings
from django.contrib.auth import login
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
from .models import UserProfile

class FortyTwoLoginView(APIView):
    def get(self, request):
        # Redirect to 42's OAuth authorization URL
        auth_url = f"https://api.intra.42.fr/oauth/authorize"
        params = {
            'client_id': settings.FT_CLIENT_ID,
            'redirect_uri': settings.FT_REDIRECT_URI,
            'response_type': 'code',
            'scope': 'public'
        }
        auth_url = f"{auth_url}?{'&'.join(f'{k}={v}' for k, v in params.items())}"
        return redirect(auth_url)

class FortyTwoCallbackView(APIView):
    def get(self, request):
        code = request.GET.get('code')
        if not code:
            return Response({'error': 'No code provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Exchange code for access token
        token_url = "https://api.intra.42.fr/oauth/token"
        data = {
            'grant_type': 'authorization_code',
            'client_id': settings.FT_CLIENT_ID,
            'client_secret': settings.FT_CLIENT_SECRET,
            'code': code,
            'redirect_uri': settings.FT_REDIRECT_URI
        }
        
        try:
            token_response = requests.post(token_url, data=data)
            token_data = token_response.json()
            access_token = token_data.get('access_token')

            # Get user info from 42 API
            headers = {'Authorization': f'Bearer {access_token}'}
            user_response = requests.get('https://api.intra.42.fr/v2/me', headers=headers)
            user_data = user_response.json()

            # Create or get user
            user, created = User.objects.get_or_create(
                username=user_data['login'],
                defaults={'email': user_data['email']}
            )

            # Create or update user profile
            profile, created = UserProfile.objects.get_or_create(
                user=user,
                defaults={
                    'intra_id': str(user_data['id']),
                    'avatar': user_data['image_url'],
                    'display_name': user_data['login']
                }
            )

            # Log the user in
            login(request, user)
            
            return redirect('/') # Redirect to frontend home page

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)