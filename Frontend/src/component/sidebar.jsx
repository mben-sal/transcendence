import logoImage from '../assets/src/logo.svg'
import home from '../assets/src/home.svg'
import game from '../assets/src/game.svg'
import chat from '../assets/src/chat.svg'
import settings from '../assets/src/setting.svg'
import logout from '../assets/src/logout.svg'
import { NavLink } from 'react-router-dom';
import Player from '../assets/src/player_.svg';
import { Divide as Hamburger } from 'hamburger-react'
import { useState } from 'react';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { to: "/", icon: home, label: "Home" },
        { to: "/game", icon: game, label: "Game" },
        { to: "/chat", icon: chat, label: "Chat" },
        { to: "/settings", icon: settings, label: "Settings" },
    ];

    const SidebarContent = () => (
        <div className="w-full md:w-[250px] bg-[#CBDCEB] flex flex-col h-full">
            {/* Logo Section */}
            <div className="mb-8 flex justify-center p-6 border-b border-[#608BC1]/50">
                <img
                    src={logoImage}
                    alt="Pong Logo"
                    className="w-19 h-19"
                />
            </div>

            {/* Navigation Menu */}
            <nav className="p-4 space-y-2">
                {navLinks.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        onClick={() => setIsOpen(false)} // Close mobile menu when clicking a link
                        className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 
                            ${isActive 
                            ? 'bg-[#608BC1] text-white font-medium' 
                            : 'text-[#133E87] hover:bg-[#608BC1]/10'}`}>
                        <img src={link.icon} alt={link.label} className="w-12" />
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* User Profile */}
            <div className="mt-auto p-4 border-t border-[#608BC1]/50">
                <div className="flex items-center gap-3 px-4 py-2">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-[#FFE5B4]">
                        <img src={Player} alt="profile" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[#133E87]">John Doe</span>
                </div>
                <button
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
            {/* Hamburger Menu for Mobile */}
            <div className="fixed top-4 left-4 z-50 md:hidden">
                <Hamburger toggled={isOpen} toggle={setIsOpen} color="#133E87" />
            </div>

            {/* Desktop Sidebar */}
            <div className="h-screen shadow-2xl hidden md:flex">
                <SidebarContent />
            </div>

            {/* Mobile Sidebar */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
                    <div className="h-screen w-[250px] transform transition-transform duration-300">
                        <SidebarContent />
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;