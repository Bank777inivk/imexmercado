import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { 
  Package, MapPin, Heart
} from '@phosphor-icons/react';

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
    </div>
  );
};

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
  const { profile } = useOutletContext<any>();
  
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mes <span className="text-primary">Adresses</span></h1>
        <button className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-black transition-all">+ Ajouter</button>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {profile?.address ? (
          <div className="bg-primary/5 border-2 border-primary p-6 md:p-8 rounded-2xl relative mt-4 md:mt-0">
            <span className="absolute top-4 right-4 bg-primary text-white text-xs font-medium px-2 py-1 rounded">Principale</span>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Maison / Livraison</h3>
            <p className="text-base text-gray-600 leading-relaxed">
              {profile.firstName} {profile.lastName}<br />
              {profile.address}<br />
              {profile.phone}
            </p>
          </div>
        ) : (
          <div className="bg-gray-50 p-8 md:p-12 rounded-3xl text-center border border-dashed border-gray-200 mt-4 md:mt-0">
            <MapPin size={48} weight="thin" className="text-gray-300 mx-auto mb-4" />
            <p className="text-sm font-medium text-gray-500">Aucune adresse enregistrée.</p>
          </div>
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


