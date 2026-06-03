import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { 
  Package, MapPin, Heart, PencilSimple, Check, FloppyDisk, X, User as UserIcon, Phone, Globe, NavigationArrow, Trash, Plus
} from '@phosphor-icons/react';
import { setDocument, deleteDocument } from '@imexmercado/firebase';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, icon, color, subtitle }: any) => (
  <div 
    className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 h-full flex flex-col"
    style={{ backgroundColor: 'var(--client-card-bg, #FFFFFF)' }}
  >
    <div className={`w-12 h-12 ${color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
      {icon}
    </div>
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1" style={{ color: 'var(--client-card-text, #111827)', opacity: 0.5 }}>{label}</p>
    <h3 className="text-3xl font-bold tracking-tighter mb-2" style={{ color: 'var(--client-card-text, #111827)' }}>{value}</h3>
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-auto" style={{ color: 'var(--client-card-text, #111827)', opacity: 0.5 }}>{subtitle}</p>
    <div className={`absolute -right-8 -bottom-8 w-32 h-32 ${color.replace('bg-', 'bg-')}/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
  </div>
);

export const Dashboard = () => {
  const { user, profile, orders } = useOutletContext<any>();
  
  const initials = profile 
    ? `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase()
    : user?.displayName 
      ? user.displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase()
      : 'U';

  const fullName = profile 
    ? `${profile.firstName} ${profile.lastName}`
    : user?.displayName || 'Utilisateur';

  return (
    <div className="space-y-10 md:space-y-12 animate-in fade-in duration-700">
      
      {/* Premium Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tighter leading-none mb-4 uppercase">
            Bienvenue, {profile?.firstName || user?.displayName?.split(' ')[0] || 'Client'}
          </h1>
          <div className="flex items-center gap-3">
             <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full border border-primary/20">Client Premium</span>
             <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Membre depuis {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).getFullYear() : '2026'}</span>
          </div>
        </div>
        
      </div>

      {/* Stats Grid - Modern Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          label="Commandes" 
          value={orders.length} 
          icon={<Package size={24} weight="fill" />} 
          color="bg-gray-900"
          subtitle="Suivi en temps réel"
        />
        <StatCard 
          label="Favoris" 
          value={profile?.wishlist?.length || 0} 
          icon={<Heart size={24} weight="fill" />} 
          color="bg-primary"
          subtitle="Votre liste de souhaits"
        />
        <StatCard 
          label="Total Dépensé" 
          value={`${orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0).toFixed(2)}€`} 
          icon={<Globe size={24} weight="fill" />} 
          color="bg-gray-900"
          subtitle="Investissement total"
        />
      </div>

      {/* Activity & Quick View */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Recent Activity (2/3) */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Activité Récente</h2>
            <Link to="/compte/commandes" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">Voir tout →</Link>
          </div>
          
          {orders.length > 0 ? (
            <div className="space-y-3">
              {orders.slice(0, 4).map((order: any) => (
                <Link 
                  key={order.id} 
                  to={`/compte/commandes`} 
                  className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-3xl hover:border-primary hover:shadow-xl hover:shadow-gray-200/50 transition-all group relative overflow-hidden"
                >
                  <div className="flex items-center gap-5 relative z-10">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                      <Package size={24} weight="bold" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900 mb-0.5">Commande #{order.id.slice(-6).toUpperCase()}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</span>
                        <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-primary">{order.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right relative z-10">
                    <p className="text-lg font-black text-gray-900 leading-none">{order.total?.toFixed(2)}€</p>
                  </div>
                  {/* Decorative background number */}
                  <span className="absolute -right-4 -bottom-8 text-8xl font-black text-gray-50/50 select-none group-hover:text-primary/5 transition-colors">#{order.id.slice(-2)}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-[2.5rem] text-center border border-dashed border-gray-200">
              <Package size={48} weight="thin" className="text-gray-200 mx-auto mb-4" />
              <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Aucune commande récente.</p>
            </div>
          )}
        </div>

        {/* Info / Quick Actions (1/3) */}
        <div className="space-y-6">
           <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Profil Rapide</h2>
           <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-gray-900/20">
              <div className="relative z-10">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Compte Vérifié</p>
                <h3 className="text-2xl font-black tracking-tight mb-6 line-clamp-1">{fullName}</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-white/60">
                    <UserIcon size={18} weight="bold" />
                    <span className="text-xs font-bold truncate">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/60">
                    <Phone size={18} weight="bold" />
                    <span className="text-xs font-bold">{profile?.phone || 'Non renseigné'}</span>
                  </div>
                </div>
                <Link to="/compte/parametres" className="mt-8 block w-full bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl py-3 text-center text-[10px] font-black uppercase tracking-widest transition-all">
                  Modifier le profil
                </Link>
              </div>
              <div className="absolute -right-12 -top-12 w-40 h-40 bg-gray-500/10 rounded-full blur-3xl"></div>
              <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-gray-500/10 rounded-full blur-3xl"></div>
           </div>
        </div>
      </div>

    </div>
  );
};

const ProfileEdit = ({ profile, user }: any) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [formData, setFormData] = React.useState({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    phone: profile?.phone || ''
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await setDocument('users', user.uid, {
        ...profile,
        ...formData,
        email: user.email,
        updatedAt: new Date().toISOString()
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIsEditing(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-8 border-t border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Mes Informations</h2>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="text-gray-900 text-sm font-black uppercase tracking-widest flex items-center gap-2 hover:underline"
        >
          {isEditing ? <><X size={14} weight="bold" /> Annuler</> : <><PencilSimple size={14} weight="bold" /> Modifier</>}
        </button>
      </div>

      {isEditing ? (
        <div className="bg-white border-2 border-gray-100 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Prénom</label>
              <input 
                type="text" 
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Nom</label>
              <input 
                type="text" 
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm text-gray-900"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Téléphone</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm text-gray-900"
              />
            </div>
          </div>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-gray-900 text-white font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-black transition-all disabled:opacity-50"
          >
            {loading ? 'Enregistrement...' : success ? <><Check size={18} weight="bold" /> Enregistré !</> : <><FloppyDisk size={18} weight="bold" /> Sauvegarder</>}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <InfoItem label="Nom complet" value={profile?.firstName ? `${profile.firstName} ${profile.lastName}` : user?.displayName || 'Non renseigné'} icon={<UserIcon size={20} />} />
           <InfoItem label="E-mail" value={user?.email} icon={<Check size={20} className="text-success" />} />
           <InfoItem label="Téléphone" value={profile?.phone || 'Non renseigné'} icon={<Phone size={20} />} />
        </div>
      )}
    </div>
  );
};

const InfoItem = ({ label, value, icon }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4 hover:border-primary/20 transition-colors group">
    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-0.5">{label}</p>
      <p className="text-sm font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const GdprTools = ({ profile, user }: any) => {
  const [loading, setLoading] = React.useState(false);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      uid: user?.uid,
      email: user?.email,
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      phone: profile?.phone || '',
      addresses: profile?.addresses || [],
      metadata: {
        creationTime: user?.metadata?.creationTime,
        lastSignInTime: user?.metadata?.lastSignInTime
      }
    }, null, 2));
    
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `imex_donnees_${user?.uid || 'client'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer définitivement votre compte et toutes vos données personnelles ? Cette action est irréversible et conforme au RGPD (Droit à l'oubli).")) return;
    if (!window.confirm("Confirmez une seconde fois pour valider la suppression définitive de votre compte.")) return;

    setLoading(true);
    try {
      // 1. Supprimer le document profil dans Firestore
      await deleteDocument('users', user.uid);
      
      // 2. Supprimer le compte dans Firebase Authentication
      if (user && typeof user.delete === 'function') {
        await user.delete();
      }
      
      alert("Votre compte et toutes vos données ont été définitivement supprimés.");
      window.location.href = '/';
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/requires-recent-login') {
        alert("Pour des raisons de sécurité, cette action sensible nécessite de vous reconnecter avant de pouvoir supprimer votre compte.");
      } else {
        alert("Une erreur est survenue lors de la suppression de votre compte.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-8 border-t border-gray-100 text-left">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Sécurité & Données (RGPD)</h2>
      <p className="text-xs text-gray-400 font-medium mb-6">
        Conformément au Règlement Général sur la Protection des Données (RGPD), vous pouvez exporter vos données personnelles ou demander la suppression définitive de votre compte (droit à l'oubli).
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleExport}
          className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-[10px] font-black uppercase tracking-widest py-4 px-6 rounded-2xl transition-all text-center flex items-center justify-center gap-2"
        >
          Exporter mes données (JSON)
        </button>
        <button
          onClick={handleDeleteAccount}
          disabled={loading}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-widest py-4 px-6 rounded-2xl transition-all text-center flex items-center justify-center gap-2 shadow-lg shadow-red-500/10 disabled:opacity-50"
        >
          {loading ? 'Suppression en cours...' : "Supprimer mon compte (Droit à l'oubli)"}
        </button>
      </div>
    </div>
  );
};

export const Settings = () => {
  const { user, profile } = useOutletContext<any>();
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tighter">Paramètres du Compte</h1>
      </div>
      
      <ProfileEdit profile={profile} user={user} />
      
      <div className="pt-8 border-t border-gray-100">
        <Addresses />
      </div>

      <div className="pt-8 border-t border-gray-100">
        <GdprTools profile={profile} user={user} />
      </div>
    </div>
  );
};

export const Orders = () => {
  const { orders } = useOutletContext<any>();

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tighter">Mes Commandes</h1>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
          {orders.length} commandes
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order: any) => (
            <div key={order.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all group overflow-hidden relative">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all">
                    <Package size={28} weight="bold" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-black text-gray-900 uppercase tracking-tight text-lg">#{order.id.slice(-6).toUpperCase()}</h3>
                      <span className="px-3 py-1 bg-gray-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Le {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-10 border-t md:border-t-0 pt-4 md:pt-0 border-gray-50">
                  <div className="text-left md:text-right">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Articles</p>
                    <p className="text-sm font-bold text-gray-900">{order.items?.length || 0} produits</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total</p>
                    <p className="text-xl font-black text-gray-900 leading-none">{order.total?.toFixed(2)}€</p>
                  </div>
                </div>
              </div>
              
              {order.items && order.items.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-50 flex gap-3 overflow-x-auto pb-2 scrollbar-hide relative z-10">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="w-12 h-12 rounded-xl border border-gray-100 flex-shrink-0 overflow-hidden bg-gray-50 group-hover:border-primary/20 transition-colors">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
              {/* Decorative background ID */}
              <span className="absolute -right-4 -bottom-6 text-7xl font-black text-gray-50/30 select-none group-hover:text-gray-900/5 transition-colors pointer-events-none">#{order.id.slice(-2)}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-100">
          <Package size={64} weight="thin" className="text-gray-200 mx-auto mb-6" />
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Aucune commande enregistrée.</p>
          <Link to="/boutique" className="inline-block mt-8 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-8 py-4 rounded-xl shadow-lg hover:shadow-primary/20 transition-all active:scale-95">Commencer mes achats</Link>
        </div>
      )}
    </div>
  );
};

export const Addresses = () => {
  const { user, profile } = useOutletContext<any>();
  const [isEditing, setIsEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    address: '',
    city: '',
    zipCode: '',
    country: 'France'
  });

  const openEdition = (addr: any) => {
    setFormData({
      address: addr.address || '',
      city: addr.city || '',
      zipCode: addr.zipCode || '',
      country: addr.country || 'France'
    });
    setEditingId(addr.id);
    setIsEditing(true);
  };

  const openCreation = () => {
    setFormData({
      address: '',
      city: '',
      zipCode: '',
      country: 'France'
    });
    setEditingId(null);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId === 'root-default') {
        await setDocument('users', user.uid, {
          ...profile,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country,
          updatedAt: new Date().toISOString()
        });
      } else if (editingId) {
        const updatedAddresses = profile.addresses.map((a: any) => 
          a.id === editingId ? { ...a, ...formData } : a
        );
        await setDocument('users', user.uid, {
          ...profile,
          addresses: updatedAddresses,
          updatedAt: new Date().toISOString()
        });
      } else {
        const newAddress = {
          id: `addr-${Date.now()}`,
          firstName: profile.firstName,
          lastName: profile.lastName,
          ...formData,
          isDefault: (profile?.addresses || []).length === 0 && !profile.address
        };
        const currentAddresses = profile.addresses || [];
        await setDocument('users', user.uid, {
          ...profile,
          addresses: [...currentAddresses, newAddress],
          updatedAt: new Date().toISOString()
        });
      }
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIsEditing(false);
        setEditingId(null);
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (addressId: string) => {
    if (window.confirm('Supprimer cette adresse ?')) {
      setLoading(true);
      try {
        const updatedAddresses = (profile.addresses || []).filter((a: any) => a.id !== addressId);
        await setDocument('users', user.uid, {
          ...profile,
          addresses: updatedAddresses,
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tighter">Mes Adresses</h1>
        <button 
          onClick={isEditing ? () => { setIsEditing(false); setEditingId(null); } : openCreation}
          className="bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-black transition-all flex items-center gap-2 shadow-xl shadow-gray-900/10"
        >
          {isEditing ? <><X size={14} weight="bold" /> Annuler</> : <><Plus size={14} weight="bold" /> Ajouter</>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(() => {
          let savedAddresses = profile?.addresses || [];
          if (profile?.address && !savedAddresses.some((a: any) => a.id === 'root-default')) {
            savedAddresses.unshift({
              id: 'root-default',
              firstName: profile.firstName,
              lastName: profile.lastName,
              address: profile.address,
              city: profile.city,
              zipCode: profile.zipCode,
              country: profile.country,
              isDefault: true
            });
          }

          if (savedAddresses.length === 0 && !isEditing) {
            return (
              <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-100 md:col-span-2">
                <MapPin size={64} weight="thin" className="text-gray-200 mx-auto mb-6" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Aucune adresse enregistrée.</p>
              </div>
            );
          }

          return savedAddresses.map((addr: any) => (
            <div key={addr.id} className={`bg-white p-8 rounded-[2.5rem] border-2 transition-all relative group hover:shadow-2xl hover:shadow-gray-200/50 ${addr.isDefault ? 'border-primary/10' : 'border-gray-50 hover:border-primary/10'}`}>
              {addr.isDefault && (
                <span className="absolute top-8 right-8 bg-primary text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg shadow-sm">Principale</span>
              )}
              
              <div className="space-y-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${addr.isDefault ? 'bg-primary text-white' : 'bg-gray-50 text-gray-400'}`}>
                  <MapPin size={24} weight="bold" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 uppercase tracking-tight text-xl mb-2">{addr.city}</h3>
                  <p className="text-sm font-bold text-gray-900">{addr.firstName} {addr.lastName}</p>
                  <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">{addr.address}<br/>{addr.zipCode} {addr.city}, {addr.country}</p>
                </div>
                
                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                   <button 
                    onClick={() => openEdition(addr)}
                    className="text-[9px] font-black uppercase tracking-widest text-gray-900 hover:underline flex items-center gap-1.5"
                  >
                    <PencilSimple size={14} weight="bold" /> Modifier
                  </button>
                  {!addr.isDefault && (
                    <button 
                      onClick={() => handleDelete(addr.id)}
                      className="text-[9px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 flex items-center gap-1.5"
                    >
                      <Trash size={14} weight="bold" /> Supprimer
                    </button>
                  )}
                </div>
              </div>
            </div>
          ));
        })()}
      </div>

      {isEditing && (
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSave}
          className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-gray-200/50 space-y-8 border border-gray-50"
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Adresse</label>
              <input 
                type="text" 
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 outline-none focus:border-primary transition-all font-bold text-sm text-gray-900"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Code Postal</label>
                <input 
                  type="text" 
                  value={formData.zipCode}
                  onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                  required
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 outline-none focus:border-primary transition-all font-bold text-sm text-gray-900"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Ville</label>
                <input 
                  type="text" 
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  required
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 outline-none focus:border-primary transition-all font-bold text-sm text-gray-900"
                />
              </div>
            </div>
          </div>
          <button 
            type="submit"
            className="w-full bg-gray-900 text-white font-black uppercase tracking-widest py-5 rounded-2xl shadow-xl hover:bg-black transition-all active:scale-[0.98]"
          >
            Sauvegarder l'adresse
          </button>
        </motion.form>
      )}
    </div>
  );
};

export const Favorites = () => {
  const { toggleWishlist, wishlist } = useWishlist();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tighter">Mes Favoris</h1>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
          {wishlist.length} articles
        </p>
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product: any) => (
            <div key={product.id} className="bg-white p-4 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all group relative">
              <div className="aspect-square relative overflow-hidden bg-gray-50 rounded-[2rem] mb-4">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700" 
                />
                <button 
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-4 right-4 bg-white shadow-lg p-2.5 rounded-xl text-primary hover:bg-primary hover:text-white transition-all group-hover:rotate-12"
                >
                  <Heart size={20} weight="fill" />
                </button>
              </div>
              <div>
                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">{product.category}</p>
                <h3 className="text-xs font-black text-gray-900 line-clamp-1 mb-4 uppercase tracking-tight">{product.name}</h3>
                <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                  <p className="text-sm font-black text-gray-900">{product.price?.toFixed(2)}€</p>
                  <Link 
                    to={`/?product=${product.id}`}
                    className="text-[9px] font-black uppercase tracking-widest text-gray-900 hover:underline"
                  >
                    Détails
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-100">
          <Heart size={64} weight="fill" className="text-gray-200 mx-auto mb-6 opacity-20" />
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-8">Votre liste est vide.</p>
          <Link to="/boutique" className="inline-block bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest px-10 py-4 rounded-xl shadow-xl hover:bg-black transition-all">Découvrir les nouveautés</Link>
        </div>
      )}
    </div>
  );
};
