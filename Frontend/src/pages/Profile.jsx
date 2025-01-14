// import { useState } from 'react';
// import player_ from '../assets/src/player_.svg';
// import { Camera } from "lucide-react";

// const UserProfile = () => {
//   const [activeTab, setActiveTab] = useState('stats');
//   const [profileImage, setProfileImage] = useState(player_);
//   const [coverImage, setCoverImage] = useState(null);
  
//   const user = {
//     name: "John Doe",
//     username: "@johndoe",
//     level: 42,
//     rank: "Gold Master",
//     gamesPlayed: 150,
//     wins: 89,
//     achievements: [
//       { id: 1, name: "First Win", icon: "🏆" },
//       { id: 2, name: "Speed Demon", icon: "⚡" },
//       { id: 3, name: "Pro Player", icon: "👑" }
//     ]
//   };

//   const stats = {
//     winRate: Math.round((user.wins / user.gamesPlayed) * 100),
//     totalPoints: 12500,
//     ranking: "#234"
//   };

//   const handleProfileImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfileImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleCoverImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setCoverImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <div className="min-h-screen p-4">
//       <div className="max-w-6xl mx-auto bg-[#CBDCEB] rounded-3xl overflow-hidden shadow-xl">
//         {/* Header Section with Cover Image */}
//         <div className="relative h-48">
//           <div className={`w-full h-full ${coverImage ? '' : 'bg-gradient-to-r from-blue-500 to-purple-600'}`}>
//             {coverImage && (
//               <img
//                 src={coverImage}
//                 alt="Cover"
//                 className="w-full h-full object-cover"
//               />
//             )}
//           </div>
//           {/* Cover Image Upload Button */}
//           <label className="absolute top-4 right-4 cursor-pointer">
//             <div className="p-2 bg-gray-800 bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all">
//               <Camera className="w-6 h-6 text-white" />
//             </div>
//             <input
//               type="file"
//               className="hidden"
//               accept="image/*"
//               onChange={handleCoverImageChange}
//             />
//           </label>
//           {/* Profile Image Section */}
//           <div className="absolute -bottom-16 left-6">
//             <div className="relative">
//               <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-gray-800 bg-gray-700">
//                 <img
//                   src={profileImage}
//                   alt="Profile"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               {/* Profile Image Upload Button */}
//               <label className="absolute bottom-2 right-2 cursor-pointer">
//                 <div className="p-2 bg-gray-800 bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all">
//                   <Camera className="w-4 h-4 text-white" />
//                 </div>
//                 <input
//                   type="file"
//                   className="hidden"
//                   accept="image/*"
//                   onChange={handleProfileImageChange}
//                 />
//               </label>
//             </div>
//           </div>
//         </div>

//         {/* Rest of the component remains the same */}
//         <div className="pt-20 px-6 pb-6">
//           <div className="flex flex-col md:flex-row md:justify-between md:items-center">
//             <div>
//               <h1 className="text-2xl font-bold text-[#133E87]">{user.name}</h1>
//               <p className="text-blue-400">{user.username}</p>
//             </div>
//             <div className="mt-4 md:mt-0">
//               <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-semibold">
//                 Level {user.level} • {user.rank}
//               </span>
//             </div>
//           </div>

//           <div className="mt-8 border-b border-gray-800">
//             <div className="flex space-x-8">
//               <button
//                 onClick={() => setActiveTab('stats')}
//                 className={`pb-4 ${
//                   activeTab === 'stats'
//                     ? 'text-blue-400 border-b-2 border-blue-400'
//                     : 'text-gray-400 hover:text-gray-300'
//                 }`}
//               >
//                 Statistics
//               </button>
//               <button
//                 onClick={() => setActiveTab('achievements')}
//                 className={`pb-4 ${
//                   activeTab === 'achievements'
//                     ? 'text-blue-400 border-b-2 border-blue-400'
//                     : 'text-gray-400 hover:text-gray-300'
//                 }`}
//               >
//                 Achievements
//               </button>
//             </div>
//           </div>

