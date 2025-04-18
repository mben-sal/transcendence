import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import Conversation, Message, UserConversation
from authen.models import Notification

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.conversation_group_name = f'chat_{self.conversation_id}'
        
        print(f"[WebSocket] Tentative de connexion pour l'utilisateur: {self.user}, ID: {getattr(self.user, 'id', 'Anonymous')}")
        print(f"[WebSocket] Paramètres de l'URL: {self.scope.get('query_string', b'').decode()}")
        print(f"[WebSocket] Headers: {self.scope.get('headers', [])}")
        
        # Vérifier si l'utilisateur est authentifié
        if self.user.is_anonymous:
            print("[WebSocket] Utilisateur non authentifié, connexion refusée")
            await self.close(code=4001)
            return
        
        # Check if user has access to this conversation
        has_access = await self.check_conversation_access()
        if not has_access:
            print(f"[WebSocket] Utilisateur {self.user.id} n'a pas accès à la conversation {self.conversation_id}")
            await self.close(code=4003)
            return
        
        try:
            # Join room group
            await self.channel_layer.group_add(
                self.conversation_group_name,
                self.channel_name
            )
            
            await self.accept()
            print(f"[WebSocket] Connexion acceptée pour l'utilisateur ID: {self.user.id} à la conversation {self.conversation_id}")
            
            # Envoyer un message de bienvenue pour confirmer la connexion
            await self.send(text_data=json.dumps({
                'type': 'connection_established',
                'message': 'Connexion WebSocket établie avec succès!'
            }))
        except Exception as e:
            print(f"[WebSocket] Erreur lors de l'établissement de la connexion: {e}")
            await self.close(code=4000)
    
    async def disconnect(self, close_code):
        # Leave room group
        if hasattr(self, 'conversation_group_name'):
            try:
                await self.channel_layer.group_discard(
                    self.conversation_group_name,
                    self.channel_name
                )
                print(f"[WebSocket] Déconnexion réussie pour l'utilisateur ID: {getattr(self.user, 'id', 'Unknown')}, code: {close_code}")
            except Exception as e:
                print(f"[WebSocket] Erreur lors de la déconnexion: {e}")
        else:
            print(f"[WebSocket] Déconnexion, pas de groupe de conversation défini, code: {close_code}")
    
    # Receive message from WebSocket
    async def receive(self, text_data):
        try:
            print(f"[WebSocket] Réception de données: {text_data[:100]}...")
            text_data_json = json.loads(text_data)
            message_content = text_data_json.get('message', '')
            
            # Check if it's not an empty message
            if not message_content.strip():
                print("[WebSocket] Message vide reçu, ignoré")
                return
            
            # Save message to database
            message = await self.save_message(message_content)
            print(f"[WebSocket] Message sauvegardé: ID={message['id']}")
            
            # Send message to room group
            await self.channel_layer.group_send(
                self.conversation_group_name,
                {
                    'type': 'chat_message',
                    'message': {
                        'id': message['id'],
                        'sender': message['sender'],
                        'sender_name': message['sender_name'],
                        'sender_avatar': message['sender_avatar'],
                        'content': message['content'],
                        'created_at': message['created_at'].isoformat()
                    }
                }
            )
            
            # Create notification for other participants
            await self.create_message_notification(message)
        except json.JSONDecodeError:
            print(f"[WebSocket] Erreur de décodage JSON: {text_data[:100]}...")
        except Exception as e:
            print(f"[WebSocket] Erreur lors du traitement du message: {e}")
    
    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        
        try:
            # Send message to WebSocket
            await self.send(text_data=json.dumps({
                'message': message
            }))
            print(f"[WebSocket] Message envoyé au client: ID={message['id']}")
        except Exception as e:
            print(f"[WebSocket] Erreur lors de l'envoi du message au client: {e}")
    
    @database_sync_to_async
    def check_conversation_access(self):
        try:
            conversation = Conversation.objects.get(id=self.conversation_id)
            has_access = conversation.participants.filter(id=self.user.id).exists()
            print(f"[WebSocket] Vérification d'accès: utilisateur={self.user.id}, conversation={self.conversation_id}, accès={'autorisé' if has_access else 'refusé'}")
            return has_access
        except Conversation.DoesNotExist:
            print(f"[WebSocket] Conversation {self.conversation_id} n'existe pas")
            return False
        except Exception as e:
            print(f"[WebSocket] Erreur lors de la vérification d'accès: {e}")
            return False
    
    @database_sync_to_async
    def save_message(self, content):
        try:
            conversation = Conversation.objects.get(id=self.conversation_id)
            message = Message.objects.create(
                conversation=conversation,
                sender=self.user,
                content=content
            )
            
            # Update conversation timestamp
            conversation.save()  # This will update the updated_at field
            
            sender_name = self.user.userprofile.display_name if hasattr(self.user, 'userprofile') else self.user.username
            sender_avatar = self.user.userprofile.avatar if hasattr(self.user, 'userprofile') else None
            
            return {
                'id': message.id,
                'sender': message.sender.id,
                'sender_name': sender_name,
                'sender_avatar': sender_avatar,
                'content': message.content,
                'created_at': message.created_at
            }
        except Exception as e:
            print(f"[WebSocket] Erreur lors de la sauvegarde du message: {e}")
            raise
    
    @database_sync_to_async
    def create_message_notification(self, message_data):
        """Create notifications for other participants in the conversation"""
        try:
            conversation = Conversation.objects.get(id=self.conversation_id)
            other_participants = conversation.participants.exclude(id=self.user.id)
            
            sender_name = self.user.userprofile.display_name if hasattr(self.user, 'userprofile') else self.user.username
            
            notification_count = 0
            # Create notifications
            for participant in other_participants:
                # Skip if user is online in this conversation (already seeing the message)
                user_conversation = UserConversation.objects.filter(
                    user=participant, 
                    conversation=conversation,
                    is_blocked=False
                ).first()
                
                if user_conversation:
                    # Create notification
                    Notification.objects.create(
                        recipient=participant,
                        sender=self.user,
                        notification_type='message',
                        content=f"{sender_name}: {message_data['content'][:50]}..."
                    )
                    notification_count += 1
            
            print(f"[WebSocket] {notification_count} notifications créées pour le message ID={message_data['id']}")
        except Exception as e:
            print(f"[WebSocket] Erreur lors de la création des notifications: {e}")