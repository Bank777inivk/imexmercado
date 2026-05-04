import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { StoreLayout } from './components/layout/StoreLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { CheckoutLayout } from './components/layout/CheckoutLayout';

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
import { CheckoutPage } from './pages/CheckoutPage';
import { Dashboard, Orders, Addresses, Favorites } from './pages/account/AccountPages';
import { subscribeToDocument } from '@imexmercado/firebase';
import { adjustColor } from '@imexmercado/ui/src/utils';

function useDynamicTheme() {
  React.useEffect(() => {
    const unsubscribe = subscribeToDocument('settings', 'homepage', (data: any) => {
      if (data?.globalTheme?.client) {
        const { primaryColor, secondaryColor, accentColor } = data.globalTheme.client;
        const root = document.documentElement;
        
        // Primary variants
        root.style.setProperty('--color-primary', primaryColor);
        root.style.setProperty('--color-primary-dark', adjustColor(primaryColor, -20));
        root.style.setProperty('--color-primary-light', adjustColor(primaryColor, 30));
        
        // Secondary variants
        root.style.setProperty('--color-secondary', secondaryColor);
        root.style.setProperty('--color-secondary-dark', adjustColor(secondaryColor, -20));
        root.style.setProperty('--color-secondary-light', adjustColor(secondaryColor, 30));
        
        // Accent variants
        root.style.setProperty('--color-accent', accentColor);
        root.style.setProperty('--color-accent-dark', adjustColor(accentColor, -20));
      }
    });
    return () => unsubscribe();
  }, []);
}

function App() {
  useDynamicTheme();
  return (
    <Routes>
      {/* ─── Special Isolated Checkout ─── */}
      <Route element={<CheckoutLayout />}>
        <Route path="/commande" element={<CheckoutPage />} />
      </Route>

      {/* ─── Public & Shop Universe ─── */}
      <Route element={<StoreLayout />}>
        <Route path="/" element={<HomePage isSidebarOpen={true} />} />
        <Route path="/boutique" element={<ShopPage />} />
        <Route path="/category/:categorySlug" element={<ShopPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/a-propos" element={<AboutPage />} />
        
        {/* Product Drawer (overlay logic is global) */}
        <Route path="/p/:productSlug" element={<ProductPage />} />

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
