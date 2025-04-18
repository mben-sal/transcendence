import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from authen.routing import websocket_urlpatterns as auth_websocket_urlpatterns
from chat.routing import websocket_urlpatterns as chat_websocket_urlpatterns
from chat.middleware import TokenAuthMiddleware

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Important - Charger Django avant les imports de Channels
django_asgi_app = get_asgi_application()

# Combiner toutes les routes WebSocket
combined_websocket_urlpatterns = auth_websocket_urlpatterns + chat_websocket_urlpatterns

# Configuration ASGI avec authentification personnalisée pour WebSocket
application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": TokenAuthMiddleware(
        URLRouter(
            combined_websocket_urlpatterns
        )
    ),
})

print("[ASGI] Application ASGI initialisée avec TokenAuthMiddleware pour WebSocket")
print(f"[ASGI] Routes WebSocket enregistrées: {len(combined_websocket_urlpatterns)}")