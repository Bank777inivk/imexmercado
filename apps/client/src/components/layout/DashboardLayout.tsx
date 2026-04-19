import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  User, Package, MapPin, Heart, 
  SignOut, Layout, CaretRight,
  House, Bell, MagnifyingGlass,
  List, X
} from '@phosphor-icons/react';
import { useAuth, logout, getDocument } from '@imexmercado/firebase';

const accountMenu = [
  { label: 'Tableau de bord', path: '/compte', icon: Layout },
  { label: 'Mes Commandes', path: '/compte/commandes', icon: Package },
  { label: 'Mes Adresses', path: '/compte/adresses', icon: MapPin },
  { label: 'Mes Favoris', path: '/compte/favoris', icon: Heart },
];

export function DashboardLayout() {
  const { user, profile, loading: authLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/connexion');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    // Fermer la sidebar sur mobile en cas de changement de route
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
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
    ? `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase()
    : user.displayName 
      ? user.displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase()
      : 'U';

  const fullName = profile 
    ? `${profile.firstName} ${profile.lastName}`
    : user.displayName || 'Utilisateur';

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Dédiée (Desktop & Mobile Drawer) */}
      <aside className={`fixed inset-y-0 left-0 w-[280px] sm:w-[300px] h-screen bg-white border-r border-gray-100 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} lg:relative lg:translate-x-0 lg:shadow-none`}>
        <div className="p-6 md:p-8 border-b border-gray-50 flex items-center justify-between">
          <div>
            <Link to="/" className="font-black text-2xl tracking-tight hover:text-primary transition-colors">
              <span className="text-primary">i</span>mexmercado
            </Link>
            <p className="text-sm text-gray-500 font-medium tracking-wide mt-1">Espace Membre</p>
          </div>
          <button className="lg:hidden text-gray-400 p-2 hover:text-gray-900" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} weight="bold" />
          </button>
        </div>



        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          {accountMenu.map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${
                location.pathname === item.path 
                  ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} weight={location.pathname === item.path ? 'fill' : 'bold'} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              {location.pathname === item.path && <CaretRight size={14} weight="bold" />}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-50">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-medium text-sm group"
          >
            <SignOut size={22} weight="bold" className="group-hover:-translate-x-1 transition-transform" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 w-full relative h-[100dvh] overflow-hidden">
        
        {/* Dashboard TopBar (Shared Mobile & Desktop) */}
        <header className="h-[70px] md:h-[80px] w-full bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 z-30 shrink-0 shadow-sm lg:shadow-none">
          
          <div className="flex items-center gap-3 md:gap-4">
            <button className="lg:hidden text-gray-900 p-2 -ml-2" onClick={() => setIsSidebarOpen(true)}>
              <List size={28} weight="bold" />
            </button>
            
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-gray-500">
              <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1.5">
                <House size={14} weight="bold" /> Boutique
              </Link>
              <CaretRight size={10} weight="bold" />
              <span className="text-gray-900">Tableau de bord</span>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden lg:flex items-center bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 gap-3 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <MagnifyingGlass size={18} className="text-gray-400" />
              <input type="text" placeholder="Rechercher..." className="bg-transparent border-none outline-none text-xs font-medium w-40" />
            </div>
            
            <button className="relative p-2 text-gray-400 hover:text-primary transition-colors">
              <Bell size={24} weight="bold" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="hidden sm:block h-8 w-px bg-gray-100 mx-1"></div>
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 leading-none">{fullName}</p>
                <p className="text-xs font-medium text-gray-500 mt-1">ID #{user.uid.slice(0, 5)}</p>
              </div>
              <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-gray-900/5">
                {initials}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="p-4 md:p-8 lg:p-12 pb-12 flex-grow overflow-y-auto">
          <Outlet context={{ user, profile }} />
          
          <footer className="mt-12 text-center text-sm font-medium text-gray-400 border-t border-gray-100 pt-8 pb-4">
            © 2026 ImexMercado • Espace Client Sécurisé
          </footer>
        </main>

      </div>
    </div>
  );
}
