import api from '../api/axios';

export const chatService = {
  // Get all conversations
  async getConversations() {
    try {
      const response = await api.get('/conversations/');
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },

  // Get messages for a specific conversation
  async getMessages(conversationId) {
    try {
      const response = await api.get(`/conversations/${conversationId}/messages/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  // Send a message to a conversation - utiliser la fonction de message direct
  async sendMessage(conversationId, content) {
    try {
      console.log(`Envoi d'un message à la conversation ${conversationId}:`, content);
      
      // Essayer avec la fonction send_message_view directement
      const response = await api.post(`/message/${conversationId}/`, {
        content
      });
      
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
  
  // Mark conversation as read
  async markAsRead(conversationId) {
    try {
      const response = await api.post(`/conversations/${conversationId}/mark_as_read/`);
      return response.data;
    } catch (error) {
      console.error('Error marking as read:', error);
      throw error;
    }
  },

  // Create a new conversation
  async createConversation(participants, type = 'private', name = '') {
    try {
      const response = await api.post('/conversations/', {
        participants,
        type,
        name
      });
      return response.data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  },

  // Block a conversation
  async blockConversation(conversationId) {
    try {
      const response = await api.post(`/conversations/${conversationId}/block/`);
      return response.data;
    } catch (error) {
      console.error('Error blocking conversation:', error);
      throw error;
    }
  },

  // Unblock a conversation
  async unblockConversation(conversationId) {
    try {
      const response = await api.post(`/conversations/${conversationId}/unblock/`);
      return response.data;
    } catch (error) {
      console.error('Error unblocking conversation:', error);
      throw error;
    }
  }
};