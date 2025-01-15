import { useState } from 'react';
import player_ from '../assets/src/player_.svg';
import { Settings, MoreVertical, MessageCircle, UserPlus, UserMinus, Lock } from "lucide-react";
import Friends from '../component/profile/Friends';
import UserInfo from '../component/profile/UserInfo';
import Achievements from '../component/profile/Achievements';

const UserProfile = () => {
  const [profileImage, setProfileImage] = useState(player_);
  const [coverImage, setCoverImage] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

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

  const handleGameInvite = async () => {
	try {
	  await fetch('http://localhost:3001/api/game/invite', {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify({
		  receiverId: user.id
		}),
	  });
	  setIsMoreOpen(false);
	  alert('Invitation de jeu envoyée !');
	} catch (error) {
	  console.error('Erreur lors de l\'envoi de l\'invitation:', error);
	  alert('Erreur lors de l\'envoi de l\'invitation');
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

  const handleCloseMenus = () => {
    setIsSettingsOpen(false);
    setIsMoreOpen(false);
  };

  return (
    <div className="min-h-screen p-4" onClick={handleCloseMenus}>
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
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSettingsOpen(!isSettingsOpen);
                  setIsMoreOpen(false);
                }}
                className="p-2 bg-gray-800 bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
              >
                <Settings className="w-6 h-6 text-white" />
              </button>
              
              {isSettingsOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-2 z-50" onClick={(e) => e.stopPropagation()}>
                  <label className="bg-[#CBDCEB] block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">
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
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMoreOpen(!isMoreOpen);
                  setIsSettingsOpen(false);
                }}
                className="p-2 bg-gray-800 bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
              >
                <MoreVertical className="w-6 h-6 text-white" />
              </button>
              
              {isMoreOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#CBDCEB] rounded-lg shadow-lg py-2 z-50" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="bg-[#CBDCEB] flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
					onClick={() => handleGameInvite()}
                  >
					🎮 invite to Game 
                  </button>
                  <button 
                    className="bg-[#CBDCEB] flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
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
                  <button className="bg-[#CBDCEB] flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    send message
                  </button>
                  <button 
                    className="bg-[#CBDCEB] flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
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
          <UserInfo user={user} />

          {/* Achievements Grid */}
         <Achievements achievements={user.achievements} />

          {/* Friends Component */}
          <Friends />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;