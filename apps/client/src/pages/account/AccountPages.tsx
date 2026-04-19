import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { 
  Package, MapPin, Heart, PencilSimple, Check, FloppyDisk, X, User as UserIcon, Phone, Globe, NavigationArrow, Trash
} from '@phosphor-icons/react';
import { setDocument } from '@imexmercado/firebase';
import { motion } from 'framer-motion';

export const Dashboard = () => {
  const { user, profile } = useOutletContext<any>();
  
  const initials = profile 
    ? `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase()
    : user?.displayName 
      ? user.displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase()
      : 'U';

  return (
    <div className="space-y-8 md:space-y-10 animate-in fade-in duration-500">
      
      {/* Unified Profile & Stats Card */}
      <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-sm flex flex-col xl:flex-row items-start xl:items-center justify-between gap-10">
        
        {/* Profile Info */}
        <div className="flex flex-col md:flex-row items-start xl:items-center gap-6 text-left">
          <div className="hidden md:flex w-20 h-20 bg-gray-900 text-white rounded-3xl items-center justify-center font-bold text-3xl shadow-lg ring-8 ring-gray-900/5">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              Bienvenue, <span className="text-primary">{profile?.firstName || user?.displayName?.split(' ')[0] || 'Client'}</span> !
            </h1>
            <p className="text-xs text-primary font-bold tracking-widest uppercase mb-2">Client Premium</p>
            <p className="text-gray-500 font-medium text-sm">C'est un plaisir de vous revoir.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 divide-x divide-gray-100 w-full xl:w-auto mt-6 xl:mt-0 pt-6 xl:pt-0 border-t border-gray-50 xl:border-t-0 xl:border-l xl:pl-12 items-center">
          <div className="text-center px-2">
            <p className="text-2xl md:text-4xl font-bold text-gray-900 mb-1">00</p>
            <p className="text-[10px] md:text-sm font-medium text-gray-500">Commandes</p>
          </div>
          <div className="text-center px-2">
            <p className="text-2xl md:text-4xl font-bold text-primary mb-1">00</p>
            <p className="text-[10px] md:text-sm font-medium text-gray-500">Favoris</p>
          </div>
          <div className="text-center px-2">
            <p className="text-2xl md:text-4xl font-bold text-gray-900 mb-1">0.00€</p>
            <p className="text-[10px] md:text-sm font-medium text-gray-500 truncate">Économisés</p>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-gray-50">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 md:mb-6">Activité Récente</h2>
        <div className="bg-gray-50/50 p-8 md:p-12 rounded-3xl text-center border border-dashed border-gray-200">
          <Package size={48} weight="thin" className="text-gray-300 mx-auto mb-4" />
          <p className="text-sm font-medium text-gray-500">Aucune commande récente.</p>
        </div>
      </div>

      {/* Profil Quick Edit */}
      <ProfileEdit profile={profile} user={user} />
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
    <div className="pt-8 border-t border-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Mes Informations</h2>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="text-primary text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:underline"
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
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Nom</label>
              <input 
                type="text" 
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Téléphone</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm"
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
           <InfoItem label="Nom complet" value={`${profile?.firstName || ''} ${profile?.lastName || ''}`} icon={<UserIcon size={20} />} />
           <InfoItem label="E-mail" value={user?.email} icon={<Check size={20} className="text-success" />} />
           <InfoItem label="Téléphone" value={profile?.phone || 'Non renseigné'} icon={<Phone size={20} />} />
        </div>
      )}
    </div>
  );
};

const InfoItem = ({ label, value, icon }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4">
    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-0.5">{label}</p>
      <p className="text-sm font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export const Orders = () => (
  <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mes <span className="text-primary">Commandes</span></h1>
    <div className="bg-gray-50/50 p-8 md:p-20 rounded-3xl text-center border border-dashed border-gray-200">
      <Package size={64} weight="thin" className="text-gray-200 mx-auto mb-6" />
      <p className="text-base font-medium text-gray-500">Vous n'avez pas encore passé de commande.</p>
      <Link to="/boutique" className="inline-block mt-8 bg-gray-900 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-black transition-all">Commencer mes achats</Link>
    </div>
  </div>
);

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

  // Form management
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
      if (editingId === 'root-default' || editingId === 'main-migrated') {
        // Mise à jour de l'adresse principale (racine)
        await setDocument('users', user.uid, {
          ...profile,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country,
          updatedAt: new Date().toISOString()
        });
      } else if (editingId) {
        // Mise à jour d'une adresse secondaire existante
        const updatedAddresses = profile.addresses.map((a: any) => 
          a.id === editingId ? { ...a, ...formData } : a
        );
        await setDocument('users', user.uid, {
          ...profile,
          addresses: updatedAddresses,
          updatedAt: new Date().toISOString()
        });
      } else {
        // Création d'une nouvelle adresse secondaire
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
    if (window.confirm('Voulez-vous vraiment supprimer cette adresse ?')) {
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

  const handleSetDefault = async (addressId: string) => {
    setLoading(true);
    try {
      const updatedAddresses = profile.addresses.map((a: any) => ({
        ...a,
        isDefault: a.id === addressId
      }));
      await setDocument('users', user.uid, {
        ...profile,
        addresses: updatedAddresses
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mes <span className="text-primary">Adresses</span></h1>
        <button 
          onClick={isEditing ? () => { setIsEditing(false); setEditingId(null); } : openCreation}
          className="bg-gray-900 text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-black transition-all flex items-center gap-2 shadow-sm"
        >
          {isEditing ? <><X size={14} weight="bold" /> Annuler</> : <><Check size={14} weight="bold" /> Ajouter</>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(() => {
          let savedAddresses = profile?.addresses || [];
          // Migration view logic
          if (savedAddresses.length === 0 && profile?.address) {
            const rootId = 'root-default';
            savedAddresses = [{
              id: rootId,
              firstName: profile.firstName,
              lastName: profile.lastName,
              address: profile.address,
              city: profile.city,
              zipCode: profile.zipCode,
              country: profile.country,
              phone: profile.phone,
              isDefault: true
            }];
          } else if (profile?.address) {
            // S'assurer que l'adresse racine est toujours présente en tête de liste si elle existe
            const rootId = 'root-default';
            if (!savedAddresses.some((a: any) => a.id === rootId)) {
              savedAddresses.unshift({
                id: rootId,
                firstName: profile.firstName,
                lastName: profile.lastName,
                address: profile.address,
                city: profile.city,
                zipCode: profile.zipCode,
                country: profile.country,
                phone: profile.phone,
                isDefault: true
              });
            }
          }

          if (savedAddresses.length === 0 && !isEditing) {
            return (
              <div className="bg-gray-50 p-12 md:p-20 rounded-3xl text-center border-2 border-dashed border-gray-200 mt-4 md:mt-0 md:col-span-2">
                <MapPin size={64} weight="thin" className="text-gray-200 mx-auto mb-6" />
                <p className="text-base font-bold text-gray-400 uppercase tracking-widest mb-8">Aucune adresse enregistrée</p>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-gray-900 text-white text-xs font-black uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-black transition-all shadow-lg"
                >
                  + Ajouter ma première adresse
                </button>
              </div>
            );
          }

          return savedAddresses.map((addr: any) => (
            <div key={addr.id} className={`bg-white border-2 p-6 md:p-10 rounded-3xl relative group hover:shadow-xl transition-all ${addr.isDefault ? 'border-primary/20' : 'border-gray-50'}`}>
              {addr.isDefault && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform" />
              )}
              {addr.isDefault ? (
                <span className="absolute top-6 right-6 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm">Principale</span>
              ) : (
                <button 
                   onClick={() => handleSetDefault(addr.id)}
                   className="absolute top-6 right-6 bg-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100"
                >
                  Définir par défaut
                </button>
              )}
              
              <div className="flex items-start gap-6 relative z-10">
                <div className={`p-4 rounded-2xl shadow-sm border ${addr.isDefault ? 'bg-white border-primary/20 text-primary' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                  <MapPin size={28} weight="bold" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 uppercase tracking-tight text-xl mb-4">
                    {addr.isDefault ? 'Maison / Livraison' : 'Adresse secondaire'}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-500 font-medium">
                      <UserIcon size={14} className="text-gray-300" />
                      <span className="text-sm">{addr.firstName} {addr.lastName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-900 font-bold">
                      <NavigationArrow size={14} className="text-primary" weight="fill" />
                      <span className="text-sm">{addr.address}, {addr.zipCode} {addr.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 font-medium">
                       <Globe size={14} className="text-gray-300" />
                       <span className="text-sm uppercase tracking-wider">{addr.country}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-success">
                  <Check size={14} weight="bold" /> Enregistré dans Firestore
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => openEdition(addr)}
                    className="p-2 text-gray-300 hover:text-primary transition-colors"
                    title="Modifier"
                  >
                    <PencilSimple size={18} />
                  </button>
                  {!addr.isDefault && (
                    <button 
                      onClick={() => handleDelete(addr.id)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                      title="Supprimer"
                    >
                      <Trash size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ));
        })()}

        {isEditing && (
          <motion.form 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSave}
            className="bg-white border-2 border-primary/20 p-6 md:p-10 rounded-3xl shadow-xl space-y-6 md:col-span-2"
          >
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Adresse Complète</label>
                <input 
                  type="text" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                  placeholder="Rue, numéro, appartement..."
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm text-gray-900"
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
                    placeholder="75001"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Ville</label>
                  <input 
                    type="text" 
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    required
                    placeholder="Paris"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm text-gray-900"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Pays / Région</label>
                <select 
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  required
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm appearance-none text-gray-900"
                >
                  <option value="France">France métropolitaine</option>
                  <option value="Suisse">Suisse</option>
                  <option value="Portugal">Portugal</option>
                  <option value="Belgique">Belgique</option>
                </select>
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-black uppercase tracking-widest py-5 rounded-xl shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : success ? (
                <><Check size={20} weight="bold" /> {editingId ? 'Adresse modifiée !' : 'Adresse ajoutée !'}</>
              ) : (
                <><FloppyDisk size={20} weight="bold" /> {editingId ? 'Enregistrer les modifications' : 'Ajouter l\'adresse'}</>
              )}
            </button>
          </motion.form>
        )}
      </div>
    </div>
  );
};

export const Favorites = () => (
  <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mes <span className="text-primary">Favoris</span></h1>
    <div className="bg-gray-50 p-10 md:p-20 rounded-3xl text-center border-2 border-dashed border-gray-200">
      <Heart size={64} weight="fill" className="text-gray-200 mx-auto mb-6" />
      <p className="text-base font-medium text-gray-500">Votre liste de souhaits est vide.</p>
    </div>
  </div>
);


