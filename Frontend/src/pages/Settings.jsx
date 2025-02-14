import { Pencil, Shield, Camera, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useUser } from '../contexts/UserContext';
import Player_ from '../assets/src/player_.svg';
import axios from 'axios';
import ConfirmationModal from '../component/settings/confirmationModel';
import ActionButtons from '../component/settings/ActionButtons';



axios.defaults.withCredentials = true;
const ProfileSettings = () => {
  const { user, fetchUserProfile } = useUser();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationType, setConfirmationType] = useState(null);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [pendingChanges, setPendingChanges] = useState(null);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const fileInputRef = useRef(null);


  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setTwoFactorEnabled(user.two_factor_enabled || false);
    }
  }, [user]);

  const validatePasswords = () => {
    if (newPassword && !currentPassword) {
      setPasswordError('Please enter your current password');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return false;
    }
    if (newPassword && newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };
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
	  setError('Error uploading photo');
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
	  setError('Error deleting photo');
	}
  };

  const handleSave = async () => {
	try {
	  const token = localStorage.getItem('token');
	  
	  if (newPassword) {
		// Si changement de mot de passe
		if (!validatePasswords()) {
		  return;
		}
  
		const response = await axios.post(
		  'http://localhost:8000/api/users/request-password-change/',
		  {
			old_password: currentPassword,
			new_password: newPassword
		  },
		  {
			headers: { 
			  Authorization: `Bearer ${token}`,
			  'Content-Type': 'application/json'
			},
			withCredentials: true
		  }
		);
  
		if (response.data.status === 'success') {
		  setConfirmationType('password');
		  setShowConfirmation(true);
		}
	  } else {
		// Pour les autres changements (nom, prénom, etc.)
		const response = await axios.post(
		  'http://localhost:8000/api/users/request-change/',
		  {
			first_name: firstName,
			last_name: lastName,
			two_factor_enabled: twoFactorEnabled
		  },
		  {
			headers: { 
			  Authorization: `Bearer ${token}`,
			  'Content-Type': 'application/json'
			},
			withCredentials: true
		  }
		);
		
		if (response.data.message) {
		  setConfirmationType('profile');
		  setShowConfirmation(true);
		}
	  }
	} catch (error) {
	  console.error('Save error:', error.response || error);
	  const errorMessage = error.response?.data?.message || 'Erreur lors de la sauvegarde';
	  if (newPassword) {
		setPasswordError(errorMessage);
	  } else {
		setError(errorMessage);
	  }
	}
  };
  
  // Modification de handleConfirmation pour gérer les deux types
  const handleConfirmation = async (code) => {
	try {
	  const token = localStorage.getItem('token');
	  let response;
  
	  if (confirmationType === 'password') {
		response = await axios.post(
		  'http://localhost:8000/api/users/confirm-password-change/',
		  { confirmation_code: code },
		  {
			headers: { 
			  Authorization: `Bearer ${token}`,
			  'Content-Type': 'application/json'
			},
			withCredentials: true
		  }
		);
  
		if (response.data.status === 'success') {
		  setCurrentPassword('');
		  setNewPassword('');
		  setConfirmPassword('');
		  setPasswordError('');
		  setShowConfirmation(false);
		  
		  // Déconnexion après changement de mot de passe
		  alert('Mot de passe changé avec succès. Veuillez vous reconnecter.');
		  localStorage.removeItem('token');
		  window.location.href = '/auth/login';
		}
	  } else {
		// Pour les changements de profil
		response = await axios.post(
		  'http://localhost:8000/api/users/confirm-profile-change/',
		  { confirmation_code: code },
		  {
			headers: { 
			  Authorization: `Bearer ${token}`,
			  'Content-Type': 'application/json'
			},
			withCredentials: true
		  }
		);
  
		if (response.data && response.data.message) {
		  setShowConfirmation(false);
		  await fetchUserProfile();
		}
	  }
	} catch (error) {
	  console.error('Confirmation error:', error.response || error);
	  throw new Error(error.response?.data?.error || 'Code de confirmation invalide');
	}
  };

  const applyChanges = async (changes) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:8000/api/users/profile/',
        changes,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
    
      if (response.status === 200) {
		  setCurrentPassword('');
		  setNewPassword('');
		  setConfirmPassword('');
		  setError('');
		  await fetchUserProfile();
      }
    } catch (error) {
      console.error('Error applying changes:', error);
      setError('Error applying changes');
    }
  };

const handleDeleteAccount = async (password) => {
	try {
	  const token = localStorage.getItem('token');
	  
	  // Appeler l'endpoint de confirmation de suppression
	  await axios.post('http://localhost:8000/api/users/confirm-delete/', 
		{ password: password },
		{
		  headers: { Authorization: `Bearer ${token}` }
		}
	  );
	  
	  // Si la suppression est réussie, déconnecter l'utilisateur
	  localStorage.removeItem('token');
	  localStorage.removeItem('refresh_token');
	  
	  // Rediriger vers la page de login
	  window.location.href = '/auth/login';
	} catch (error) {
	  console.error('Error deleting account:', error);
	  setError(error.response?.data?.message || 'Failed to delete account. Please try again.');
	}
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white">
  <h1 className="text-2xl font-semibold text-center mb-4">Profile Settings</h1>
  <div className="flex items-center gap-4 justify-center">
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
    <span className="text-lg font-medium">
      {uploadLoading ? 'Uploading...' : `${user.first_name} ${user.last_name}`}
    </span>
  </div>
</div>

        {/* Affichage des erreurs générales */}
        {error && (
          <div className="m-6 bg-red-50 text-red-600 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Main content en deux colonnes */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Colonne gauche: Profile et Two Factor */}
            <div className="space-y-8">
              {/* Edit Profile Section */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Pencil className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-medium">Edit Profile</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-neutral-950">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full p-2.5 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-neutral-950"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-neutral-950">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full p-2.5 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-neutral-950"
                    />
                  </div>
                </div>
              </div>

              {/* Two Factor Authentication Section */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <div>
                      <h2 className="text-lg font-medium">Two Factor Authentication</h2>
                      <p className="text-sm text-gray-600">
                        {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={twoFactorEnabled}
                      onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 text-neutral-950">
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Colonne droite: Password Management */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-medium">Change Password</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-neutral-950">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-2.5 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-neutral-950"
                    placeholder="Enter your current password"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-neutral-950">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2.5 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-neutral-950"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-neutral-950">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2.5 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-neutral-950"
                    placeholder="Confirm new password"
                  />
                </div>
                {passwordError && (
                  <p className="text-red-500 text-sm">{passwordError}</p>
                )}
              </div>
            </div>
          </div>
		<ActionButtons 
  			onSave={handleSave}
  			onDelete={handleDeleteAccount}
  			loading={loading}
		/>
        </div>
      </div>

	  <ConfirmationModal 
  		isOpen={showConfirmation}
  		onClose={() => {
   		setShowConfirmation(false);
    	setPendingChanges(null);
 	 	}}
  		onConfirm={handleConfirmation}
  		type={confirmationType}
		/>
    </div>
  );
};

export default ProfileSettings;

