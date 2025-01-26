from django.urls import path
from .views import FortyTwoLoginView, FortyTwoCallbackView, LoginView, UserProfileView, LogoutView

urlpatterns = [
    path('auth/42/login/', FortyTwoLoginView.as_view(), name='ft_login'),
    path('auth/42/callback/', FortyTwoCallbackView.as_view(), name='ft_callback'),
    path('users/login/', LoginView.as_view(), name='login'),
    path('users/profile/', UserProfileView.as_view(), name='user-profile'),
	path('users/logout/', LogoutView.as_view(), name='logout'),

]