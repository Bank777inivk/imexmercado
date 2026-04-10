import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopBar } from './AdminTopBar';
import { BottomNav } from './BottomNav';

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const getTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Tableau de bord';
    if (path.startsWith('/produits')) return 'Gestion du Catalogue';
    if (path.startsWith('/commandes')) return 'Suivi des Commandes';
    if (path.startsWith('/clients')) return 'Base Clients';
    if (path.startsWith('/parametres')) return 'Paramètres Système';
    if (path.startsWith('/categories')) return 'Catégories';
    if (path.startsWith('/cms')) return 'Contenu Site';
    return 'IMEX-ADMIN';
  };

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        <AdminTopBar 
          onMenuClick={() => setIsSidebarOpen(true)} 
          title={getTitle()} 
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 pb-24 md:pb-10 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Outlet />
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
