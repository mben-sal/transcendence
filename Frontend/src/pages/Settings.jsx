import { Pencil, Image, Wallpaper } from 'lucide-react';
import setting from '../assets/src/settings_.svg';
import profil from '../assets/src/player_.svg';

const ProfileSettings = () => {
  return (
    <div className="flex min-h-screen justify-center  p-10">
      <div className="max-w-3xl w-full flex gap-8">
        {/* Settings Illustration */}
        <div className="w-64">
          <img
            src={setting}
            alt="Settings Illustration"
            className="w-full"
          />
        </div>

        {/* Settings Card */}
        <div className="flex-1 bg-blue-500 rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-2xl text-white">Profile Settings</h2>
          </div>
          
          <div className="flex items-center gap-8 mb-6">
            <img
              src={profil}
              alt="Profile"
              className="w-12 h-12 rounded-full"
            />
            <span className="text-white text-lg">John Doe</span>
          </div>
          
          <div className="h-px bg-blue-400 mb-6" />
          
          <div className="space-y-4">
            <button className="flex items-center gap-3 text-white hover:text-blue-100 transition-colors w-full">
              <Pencil className="w-5 h-5" />
              <span>Edit Profile Name</span>
            </button>
            <button className="flex items-center gap-3 text-white hover:text-blue-100 transition-colors w-full">
              <Image className="w-5 h-5" />
              <span>Edit Profile Photo</span>
            </button>
            <button className="flex items-center gap-3 text-white hover:text-blue-100 transition-colors w-full">
              <Wallpaper className="w-5 h-5" />
              <span>Change Wallpaper</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;