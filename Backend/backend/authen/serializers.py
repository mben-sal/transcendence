from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'avatar')
        
    def get_avatar(self, obj):
        try:
            return obj.userprofile.avatar
        except UserProfile.DoesNotExist:
            return UserProfile.DEFAULT_AVATAR

class LoginSerializer(serializers.Serializer):
    login_name = serializers.CharField(
        help_text="User's login name",
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

class SignUpSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    intra_id = serializers.CharField(required=True)
    display_name = serializers.CharField(required=True)

    def validate_intra_id(self, value):
        if UserProfile.objects.filter(intra_id=value).exists():
            raise serializers.ValidationError("This login name is already taken.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.UUIDField(required=True)
    new_password = serializers.CharField(
        required=True,
        write_only=True,
        min_length=8,
        style={'input_type': 'password'}
    )