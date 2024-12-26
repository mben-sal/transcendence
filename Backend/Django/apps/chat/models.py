from django.db import models
from django.contrib.auth.models import User

class Conversation(models.Model):
    TYPES = (
        ('private', 'Private'),
        ('group', 'Group'),
    )
    type = models.CharField(max_length=7, choices=TYPES)
    name = models.CharField(max_length=255, null=True, blank=True)
    participants = models.ManyToManyField(User, related_name='conversations')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

class GroupChat(models.Model):
    conversation = models.OneToOneField(Conversation, on_delete=models.CASCADE)
    admin = models.ForeignKey(User, on_delete=models.CASCADE, related_name='administered_groups')
    description = models.TextField(blank=True)

class PrivateChat(models.Model):
    conversation = models.OneToOneField(Conversation, on_delete=models.CASCADE)
    last_activity = models.DateTimeField(auto_now=True)