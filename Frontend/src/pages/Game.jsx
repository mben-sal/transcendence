import player_ from '../assets/src/player_.svg';


const PongGame = () => {
  const gameOptions = [
    { 
      icon: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      title: "Play vs Bot" 
    },
    { 
      icon: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="7" r="4" />
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        </svg>
      ),
      title: "Play Vs Friend" 
    },
    { 
      icon: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <circle cx="8.5" cy="8.5" r="1" fill="currentColor" />
          <circle cx="15.5" cy="8.5" r="1" fill="currentColor" />
          <circle cx="15.5" cy="15.5" r="1" fill="currentColor" />
          <circle cx="8.5" cy="15.5" r="1" fill="currentColor" />
        </svg>
      ),
      title: "random table" 
    }
  ];

  const friends = [
    { id: 1, name: 'User1' , image: player_ },
    { id: 2, name: 'User2' , image: player_ },
    { id: 3, name: 'User3' , image: player_ },
    { id: 4, name: 'User4' , image: player_ },
    { id: 5, name: 'User5' , image: player_ },
    { id: 6, name: 'User6' , image: player_ },
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-20">
        <div className="bg-gray-200 rounded-lg">
          <div className="grid grid-cols-3 gap-x-20-gap-y-20 p-14">
            {gameOptions.map((option, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center border-2 border-blue-500">
                  {option.icon}
                </div>
                <span className="text-blue-500 font-medium">{option.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-200 rounded-lg gap-x-20-gap-y-20 p-1">
          <h2 className="text-xl font-semibold mb-4">Friends</h2>
          <div className="grid grid-cols-4 gap-x-4 gap-y-4">
            {friends.map((friend) => (
              <div key={friend.id} className="flex items-center space-x-2">
                <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
                  <img
                    src={friend.image}
                    alt={friend.name}
                    className="w-full h-full rounded-full"
                  />
                </div>
                <span className="text-gray-700">{friend.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PongGame;