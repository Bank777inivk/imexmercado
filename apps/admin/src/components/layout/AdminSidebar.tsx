import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Layout, Package, ShoppingCart, 
  Users, Gear, CaretRight, X,
  Megaphone, CreditCard
} from '@phosphor-icons/react';

const adminMenu = [
  { label: 'Tableau de bord', path: '/', icon: Layout },
  { label: 'Mes Clients', path: '/clients', icon: Users },
  { label: 'Gestion des Produits', path: '/produits', icon: Package },
  { label: 'Gestion des Catégories', path: '/categories', icon: List },
  { label: 'Mes Commandes', path: '/commandes', icon: ShoppingCart },
  { label: 'Gestion technique du site', path: '/cms', icon: Gear },
  { label: 'Gestion des API', path: '/parametres', icon: CreditCard },
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
      <aside 
        style={{ backgroundColor: 'var(--admin-sidebar-bg, #FFFFFF)' }}
        className={`fixed inset-y-0 left-0 w-[280px] border-r border-gray-100 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}
      >
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <Link to="/" className="font-black text-2xl tracking-tight" style={{ color: 'var(--admin-sidebar-text, #111827)' }}>
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
                  ? 'bg-primary shadow-xl shadow-primary/20' 
                  : 'hover:bg-black/5'
              }`}
              style={{ 
                color: location.pathname === item.path 
                  ? 'var(--admin-sidebar-active-text, #FFFFFF)' 
                  : 'var(--admin-sidebar-text, #6B7280)'
              }}
            >
              <div className="flex items-center gap-3">
                <item.icon size={22} weight={location.pathname === item.path ? 'fill' : 'bold'} />
                <span className="text-sm font-bold tracking-tight">{item.label}</span>
              </div>
              {location.pathname === item.path && <CaretRight size={14} weight="bold" />}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t" style={{ borderColor: 'rgba(128,128,128,0.1)' }}>
          <div className="p-4 rounded-2xl flex items-center gap-3" style={{ backgroundColor: 'var(--admin-card-bg, rgba(128,128,128,0.08))' }}>
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-xs">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate" style={{ color: 'var(--admin-card-text, #111827)' }}>Seba Aussant</p>
              <p className="text-[10px] font-medium opacity-60" style={{ color: 'var(--admin-card-text, #111827)' }}>Administrateur</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
