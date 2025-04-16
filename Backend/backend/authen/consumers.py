# consumers.py
# consumers.py
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Notification

class NotificationConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        print(f"Tentative de connexion WebSocket pour l'utilisateur: {self.scope.get('user', 'Anonymous')}")
        
        # Vérifier si l'utilisateur est authentifié
        if self.scope["user"].is_anonymous:
            print("Utilisateur non authentifié, connexion refusée")
            await self.close()
            return
            
        # L'utilisateur est authentifié, continuer
        self.user_id = self.scope["user"].id
        self.group_name = f"user_{self.user_id}"
        
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()
        print(f"Connexion WebSocket acceptée pour l'utilisateur ID: {self.user_id}")

    async def disconnect(self, close_code):
        # Se désabonner du groupe
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )
        print(f"Déconnexion WebSocket, code: {close_code}")

    async def notification_message(self, event):
        # Envoyer la notification au client
        await self.send_json(event['message'])
        print(f"Notification envoyée à l'utilisateur ID: {self.user_id}")