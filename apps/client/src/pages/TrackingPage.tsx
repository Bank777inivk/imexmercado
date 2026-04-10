import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, MagnifyingGlass } from '@phosphor-icons/react';

export function TrackingPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="bg-bg min-h-screen font-sans selection:bg-primary/10 pb-24">
      {/* ─── Breadcrumbs ─── */}
      <div className="bg-white border-b border-gray-50">
        <div className="container mx-auto px-4 py-4 md:py-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">
          <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
          <span className="text-gray-200">/</span>
          <span className="text-gray-900">Suivi de commande</span>
        </div>
      </div>

      {/* ─── Main Unified Card ─── */}
      <section className="container mx-auto px-4 pt-6 md:pt-12">
        <motion.div 
          {...fadeIn}
          className="bg-white rounded-3xl border-2 border-gray-200 shadow-xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left Column: Tracking Form */}
            <div className="p-6 md:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-gray-100 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -mr-16 -mt-16 pointer-events-none opacity-50" />
              
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 text-primary shadow-inner relative z-10">
                <MagnifyingGlass size={32} weight="duotone" />
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4 relative z-10 leading-tight">
                Suivez votre <br />
                <span className="text-primary italic-none">Colis</span>
              </h1>
              <p className="text-sm md:text-base text-gray-500 max-w-md leading-relaxed font-medium mb-10 relative z-10">
                Entrez vos informations ci-dessous pour connaître l'état actuel de votre livraison en temps réel.
              </p>

              <form className="space-y-4 md:space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Numéro de commande</label>
                  <input 
                    type="text" 
                    placeholder="Ex: IMX-123456" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-bold text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Adresse E-mail</label>
                  <input 
                    type="email" 
                    placeholder="votre@email.com" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-bold text-sm"
                  />
                </div>
                
                <button className="w-full bg-gray-900 text-white font-black uppercase tracking-widest py-4 rounded-xl hover:bg-primary transition-all shadow-lg active:scale-95 text-xs mt-4">
                  Rechercher mon colis
                </button>
              </form>
            </div>

            {/* Right Column: Information & Timeline Visual */}
            <div className="bg-gray-50/50 p-6 md:p-16 flex flex-col justify-center">
              
              {/* Info Alert */}
              <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl mb-12 flex gap-4 items-start shadow-sm">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg shrink-0 mt-1">
                  <Package size={20} weight="fill" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-900 mb-1">Mise à jour requise</p>
                  <p className="text-xs text-blue-800 font-medium leading-relaxed">
                    Les informations de transport sont synchronisées toutes les 24h avec nos partenaires logistiques (CTT, DHL, DPD).
                  </p>
                </div>
              </div>

              <h3 className="font-black text-gray-900 uppercase tracking-tighter text-lg mb-8">
                Parcours type d'expédition
              </h3>

              {/* Static Timeline Illustration */}
              <div className="relative pl-6 space-y-8 before:absolute before:inset-y-0 before:left-[11px] before:w-0.5 before:bg-gray-200">
                
                {/* Step 1 */}
                <div className="relative z-10 flex items-center gap-6">
                  <div className="w-6 h-6 rounded-full bg-white border-2 border-primary flex items-center justify-center absolute -left-[27px]">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex-1">
                    <p className="text-sm font-bold text-gray-900">Préparation en entrepôt</p>
                    <p className="text-[10px] uppercase text-gray-400 font-black mt-1">Alhos Vedros, PT</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative z-10 flex items-center gap-6 opacity-60">
                  <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center absolute -left-[27px]">
                    <Truck size={12} className="text-gray-400" weight="bold" />
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-gray-100 flex-1">
                    <p className="text-sm font-bold text-gray-500">Prise en charge transporteur</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative z-10 flex items-center gap-6 opacity-60">
                  <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center absolute -left-[27px]">
                    <CheckCircle size={12} className="text-gray-400" weight="bold" />
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-gray-100 flex-1">
                    <p className="text-sm font-bold text-gray-500">Livraison effectuée</p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
