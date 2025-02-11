import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Divide as Hamburger } from 'hamburger-react';
import Player_ from '../assets/src/player_.svg';
import { Search } from 'lucide-react';
import Notification from './profile/Notification';

const Navbar = ({ isOpen, setIsOpen }) => {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <nav className="h-[56px] bg-[#5376aa] p-4 flex items-center justify-between sticky top-0 z-40 shadow-2xl">
      <div className="flex items-center gap-4">
        <div className="md:hidden">
          <Hamburger toggled={isOpen} toggle={setIsOpen} color="#133E87" />
        </div>
      </div>
      
      <div className="flex-1 max-w-xl mx-8 text-black">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher des utilisateurs..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/80"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-black" size={20} />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Notification />
        <NavLink
          to="/profile"
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#608BC1]/10"
        >
          <span className="text-[#133E87] hidden md:block">{user?.first_name || 'Loading...'}</span>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-[#FFE5B4]">
            <img 
              src={user?.avatar || Player_} 
              alt="profile" 
              onError={(e) => {e.target.src = Player_}}
              className="w-full h-full object-cover" 
            />
          </div>
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;