import React from 'react';
import { ShoppingCart, User, MagnifyingGlass, List } from '@phosphor-icons/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@imexmercado/firebase';
import { useCart } from '../../context/CartContext';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();
  const { totalItems, totalPrice } = useCart();
  const [searchQuery, setSearchQuery] = React.useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
       navigate(`/boutique?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-[#1A1A1A] text-white">
      
      {/* 
        ========================================
        DESKTOP HEADER : h-[80px]
        ========================================
      */}
      <div className="w-full px-2 md:px-4 lg:px-6 h-[80px] hidden md:flex items-center gap-6">
        {/* Logo */}
        <Link to="/" className="font-extrabold text-2xl tracking-tight whitespace-nowrap flex-shrink-0 w-[250px] hover:text-primary transition-colors">
          <span className="text-primary">i</span>mexmercado
          <div className="text-[10px] font-normal text-gray-400 tracking-widest uppercase -mt-1">all in one store</div>
        </Link>
        
        {/* Search Bar Desktop */}
        <form onSubmit={handleSearch} className="flex-1 flex items-center max-w-2xl">
          <select className="h-11 px-3 bg-gray-100 border-r border-gray-300 text-gray-600 text-xs rounded-l-sm focus:outline-none cursor-pointer">
            <option>Toutes catégories</option>
            <option>Téléphones &amp; Hi-Tech</option>
            <option>Maison &amp; Décoration</option>
            <option>Meubles &amp; Lampes</option>
            <option>Bricolage</option>
            <option>Barbecues &amp; Planchas</option>
            <option>Piscines &amp; Spas</option>
          </select>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Entrez votre mot-clé..." 
            className="flex-1 h-11 px-4 text-sm text-gray-800 focus:outline-none"
          />
          <button type="submit" className="h-11 px-5 bg-primary hover:bg-primary-dark transition-colors flex items-center justify-center rounded-r-sm">
            <MagnifyingGlass size={20} weight="bold" className="text-white" />
          </button>
        </form>

        {/* Right — Account + Cart */}
        <div className="flex items-center gap-5 ml-auto">
          {/* Account */}
          <Link to={user ? '/compte' : '/connexion'} className="flex items-center gap-2 cursor-pointer group hover:opacity-80 transition-opacity">
            <User size={26} />
            <div className="flex flex-col text-xs leading-tight">
              <span className="text-gray-400">{user ? 'Bienvenue' : 'Connexion'}</span>
              <span className="font-bold truncate max-w-[100px]">
                {user ? (user.displayName?.split(' ')[0] || 'Mon Compte') : 'Mon Compte'}
              </span>
            </div>
          </Link>

          {/* Cart */}
          <Link to="/panier" className="flex items-center gap-2 cursor-pointer group hover:opacity-80 transition-opacity">
            <div className="relative">
              <ShoppingCart size={26} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </div>
            <div className="flex flex-col text-xs leading-tight">
              <span className="text-gray-400">Mon Panier</span>
              <span className="font-bold text-primary">€{totalPrice.toFixed(2)}</span>
            </div>
          </Link>
        </div>
      </div>


      {/* 
        ========================================
        MOBILE HEADER : App-like layout
        ========================================
      */}
      {/* 
        ========================================
        MOBILE HEADER : App-like layout
        ========================================
      */}
      <div className="md:hidden flex flex-col pt-3 pb-3 overflow-hidden">
        {/* Row 1: 3-Column Grid for perfect centering */}
        <div className="px-4 grid grid-cols-3 items-center h-12">
           {/* Left: Hamburger */}
           <div className="flex justify-start">
             <button 
               onClick={onMenuClick}
               className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all text-white"
             >
               <List size={28} weight="bold" />
             </button>
           </div>

           {/* Center: Logo */}
           <div className="flex justify-center">
             <Link to="/" className="font-black text-xl tracking-tighter whitespace-nowrap">
               IMEX<span className="text-primary">MERCADO</span>
             </Link>
           </div>
           
           {/* Right: Cart/Account (Optional, keeping it symmetrical) */}
           <div className="flex justify-end">
             <Link to="/panier" className="relative w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full">
               <ShoppingCart size={24} />
               {totalItems > 0 && (
                 <span className="absolute top-1 right-1 bg-primary text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                   {totalItems}
                 </span>
               )}
             </Link>
           </div>
        </div>

        {/* Row 2: Mobile Search Bar */}
        <div className="px-4 mt-2">
          <form onSubmit={handleSearch} className="flex items-center w-full relative">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un produit..." 
              className="w-full h-10 pl-4 pr-12 text-sm text-gray-900 bg-white rounded-xl focus:outline-none shadow-sm"
            />
            <button type="submit" className="absolute right-1 w-8 h-8 bg-primary flex items-center justify-center rounded-lg active:scale-95 transition-all">
              <MagnifyingGlass size={16} weight="bold" className="text-white" />
            </button>
          </form>
        </div>
      </div>

    </header>
  );
}
