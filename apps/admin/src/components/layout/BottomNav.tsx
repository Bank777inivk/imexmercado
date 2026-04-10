import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Layout, Package, ShoppingCart, 
  Users, Gear 
} from '@phosphor-icons/react';

const mobileNavLinks = [
  { label: 'Dash', path: '/', icon: Layout },
  { label: 'Produits', path: '/produits', icon: Package },
  { label: 'Commandes', path: '/commandes', icon: ShoppingCart },
  { label: 'Clients', path: '/clients', icon: Users },
  { label: 'Paramètres', path: '/parametres', icon: Gear },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 flex justify-around items-center px-2 py-3 lg:hidden z-40 safe-area-bottom">
      {mobileNavLinks.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `
            flex flex-col items-center gap-1 px-3 py-1 rounded-2xl transition-all
            ${isActive ? 'text-primary' : 'text-gray-400'}
          `}
        >
          {({ isActive }) => (
            <>
              <item.icon 
                size={22} 
                weight={isActive ? 'fill' : 'bold'} 
              />
              <span className={`text-[9px] font-black uppercase tracking-tight ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
