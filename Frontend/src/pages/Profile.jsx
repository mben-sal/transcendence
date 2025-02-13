// import { useState, useEffect, useRef } from 'react';
// import player_ from '../assets/src/player_.svg';
// import { MoreVertical, MessageCircle, UserPlus, UserMinus, Lock } from "lucide-react";
// import Friends from '../component/profile/Friends';
// import UserInfo from '../component/profile/UserInfo';
// import Achievements from '../component/profile/Achievements';
// import { useUser } from '../contexts/UserContext';
// import cover from '../assets/src/cover_1.jpg';

// const UserProfile = () => {
//   const { user, updateUser, fetchUserProfile } = useUser();
//   const [profileImage, setProfileImage] = useState(player_);
//   const [coverImage, setCoverImage] = useState(user?.cover || '');
//   const [isMoreOpen, setIsMoreOpen] = useState(false);
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [isBlocked, setIsBlocked] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
  
//   const profileInputRef = useRef(null);
//   const coverInputRef = useRef(null);

//   useEffect(() => {
//     if (user?.avatar) {
//       setProfileImage(user.avatar);
//     }
//   }, [user]);

//   const handleProfileImageChange = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     try {
//       setIsUploading(true);
      
//       const formData = new FormData();
//       formData.append('avatar', file);

//       const response = await fetch('http://localhost:8000/api/users/avatar/', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: formData
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('Upload error:', errorData);
//         throw new Error(errorData.error || 'Failed to upload image');
//       }

//       const data = await response.json();
//       console.log('Upload success:', data);
      
//       if (data.avatarUrl) {
//         const fullAvatarUrl = `http://localhost:8000${data.avatarUrl}`;
//         setProfileImage(fullAvatarUrl);
        
//         // Mettre à jour le profil complet
//         const updatedUser = { ...user, avatar: fullAvatarUrl };
//         updateUser(updatedUser);
        
//         // Recharger le profil depuis le serveur
//         await fetchUserProfile();
//       } else {
//         throw new Error('No avatar URL in response');
//       }
      
//     } catch (error) {
//       console.error('Error uploading profile image:', error);
//       alert(error.message || 'Failed to update profile image. Please try again.');
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleGameInvite = async () => {
//     try {
//       await fetch('http://localhost:8000/api/game/invite', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify({
//           receiverId: user?.id
//         }),
//       });
//       setIsMoreOpen(false);
//       alert('Game invitation sent!');
//     } catch (error) {
//       console.error('Error sending invitation:', error);
//       alert('Error sending invitation');
//     }
//   };

//   if (!user) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="min-h-screen" onClick={() => setIsMoreOpen(false)}>
//       <div className="max-w-6xl mx-auto bg-[#CBDCEB] rounded-3xl overflow-hidden shadow-xl">
//         <div className="relative h-48">
//           {/* Cover Image */}
//           <div className="w-full h-full cursor-pointer relative group">
//             <div className={`w-full h-full bg-cover bg-center ${coverImage ? '' : 'bg-gray-800'}`}>
//               <img
//                 src={cover}
//                 alt="Cover"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           </div>

//           {/* More Options Menu */}
//           <div className="absolute top-4 right-4">
//             <div className="relative">
//               <button 
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setIsMoreOpen(!isMoreOpen);
//                 }}
//                 className="p-2 bg-gray-800 bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
//               >
//                 <MoreVertical className="w-6 h-6 text-white" />
//               </button>
              
//               {isMoreOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-[#CBDCEB] rounded-lg shadow-lg py-2 z-50" 
//                      onClick={(e) => e.stopPropagation()}>
//                   <button 
//                     className="bg-[#CBDCEB] flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
//                     onClick={() => handleGameInvite()}
//                   >
//                     🎮 invite to Game 
//                   </button>
//                   <button 
//                     className="bg-[#CBDCEB] flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
//                     onClick={() => setIsFollowing(!isFollowing)}
//                   >
//                     {isFollowing ? (
//                       <>
//                         <UserMinus className="w-4 h-4 mr-2" />
//                         Ne plus suivre
//                       </>
//                     ) : (
//                       <>
//                         <UserPlus className="w-4 h-4 mr-2" />
//                         Suivre
//                       </>
//                     )}
//                   </button>
//                   <button className="bg-[#CBDCEB] flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100">
//                     <MessageCircle className="w-4 h-4 mr-2" />
//                     send message
//                   </button>
//                   <button 
//                     className="bg-[#CBDCEB] flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
//                     onClick={() => setIsBlocked(!isBlocked)}
//                   >
//                     <Lock className="w-4 h-4 mr-2" />
//                     {isBlocked ? 'Débloquer' : 'Bloquer'}
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Profile Image */}
//           <div className="absolute -bottom-16 left-6">
//             <div 
//               className="relative cursor-pointer group"
//               onClick={() => !isUploading && profileInputRef.current?.click()}
//             >
//               <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white relative">
//                 <img
//                   src={profileImage || player_}
//                   alt="Profile"
//                   className={`w-full h-full object-cover ${isUploading ? 'opacity-50' : ''}`}
//                   onError={(e) => {
//                     e.target.onerror = null;
//                     e.target.src = player_;
//                   }}
//                 />
//                 {isUploading && (
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//                   </div>
//                 )}
//               </div>
//               <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity rounded-2xl flex items-center justify-center">
//                 <span className="text-white text-sm">
//                   {isUploading ? 'Uploading...' : 'Change photo'}
//                 </span>
//               </div>
//               <input
//                 ref={profileInputRef}
//                 type="file"
//                 className="hidden"
//                 accept="image/png, image/jpeg"
//                 onChange={handleProfileImageChange}
//                 disabled={isUploading}
//               />
//             </div>
//           </div>
//         </div>

