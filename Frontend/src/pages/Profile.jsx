import { useState } from 'react';
import player_ from '../assets/src/player_.svg';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('stats');
  
  const user = {
    name: "John Doe",
    username: "@johndoe",
    level: 42,
    rank: "Gold Master",
    gamesPlayed: 150,
    wins: 89,
    achievements: [
      { id: 1, name: "First Win", icon: "🏆" },
      { id: 2, name: "Speed Demon", icon: "⚡" },
      { id: 3, name: "Pro Player", icon: "👑" }
    ]
  };

  const stats = {
    winRate: Math.round((user.wins / user.gamesPlayed) * 100),
    totalPoints: 12500,
    ranking: "#234"
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto bg-[#CBDCEB] rounded-3xl overflow-hidden shadow-xl">
        {/* Header Section */}
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="absolute -bottom-16 left-6">
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-gray-800 bg-gray-700">
              <img
                src={player_}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* User Info Section */}
        <div className="pt-20 px-6 pb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#133E87]">{user.name}</h1>
              <p className="text-blue-400">{user.username}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-semibold">
                Level {user.level} • {user.rank}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-8 border-b border-gray-800">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('stats')}
                className={`pb-4 ${
                  activeTab === 'stats'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Statistics
              </button>
              <button
                onClick={() => setActiveTab('achievements')}
                className={`pb-4 ${
                  activeTab === 'achievements'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Achievements
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="mt-6">
            {activeTab === 'stats' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-700 p-4 rounded-xl text-center">
                  <p className="text-gray-400 text-sm">Win Rate</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.winRate}%</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-xl text-center">
                  <p className="text-gray-400 text-sm">Total Points</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.totalPoints}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-xl text-center">
                  <p className="text-gray-400 text-sm">Global Ranking</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.ranking}</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {user.achievements.map(achievement => (
                  <div key={achievement.id} className="bg-gray-700 p-4 rounded-xl flex items-center space-x-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <span className="text-white">{achievement.name}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 flex justify-center">
              <div className=" rounded-xl overflow-hidden bg-gray-700">
                {/* <video 
                  src={Pongvideo}
                  className=" object-cover"
                  controls
                  autoPlay
                  muted
                  loop
				  height={100}
				  width={200}
                > */}
                {/* </video> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;