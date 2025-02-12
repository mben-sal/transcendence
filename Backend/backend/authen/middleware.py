# # middleware.py
# from django.utils import timezone
# from datetime import timedelta
# from .models import UserProfile

# class UserStatusMiddleware:
#     def __init__(self, get_response):
#         self.get_response = get_response

#     def __call__(self, request):
#         # Marquer comme hors ligne les utilisateurs inactifs depuis plus de 2 minutes
#         UserProfile.objects.filter(
#             status='online',
#             updated_at__lt=timezone.now() - timedelta(minutes=2)
#         ).update(status='offline')
        
#         response = self.get_response(request)
#         return response