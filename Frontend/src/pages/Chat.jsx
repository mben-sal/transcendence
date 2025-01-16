
import { useState, useEffect } from 'react';
import GroupCard from "../component/chat/group-card";
import PrivateCard from "../component/chat/private-card"; 
import SearchInput from "../component/chat/Search-input";
import ChatConversation from "../component/chat/chat-convesation";
import { chatService } from '../services/api_chat';

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredConversations, setFilteredConversations] = useState([]);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    const filtered = conversations.filter(conv => 
      conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.messages?.[0]?.content.toLowerCase().includes(searchTerm.toLowerCase())
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
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleSelectChat = async (chat, type) => {
    try {
      const messages = await chatService.getMessages(chat.id);
      setSelectedChat({ ...chat, type, messages });
      if (chat.unread_count > 0) {
        await chatService.markAsRead(chat.id);
        loadConversations();
      }
    } catch (error) {
      console.error('Error:', error);
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
      loadConversations();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSearch = (term) => setSearchTerm(term);

  return (
      <div className="flex gap-4 h-[calc(100vh-2rem)]">
        <div className="flex flex-col gap-4 w-96">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Inbox</h1>
            <span className="px-6 py-1 rounded-full bg-orange-500 text-white text-sm">
              {conversations.filter(c => c.unread_count > 0).length} new
            </span>
          </div>
          <SearchInput onSearch={handleSearch} />
          <div className="flex-1 space-y-4">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <span className="text-gray-500">Loading...</span>
              </div>
            ) : (
              <>
                <GroupCard 
                  conversations={filteredConversations.filter(c => c.type === 'group')}
                  onSelectGroup={chat => handleSelectChat(chat, 'group')} 
                />
                <PrivateCard 
                  conversations={filteredConversations.filter(c => c.type === 'private')}
                  onSelectPrivate={chat => handleSelectChat(chat, 'private')} 
                />
              </>
            )}
          </div>
        </div>

        <div className="flex-1">
          {selectedChat ? (
            <ChatConversation 
              user={selectedChat}
              messages={selectedChat.messages}
              onSendMessage={handleSendMessage}
              onClose={() => setSelectedChat(null)}
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