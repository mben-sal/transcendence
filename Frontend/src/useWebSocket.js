import { useState, useEffect, useCallback } from 'react';

const useWebSocket = (conversationId) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!conversationId) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token d\'authentification non trouvé');
      return;
    }

    // Tester avec une URL absolue complète
    // S'assurer que l'URL correspond exactement à ce que votre backend attend
    const wsUrl = `wss://localhost/ws/chat/${conversationId}/?token=${token}`;
    
    console.log('Tentative de connexion WebSocket:', wsUrl);
    console.log('État actuel du WebSocket:', socket?.readyState);
    
    try {
      const webSocket = new WebSocket(wsUrl);

      webSocket.onopen = () => {
        console.log('WebSocket connecté avec succès');
        setIsConnected(true);
        setError(null);
      };

      webSocket.onmessage = (event) => {
        console.log('Message WebSocket reçu:', event.data);
        try {
          const data = JSON.parse(event.data);
          if (data.message) {
            setMessages((prevMessages) => [...prevMessages, data.message]);
          }
        } catch (err) {
          console.error('Erreur de parsing du message WebSocket:', err);
        }
      };

      webSocket.onerror = (event) => {
        console.error('Erreur WebSocket:', event);
        // Ajout de plus de détails de l'erreur
        console.error('Type d\'erreur:', event.type);
        console.error('État de la connexion:', webSocket.readyState);
        setError('Erreur de connexion WebSocket');
        setIsConnected(false);
      };

      webSocket.onclose = (event) => {
        console.log('WebSocket fermé. Code:', event.code, 'Raison:', event.reason || 'Non spécifiée');
        setIsConnected(false);
      };

      setSocket(webSocket);

      // Cleanup function
      return () => {
        if (webSocket && webSocket.readyState === WebSocket.OPEN) {
          console.log('Fermeture de la connexion WebSocket');
          webSocket.close();
        }
      };
    } catch (err) {
      console.error('Exception lors de la création du WebSocket:', err);
      setError(`Erreur de création WebSocket: ${err.message}`);
    }
  }, [conversationId]);

  // Function to send messages
  const sendMessage = useCallback((message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      try {
        console.log('Envoi de message via WebSocket:', message);
        socket.send(JSON.stringify({
          message: message
        }));
        return true;
      } catch (err) {
        console.error('Erreur d\'envoi via WebSocket:', err);
        return false;
      }
    } else {
      console.warn(`WebSocket non connecté (état: ${socket?.readyState}), impossible d'envoyer le message`);
      return false;
    }
  }, [socket]);

  return {
    isConnected,
    messages,
    sendMessage,
    error,
    socketState: socket?.readyState
  };
};

export default useWebSocket;