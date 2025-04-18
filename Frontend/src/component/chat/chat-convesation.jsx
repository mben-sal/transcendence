// import { useState, useEffect, useRef } from 'react';
// import { Send, MoreVertical } from 'lucide-react';
// import PropTypes from 'prop-types';
// import useWebSocket from '../../useWebSocket';

// export const ChatConversation = ({ 
//   user, 
//   messages: initialMessages = [], 
//   onSendMessage, 
//   onClose, 
//   onBlock = () => {}
// }) => {
//   const [message, setMessage] = useState('');
//   const [showMenu, setShowMenu] = useState(false);
//   const menuRef = useRef(null);
//   const messagesEndRef = useRef(null);
  
//   // Initialiser WebSocket si disponible
//   const { isConnected, messages: wsMessages, sendMessage: wsSendMessage } = 
//     useWebSocket(user?.id);
  
//   // Combiner les messages initiaux avec ceux du WebSocket
//   const [allMessages, setAllMessages] = useState(initialMessages);

//   // Mise à jour des messages lorsque de nouveaux arrivent via WebSocket
//   useEffect(() => {
//     if (wsMessages.length > 0) {
//       // Filtrer les messages pour éviter les doublons
//       const newMessages = wsMessages.filter(
//         wsMsg => !allMessages.some(msg => msg.id === wsMsg.id)
//       );
      
//       if (newMessages.length > 0) {
//         setAllMessages(prev => [...prev, ...newMessages]);
//       }
//     }
//   }, [wsMessages, allMessages]);

//   // Mise à jour des messages si les messages initiaux changent
//   useEffect(() => {
//     setAllMessages(initialMessages);
//   }, [initialMessages]);
  
//   // Handle clicking outside to close menu
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setShowMenu(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Auto scroll to bottom when new messages arrive
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [allMessages]);

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (message.trim()) {
//       // Essayer d'envoyer via WebSocket d'abord si connecté
//       if (isConnected && wsSendMessage(message.trim())) {
//         // WebSocket a envoyé le message avec succès
//         setMessage('');
//       } else {
//         // Fallback à l'envoi via API REST
//         await onSendMessage(message.trim());
//         setMessage('');
//       }
//     }
//   };

//   const handleMenuAction = (action) => {
//     setShowMenu(false);
//     if (action === 'quit') {
//       onClose();
//     } else if (action === 'block') {
//       onBlock();
//       onClose();
//     }
//   };

//   // Using optional chaining and default values for user properties
//   const userName = user?.name || user?.display_name || 'User';
//   const userAvatar = user?.avatar || "/api/placeholder/48/48";
//   const isUserOnline = user?.status === 'online';

//   return (
//     <div className="flex flex-col h-full bg-white rounded-3xl shadow-md">
//       {/* Header */}
//       <div className="flex items-center justify-between p-4 border-b">
//         <div className="flex items-center gap-3">
//           <div className="relative">
//             <img
//               src={userAvatar}
//               alt={userName}
//               className="w-12 h-12 rounded-full object-cover"
//             />
//             {isUserOnline && (
//               <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
//             )}
//           </div>
//           <div>
//             <h3 className="font-semibold text-gray-900">{userName}</h3>
//             <p className="text-sm text-gray-500">
//               {isUserOnline 
//                 ? 'Online' 
//                 : isConnected 
//                   ? 'Last seen recently' 
//                   : 'Offline'}
//             </p>
//           </div>
//         </div>
        
//         {/* Three-dot menu */}
//         <div className="relative" ref={menuRef}>
//           <button 
//             onClick={() => setShowMenu(!showMenu)}
//             className="bg-slate-300 p-2 hover:bg-white rounded-full transition-colors"
//             type="button"
//             aria-label="More options"
//           >
//             <MoreVertical className="w-5 h-5 text-gray-600" />
//           </button>
          
//           {showMenu && (
//             <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-1 z-10 border border-gray-100">
//               <button
//                 onClick={() => handleMenuAction('quit')}
//                 className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 transition-colors"
//               >
//                 Quit Conversation
//               </button>
//               <button
//                 onClick={() => handleMenuAction('block')}
//                 className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 transition-colors"
//               >
//                 Block Conversation
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="h-[calc(100vh-18rem)] overflow-y-auto p-4 flex flex-col gap-4">
//         {allMessages.length === 0 ? (
//           <div className="flex items-center justify-center h-full text-gray-400">
//             No messages yet. Start the conversation!
//           </div>
//         ) : (
//           allMessages.map((msg) => (
//             <div key={msg.id} className={`flex ${msg.sender === user.id ? 'justify-start' : 'justify-end'}`}>
//               <div className={`max-w-[70%] rounded-2xl p-3 ${msg.sender === user.id ? 'bg-gray-100' : 'bg-blue-500 text-white'}`}>
//                 <p>{msg.content}</p>
//                 <span className="text-xs opacity-70">{new Date(msg.created_at).toLocaleTimeString()}</span>
//               </div>
//             </div>
//           ))
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Message Input */}
//       <form onSubmit={handleSend} className="p-4 bg-gray-50 rounded-3xl">
//         <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2.5 shadow-sm">
//           <input
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder="Type your message here..."
//             className="flex-1 text-gray-600 bg-transparent focus:outline-none"
//           />
//           <button
//             type="submit"
//             className={`p-1.5 rounded-full ${
//               message.trim() 
//                 ? 'bg-blue-500 text-white hover:bg-blue-600' 
//                 : 'bg-gray-100 text-gray-400'
//             } transition-colors`}
//             disabled={!message.trim()}
//           >
//             <Send className="w-5 h-5" />
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// // PropTypes for type checking
// ChatConversation.propTypes = {
//   user: PropTypes.shape({
//     id: PropTypes.number,
//     name: PropTypes.string,
//     display_name: PropTypes.string,
//     avatar: PropTypes.string,
//     status: PropTypes.string
//   }),
//   messages: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.number,
//       content: PropTypes.string,
//       sender: PropTypes.number,
//       created_at: PropTypes.string
//     })
//   ),
//   onSendMessage: PropTypes.func,
//   onClose: PropTypes.func,
//   onBlock: PropTypes.func
// };

