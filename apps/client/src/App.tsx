import React, { Suspense, lazy } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useParams,
  Outlet,
} from "react-router-dom";
import { StoreLayout } from "./components/layout/StoreLayout";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { CheckoutLayout } from "./components/layout/CheckoutLayout";
import { TrackingManager } from "./components/layout/TrackingManager";
import { CookieBanner } from "./components/layout/CookieBanner";
import { subscribeToDocument } from "@imexmercado/firebase";
import { adjustColor } from "@imexmercado/ui/src/utils";
import { useTranslation } from "react-i18next";

const HomePage = lazy(() =>
  import("./pages/HomePage").then((m) => ({ default: m.HomePage })),
);
const ShopPage = lazy(() =>
  import("./pages/ShopPage").then((m) => ({ default: m.ShopPage })),
);
const ContactPage = lazy(() =>
  import("./pages/ContactPage").then((m) => ({ default: m.ContactPage })),
);
const AboutPage = lazy(() =>
  import("./pages/AboutPage").then((m) => ({ default: m.AboutPage })),
);
const FAQPage = lazy(() =>
  import("./pages/FAQPage").then((m) => ({ default: m.FAQPage })),
);
const TrackingPage = lazy(() =>
  import("./pages/TrackingPage").then((m) => ({ default: m.TrackingPage })),
);

const CGVPage = lazy(() =>
  import("./pages/legal/LegalPages").then((m) => ({ default: m.CGVPage })),
);
const PrivacyPage = lazy(() =>
  import("./pages/legal/LegalPages").then((m) => ({ default: m.PrivacyPage })),
);
const LegalInfoPage = lazy(() =>
  import("./pages/legal/LegalPages").then((m) => ({
    default: m.LegalInfoPage,
  })),
);
const ShippingInfoPage = lazy(() =>
  import("./pages/legal/LegalPages").then((m) => ({
    default: m.ShippingInfoPage,
  })),
);
const ReturnsInfoPage = lazy(() =>
  import("./pages/legal/LegalPages").then((m) => ({
    default: m.ReturnsInfoPage,
  })),
);
const CookiesPage = lazy(() =>
  import("./pages/legal/LegalPages").then((m) => ({ default: m.CookiesPage })),
);

