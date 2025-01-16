
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Game = () => {
  const navigate = useNavigate();

  const gameOptions = [
    { 
      icon: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      title: "Play vs Bot",
      path: "/game/bot"
    },
    { 
      icon: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="7" r="4" />
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        </svg>
      ),
      title: "Play Vs Friend",
      path: "/game/friend"
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
      title: "Random Table",
      path: "/game/random"
    }
  ];

  const handleGameStart = async (path) => {
    try {
      const gameData = {
        gameType: path.split('/')[2],
        userId: localStorage.getItem('userId')
      };

      const response = await axios.post('http://localhost:3001/api/games/create', gameData);
      const { gameId } = response.data;
      
      navigate(`${path}/${gameId}`);
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
            {gameOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleGameStart(option.path)}
                className="bg-gray-300 flex flex-col items-center space-y-4 p-6 rounded-xl 
                         hover:bg-blue-50 transition-all duration-200 cursor-pointer"
              >
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center 
                            justify-center border-2 border-blue-500 hover:border-blue-600">
                  {option.icon}
                </div>
                <span className="text-blue-500 font-medium text-lg">{option.title}</span>
              </button>
            ))}
          </div>
        </div>
    </div>
  );
};

export default Game;