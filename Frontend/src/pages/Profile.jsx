import { useState, useEffect, useRef } from 'react';
import player_ from '../assets/src/player_.svg';
import { MoreVertical, MessageCircle, UserPlus, UserMinus, Lock } from "lucide-react";
import Friends from '../component/profile/Friends';
import UserInfo from '../component/profile/UserInfo';
import Achievements from '../component/profile/Achievements';
import { useUser } from '../contexts/UserContext';

const UserProfile = () => {
  const { user } = useUser();
  const [profileImage, setProfileImage] = useState(user?.avatar || player_);
  const [coverImage, setCoverImage] = useState(user?.cover || '');
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  
  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  useEffect(() => {
    if (user?.avatar) {
      setProfileImage(user.avatar);
    }
  }, [user]);

  const handleProfileImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
      // Upload image API call here if needed
    }
  };

  const handleCoverImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result);
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
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          receiverId: user?.id
        }),
      });
      setIsMoreOpen(false);
      alert('Game invitation sent!');
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert('Error sending invitation');
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div onClick={() => setIsMoreOpen(false)}>
      <div className="max-w-6xl mx-auto bg-[#CBDCEB] rounded-3xl overflow-hidden shadow-xl">
        <div className="relative h-48">
          {/* Cover Image with Click Handler */}
          <div 
            className="w-full h-full cursor-pointer relative group"
            onClick={() => coverInputRef.current?.click()}
          >
            <div className={`w-full h-full ${coverImage ? '' : 'bg-gradient-to-r from-blue-500 to-purple-600'}`}>
              {coverImage && (
                <img
                  src={coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity flex items-center justify-center">
              <span className="text-white">Click to change cover</span>
            </div>
            <input
              ref={coverInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleCoverImageChange}
            />
          </div>

          {/* More Options Menu */}
          <div className="absolute top-4 right-4">
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMoreOpen(!isMoreOpen);
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

          {/* Profile Image with Click Handler */}
          <div className="absolute -bottom-16 left-6">
            <div 
              className="relative cursor-pointer group"
              onClick={() => profileInputRef.current?.click()}
            >
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity rounded-2xl flex items-center justify-center">
                <span className="text-white text-sm">Change photo</span>
              </div>
              <input
                ref={profileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleProfileImageChange}
              />
            </div>
          </div>
        </div>

        <div className="pt-20 px-6 pb-6">
          <UserInfo />
          <Achievements />
          <Friends />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;