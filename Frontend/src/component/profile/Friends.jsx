import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import player_ from '../../assets/src/player_.svg';
import axios from 'axios';

const Friends = () => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/friends');
      setFriends(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching friends:', error);
      setLoading(false);
    }
  };

  const handleFriendClick = (friendId) => {
    navigate(`/game/friend/${friendId}`);
  };

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-2 p-8">
	  <div className="bg-white rounded-lg p-6 mb-6 shadow-lg">
	 	 <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#133E87]"> Friends </h1>
          <div className="flex-1 max-w-md mx-4">
            <input
              type="text"
              placeholder="Rechercher un ami..."
              className="w-full px-4 py-2 rounded-lg bg-slate-300 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#133E87]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement de vos amis...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredFriends.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 py-8">
                Aucun ami trouvé avec ce nom
              </p>
            ) : (
              filteredFriends.map((friend) => (
                <button
                  key={friend.id}
                  onClick={() => handleFriendClick(friend.id)}
                  className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-100"
                >
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                      <img
                        src={friend.image || player_}
                        alt={friend.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div 
                      className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white 
                      ${friend.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-gray-900">{friend.name}</span>
                    <span className="text-sm text-gray-500">
                      {friend.isOnline ? 'En ligne' : 'Hors ligne'}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;