const LoginPage = lazy(() =>
  import("./pages/auth/AuthPages").then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = lazy(() =>
  import("./pages/auth/AuthPages").then((m) => ({ default: m.RegisterPage })),
);
const ForgotPasswordPage = lazy(() =>
  import("./pages/auth/AuthPages").then((m) => ({
    default: m.ForgotPasswordPage,
  })),
);

const WishlistPage = lazy(() =>
  import("./pages/WishlistPage").then((m) => ({ default: m.WishlistPage })),
);
const CheckoutPage = lazy(() =>
  import("./pages/CheckoutPage").then((m) => ({ default: m.CheckoutPage })),
);

const Dashboard = lazy(() =>
  import("./pages/account/AccountPages").then((m) => ({
    default: m.Dashboard,
  })),
);
const Orders = lazy(() =>
  import("./pages/account/AccountPages").then((m) => ({ default: m.Orders })),
);
const Settings = lazy(() =>
  import("./pages/account/AccountPages").then((m) => ({ default: m.Settings })),
);
const Favorites = lazy(() =>
  import("./pages/account/AccountPages").then((m) => ({
    default: m.Favorites,
  })),
);
const Support = lazy(() =>
  import("./pages/account/AccountPages").then((m) => ({ default: m.Support })),
);

const NotFoundPage = lazy(() =>
  import("./pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })),
);

const LoadingFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent pointer-events-none">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

function useDynamicTheme() {
  React.useEffect(() => {
    const unsubscribe = subscribeToDocument(
      "settings",
      "homepage",
      (data: any) => {
        if (data?.globalTheme?.client) {
          const {
            primaryColor,
            secondaryColor,
            accentColor,
            sidebarColor,
            sidebarTextColor,
            sidebarActiveColor,
            cardBgColor,
            cardTextColor,
          } = data.globalTheme.client;
          const root = document.documentElement;

          // Primary variants
          root.style.setProperty("--color-primary", primaryColor);
          root.style.setProperty(
            "--color-primary-dark",
            adjustColor(primaryColor, -20),
          );
          root.style.setProperty(
            "--color-primary-light",
            adjustColor(primaryColor, 30),
          );

          // Secondary variants
          root.style.setProperty("--color-secondary", secondaryColor);
          root.style.setProperty(
            "--color-secondary-dark",
            adjustColor(secondaryColor, -20),
          );
          root.style.setProperty(
            "--color-secondary-light",
            adjustColor(secondaryColor, 30),
          );

          // Accent variants
          root.style.setProperty("--color-accent", accentColor);
          root.style.setProperty(
            "--color-accent-dark",
            adjustColor(accentColor, -20),
          );

          // Dashboard specific
          root.style.setProperty(
            "--client-sidebar-bg",
            sidebarColor || "#0F1115",
          );
          root.style.setProperty(
            "--client-sidebar-text",
            sidebarTextColor || "#9CA3AF",
          );
          root.style.setProperty(
            "--client-sidebar-active-text",
            sidebarActiveColor || "#FFFFFF",
          );
          root.style.setProperty("--client-card-bg", cardBgColor || "#FFFFFF");
          root.style.setProperty(
            "--client-card-text",
            cardTextColor || "#111827",
          );
        }
      },
    );
    return () => unsubscribe();
  }, []);
}

const ProductRedirect = () => {
  const { lang } = useParams();
  const location = useLocation();
  const id = location.pathname.split("/").pop();
  return <Navigate to={`/${lang || "pt"}/?product=${id}`} replace />;
};

const RootRedirect = () => {
  let savedLang = "pt";
  try {
    const stored = localStorage.getItem("imex_lang");
    if (stored === "fr" || stored === "pt") savedLang = stored;
  } catch (_) {}
  return <Navigate to={`/${savedLang}`} replace />;
};

const HomeRedirect = () => {
  const { lang } = useParams();
  return <Navigate to={`/${lang || "pt"}/${lang === "fr" ? "accueil" : "inicio"}`} replace />;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    // Force scroll to absolute top on every route change
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
};

const LanguageWrapper = () => {
  const { lang } = useParams();
  const { i18n } = useTranslation();
  const location = useLocation();
  // Start as true (optimistic) — only flip to false if Firestore says so explicitly
  const [frenchEnabled, setFrenchEnabled] = React.useState<boolean>(true);
  const [frenchChecked, setFrenchChecked] = React.useState<boolean>(false);

  // Set language IMMEDIATELY and synchronously from URL — no waiting for Firestore
  React.useLayoutEffect(() => {
    if (lang === "pt" || lang === "fr") {
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
      }
    }
  }, [lang, i18n]);

  // Check Firestore in background — only used to disable FR if needed
  React.useEffect(() => {
    const unsubscribe = subscribeToDocument(
      "settings",
      "homepage",
      (data: any) => {
        setFrenchEnabled(data?.isFrenchEnabled !== false);
        setFrenchChecked(true);
      },
    );
    return () => unsubscribe();
  }, []);

  // Invalid lang prefix → redirect to /pt
  if (lang !== "pt" && lang !== "fr") {
    return (
      <Navigate to={`/pt${location.pathname}${location.search}`} replace />
    );
  }

  // French explicitly disabled and Firestore confirmed → redirect to PT
  if (lang === "fr" && frenchChecked && !frenchEnabled) {
    const newPath = location.pathname.replace(/^\/fr(\/|$)/, "/pt$1");
    return <Navigate to={newPath + location.search} replace />;
  }

  return <Outlet />;
};

function App() {
  useDynamicTheme();
  const [simulatedEmail, setSimulatedEmail] = React.useState<{
    type: string;
    recipientEmail: string;
    subject: string;
  } | null>(null);

  React.useEffect(() => {
    if (
      window.location.protocol === "http:" &&
      !window.location.hostname.includes("localhost") &&
      !window.location.hostname.includes("127.0.0.1")
    ) {
      window.location.href = window.location.href.replace("http:", "https:");
    }
  }, []);

  React.useEffect(() => {
    const handleEmailEvent = (e: any) => {
      setSimulatedEmail(e.detail);
      const timer = setTimeout(() => {
        setSimulatedEmail(null);
      }, 7000);
      return () => clearTimeout(timer);
    };
    window.addEventListener("simulated-email-sent", handleEmailEvent);
    return () =>
      window.removeEventListener("simulated-email-sent", handleEmailEvent);
  }, []);

  return (
    <>
      <ScrollToTop />
      <TrackingManager />
      <CookieBanner />

      {/* Visual Email Simulation Toast (dev only) */}
      {import.meta.env.DEV && simulatedEmail && (
        <div className="fixed bottom-6 right-6 z-[9999] max-w-sm w-full bg-slate-900 text-white p-5 rounded-2xl shadow-2xl border border-slate-800 animate-in slide-in-from-bottom duration-300 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="animate-ping w-2.5 h-2.5 bg-amber-400 rounded-full inline-block"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
              Simulation Email
            </span>
          </div>
          <h4 className="text-xs font-black truncate">
            {simulatedEmail.subject}
          </h4>
          <p className="text-[10px] text-gray-400">
            Envoyé à :{" "}
            <span className="font-bold text-gray-200">
              {simulatedEmail.recipientEmail}
            </span>
          </p>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-[9px] bg-slate-800 text-gray-300 font-bold px-2 py-0.5 rounded uppercase">
              {simulatedEmail.type.replace("_", " ")}
            </span>
            <button
              onClick={() => setSimulatedEmail(null)}
              className="text-[10px] font-extrabold uppercase text-gray-400 hover:text-white"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Redirect / to saved language or /pt */}
          <Route path="/" element={<RootRedirect />} />

          {/* Wrapper for routing prefix language */}
          <Route path="/:lang" element={<LanguageWrapper />}>
            {/* ─── Special Isolated Checkout ─── */}
            <Route element={<CheckoutLayout />}>
              <Route path="commande" element={<CheckoutPage />} />
              <Route path="finalizar-compra" element={<CheckoutPage />} />
            </Route>

            {/* ─── Public & Shop Universe ─── */}
            <Route element={<StoreLayout />}>
              <Route index element={<HomeRedirect />} />
              <Route path="accueil" element={<HomePage isSidebarOpen={true} />} />
              <Route path="inicio" element={<HomePage isSidebarOpen={true} />} />
              <Route path="boutique" element={<ShopPage />} />
              <Route path="loja" element={<ShopPage />} />
              <Route path="category/:categorySlug" element={<ShopPage />} />
              <Route path="categoria/:categorySlug" element={<ShopPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="contacto" element={<ContactPage />} />
              <Route path="a-propos" element={<AboutPage />} />
              <Route path="sobre-nos" element={<AboutPage />} />

              {/* Product Drawer is now global via modal */}
              <Route path="p/:productSlug" element={<ProductRedirect />} />
              <Route path="produit/*" element={<ProductRedirect />} />

              {/* Auth (Still using Store Layout for branding) */}
              <Route path="connexion" element={<LoginPage />} />
              <Route path="entrar" element={<LoginPage />} />
              <Route path="inscription" element={<RegisterPage />} />
              <Route path="registar" element={<RegisterPage />} />
              <Route
                path="mot-de-passe-oublie"
                element={<ForgotPasswordPage />}
              />
              <Route path="recuperar-senha" element={<ForgotPasswordPage />} />

              {/* Legal Pages */}
              <Route path="cgv" element={<CGVPage />} />
              <Route path="confidentialite" element={<PrivacyPage />} />
              <Route path="privacidade" element={<PrivacyPage />} />
              <Route path="mentions-legales" element={<LegalInfoPage />} />
              <Route path="informacao-legal" element={<LegalInfoPage />} />
              <Route path="cookies" element={<CookiesPage />} />
              <Route path="livraison" element={<ShippingInfoPage />} />
              <Route path="envios" element={<ShippingInfoPage />} />
              <Route path="retours" element={<ReturnsInfoPage />} />
              <Route path="devolucoes" element={<ReturnsInfoPage />} />
              <Route path="faq" element={<FAQPage />} />
              <Route path="suivi-commande" element={<TrackingPage />} />
              <Route path="seguir-encomenda" element={<TrackingPage />} />
              <Route path="favoris" element={<WishlistPage />} />
              <Route path="favoritos" element={<WishlistPage />} />
            </Route>

            {/* ─── Private Dashboard Universe ─── */}
            <Route path="compte" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="commandes" element={<Orders />} />
              <Route path="parametres" element={<Settings />} />
              <Route path="favoris" element={<Favorites />} />
              <Route path="aide" element={<Support />} />
              <Route path="suivi" element={<TrackingPage />} />
            </Route>
            <Route path="conta" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="encomendas" element={<Orders />} />
              <Route path="configuracoes" element={<Settings />} />
              <Route path="favoritos" element={<Favorites />} />
              <Route path="ajuda" element={<Support />} />
              <Route path="seguir" element={<TrackingPage />} />
            </Route>
          </Route>

          {/* Catch-all 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
