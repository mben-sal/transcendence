import { Check } from 'lucide-react';
import PropTypes from 'prop-types';

export const PrivateCard = ({ conversations = [], onSelectPrivate }) => {
	// Fonction pour obtenir un avatar valide
	const getAvatarUrl = (avatar) => {
	  if (!avatar) {
		// Si pas d'avatar, utiliser un placeholder local
		return "../../assets/src/player_.svg";
	  }
	  
	  // Nettoyer le chemin de l'avatar
	  const cleanPath = avatar.replace(/^\/?(media\/)+/g, '');
	  
	  // Si c'est une URL complète, la retourner telle quelle
	  if (avatar.startsWith('http')) {
		return avatar;
	  }
	  
	  // Sinon, construire le chemin correct
	  return `/media/${cleanPath}`;
	};

  return (
    <div className="bg-white rounded-3xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">People</h2>
      <div className="space-y-4">
        {conversations.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No conversations yet
          </div>
        ) : (
          conversations.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => onSelectPrivate(chat)}
              className="flex items-center justify-between pb-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <img
                  src={getAvatarUrl(chat.avatar)}
                  alt={chat.name}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    // En cas d'erreur, remplacer par un placeholder
                    e.target.src = "/placeholder/48/48";
                  }}
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{chat.name}</h3>
                  <p className="text-gray-500 text-sm line-clamp-1">{
                    chat.last_message 
                      ? chat.last_message.content 
                      : 'No message'
                  }</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-gray-400 text-sm">
                  {chat.last_message 
                    ? new Date(chat.last_message.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                    : ''}
                </span>
                {chat.unread_count === 0 && chat.last_message && (
                  <div className="flex">
                    <Check className="w-4 h-4 text-blue-500" />
                    <Check className="w-4 h-4 text-blue-500 -ml-2" />
                  </div>
                )}
                {chat.unread_count > 0 && (
                  <span className="bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {chat.unread_count}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

PrivateCard.propTypes = {
  conversations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      avatar: PropTypes.string,
      last_message: PropTypes.shape({
        content: PropTypes.string,
        created_at: PropTypes.string
      }),
      unread_count: PropTypes.number
    })
  ),
  onSelectPrivate: PropTypes.func
};

export default PrivateCard;