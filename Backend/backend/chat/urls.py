from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from .views import ConversationViewSet, MessageViewSet, send_message_view

# Create a router for conversations
router = DefaultRouter()
router.register(r'conversations', ConversationViewSet, basename='conversation')

# Create a nested router for messages within conversations
messages_router = routers.NestedSimpleRouter(router, r'conversations', lookup='conversation')
messages_router.register(r'messages', MessageViewSet, basename='conversation-messages')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(messages_router.urls)),
    # Ajouter cette route pour l'envoi direct de messages
    path('message/<int:conversation_id>/', send_message_view, name='send-message'),
]

print("[URLs] Routes de l'application chat chargées")
print("[URLs] Route pour l'envoi direct de messages ajoutée: /message/<conversation_id>/")