from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Conversation, Message, UserConversation
from authen.models import UserProfile
from authen.serializers import UserProfileSerializer

User = get_user_model()

class UserChatSerializer(serializers.ModelSerializer):
    """Serialize basic user info needed for chat"""
    avatar = serializers.SerializerMethodField()
    display_name = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'avatar', 'display_name', 'status']
    
    def get_avatar(self, obj):
        try:
            return obj.userprofile.avatar
        except UserProfile.DoesNotExist:
            return None
            
    def get_display_name(self, obj):
        try:
            return obj.userprofile.display_name
        except UserProfile.DoesNotExist:
            return obj.username
            
    def get_status(self, obj):
        try:
            return obj.userprofile.status
        except UserProfile.DoesNotExist:
            return 'offline'


class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()
    sender_avatar = serializers.SerializerMethodField()
    
    class Meta:
        model = Message
        fields = ['id', 'sender', 'sender_name', 'sender_avatar', 'content', 'created_at']
    
    def get_sender_name(self, obj):
        try:
            return obj.sender.userprofile.display_name
        except UserProfile.DoesNotExist:
            return obj.sender.username
            
    def get_sender_avatar(self, obj):
        try:
            return obj.sender.userprofile.avatar
        except UserProfile.DoesNotExist:
            return None


class ConversationListSerializer(serializers.ModelSerializer):
    """Used when listing conversations"""
    participants = UserChatSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    
    class Meta:
        model = Conversation
        fields = ['id', 'name', 'type', 'participants', 'last_message', 'unread_count', 'avatar', 'updated_at']
    
    def get_last_message(self, obj):
        message = obj.messages.last()
        if message:
            return {
                'content': message.content,
                'created_at': message.created_at,
                'sender': message.sender.id,
                'sender_name': self.get_sender_name(message.sender)
            }
        return None
    
    def get_unread_count(self, obj):
        user = self.context.get('request').user
        try:
            user_conversation = UserConversation.objects.get(user=user, conversation=obj)
            return user_conversation.unread_count()
        except UserConversation.DoesNotExist:
            return obj.messages.count()
    
    def get_name(self, obj):
        """For private chats, use the other participant's name"""
        if obj.type == 'private':
            current_user = self.context.get('request').user
            other_participant = obj.participants.exclude(id=current_user.id).first()
            if other_participant:
                try:
                    return other_participant.userprofile.display_name
                except UserProfile.DoesNotExist:
                    return other_participant.username
        return obj.name
        
    def get_sender_name(self, user):
        try:
            return user.userprofile.display_name
        except UserProfile.DoesNotExist:
            return user.username
    
    def get_avatar(self, obj):
        """For private chats, get the other user's avatar"""
        if obj.type == 'private':
            current_user = self.context.get('request').user
            other_participant = obj.participants.exclude(id=current_user.id).first()
            if other_participant:
                try:
                    return other_participant.userprofile.avatar
                except UserProfile.DoesNotExist:
                    return None
        return None


class ConversationDetailSerializer(serializers.ModelSerializer):
    """Used when viewing a single conversation with messages"""
    participants = UserChatSerializer(many=True, read_only=True)
    messages = MessageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Conversation
        fields = ['id', 'name', 'type', 'participants', 'messages', 'created_at', 'updated_at']


class UserConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserConversation
        fields = ['is_muted', 'is_blocked', 'last_read_at']