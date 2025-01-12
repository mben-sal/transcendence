import { Pencil, Image, Wallpaper } from 'lucide-react';
import setting from '../assets/src/settings_.svg';
import profil from '../assets/src/player_.svg';

const ProfileSettings = () => {
  return (
    <div className="flex gap-4 h-full justify-center items-center">
        <div className="flex-1 flex justify-center items-center h-full">
          <img
            src={setting}
            alt="Settings Illustration"
            className="w-2/3 object-fill"
          />
        </div>

        {/* Settings Card */}
        <div className="flex-1 bg-[#608BC1] rounded-lg shadow-lg p-6 h-full ">
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
          
          <div className="h-px bg-blue-100 mb-6" />
          
          <div className="space-y-4">
            <button className="bg-[#133E87] flex items-center gap-3 text-white hover:text-blue-200 transition-colors w-full">
              <Pencil className="w-8 h-8" />
              <span>Edit Profile Name</span>
            </button>
            <button className=" bg-[#133E87] flex items-center gap-3 text-white hover:text-blue-200 transition-colors w-full">
              <Image className="w-8 h-8" />
              <span>Edit Profile Photo</span>
            </button>
            <button className="bg-[#133E87] flex items-center gap-3 text-white hover:text-blue-200 transition-colors w-full">
              <Wallpaper className="w-8 h-8" />
              <span>Change Wallpaper</span>
            </button>
          </div>
        </div>
      </div>
    // </div>
  );
};

export default ProfileSettings;