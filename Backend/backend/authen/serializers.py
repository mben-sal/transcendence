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

class SignUpSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    intra_id = serializers.CharField(required=True)
    display_name = serializers.CharField(required=True)
    profile_image = serializers.ImageField(
        required=True,
        allow_empty_file=False,
        error_messages={
            'invalid': 'Please upload a valid image file',
            'required': 'Please provide a profile image'
        }
    )

    def validate_profile_image(self, value):
        try:
            # Vérifier le type MIME
            valid_types = ['image/jpeg', 'image/png', 'image/gif']
            if hasattr(value, 'content_type') and value.content_type not in valid_types:
                raise serializers.ValidationError(
                    f"Invalid file type: {value.content_type}. Allowed types are: JPEG, PNG, GIF"
                )

            # Vérifier la taille (5MB max)
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError(
                    "File too large. Size should not exceed 5 MB."
                )

            return value
        except Exception as e:
            print(f"Image validation error: {str(e)}")
            raise serializers.ValidationError(str(e))

    def validate_intra_id(self, value):
        if UserProfile.objects.filter(intra_id=value).exists():
            raise serializers.ValidationError("This login name is already taken.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value