//         <div className="pt-20 px-6 pb-6">
//           <UserInfo />
//           <Achievements />
//           <Friends />
//         </div>
//       </div>
//     </div>
//   );
// };
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import player_ from '../assets/src/player_.svg';
import { MoreVertical, MessageCircle, UserPlus, UserMinus, Lock } from "lucide-react";
import Friends from '../component/profile/Friends';
import UserInfo from '../component/profile/UserInfo';
import Achievements from '../component/profile/Achievements';
import { useUser } from '../contexts/UserContext';
import cover from '../assets/src/cover_1.jpg';
import { useNavigate } from 'react-router-dom';


const Profile = () => {
  const { intraId } = useParams(); // Get userId from URL
  const { user, updateUser, fetchUserProfile } = useUser();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(player_);
  const [coverImage] = useState(user?.cover || '');
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const profileInputRef = useRef(null);
  const isOwnProfile = !intraId || (user && user.intra_id === intraId);

  const normalizeAvatarUrl = (avatar) => {
    if (!avatar) return player_;
    if (avatar.startsWith('http')) return avatar;
    if (avatar.startsWith('./media')) return `http://localhost:8000${avatar.substring(1)}`;
    if (avatar.startsWith('/media')) return `http://localhost:8000${avatar}`;
    return avatar;
  };


  useEffect(() => {
	const loadProfileData = async () => {
	  if (isOwnProfile) {
		setProfileData(user);
		setProfileImage(user?.avatar || player_);
		setIsLoading(false);
		return;
	  }
  
	  try {
		const response = await fetch(`http://localhost:8000/api/users/${intraId}/`, {
		  headers: {
			'Authorization': `Bearer ${localStorage.getItem('token')}`
		  }
		});
  
		if (response.ok) {
		  const data = await response.json();
		  setProfileData(data);
		  setProfileImage(normalizeAvatarUrl(data.avatar));
		} else {
		  // Rediriger vers l'accueil avec un message d'erreur
		  navigate("/", { state: { error: "L'utilisateur n'existe pas." } });
		}
	  } catch (error) {
		console.error('Error loading profile:', error);
		navigate("/", { state: { error: "Impossible de charger l'utilisateur." } });
	  } finally {
		setIsLoading(false);
	  }
	};
  
	loadProfileData();
  }, [intraId, user, isOwnProfile, navigate]);
  

  const handleProfileImageChange = async (event) => {
    if (!isOwnProfile) return;
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('http://localhost:8000/api/users/avatar/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      const fullAvatarUrl = normalizeAvatarUrl(data.avatarUrl);
      setProfileImage(fullAvatarUrl);
      await fetchUserProfile();
    } catch (error) {
      console.error('Error uploading profile image:', error);
      alert('Failed to update profile image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleGameInvite = async () => {
    if (isOwnProfile) return;
    try {
      await fetch('http://localhost:8000/api/game/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          receiverId: profileData?.id
        }),
      });
      setIsMoreOpen(false);
      alert('Game invitation sent!');
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert('Error sending invitation');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" onClick={() => setIsMoreOpen(false)}>
      <div className="max-w-6xl mx-auto bg-[#CBDCEB] rounded-3xl overflow-hidden shadow-xl">
        <div className="relative h-48">
          {/* Cover Image */}
          <div className="w-full h-full cursor-pointer relative group">
            <div className={`w-full h-full bg-cover bg-center ${coverImage ? '' : 'bg-gray-800'}`}>
              <img
                src={cover}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* More Options Menu - Only show for other users' profiles */}
          {!isOwnProfile && (
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
                  <div className="absolute right-0 mt-2 w-48 bg-[#CBDCEB] rounded-lg shadow-lg py-2 z-50" 
                       onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="bg-[#CBDCEB] flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={handleGameInvite}
                    >
                      🎮 Invite to Game 
                    </button>
                    <button 
                      className="bg-[#CBDCEB] flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={() => setIsFollowing(!isFollowing)}
                    >
                      {isFollowing ? (
                        <>
                          <UserMinus className="w-4 h-4 mr-2" />
                          Unfollow
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Follow
                        </>
                      )}
                    </button>
                    <button className="bg-[#CBDCEB] flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send Message
                    </button>
                    <button 
                      className="bg-[#CBDCEB] flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={() => setIsBlocked(!isBlocked)}
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      {isBlocked ? 'Unblock' : 'Block'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Profile Image */}
          <div className="absolute -bottom-16 left-6">
            <div 
              className={`relative ${isOwnProfile ? 'cursor-pointer' : ''} group`}
              onClick={() => isOwnProfile && !isUploading && profileInputRef.current?.click()}
            >
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white relative">
                <img
                  src={profileImage}
                  alt="Profile"
                  className={`w-full h-full object-cover ${isUploading ? 'opacity-50' : ''}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = player_;
                  }}
                />
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                )}
              </div>
              {isOwnProfile && (
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity rounded-2xl flex items-center justify-center">
                  <span className="text-white text-sm">
                    {isUploading ? 'Uploading...' : 'Change photo'}
                  </span>
                </div>
              )}
              {isOwnProfile && (
                <input
                  ref={profileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/png, image/jpeg"
                  onChange={handleProfileImageChange}
                  disabled={isUploading}
                />
              )}
            </div>
          </div>
        </div>

        <div className="pt-20 px-6 pb-6">
          <UserInfo userData={profileData} isOwnProfile={isOwnProfile} />
          <Friends userData={profileData} isOwnProfile={isOwnProfile} />
        </div>
      </div>
    </div>
  );
};

export default Profile;