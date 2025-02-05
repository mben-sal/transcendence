import { Pencil, Shield, Trash2, Camera, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useUser } from '../contexts/UserContext';
import setting from '../assets/src/settings_.svg';
import Player_ from '../assets/src/player_.svg';
import axios from 'axios';

const ProfileSettings = () => {
  const { user, fetchUserProfile } = useUser();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setTwoFactorEnabled(user.two_factor_enabled || false);
    }
  }, [user]);

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    setUploadLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/users/avatar/', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      await fetchUserProfile();
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!window.confirm('Are you sure you want to remove your profile picture?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:8000/api/users/avatar/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await fetchUserProfile();
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const data = {
        first_name: firstName,
        last_name: lastName,
        two_factor_enabled: twoFactorEnabled
      };
    
      const response = await axios.put('http://localhost:8000/api/users/profile/', data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    
      if (response.status === 200) {
        await fetchUserProfile();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This is permanent.')) {
      return;
    }
   
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:8000/api/users/profile/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="flex gap-4 h-full justify-center items-center">
      <div className="flex-1 flex justify-center items-center h-full">
        <img src={setting} alt="Settings" className="w-2/3 object-fill" />
      </div>

      <div className="flex-1 bg-[#608BC1] rounded-lg shadow-lg p-6 h-full">
        <div className="mb-6">
          <h2 className="text-2xl text-white">Profile Settings</h2>
        </div>
        
        <div className="flex items-center gap-8 mb-6">
          <div className="relative group">
            <img 
              src={user?.avatar || Player_}  
              onError={(e) => {e.target.src = Player_}} 
              alt="Profile" 
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={handlePhotoClick}
                className="absolute bg-black/50 rounded-full p-1"
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
              {user?.avatar && user.avatar !== Player_ && (
                <button 
                  onClick={handleDeletePhoto}
                  className="absolute bg-red-500/50 rounded-full p-1 -right-2 -top-2"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
          <span className="text-white text-lg">
            {uploadLoading ? 'Uploading...' : `${user.first_name} ${user.last_name}`}
          </span>
        </div>
        
        <div className="h-px bg-blue-100 mb-6" />
        
        <div className="space-y-6">
          <div className="bg-[#133E87] p-4 rounded-lg">
            <div className="flex items-center gap-3 text-white mb-4">
              <Pencil className="w-6 h-6" />
              <span className="font-semibold">Edit Name</span>
            </div>
            <div className="space-y-4 px-4">
              <div>
                <label className="block text-white text-sm mb-2">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-2 rounded bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white"
                />
              </div>
              <div>
                <label className="block text-white text-sm mb-2">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-2 rounded bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white"
                />
              </div>
              <div>
                <label className="block text-white text-sm mb-2">Change password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 rounded bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#133E87] p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3 text-white">
                <Shield className="w-6 h-6" />
                <div>
                  <span className="font-semibold block">Two Factor Authentication</span>
                  <span className="text-sm text-blue-200">
                    {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={twoFactorEnabled}
                  onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-3 text-white p-4 rounded-lg w-full transition-colors disabled:bg-blue-400"
          >
            <Pencil className="w-6 h-6" />
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
          </button>

          <button 
            onClick={handleDeleteAccount}
            className="bg-red-600 hover:bg-red-700 flex items-center gap-3 text-white p-4 rounded-lg w-full transition-colors"
          >
            <Trash2 className="w-6 h-6" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;