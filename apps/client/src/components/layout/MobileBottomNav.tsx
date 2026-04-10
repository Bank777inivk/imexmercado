import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { House, MagnifyingGlass, ShoppingCart, User } from '@phosphor-icons/react';
import { useCart } from '../../context/CartContext';

export function MobileBottomNav() {
  const location = useLocation();
  const { totalItems } = useCart();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 px-6 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
      <div className="flex justify-between items-center">
        
        {/* Accueil */}
        <Link 
          to="/" 
          className={`flex flex-col items-center justify-center w-16 h-12 transition-colors ${isActive('/') ? 'text-primary' : 'text-gray-400 hover:text-gray-900'}`}
        >
          <House size={26} weight={isActive('/') ? 'fill' : 'regular'} />
          <span className="text-[9px] font-black uppercase tracking-tight mt-1">Accueil</span>
        </Link>
        
        {/* Boutique (Search) */}
        <Link 
          to="/boutique" 
          className={`flex flex-col items-center justify-center w-16 h-12 transition-colors ${isActive('/boutique') ? 'text-primary' : 'text-gray-400 hover:text-gray-900'}`}
        >
          <MagnifyingGlass size={26} weight={isActive('/boutique') ? 'fill' : 'regular'} />
          <span className="text-[9px] font-black uppercase tracking-tight mt-1">Boutique</span>
        </Link>
        
        {/* Panier */}
        <Link 
          to="/panier" 
          className={`flex flex-col items-center justify-center w-16 h-12 transition-colors relative ${isActive('/panier') ? 'text-primary' : 'text-gray-400 hover:text-gray-900'}`}
        >
          <div className="relative">
             <ShoppingCart size={26} weight={isActive('/panier') ? 'fill' : 'regular'} />
             {totalItems > 0 && (
               <span className="absolute -top-1 -right-2 bg-primary text-white text-[9px] font-black h-4 w-4 flex items-center justify-center rounded-full ring-2 ring-white shadow-sm">
                 {totalItems}
               </span>
             )}
          </div>
          <span className="text-[9px] font-black uppercase tracking-tight mt-1">Panier</span>
        </Link>
        
        {/* Compte */}
        <Link 
          to="/compte" 
          className={`flex flex-col items-center justify-center w-16 h-12 transition-colors ${isActive('/compte') || isActive('/connexion') || isActive('/inscription') ? 'text-primary' : 'text-gray-400 hover:text-gray-900'}`}
        >
          <User size={26} weight={isActive('/compte') ? 'fill' : 'regular'} />
          <span className="text-[9px] font-black uppercase tracking-tight mt-1">Compte</span>
        </Link>

      </div>
    </nav>
  );
}
