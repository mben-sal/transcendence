from django.urls import path
from .views import FortyTwoLoginView, FortyTwoCallbackView

urlpatterns = [
    path('auth/42/login/', FortyTwoLoginView.as_view(), name='ft_login'),
    path('auth/42/callback/', FortyTwoCallbackView.as_view(), name='ft_callback'),
]