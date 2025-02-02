from django.urls import path
from .views import (
    FortyTwoLoginView, 
    FortyTwoCallbackView, 
    LoginView, 
    UserProfileView, 
    LogoutView,
    UpdateAvatarView,
    SignUpView,
	PasswordResetRequestView,
	PasswordResetConfirmView
)

urlpatterns = [
    path('users/signup/', SignUpView.as_view(), name='signup'),
    path('auth/42/login/', FortyTwoLoginView.as_view(), name='ft_login'),
    path('auth/42/callback/', FortyTwoCallbackView.as_view(), name='ft_callback'),
    path('users/login/', LoginView.as_view(), name='login'),
    path('users/profile/', UserProfileView.as_view(), name='user-profile'),
    path('users/logout/', LogoutView.as_view(), name='logout'),
    path('users/avatar/', UpdateAvatarView.as_view(), name='update-avatar'),
	path('users/password-reset/', PasswordResetRequestView.as_view(), name='password-reset-request'),
	path('users/password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
]