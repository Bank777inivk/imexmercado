import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  User,
  Package,
  MapPin,
  Heart,
  SignOut,
  Layout,
  CaretRight,
  House,
  Bell,
  MagnifyingGlass,
  List,
  X,
  Gear,
  Truck,
} from "@phosphor-icons/react";
import {
  useAuth,
  logout,
  subscribeToCollectionWithFilter,
} from "@imexmercado/firebase";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../hooks/useLocale";

export function DashboardLayout() {
  const { user, profile, loading: authLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const { t } = useTranslation("account");
  const { localLink } = useLocale();

  const accountMenu = [
    { label: t("sidebar.dashboard"), path: localLink("/compte"), icon: Layout },
    {
      label: t("sidebar.orders"),
      path: localLink("/compte/commandes"),
      icon: Package,
    },
    {
      label: t("sidebar.tracking"),
      path: localLink("/compte/suivi"),
      icon: Truck,
    },
    {
      label: t("sidebar.favorites"),
      path: localLink("/compte/favoris"),
      icon: Heart,
    },
    {
      label: t("sidebar.settings"),
      path: localLink("/compte/parametres"),
      icon: Gear,
    },
  ];

  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToCollectionWithFilter(
        "orders",
        "userId",
        user.uid,
        (data) => {
          const sorted = [...data].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
          setOrders(sorted);
        },
      );
      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/connexion");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    // Fermer la sidebar sur mobile en cas de changement de route
    setIsSidebarOpen(false);
    // Remonter en haut de page à chaque changement d'onglet dashboard
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  const initials = profile
    ? `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase()
    : user.displayName
      ? user.displayName
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
      : "U";

  const fullName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : user.displayName || "Utilisateur";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0] flex overflow-hidden font-sans">
      {/* Local high-specificity style injection to protect sidebar links on hover */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .sidebar-link-item:not(.active-link):hover {
          background-color: rgba(241, 90, 36, 0.28) !important;
          color: #FFFFFF !important;
        }
        .sidebar-link-item:not(.active-link):hover * {
          color: #FFFFFF !important;
        }
      `,
        }}
      />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-md transition-all duration-500"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Premium Dark Design */}
      <aside
        className={`fixed inset-y-0 left-0 w-[280px] flex flex-col z-[70] border-r border-white/5 transform transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isSidebarOpen ? "translate-x-0 shadow-[20px_0_60px_rgba(0,0,0,0.3)]" : "-translate-x-full"} lg:relative lg:translate-x-0`}
        style={{ backgroundColor: "var(--client-sidebar-bg, #0F1115)" }}
      >
        {/* Logo Section */}
        <div className="p-8 pb-12 flex items-center justify-between">
          <Link to={localLink("/")} className="group">
            <h1
              className="text-2xl font-bold tracking-tighter leading-none"
              style={{ color: "var(--client-sidebar-active-text, #FFFFFF)" }}
            >
              IMEX
              <span className="text-primary transition-all group-hover:opacity-80">
                MERCADO
              </span>
            </h1>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.2em] mt-2 opacity-60 group-hover:opacity-100 transition-opacity"
              style={{ color: "var(--client-sidebar-text, #9CA3AF)" }}
            >
              {t("sidebar.espace_prive")}
            </p>
          </Link>
          <button
            className="lg:hidden text-white/50 hover:text-white transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} weight="bold" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-grow px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {accountMenu.map((item) => {
            const active = location.pathname === item.path;
            const isHovered = hoveredPath === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onMouseEnter={() => setHoveredPath(item.path)}
                onMouseLeave={() => setHoveredPath(null)}
                className={`sidebar-link-item flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 relative group overflow-hidden ${
                  active
                    ? "active-link bg-gradient-to-r from-primary to-orange-500 text-white shadow-[0_8px_20px_-4px_rgba(255,92,0,0.35)] scale-[1.02]"
                    : "text-gray-400 hover:scale-[1.01]"
                }`}
              >
                {/* Active Indicator Line */}
                {active && (
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-full shadow-[0_0_10px_#fff]"></div>
                )}

                <item.icon
                  size={22}
                  weight={active || isHovered ? "fill" : "bold"}
                  className={`transition-transform duration-300 group-hover:scale-110`}
                  style={{
                    color:
                      active || isHovered
                        ? "var(--client-sidebar-active-text, #FFFFFF)"
                        : "var(--client-sidebar-text, #9CA3AF)",
                  }}
                />
                <span
                  className="text-[13px] font-bold uppercase tracking-widest"
                  style={{
                    color:
                      active || isHovered
                        ? "var(--client-sidebar-active-text, #FFFFFF)"
                        : "var(--client-sidebar-text, #9CA3AF)",
                  }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar */}
        <div className="p-6 mt-auto">
          <div className="bg-white/5 rounded-3xl p-5 mb-4 border border-white/5">
            <p
              className="text-[10px] font-black uppercase tracking-widest mb-3"
              style={{ color: "var(--client-sidebar-text, #9CA3AF)" }}
            >
              {t("sidebar.need_help")}
            </p>
            <Link
              to={localLink("/compte/aide")}
              className="text-xs font-bold hover:text-primary transition-colors flex items-center gap-2"
              style={{ color: "var(--client-sidebar-active-text, #FFFFFF)" }}
            >
              {t("sidebar.client_support")}{" "}
              <CaretRight size={12} weight="bold" />
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all font-black text-[11px] uppercase tracking-widest group"
          >
            <SignOut
              size={22}
              weight="bold"
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>{t("sidebar.logout")}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 w-full relative h-[100dvh] overflow-hidden">
        {/* Dashboard TopBar (Shared Mobile & Desktop) */}
        <header className="h-[70px] md:h-[80px] w-full bg-white/75 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-8 z-30 shrink-0 shadow-sm lg:shadow-none">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              className="lg:hidden text-gray-900 p-2 -ml-2"
              onClick={() => setIsSidebarOpen(true)}
            >
              <List size={28} weight="bold" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-gray-500">
              <Link
                to={localLink("/")}
                className="hover:text-primary transition-colors flex items-center gap-1.5"
              >
                <House size={14} weight="bold" /> {t("sidebar.boutique")}
              </Link>
              <CaretRight size={10} weight="bold" />
              <span className="text-gray-900">{t("sidebar.dashboard")}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden lg:flex items-center bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 gap-3 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <MagnifyingGlass size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder={t("dashboard.search_placeholder")}
                className="bg-transparent border-none outline-none text-xs font-medium w-40"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 leading-none">
                  {fullName}
                </p>
              </div>
              <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-gray-900/5">
                {initials}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="p-4 md:p-8 lg:p-12 pb-12 flex-grow overflow-y-auto">
          <Outlet context={{ user, profile, orders }} />

          <footer className="mt-12 text-center text-sm font-medium text-gray-400 border-t border-gray-100 pt-8 pb-4">
            {t("dashboard.footer_secured")}
          </footer>
        </main>
      </div>
    </div>
  );
}
