import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminGuard } from './components/AdminGuard';
import { DashboardView } from './views/DashboardView';
import { ProductsView } from './views/ProductsView';
import { ProductFormView } from './views/ProductFormView';
import { CMSView } from './views/CMSView';
import { OrdersView } from './views/OrdersView';
import { LoginView } from './views/LoginView';
import { CustomersView } from './views/CustomersView';
import { SettingsView } from './views/SettingsView';
import { subscribeToDocument } from '@imexmercado/firebase';
import { adjustColor } from '@imexmercado/ui/src/utils';

function useDynamicTheme() {
  React.useEffect(() => {
    const unsubscribe = subscribeToDocument('settings', 'homepage', (data: any) => {
      if (data?.globalTheme?.admin) {
        const { 
          primaryColor, sidebarColor, sidebarTextColor, sidebarActiveColor, 
          cardBgColor, cardTextColor, accentColor 
        } = data.globalTheme.admin;
        const root = document.documentElement;
        
        // Primary variants
        root.style.setProperty('--color-primary', primaryColor);
        root.style.setProperty('--color-primary-dark', adjustColor(primaryColor, -20));
        root.style.setProperty('--color-primary-light', adjustColor(primaryColor, 30));
        
        // Accent variants
        root.style.setProperty('--color-accent', accentColor);
        root.style.setProperty('--color-accent-dark', adjustColor(accentColor, -20));
        
        // Admin specific
        root.style.setProperty('--admin-sidebar-bg', sidebarColor);
        root.style.setProperty('--admin-sidebar-text', sidebarTextColor || '#6B7280');
        root.style.setProperty('--admin-sidebar-active-text', sidebarActiveColor || '#FFFFFF');
        root.style.setProperty('--admin-card-bg', cardBgColor || 'rgba(128,128,128,0.08)');
        root.style.setProperty('--admin-card-text', cardTextColor || '#111827');
      }
    });
    return () => unsubscribe();
  }, []);
}

const Products = () => (
  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="p-8 border-b border-gray-50 flex items-center justify-between">
      <h3 className="font-bold text-gray-900">Liste des Produits</h3>
      <button className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
        + Nouveau Produit
      </button>
    </div>
    <div className="p-12 text-center text-gray-400">
      <p className="text-sm font-medium">Chargement du catalogue...</p>
    </div>
  </div>
);



const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl text-center space-y-6">
      <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto text-4xl font-black">
        !
      </div>
      <button 
        onClick={() => window.location.href = '/login'}
        className="w-full bg-primary text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl hover:scale-105 transition-all mb-2"
      >
        Se connecter (Admin)
      </button>
      <button 
        onClick={() => window.location.href = '/'}
        className="w-full bg-gray-100 text-gray-500 font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-gray-200 transition-all"
      >
        Retour à la boutique
      </button>
    </div>
  </div>
);

function App() {
  useDynamicTheme();
  return (
    <Routes>
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/login" element={<LoginView />} />
      
      <Route element={<AdminGuard />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<DashboardView />} />
          <Route path="/produits" element={<ProductsView />} />
          <Route path="/produits/nouveau" element={<ProductFormView />} />
          <Route path="/produits/modifier/:id" element={<ProductFormView />} />
          <Route path="/cms" element={<CMSView />} />
          <Route path="/commandes" element={<OrdersView />} />
          <Route path="/clients" element={<CustomersView />} />
          <Route path="/parametres" element={<SettingsView />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
