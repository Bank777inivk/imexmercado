import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { StoreLayout } from './components/layout/StoreLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { CheckoutLayout } from './components/layout/CheckoutLayout';
import { TrackingManager } from './components/layout/TrackingManager';
import { CookieBanner } from './components/layout/CookieBanner';

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
import { WishlistPage } from './pages/WishlistPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { Dashboard, Orders, Settings, Favorites } from './pages/account/AccountPages';
import { subscribeToDocument } from '@imexmercado/firebase';
import { adjustColor } from '@imexmercado/ui/src/utils';

function useDynamicTheme() {
  React.useEffect(() => {
    const unsubscribe = subscribeToDocument('settings', 'homepage', (data: any) => {
      if (data?.globalTheme?.client) {
        const { 
          primaryColor, secondaryColor, accentColor,
          sidebarColor, sidebarTextColor, sidebarActiveColor,
          cardBgColor, cardTextColor
        } = data.globalTheme.client;
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

        // Dashboard specific
        root.style.setProperty('--client-sidebar-bg', sidebarColor || '#0F1115');
        root.style.setProperty('--client-sidebar-text', sidebarTextColor || '#9CA3AF');
        root.style.setProperty('--client-sidebar-active-text', sidebarActiveColor || '#FFFFFF');
        root.style.setProperty('--client-card-bg', cardBgColor || '#FFFFFF');
        root.style.setProperty('--client-card-text', cardTextColor || '#111827');
      }
    });
    return () => unsubscribe();
  }, []);
}

const ProductRedirect = () => {
  const location = useLocation();
  const id = location.pathname.split('/').pop();
  return <Navigate to={`/?product=${id}`} replace />;
};


function App() {
  useDynamicTheme();

  React.useEffect(() => {
    if (window.location.protocol === 'http:' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
      window.location.href = window.location.href.replace('http:', 'https:');
    }
  }, []);

  return (
    <>
      <TrackingManager />
      <CookieBanner />
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
        
        {/* Product Drawer is now global via modal */}
        <Route path="/p/:productSlug" element={<ProductRedirect />} />
        <Route path="/produit/*" element={<ProductRedirect />} />

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
        <Route path="/favoris" element={<WishlistPage />} />
      </Route>

      {/* ─── Private Dashboard Universe ─── */}
      <Route path="/compte" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="commandes" element={<Orders />} />
        <Route path="parametres" element={<Settings />} />
        <Route path="favoris" element={<Favorites />} />
      </Route>
    </Routes>
    </>
  );
}

export default App;