// export default ChatConversation;


import { useState, useEffect, useRef } from 'react';
import { Send, MoreVertical } from 'lucide-react';
import PropTypes from 'prop-types';
import useWebSocket from '../../useWebSocket';

export const ChatConversation = ({ 
  user, 
  messages: initialMessages = [], 
  onSendMessage, 
  onClose, 
  onBlock = () => {},
  onNewMessage = () => {}
}) => {
  const [message, setMessage] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  // Initialize WebSocket if available
  const { isConnected, messages: wsMessages, sendMessage: wsSendMessage } = 
    useWebSocket(user?.id);

  // Combine initial messages with WebSocket messages
  const [allMessages, setAllMessages] = useState(initialMessages);

  // Update messages when new ones arrive via WebSocket
  useEffect(() => {
    if (wsMessages.length > 0) {
      // Filter to avoid duplicates
      const newMessages = wsMessages.filter(
        wsMsg => !allMessages.some(msg => msg.id === wsMsg.id)
      );
      
      if (newMessages.length > 0) {
        setAllMessages(prev => [...prev, ...newMessages]);
        // Notify parent component about new messages
        onNewMessage(newMessages);
      }
    }
  }, [wsMessages, allMessages, onNewMessage]);

  // Update messages if initial messages change
  useEffect(() => {
    setAllMessages(initialMessages);
  }, [initialMessages]);
  
  // Handle clicking outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  const handleSend = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Try WebSocket first, fall back to API
    let messageSent = false;
    
    if (isConnected) {
      try {
        messageSent = wsSendMessage(message.trim());
        console.log('Message sent via WebSocket:', messageSent);
      } catch (err) {
        console.error('WebSocket send error:', err);
        messageSent = false;
      }
    }
    
    // If WebSocket failed or not connected, use API
    if (!messageSent) {
      try {
        await onSendMessage(message.trim());
      } catch (error) {
        console.error('API send error:', error);
        // Could show an error message to the user here
        return; // Don't clear input if sending failed
      }
    }
    
    // Clear input only if message was sent successfully
    setMessage('');
  };

  const handleMenuAction = (action) => {
    setShowMenu(false);
    if (action === 'quit') {
      onClose();
    } else if (action === 'block') {
      onBlock();
      onClose();
    }
  };

  // Using optional chaining and default values for user properties
  const userName = user?.name || user?.display_name || 'User';
  const userAvatar = user?.avatar || "/api/placeholder/48/48";
  const isUserOnline = user?.status === 'online';

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={userAvatar}
              alt={userName}
              className="w-12 h-12 rounded-full object-cover"
            />
            {isUserOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{userName}</h3>
            <p className="text-sm text-gray-500">
              {isUserOnline 
                ? 'Online' 
                : isConnected 
                  ? 'Connected' 
                  : 'Offline'}
            </p>
          </div>
        </div>
        
        {/* Three-dot menu */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="bg-slate-300 p-2 hover:bg-white rounded-full transition-colors"
            type="button"
            aria-label="More options"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-1 z-10 border border-gray-100">
              <button
                onClick={() => handleMenuAction('quit')}
                className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Quit Conversation
              </button>
              <button
                onClick={() => handleMenuAction('block')}
                className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 transition-colors"
              >
                Block Conversation
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="h-[calc(100vh-18rem)] overflow-y-auto p-4 flex flex-col gap-4">
        {allMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            No messages yet. Start the conversation!
          </div>
        ) : (
          allMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === user.id ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[70%] rounded-2xl p-3 ${msg.sender === user.id ? 'bg-gray-100' : 'bg-blue-500 text-white'}`}>
                <p>{msg.content}</p>
                <span className="text-xs opacity-70">{new Date(msg.created_at).toLocaleTimeString()}</span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} className="p-4 bg-gray-50 rounded-3xl">
        <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2.5 shadow-sm">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 text-gray-600 bg-transparent focus:outline-none"
          />
          <button
            type="submit"
            className={`p-1.5 rounded-full ${
              message.trim() 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-100 text-gray-400'
            } transition-colors`}
            disabled={!message.trim()}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        {isConnected && (
          <div className="mt-2 text-xs text-green-600 text-center">
            WebSocket connected
          </div>
        )}
      </form>
    </div>
  );
};

// PropTypes for type checking
ChatConversation.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    display_name: PropTypes.string,
    avatar: PropTypes.string,
    status: PropTypes.string
  }),
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      content: PropTypes.string,
      sender: PropTypes.number,
      created_at: PropTypes.string
    })
  ),
  onSendMessage: PropTypes.func,
  onClose: PropTypes.func,
  onBlock: PropTypes.func,
  onNewMessage: PropTypes.func
};

export default ChatConversation;