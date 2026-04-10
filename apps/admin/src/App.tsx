import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminGuard } from './components/AdminGuard';
import { DashboardView } from './views/DashboardView';
import { ProductsView } from './views/ProductsView';
import { ProductFormView } from './views/ProductFormView';
import { CategoriesView } from './views/CategoriesView';
import { CategoryFormView } from './views/CategoryFormView';
import { CMSView } from './views/CMSView';
import { OrdersView } from './views/OrdersView';
import { LoginView } from './views/LoginView';
import { CustomersView } from './views/CustomersView';

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
          <Route path="/categories" element={<CategoriesView />} />
          <Route path="/categories/nouveau" element={<CategoryFormView />} />
          <Route path="/cms" element={<CMSView />} />
          <Route path="/commandes" element={<OrdersView />} />
          <Route path="/clients" element={<CustomersView />} />
          <Route path="/parametres" element={<div className="p-8 font-bold text-gray-400">Paramètres système...</div>} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
