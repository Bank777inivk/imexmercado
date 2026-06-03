import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { StoreLayout } from './components/layout/StoreLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { CheckoutLayout } from './components/layout/CheckoutLayout';
import { TrackingManager } from './components/layout/TrackingManager';
import { CookieBanner } from './components/layout/CookieBanner';
import { subscribeToDocument } from '@imexmercado/firebase';
import { adjustColor } from '@imexmercado/ui/src/utils';

const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const ShopPage = lazy(() => import('./pages/ShopPage').then(m => ({ default: m.ShopPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const FAQPage = lazy(() => import('./pages/FAQPage').then(m => ({ default: m.FAQPage })));
const TrackingPage = lazy(() => import('./pages/TrackingPage').then(m => ({ default: m.TrackingPage })));

const CGVPage = lazy(() => import('./pages/legal/LegalPages').then(m => ({ default: m.CGVPage })));
const PrivacyPage = lazy(() => import('./pages/legal/LegalPages').then(m => ({ default: m.PrivacyPage })));
const LegalInfoPage = lazy(() => import('./pages/legal/LegalPages').then(m => ({ default: m.LegalInfoPage })));
const ShippingInfoPage = lazy(() => import('./pages/legal/LegalPages').then(m => ({ default: m.ShippingInfoPage })));
const ReturnsInfoPage = lazy(() => import('./pages/legal/LegalPages').then(m => ({ default: m.ReturnsInfoPage })));
const CookiesPage = lazy(() => import('./pages/legal/LegalPages').then(m => ({ default: m.CookiesPage })));

const LoginPage = lazy(() => import('./pages/auth/AuthPages').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/auth/AuthPages').then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('./pages/auth/AuthPages').then(m => ({ default: m.ForgotPasswordPage })));

const WishlistPage = lazy(() => import('./pages/WishlistPage').then(m => ({ default: m.WishlistPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));

const Dashboard = lazy(() => import('./pages/account/AccountPages').then(m => ({ default: m.Dashboard })));
const Orders = lazy(() => import('./pages/account/AccountPages').then(m => ({ default: m.Orders })));
const Settings = lazy(() => import('./pages/account/AccountPages').then(m => ({ default: m.Settings })));
const Favorites = lazy(() => import('./pages/account/AccountPages').then(m => ({ default: m.Favorites })));

const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center py-40 min-h-[50vh]">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Chargement en cours...</p>
  </div>
);

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
      <Suspense fallback={<LoadingFallback />}>
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

          {/* Catch-all 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
