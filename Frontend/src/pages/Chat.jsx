import { useState, useEffect } from 'react';
// import GroupCard from "../component/chat/group-card";
import PrivateCard from "../component/chat/private-card"; 
import SearchInput from "../component/chat/Search-input";
import ChatConversation from "../component/chat/chat-convesation";
import { chatService } from '../services/api_chat';
import { useUser } from '../contexts/UserContext';

const Chat = () => {
  const { user } = useUser();
  const [selectedChat, setSelectedChat] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredConversations, setFilteredConversations] = useState([]);

  useEffect(() => {
    loadConversations();
    
    // Polling pour les nouvelles conversations (toutes les 30 secondes)
    const interval = setInterval(loadConversations, 30000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const filtered = conversations.filter(conv => 
      conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (conv.last_message && conv.last_message.content.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredConversations(filtered);
  }, [searchTerm, conversations]);

  const loadConversations = async () => {
    try {
      const data = await chatService.getConversations();
      setConversations(data);
      setFilteredConversations(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading conversations:', error);
      setLoading(false);
    }
  };

  const handleSelectChat = async (chat, type) => {
    try {
      // Si on a déjà sélectionné ce chat, ne rien faire
      if (selectedChat && selectedChat.id === chat.id) return;
      
      const messages = await chatService.getMessages(chat.id);
      setSelectedChat({ ...chat, type, messages });
      
      // Marquer la conversation comme lue si elle contient des messages non lus
      if (chat.unread_count > 0) {
        await chatService.markAsRead(chat.id);
        loadConversations();
      }
    } catch (error) {
      console.error('Error selecting chat:', error);
    }
  };

  const handleSendMessage = async (content) => {
    if (!selectedChat) return;
    try {
      const message = await chatService.sendMessage(selectedChat.id, content);
      setSelectedChat(prev => ({
        ...prev,
        messages: [...prev.messages, message]
      }));
      await loadConversations();  // Recharger pour mettre à jour last_message
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleBlockConversation = async (conversationId) => {
    try {
      await chatService.blockConversation(conversationId);
      await loadConversations();
    } catch (error) {
      console.error('Error blocking conversation:', error);
    }
  };

  const handleSearch = (term) => setSearchTerm(term);

  const handleCreateConversation = async (userId) => {
    try {
      // Vérifier si l'utilisateur a sélectionné son propre ID
      if (userId === user.id) {
        alert("Vous ne pouvez pas créer une conversation avec vous-même.");
        return;
      }
      
      const conversation = await chatService.createConversation([userId]);
      await loadConversations();
      
      // Sélectionner automatiquement la nouvelle conversation
      handleSelectChat(conversation, 'private');
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-4 w-96">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Inbox</h1>
          <span className="px-6 py-1 rounded-full bg-orange-500 text-white text-sm">
            {conversations.filter(c => c.unread_count > 0).length} new
          </span>
        </div>
        <SearchInput onSearch={handleSearch} />
        <div className="">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <span className="text-gray-500">Loading...</span>
            </div>
          ) : (
            <>
              {/* <GroupCard 
                conversations={filteredConversations.filter(c => c.type === 'group')}
                onSelectGroup={chat => handleSelectChat(chat, 'group')} 
              /> */}
              <PrivateCard 
                conversations={filteredConversations.filter(c => c.type === 'private')}
                onSelectPrivate={chat => handleSelectChat(chat, 'private')} 
              />
            </>
          )}
        </div>
      </div>

      <div className="w-full">
        {selectedChat ? (
          <ChatConversation 
            user={selectedChat}
            messages={selectedChat.messages}
            onSendMessage={handleSendMessage}
            onClose={() => setSelectedChat(null)}
            onBlock={() => handleBlockConversation(selectedChat.id)}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;