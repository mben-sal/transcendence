import { AUTH_CONFIG } from '../config';

export const chatService = {
  async getConversations() {
    const response = await fetch(`${AUTH_CONFIG.VITE_API_URL}/conversations/`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  },

  async getMessages(conversationId) {
    const response = await fetch(`${AUTH_CONFIG.VITE_API_URL}/conversations/${conversationId}/messages/`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  },

  async sendMessage(conversationId, content) {
    const response = await fetch(`${AUTH_CONFIG.VITE_API_URL}/conversations/${conversationId}/send_message/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ content })
    });
    return response.json();
  },

  async createPrivateChat(userId) {
    const response = await fetch(`${AUTH_CONFIG.VITE_API_URL}/conversations/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        type: 'private',
        participants: [userId]
      })
    });
    return response.json();
  },

  async createGroupChat(name, participants, description) {
    const response = await fetch(`${AUTH_CONFIG.VITE_API_URL}/conversations/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        type: 'group',
        name,
        participants,
        description
      })
    });
    return response.json();
  },

  async markAsRead(conversationId) {
    const response = await fetch(`${AUTH_CONFIG.VITE_API_URL}/conversations/${conversationId}/mark_read/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  }
};