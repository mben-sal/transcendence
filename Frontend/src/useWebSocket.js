import { useState, useEffect, useCallback } from 'react';
import { chatService } from '../src/services/chat.service';

const useWebSocket = (conversationId) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  // Initialize WebSocket connection through chatService
  useEffect(() => {
    if (!conversationId) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token d\'authentification non trouvé');
      return;
    }

    console.log('Initialisation de la connexion socket.io pour la conversation:', conversationId);
    
    // Connexion au socket
    chatService.connect(token);

    // Écouter les événements de connexion
    chatService.on('onConnected', () => {
      console.log('Socket.io connecté avec succès');
      setIsConnected(true);
      setError(null);
      
      // Rejoindre la conversation spécifique
      chatService.joinConversation(conversationId);
    });

    chatService.on('onDisconnected', () => {
      console.log('Socket.io déconnecté');
      setIsConnected(false);
    });

    // Écouter les nouveaux messages
    chatService.on('onMessage', (message) => {
      console.log('Nouveau message reçu:', message);
      setMessages((prevMessages) => {
        // Éviter les doublons en vérifiant l'ID du message
        if (!prevMessages.some(msg => msg.id === message.id)) {
          return [...prevMessages, message];
        }
        return prevMessages;
      });
    });

    // Nettoyer lors du démontage du composant
    return () => {
      console.log('Nettoyage de la connexion socket.io');
      chatService.leaveConversation();
      // Ne pas déconnecter complètement, car d'autres composants pourraient utiliser le socket
      // chatService.disconnect();
      
      // Réinitialiser les callbacks
      chatService.on('onMessage', null);
      chatService.on('onConnected', null);
      chatService.on('onDisconnected', null);
    };
  }, [conversationId]);

  // Configurer les messages initiaux
  const setInitialMessages = useCallback((initialMessages) => {
    console.log('Configuration des messages initiaux:', initialMessages.length);
    setMessages(initialMessages);
  }, []);

  // Fonction pour envoyer des messages
  const sendMessage = useCallback((message) => {
    if (isConnected) {
      try {
        console.log('Envoi de message via socket.io:', message);
        chatService.sendMessage(message);
        return true;
      } catch (err) {
        console.error('Erreur d\'envoi via socket.io:', err);
        return false;
      }
    } else {
      console.warn('Socket.io non connecté, impossible d\'envoyer le message');
      return false;
    }
  }, [isConnected]);

  // Marquer la conversation comme lue
  const markAsRead = useCallback(() => {
    if (isConnected) {
      chatService.markAsRead();
    } else {
      console.warn('Socket.io non connecté, impossible de marquer comme lu');
    }
  }, [isConnected]);

  return {
    isConnected,
    messages,
    sendMessage,
    markAsRead,
    setInitialMessages,
    error
  };
};

export default useWebSocket;