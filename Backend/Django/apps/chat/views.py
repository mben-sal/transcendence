from rest_framework import viewsets, status
from .models import GroupChat, PrivateChat

class ConversationViewSet(viewsets.ModelViewSet):
    def create(self, request):
        chat_type = request.data.get('type')
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        conversation = serializer.save()
        
        if chat_type == 'group':
            GroupChat.objects.create(
                conversation=conversation,
                admin=request.user,
                description=request.data.get('description', '')
            )
        else:
            PrivateChat.objects.create(conversation=conversation)
            
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add_participant(self, request, pk=None):
        conversation = self.get_object()
        user_id = request.data.get('user_id')
        try:
            user = User.objects.get(id=user_id)
            conversation.participants.add(user)
            return Response(status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)