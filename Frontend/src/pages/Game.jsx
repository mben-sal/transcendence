
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const generatedGameId = () => {
  return Math.random.toString(36).substring(2, 10); // exemple 'f7jd93la'
}

const Game = () => {
  const navigate = useNavigate();

  // var t = "Tournament"

  const gameOptions = [
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 21h8" />
          <path d="M12 17v4" />
          <path d="M7 4v3a5 5 0 0 0 10 0V4" />
          <path d="M17 4h2a2 2 0 0 1 2 2v1a4 4 0 0 1-4 4" />
          <path d="M7 4H5a2 2 0 0 0-2 2v1a4 4 0 0 0 4 4" />
        </svg>
      ),
     title: (
        <div className="flex flex-col items-center">
          <span>Play VS One</span>
          <span className="flex flex-col items-center">Or Tournament</span>
        </div>
      ),
      path: "/game/tournement"
    },
    { 
      icon: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      title: "Play vs IA",
      path: "/game/IA"
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
    },
  ];

  const handleGameStart = async (path) => {

    if (path.includes('tournement'))
    {
      localStorage.removeItem('gameId');
      let gameId = localStorage.getItem('gameId');
      if(!gameId)
      {
        gameId = generatedGameId();
        localStorage.setItem('gameId', gameId);
      }
      navigate(`${path}/${gameId}`);
    }
    
    try {
      const gameData = {
        gameType: path.split('/')[2],
        userId: localStorage.getItem('userId')
      };
  
      const response = await axios.post('http://localhost:8001/api/hello/');
      const { gameId } = response.data;
      console.log(response.data);
  
      if (gameId) {
        navigate(`${path}/${gameId}`);
      } else {
        console.error("Game ID not found in response.");
      }
    } 
    catch (error) {
      console.error('Error starting game:', error);
    }
  };

  return (
      <div className="max-w-6xl mx-auto space-y-8">
      <div className="rounded-lg shadow-lg">
        <div className="flex flex-row gap-6 p-8 justify-center flex-wrap">
          {gameOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => handleGameStart(option.path)}
              className="w-48 h-52 bg-gray-300 flex flex-col items-center justify-center space-y-4 p-4 rounded-xl 
                        hover:bg-blue-50 transition-all duration-200 cursor-pointer"
            >
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center 
                          justify-center border-2 border-blue-500 hover:border-blue-600">
                {option.icon}
              </div>
              <div className="text-center text-blue-500 font-medium text-lg">
                {option.title}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Game;