//           <div className="mt-6">
//             {activeTab === 'stats' ? (
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="bg-gray-700 p-4 rounded-xl text-center">
//                   <p className="text-gray-400 text-sm">Win Rate</p>
//                   <p className="text-2xl font-bold text-white mt-1">{stats.winRate}%</p>
//                 </div>
//                 <div className="bg-gray-700 p-4 rounded-xl text-center">
//                   <p className="text-gray-400 text-sm">Total Points</p>
//                   <p className="text-2xl font-bold text-white mt-1">{stats.totalPoints}</p>
//                 </div>
//                 <div className="bg-gray-700 p-4 rounded-xl text-center">
//                   <p className="text-gray-400 text-sm">Global Ranking</p>
//                   <p className="text-2xl font-bold text-white mt-1">{stats.ranking}</p>
//                 </div>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 {user.achievements.map(achievement => (
//                   <div key={achievement.id} className="bg-gray-700 p-4 rounded-xl flex items-center space-x-3">
//                     <span className="text-2xl">{achievement.icon}</span>
//                     <span className="text-white">{achievement.name}</span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserProfile;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import player_ from '../assets/src/player_.svg';
import { Camera, Settings, MoreVertical, MessageCircle, UserPlus, UserMinus, Lock } from "lucide-react";
import axios from 'axios';

const UserProfile = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(player_);
  const [coverImage, setCoverImage] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const user = {
    name: "John Doe",
    username: "@johndoe",
    level: 42,
    rank: "Gold Master",
    followers: 1234,
    following: 891,
    posts: 156,
    achievements: [
      { id: 1, name: "First Win", icon: "🏆" },
      { id: 2, name: "Speed Demon", icon: "⚡" },
      { id: 3, name: "Pro Player", icon: "👑" }
    ]
  };

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

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto bg-[#CBDCEB] rounded-3xl overflow-hidden shadow-xl">
        {/* Header Section with Cover Image */}
        <div className="relative h-48">
          <div className={`w-full h-full ${coverImage ? '' : 'bg-gradient-to-r from-blue-500 to-purple-600'}`}>
            {coverImage && (
              <img
                src={coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          {/* Settings and More Options */}
          <div className="absolute top-4 right-4 flex space-x-4">
            {/* Settings Menu */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsSettingsOpen(!isSettingsOpen);
                  setIsMoreOpen(false);
                }}
                className="p-2 bg-gray-800 bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
              >
                <Settings className="w-6 h-6 text-white" />
              </button>
              
              {isSettingsOpen && (
                <div className="absolute right-0 mt-2 w-48  rounded-lg shadow-lg py-2 z-50">
                  <label className= "bg-[#CBDCEB] block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                    />
                    Edit profil
                  </label>
                  <label className="bg-[#CBDCEB] block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                    />
                    Edit cover
                  </label>
                  <button className="bg-[#CBDCEB] block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">
                    Change password
                  </button>
                </div>
              )}
            </div>

            {/* More Options Menu */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsMoreOpen(!isMoreOpen);
                  setIsSettingsOpen(false);
                }}
                className="p-2 bg-gray-800 bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
              >
                <MoreVertical className="w-6 h-6 text-white" />
              </button>
              
              {isMoreOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#CBDCEB]  rounded-lg shadow-lg py-2 z-50">
                  <button 
                    className=" bg-[#CBDCEB]  flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => setIsFollowing(!isFollowing)}
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="w-4 h-4 mr-2" />
                        Ne plus suivre
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Suivre
                      </>
                    )}
                  </button>
                  <button className=" bg-[#CBDCEB] flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    send message
                  </button>
                  <button 
                    className=" bg-[#CBDCEB]  flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => setIsBlocked(!isBlocked)}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    {isBlocked ? 'Débloquer' : 'Bloquer'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Image Section */}
          <div className="absolute -bottom-16 left-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-gray-800 bg-gray-700">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="absolute bottom-2 right-2 cursor-pointer">
                <div className="p-2 bg-gray-800 bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all">
                  <Camera className="w-4 h-4 text-white" />
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                />
              </label>
            </div>
          </div>
        </div>

        {/* User Info Section */}
        <div className="pt-20 px-6">
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

          {/* Achievements Grid */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {user.achievements.map(achievement => (
              <div key={achievement.id} className="bg-gray-700 p-4 rounded-xl flex items-center space-x-3">
                <span className="text-2xl">{achievement.icon}</span>
                <span className="text-white">{achievement.name}</span>
              </div>
            ))}
          </div>

          {/* Friends Section */}
          <div className="mt-8 rounded-lg shadow-lg p-6 bg-gray-400">
            <h2 className="text-xl font-semibold mb-6 text-[#133E87]">Friends</h2>
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {friends.map((friend) => (
                  <button
                    key={friend.id}
                    onClick={() => handleFriendClick(friend.id)}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 
                             transition-all duration-200"
                  >
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                        <img
                          src={friend.image || player_}
                          alt={friend.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full 
                                   border-2 border-white ${friend.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                    </div>
                    <span className="text-gray-500">{friend.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;