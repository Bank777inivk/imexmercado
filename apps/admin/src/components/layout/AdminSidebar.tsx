import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Layout, Package, ShoppingCart, 
  Users, Gear, CaretRight, X,
  Megaphone 
} from '@phosphor-icons/react';

const adminMenu = [
  { label: 'Tableau de bord', path: '/', icon: Layout },
  { label: 'Produits', path: '/produits', icon: Package },
  { label: 'Catégories', path: '/categories', icon: Layout },
  { label: 'Contenu Site', path: '/cms', icon: Megaphone },
  { label: 'Commandes', path: '/commandes', icon: ShoppingCart },
  { label: 'Clients', path: '/clients', icon: Users },
  { label: 'Paramètres', path: '/parametres', icon: Gear },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-[280px] bg-white border-r border-gray-100 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <Link to="/" className="font-black text-2xl tracking-tight text-gray-900">
            <span className="text-primary">i</span>M-ADMIN
          </Link>
          <button className="lg:hidden text-gray-400 p-2 hover:text-gray-900" onClick={onClose}>
            <X size={24} weight="bold" />
          </button>
        </div>

        <nav className="flex-grow p-4 mt-4 space-y-2 overflow-y-auto">
          {adminMenu.map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              onClick={() => onClose()}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${
                location.pathname === item.path 
                  ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={22} weight={location.pathname === item.path ? 'fill' : 'bold'} />
                <span className="text-sm font-bold tracking-tight">{item.label}</span>
              </div>
              {location.pathname === item.path && <CaretRight size={14} weight="bold" />}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-50">
          <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-xs">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-gray-900 truncate">Seba Aussant</p>
              <p className="text-[10px] text-gray-500 font-medium">Administrateur</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
