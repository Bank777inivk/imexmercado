import React from 'react';
import { 
  List, Bell, MagnifyingGlass, 
  Question, SignOut 
} from '@phosphor-icons/react';
import { logout } from '@imexmercado/firebase';
import { useNavigate } from 'react-router-dom';

interface AdminTopBarProps {
  onMenuClick: () => void;
  title: string;
}

export function AdminTopBar({ onMenuClick, title }: AdminTopBarProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login'); // Ou vers la boutique publique
  };

  return (
    <header className="h-[70px] md:h-[80px] w-full bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 shrink-0">
      <div className="flex items-center gap-4">
        <button 
          className="lg:hidden text-gray-900 p-2 -ml-2 hover:bg-gray-50 rounded-xl transition-colors" 
          onClick={onMenuClick}
        >
          <List size={28} weight="bold" />
        </button>
        {/* Title removed to avoid repetition with page headers */}
        <div className="flex-1" /> 

      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <div className="hidden md:flex items-center bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 gap-3 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <MagnifyingGlass size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="bg-transparent border-none outline-none text-xs font-medium w-40" 
          />
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button className="p-2 text-gray-400 hover:text-primary transition-colors hover:bg-gray-50 rounded-xl">
            <Question size={24} weight="bold" />
          </button>
          
          <button className="relative p-2 text-gray-400 hover:text-primary transition-colors hover:bg-gray-50 rounded-xl">
            <Bell size={24} weight="bold" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="w-px h-6 bg-gray-100 mx-1 md:mx-2" />
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors group"
            title="Déconnexion"
          >
            <SignOut size={24} weight="bold" className="group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
