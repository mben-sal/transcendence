import { useState } from 'react';
import { GroupCard } from "../component/chat/group-card";
import { PrivateCard } from "../component/chat/private-card";
import SearchInput from "../component/chat/Search-input";
import { ChatConversation } from "../component/chat/chat-convesation";

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  
  const handleSelectChat = (chat, type) => {
    setSelectedChat({ ...chat, type });
  };
  
  return (
    <div className="p-4">
      <div className="flex gap-4 h-[calc(100vh-2rem)]">
        {/* Left sidebar */}
        <div className="flex flex-col gap-4 w-96">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Inbox</h1>
            <span className="px-6 py-1 flex items-center justify-center rounded-full bg-orange-500 text-white text-sm">
              2 new
            </span>
          </div>
          <div className="w-full">
            <SearchInput />
          </div>
          <div className="flex-1 overflow-y-auto space-y-4">
            <GroupCard onSelectGroup={(group) => handleSelectChat(group, 'group')} />
            <PrivateCard onSelectPrivate={(chat) => handleSelectChat(chat, 'private')} />
          </div>
        </div>

        {/* Right conversation area */}
        <div className="flex-1">
          {selectedChat ? (
            <ChatConversation 
              user={selectedChat}
              onClose={() => setSelectedChat(null)}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;