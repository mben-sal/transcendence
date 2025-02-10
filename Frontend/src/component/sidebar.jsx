import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import logoImage from '../assets/src/logo.svg';
import home from '../assets/src/home.svg';
import game from '../assets/src/game.svg';
import chat from '../assets/src/chat.svg';
import settings from '../assets/src/setting.svg';
import logout from '../assets/src/logout.svg';
import Player_ from '../assets/src/player_.svg';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const { user, logout: contextLogout } = useUser();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await contextLogout();
        navigate('/auth/login');
    };

    const navLinks = [
        { to: "/", icon: home, label: "Home" },
        { to: "/game", icon: game, label: "Game" },
        { to: "/chat", icon: chat, label: "Chat" },
        { to: "/settings", icon: settings, label: "Settings" },
    ];

    const SidebarContent = () => (
        <div className="w-full md:w-[250px] bg-[#CBDCEB] flex flex-col h-full">
            <div className="mb-8 flex justify-center p-6 border-b border-[#608BC1]/50">
                <img src={logoImage} alt="Pong Logo" className="w-19 h-19" />
            </div>

            <nav className="p-4 space-y-2">
                {navLinks.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 
                            ${isActive 
                                ? 'bg-[#608BC1] text-white font-medium' 
                                : 'text-[#133E87] hover:bg-[#608BC1]/10'}`}>
                        <img src={link.icon} alt={link.label} className="w-12" />
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto p-4 border-t border-[#608BC1]/50">
                <div className='flex items-center gap-2'>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full mt-2 flex items-center gap-4 px-4 py-3 text-[#133E87] 
                        bg-slate-400 hover:bg-[#608BC1] hover:text-white
                        rounded-lg transition-colors duration-200"
                >
                    <img src={logout} alt="logout" className="w-12" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            <div className="h-screen shadow-2xl hidden md:flex">
                <SidebarContent />
            </div>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
                    <div className="h-screen w-[250px]">
                        <SidebarContent />
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;