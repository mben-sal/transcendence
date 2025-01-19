from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    intra_id = models.CharField(max_length=100, unique=True)
    avatar = models.URLField(max_length=500, blank=True)
    display_name = models.CharField(max_length=100, unique=True)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    
    def __str__(self):
        return f"{self.display_name} ({self.user.username})"