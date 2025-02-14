from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Notification

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
    password = serializers.CharField(
        write_only=True, 
        required=True,
        min_length=8
    )
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    login_name = serializers.CharField(
        required=True,
        min_length=3,
        max_length=100
    )
    two_factor_enabled = serializers.BooleanField(default=False, required=False)

    def validate_login_name(self, value):
        if UserProfile.objects.filter(intra_id=value).exists():
            raise serializers.ValidationError("Ce nom d'utilisateur est déjà pris.")
        if not value.isalnum():
            raise serializers.ValidationError("Le nom d'utilisateur ne peut contenir que des lettres et des chiffres.")
        return value.lower()

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Cet email est déjà enregistré.")
        return value.lower()

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Le mot de passe doit contenir au moins 8 caractères.")
        if not any(char.isdigit() for char in value):
            raise serializers.ValidationError("Le mot de passe doit contenir au moins un chiffre.")
        if not any(char.isupper() for char in value):
            raise serializers.ValidationError("Le mot de passe doit contenir au moins une majuscule.")
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
    
class DeleteAccountConfirmSerializer(serializers.Serializer):
    password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )


class TwoFactorVerifySerializer(serializers.Serializer):
    code = serializers.CharField(min_length=6, max_length=6)

class TwoFactorLoginResponseSerializer(serializers.Serializer):
    requires_2fa = serializers.BooleanField()
    temp_token = serializers.CharField(required=False)
    token = serializers.CharField(required=False)
    refresh_token = serializers.CharField(required=False)
    user = UserProfileSerializer(required=False)


class NotificationSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.userprofile.display_name', read_only=True)
    sender_avatar = serializers.CharField(source='sender.userprofile.avatar', read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'notification_type', 'content', 'is_read', 'created_at', 
                 'sender_name', 'sender_avatar']