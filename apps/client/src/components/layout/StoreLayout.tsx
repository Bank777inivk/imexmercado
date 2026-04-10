import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { PromoBar } from './PromoBar';
import { TopBar } from './TopBar';
import { Header } from './Header';
import { NavBar } from './NavBar';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileDrawer } from './MobileDrawer';

export function StoreLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg flex flex-col font-sans">
      <div className="sticky top-0 z-50 shadow-md">
        <PromoBar />
        <TopBar />
        <Header onMenuClick={() => setIsMobileDrawerOpen(true)} />
        <NavBar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>
      
      <main className="flex-grow">
        <Outlet context={{ isSidebarOpen }} />
      </main>

      <Footer />

      {/* Mobile Exclusives */}
      <MobileBottomNav />
      <MobileDrawer 
        isOpen={isMobileDrawerOpen} 
        onClose={() => setIsMobileDrawerOpen(false)} 
      />
    </div>
  );
}
