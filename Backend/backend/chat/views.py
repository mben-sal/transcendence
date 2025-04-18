from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Max, F, Count
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.contrib.auth import get_user_model

from .models import Conversation, Message, UserConversation
from .serializers import (
    ConversationListSerializer, 
    ConversationDetailSerializer,
    MessageSerializer,
    UserConversationSerializer
)

User = get_user_model()

class ConversationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Conversation.objects.filter(
            participants=self.request.user
        ).annotate(
            last_message_time=Max('messages__created_at')
        ).order_by('-last_message_time')
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ConversationDetailSerializer
        return ConversationListSerializer
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        # Extract data from request
        participant_ids = request.data.get('participants', [])
        chat_type = request.data.get('type', 'private')
        chat_name = request.data.get('name', '')
        
        # Add the current user to participants if not included
        if request.user.id not in participant_ids:
            participant_ids.append(request.user.id)
        
        # For private chat, check if conversation already exists
        if chat_type == 'private' and len(participant_ids) == 2:
            existing_conversation = Conversation.objects.filter(
                type='private',
                participants__id=participant_ids[0]
            ).filter(
                participants__id=participant_ids[1]
            ).distinct()
            
            if existing_conversation.exists():
                serializer = self.get_serializer(existing_conversation.first())
                return Response(serializer.data)
        
        # Create new conversation
        conversation = Conversation.objects.create(
            name=chat_name,
            type=chat_type
        )
        
        # Add participants
        for user_id in participant_ids:
            try:
                user = User.objects.get(id=user_id)
                conversation.participants.add(user)
                # Create UserConversation record for each participant
                UserConversation.objects.create(user=user, conversation=conversation)
            except User.DoesNotExist:
                pass
        
        # Return newly created conversation
        serializer = self.get_serializer(conversation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        conversation = self.get_object()
        user_conversation, created = UserConversation.objects.get_or_create(
            user=request.user,
            conversation=conversation
        )
        user_conversation.last_read_at = timezone.now()
        user_conversation.save()
        return Response({'status': 'messages marked as read'})
    
    @action(detail=True, methods=['post'])
    def block(self, request, pk=None):
        conversation = self.get_object()
        user_conversation, created = UserConversation.objects.get_or_create(
            user=request.user,
            conversation=conversation
        )
        user_conversation.is_blocked = True
        user_conversation.save()
        return Response({'status': 'conversation blocked'})
    
    @action(detail=True, methods=['post'])
    def unblock(self, request, pk=None):
        conversation = self.get_object()
        user_conversation, created = UserConversation.objects.get_or_create(
            user=request.user,
            conversation=conversation
        )
        user_conversation.is_blocked = False
        user_conversation.save()
        return Response({'status': 'conversation unblocked'})
    
    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        """Get all messages for a conversation"""
        conversation = self.get_object()
        messages = conversation.messages.all()
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)


class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    # http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    
    def get_queryset(self):
        conversation_id = self.kwargs.get('conversation_pk')
        return Message.objects.filter(conversation_id=conversation_id)
    
    def create(self, request, *args, **kwargs):
        conversation_id = self.kwargs.get('conversation_pk')
        
        try:
            conversation = Conversation.objects.get(id=conversation_id)
        except Conversation.DoesNotExist:
            return Response(
                {'error': 'Conversation not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if user is part of this conversation
        if not conversation.participants.filter(id=request.user.id).exists():
            return Response(
                {'error': 'You are not part of this conversation'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check if conversation is blocked by user
        try:
            user_conversation = UserConversation.objects.get(
                user=request.user,
                conversation=conversation
            )
            if user_conversation.is_blocked:
                return Response(
                    {'error': 'You have blocked this conversation'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
        except UserConversation.DoesNotExist:
            pass
        
        # Create message
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        message = serializer.save(
            sender=request.user,
            conversation=conversation
        )
        
        # Update conversation's updated_at timestamp
        conversation.updated_at = timezone.now()
        conversation.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message_view(request, conversation_id):
    try:
        conversation = Conversation.objects.get(id=conversation_id)
    except Conversation.DoesNotExist:
        return Response({'error': 'Conversation not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Vérifier si l'utilisateur fait partie de la conversation
    if not conversation.participants.filter(id=request.user.id).exists():
        return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
    
    content = request.data.get('content', '')
    if not content.strip():
        return Response({'error': 'Message cannot be empty'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Créer le message
    message = Message.objects.create(
        conversation=conversation,
        sender=request.user,
        content=content
    )
    
    # Sérialiser et renvoyer
    serializer = MessageSerializer(message)
    return Response(serializer.data, status=status.HTTP_201_CREATED)