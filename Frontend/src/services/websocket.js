import { WS_BASE_URL } from '../config';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = {};
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect(userId, token) {
    // Fermer la connexion précédente si elle existe
    if (this.socket) {
      this.socket.close();
    }

    // Assurez-vous que l'URL est correcte
    const socketUrl = `${WS_BASE_URL}/notifications/`;
    console.log('Tentative de connexion WebSocket à:', socketUrl);

    try {
      // Créer une nouvelle connexion WebSocket
      this.socket = new WebSocket(socketUrl);

      // Configuration des événements
      this.socket.onopen = () => {
        console.log('WebSocket connecté avec succès');
        this.reconnectAttempts = 0;
        // Envoi du token d'authentification
        if (token) {
          this.socket.send(JSON.stringify({ 
            type: 'authentication',
            token: token 
          }));
        }
      };

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('WebSocket message reçu:', data);
        
        // Notifier tous les listeners
        const eventType = data.type || 'message';
        if (this.listeners[eventType]) {
          this.listeners[eventType].forEach(callback => callback(data));
        }
      };

      this.socket.onclose = (event) => {
        console.log('WebSocket déconnecté:', event.code, event.reason);
        
        // Éviter des tentatives infinies de reconnexion
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          const timeout = Math.min(10000, Math.pow(2, this.reconnectAttempts) * 1000);
          console.log(`Tentative de reconnexion ${this.reconnectAttempts} dans ${timeout/1000} secondes`);
          
          setTimeout(() => {
            if (this.socket && this.socket.readyState === WebSocket.CLOSED) {
              this.connect(userId, token);
            }
          }, timeout);
        } else {
          console.log('Nombre maximum de tentatives de reconnexion atteint');
        }
      };

      this.socket.onerror = (error) => {
        console.error('Erreur WebSocket:', error);
        console.error('État actuel de la connexion:', this.socket ? this.socket.readyState : 'socket non initialisé');
      };
    } catch (err) {
      console.error('Exception lors de la création du WebSocket:', err);
    }
  }

  disconnect() {
    if (this.socket) {
      console.log('Déconnexion WebSocket volontaire');
      this.socket.close();
      this.socket = null;
      this.reconnectAttempts = 0;
    }
  }

  addListener(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => this.removeListener(event, callback);
  }

  removeListener(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  isConnected() {
    return this.socket && this.socket.readyState === WebSocket.OPEN;
  }

  sendMessage(message) {
    if (this.isConnected()) {
      this.socket.send(JSON.stringify(message));
      return true;
    }
    console.warn('Tentative d\'envoi de message sur une connexion WebSocket fermée');
    return false;
  }
}

export default new WebSocketService();