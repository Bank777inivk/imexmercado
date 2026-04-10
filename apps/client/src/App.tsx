import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { StoreLayout } from './components/layout/StoreLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { FAQPage } from './pages/FAQPage';
import { TrackingPage } from './pages/TrackingPage';
import { 
  CGVPage, PrivacyPage, LegalInfoPage, ShippingInfoPage, 
  ReturnsInfoPage, CookiesPage 
} from './pages/legal/LegalPages';

import { LoginPage, RegisterPage, ForgotPasswordPage } from './pages/auth/AuthPages';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { Dashboard, Orders, Addresses, Favorites } from './pages/account/AccountPages';

function App() {
  return (
    <Routes>
      {/* ─── Public & Shop Universe ─── */}
      <Route element={<StoreLayout />}>
        <Route path="/" element={<HomePage isSidebarOpen={true} />} />
        <Route path="/boutique" element={<ShopPage />} />
        <Route path="/category/:categorySlug" element={<ShopPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/a-propos" element={<AboutPage />} />
        
        {/* Product & Cart */}
        <Route path="/p/:productSlug" element={<ProductPage />} />
        <Route path="/panier" element={<CartPage />} />
        <Route path="/commande" element={<CheckoutPage />} />

        {/* Auth (Still using Store Layout for branding) */}
        <Route path="/connexion" element={<LoginPage />} />
        <Route path="/inscription" element={<RegisterPage />} />
        <Route path="/mot-de-passe-oublie" element={<ForgotPasswordPage />} />

        {/* Legal Pages */}
        <Route path="/cgv" element={<CGVPage />} />
        <Route path="/confidentialite" element={<PrivacyPage />} />
        <Route path="/mentions-legales" element={<LegalInfoPage />} />
        <Route path="/cookies" element={<CookiesPage />} />
        <Route path="/livraison" element={<ShippingInfoPage />} />
        <Route path="/retours" element={<ReturnsInfoPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/suivi-commande" element={<TrackingPage />} />
      </Route>

      {/* ─── Private Dashboard Universe ─── */}
      <Route path="/compte" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="commandes" element={<Orders />} />
        <Route path="adresses" element={<Addresses />} />
        <Route path="favoris" element={<Favorites />} />
      </Route>
    </Routes>
  );
}

export default App;
