import { useState, useEffect } from 'react';
import player from '../../assets/src/player_.svg';

const TopPlayer = () => {
  const [topPlayers, setTopPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopPlayers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/top-players'); // Remplacez par votre URL d'API
        if (!response.ok) {
          throw new Error('Failed to fetch top players');
        }
        const data = await response.json();
        setTopPlayers(data.map(player => ({
          ...player,
          avatar: player.avatar || player // Utilise l'avatar de l'API ou l'image par défaut
        })));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching top players:', error);
        setError(error.message);
        setLoading(false);
        // Données de fallback en cas d'erreur
        setTopPlayers([
          { name: 'Jon Khan', points: '125,000 points', avatar: player },
          { name: 'John benbot', points: '101,150 points', avatar: player },
          { name: 'Ely noc', points: '81,500 points', avatar: player },
        ]);
      }
    };

    fetchTopPlayers();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex items-center gap-4 animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    console.error('Error displaying top players:', error);
  }

  return (
    <div className="space-y-6">
      {topPlayers.map((player, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center gap-4 w-full">
            <img src={player.avatar} alt={player.name} className="w-12 h-12 rounded-full" />
            <div className="flex justify-between items-center w-full">
              <p className="font-semibold text-gray-800">{player.name}</p>
              <p className="text-sm text-gray-500">{player.points}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopPlayer;