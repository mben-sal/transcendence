import { Pencil, Shield, Trash2 } from 'lucide-react';
import { useState } from 'react';
import setting from '../assets/src/settings_.svg';
import profil from '../assets/src/player_.svg';

const ProfileSettings = () => {
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleSave = () => {
    // Add your save logic here
    console.log('Saving:', { firstName, lastName });
  };

  return (
    <div className="flex gap-4 h-full justify-center items-center">
      <div className="flex-1 flex justify-center items-center h-full">
        <img
          src={setting}
          alt="Settings Illustration"
          className="w-2/3 object-fill"
        />
      </div>

      <div className="flex-1 bg-[#608BC1] rounded-lg shadow-lg p-6 h-full">
        <div className="mb-6">
          <h2 className="text-2xl text-white">Profile Settings</h2>
        </div>
        
        <div className="flex items-center gap-8 mb-6">
          <img
            src={profil}
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
          <span className="text-white text-lg">{firstName} {lastName}</span>
        </div>
        
        <div className="h-px bg-blue-100 mb-6" />
        
        <div className="space-y-6">
          {/* Name Edit Section */}
          <div className="bg-[#133E87] p-4 rounded-lg">
            <div className="flex items-center gap-3 text-white mb-4">
              <Pencil className="w-6 h-6" />
              <span className="font-semibold">Modifier le nom et prénom</span>
            </div>
            <div className="space-y-4 px-4">
              <div>
                <label className="block text-white text-sm mb-2">Prénom</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-2 rounded bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white"
                />
              </div>
              <div>
                <label className="block text-white text-sm mb-2">Nom</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-2 rounded bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white"
                />
              </div>
            </div>
          </div>

          {/* Two Factor Section */}
          <div className="bg-[#133E87] p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3 text-white">
                <Shield className="w-6 h-6" />
                <div>
                  <span className="font-semibold block">Two Factor Authentication</span>
                  <span className="text-sm text-blue-200">
                    {twoFactorEnabled ? 'Activé' : 'Désactivé'}
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

          {/* Modify Button */}
          <button 
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-3 text-white p-4 rounded-lg w-full transition-colors"
          >
            <Pencil className="w-6 h-6" />
            <span>Modifier</span>
          </button>

          {/* Delete Account Button */}
          <button className="bg-red-600 hover:bg-red-700 flex items-center gap-3 text-white p-4 rounded-lg w-full transition-colors">
            <Trash2 className="w-6 h-6" />
            <span>Supprimer le compte</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;