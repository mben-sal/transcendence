from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken
from urllib.parse import parse_qs
import jwt
from django.conf import settings

User = get_user_model()

class TokenAuthMiddleware(BaseMiddleware):
    """
    Middleware d'authentification personnalisé pour WebSocket.
    Vérifie le token JWT dans l'URL et authentifie l'utilisateur.
    """
    
    async def __call__(self, scope, receive, send):
        # Extraire le token des paramètres de requête
        query_string = scope.get('query_string', b'').decode()
        query_params = parse_qs(query_string)
        token = query_params.get('token', [''])[0]
        
        print(f"[WebSocket Middleware] Traitement de la connexion avec token: {token[:10]}...")
        
        # Authentifier l'utilisateur à partir du token
        user = await self.get_user_from_token(token)
        scope['user'] = user
        
        print(f"[WebSocket Middleware] Utilisateur authentifié: {user.username if not user.is_anonymous else 'Anonymous'}")
        
        return await super().__call__(scope, receive, send)
    
    @database_sync_to_async
    def get_user_from_token(self, token):
        """Récupère l'utilisateur à partir du token JWT."""
        try:
            if not token:
                print("[WebSocket Middleware] Aucun token fourni")
                return AnonymousUser()
            
            # Décoder le token
            try:
                # Essayer d'abord avec AccessToken (méthode standard)
                token_obj = AccessToken(token)
                user_id = token_obj['user_id']
            except Exception as e:
                print(f"[WebSocket Middleware] Erreur AccessToken: {e}")
                # Fallback: décoder manuellement
                decoded_token = jwt.decode(
                    token, 
                    settings.SECRET_KEY, 
                    algorithms=["HS256"], 
                    options={"verify_signature": True}
                )
                user_id = decoded_token.get('user_id')
            
            if not user_id:
                print("[WebSocket Middleware] ID utilisateur non trouvé dans le token")
                return AnonymousUser()
                
            user = User.objects.get(id=user_id)
            print(f"[WebSocket Middleware] Utilisateur trouvé: ID={user.id}, Username={user.username}")
            return user
        except User.DoesNotExist:
            print(f"[WebSocket Middleware] Utilisateur avec ID={user_id} n'existe pas")
            return AnonymousUser()
        except jwt.PyJWTError as e:
            print(f"[WebSocket Middleware] Erreur de décodage JWT: {e}")
            return AnonymousUser()
        except Exception as e:
            print(f"[WebSocket Middleware] Erreur d'authentification: {e}")
            return AnonymousUser()