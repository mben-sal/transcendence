from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(
        help_text="User's email address",
        required=True
    )
    password = serializers.CharField(
        style={'input_type': 'password'},
        help_text="User's password",
        required=True,
        write_only=True
    )

class UserProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = UserProfile
        fields = ('id', 'first_name', 'last_name', 'email', 'intra_id', 'avatar', 
                 'display_name', 'status', 'two_factor_enabled', 'wins', 'losses')

def update(self, instance, validated_data):
    user = instance.user
    user.first_name = validated_data.get('user', {}).get('first_name', user.first_name)
    user.last_name = validated_data.get('user', {}).get('last_name', user.last_name)
    user.save()

    if 'two_factor_enabled' in validated_data:
        instance.two_factor_enabled = validated_data['two_factor_enabled']
    instance.save()

    return instance