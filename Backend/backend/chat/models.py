from django.db import models
from django.conf import settings
from authen.models import UserProfile

class Conversation(models.Model):
    CONVERSATION_TYPES = (
        ('private', 'Private'),
        ('group', 'Group'),
    )
    
    name = models.CharField(max_length=255, blank=True)  # Pour les groupes
    type = models.CharField(max_length=10, choices=CONVERSATION_TYPES, default='private')
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='conversations')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        if self.type == 'private':
            participants = self.participants.all()
            if participants.count() == 2:
                return f"Chat between {participants[0].username} and {participants[1].username}"
            return f"Private chat ({self.id})"
        return self.name
    
    class Meta:
        ordering = ['-updated_at']


class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Message from {self.sender.username} at {self.created_at}"
    
    class Meta:
        ordering = ['created_at']


class UserConversation(models.Model):
    """Keep track of user-specific conversation metadata like read status"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    last_read_at = models.DateTimeField(null=True, blank=True)
    is_muted = models.BooleanField(default=False)
    is_blocked = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ['user', 'conversation']
        
    def unread_count(self):
        """Return count of unread messages in this conversation for this user"""
        if not self.last_read_at:
            return self.conversation.messages.count()
        return self.conversation.messages.filter(created_at__gt=self.last_read_at).exclude(sender=self.user).count()