import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost/api';
const WS_URL = import.meta.env.VITE_WS_URL || 'wss://localhost';

class ChatService {
  constructor() {
    this.socket = null;
    this.currentConversationId = null;
    this.callbacks = {
      onMessage: null,
      onConnected: null,
      onDisconnected: null,
    };
  }

  // Initialize WebSocket connection
  connect(token) {
    if (this.socket) {
      console.log('WebSocket déjà existant, déconnexion...');
      this.socket.close();
    }

    // Ne pas se connecter tout de suite, attendre joinConversation
    console.log('Token stocké pour connexion WebSocket future');
    this.token = token;
  }

  disconnect() {
    if (this.socket) {
      console.log('Déconnexion WebSocket');
      this.socket.close();
      this.socket = null;
      this.currentConversationId = null;
    }
  }

  // Join a specific conversation
  joinConversation(conversationId) {
    if (!conversationId) {
      console.error('ID de conversation non spécifié');
      return;
    }
    
    this.currentConversationId = conversationId;
    
    // Se connecter au WebSocket spécifique à cette conversation
    const wsUrl = `${WS_URL}/ws/chat/${conversationId}/?token=${this.token}`;
    console.log('Connexion au WebSocket:', wsUrl);
    
    try {
      this.socket = new WebSocket(wsUrl);
      
      this.socket.onopen = () => {
        console.log('WebSocket connecté avec succès');
        if (this.callbacks.onConnected) {
          this.callbacks.onConnected();
        }
      };
      
      this.socket.onmessage = (event) => {
        console.log('Message WebSocket reçu:', event.data);
        try {
          const data = JSON.parse(event.data);
          if (data.message && this.callbacks.onMessage) {
            this.callbacks.onMessage(data.message);
          }
        } catch (err) {
          console.error('Erreur de parsing message:', err);
        }
      };
      
      this.socket.onerror = (event) => {
        console.error('Erreur WebSocket:', event);
      };
      
      this.socket.onclose = (event) => {
        console.log('WebSocket fermé. Code:', event.code, 'Raison:', event.reason || 'Non spécifiée');
        if (this.callbacks.onDisconnected) {
          this.callbacks.onDisconnected();
        }
      };
    } catch (err) {
      console.error('Erreur lors de la création du WebSocket:', err);
    }
  }

  // Leave current conversation
  leaveConversation() {
    if (this.socket) {
      console.log('Quitter la conversation:', this.currentConversationId);
      this.socket.close();
      this.socket = null;
      this.currentConversationId = null;
    }
  }

  // Send a message to the current conversation
  sendMessage(message) {
    if (!this.currentConversationId || !this.socket) {
      console.error('Pas de conversation active ou de connexion WebSocket');
      return false;
    }
    
    if (this.socket.readyState === WebSocket.OPEN) {
      console.log('Envoi de message WebSocket:', message);
      this.socket.send(JSON.stringify({
        message: message
      }));
      return true;
    } else {
      console.warn('WebSocket non connecté, état:', this.socket.readyState);
      return false;
    }
  }

  // Register event callbacks
  on(event, callback) {
    if (this.callbacks.hasOwnProperty(event)) {
      this.callbacks[event] = callback;
    }
  }

  // API methods to interact with the backend
  async getConversations() {
    try {
      console.log('Récupération des conversations depuis:', `${API_URL}/conversations/`);
      const response = await axios.get(`${API_URL}/conversations/`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des conversations:', error);
      throw error;
    }
  }

  async getMessages(conversationId) {
    try {
      console.log('Récupération des messages pour la conversation:', conversationId);
      const response = await axios.get(`${API_URL}/conversations/${conversationId}/messages/`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
      throw error;
    }
  }

  async sendMessageAPI(conversationId, content) {
    try {
      console.log('Envoi de message API pour la conversation:', conversationId);
      // Essayer d'abord avec l'endpoint spécifique
      try {
        const response = await axios.post(`${API_URL}/message/${conversationId}/`, {
          content: content
        });
        return response.data;
      } catch (specificError) {
        console.warn('Endpoint spécifique a échoué, essai avec l\'endpoint général:', specificError);
        // Fallback à l'endpoint général
        const response = await axios.post(`${API_URL}/conversations/${conversationId}/messages/`, {
          content: content
        });
        return response.data;
      }
    } catch (error) {
      console.error('Toutes les tentatives d\'envoi ont échoué:', error);
      throw error;
    }
  }

  async markAsReadAPI(conversationId) {
    try {
      console.log('Marquer comme lu API pour la conversation:', conversationId);
      await axios.post(`${API_URL}/conversations/${conversationId}/mark_as_read/`);
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
      throw error;
    }
  }

  async blockConversation(conversationId) {
    try {
      console.log('Bloquer la conversation:', conversationId);
      await axios.post(`${API_URL}/conversations/${conversationId}/block/`);
    } catch (error) {
      console.error('Erreur lors du blocage de la conversation:', error);
      throw error;
    }
  }

  async unblockConversation(conversationId) {
    try {
      console.log('Débloquer la conversation:', conversationId);
      await axios.post(`${API_URL}/conversations/${conversationId}/unblock/`);
    } catch (error) {
      console.error('Erreur lors du déblocage de la conversation:', error);
      throw error;
    }
  }

  async createConversation(participants, type = 'private', name = '') {
    try {
      console.log('Création d\'une nouvelle conversation');
      const response = await axios.post(`${API_URL}/conversations/`, {
        participants,
        type,
        name
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la conversation:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService();