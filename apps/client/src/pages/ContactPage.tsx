import React from 'react';
import { EnvelopeSimple, Phone, MapPin, PaperPlaneTilt } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function ContactPage() {
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
          <span className="text-gray-900">Contact</span>
        </div>
      </div>

      {/* ─── Main Unified Card ─── */}
      <section className="container mx-auto px-4 pt-6 md:pt-12">
        <motion.div 
          {...fadeIn}
          className="bg-white rounded-3xl border-2 border-gray-200 shadow-xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left Column: Contact Form */}
            <div className="p-6 md:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-gray-100 relative">
              {/* Subtle decorative background element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -mr-16 -mt-16 pointer-events-none opacity-50" />
              
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4 relative z-10 leading-tight">
                Contactez <br />
                <span className="text-primary italic-none">l'Expertise</span>
              </h1>
              <p className="text-sm md:text-base text-gray-500 max-w-md leading-relaxed font-medium mb-10 relative z-10">
                Besoin d'un renseignement sur un produit, une commande ou un partenariat ? Nos experts vous répondent sous 24h ouvrées.
              </p>

              <form className="space-y-4 md:space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Nom Complet</label>
                    <input 
                      type="text" 
                      placeholder="Jean Dupont"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Email</label>
                    <input 
                      type="email" 
                      placeholder="jean@example.com"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Sujet</label>
                  <div className="relative">
                    <select className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 pr-10 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm appearance-none cursor-pointer">
                      <option>Service Client - Commande</option>
                      <option>Question Technique sur un produit</option>
                      <option>Demande de Partenariat</option>
                      <option>Autre demande</option>
                    </select>
                    {/* Custom chevron to replace default select arrow */}
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Votre Message</label>
                  <textarea 
                    rows={5}
                    placeholder="Comment pouvons-nous vous aider ?"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm resize-none"
                  ></textarea>
                </div>

                <button 
                  type="button"
                  className="w-full bg-primary text-white font-black uppercase tracking-widest py-4 rounded-xl hover:bg-primary-dark transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-primary/20 text-xs mt-4"
                >
                  <span>Envoyer le message</span>
                  <PaperPlaneTilt size={18} weight="bold" />
                </button>
              </form>
            </div>

            {/* Right Column: Contact Info & Map */}
            <div className="bg-gray-50/50 p-6 md:p-16 flex flex-col justify-center">
              
              <div className="space-y-4 md:space-y-6 mb-8 md:mb-12">
                {/* Phone Card */}
                <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-primary/10 p-3 rounded-xl text-primary">
                    <Phone size={24} weight="duotone" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 uppercase text-xs mb-1 tracking-wider">Téléphone</h3>
                    <p className="text-sm font-bold text-gray-700">+351 000 000 000</p>
                    <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-widest font-black">Lun - Ven | 9h - 18h</p>
                  </div>
                </div>

                {/* Email Card */}
                <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-blue-500/10 p-3 rounded-xl text-blue-500">
                    <EnvelopeSimple size={24} weight="duotone" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 uppercase text-xs mb-1 tracking-wider">Email</h3>
                    <p className="text-sm font-bold text-gray-700">contact@imexmercado.pt</p>
                    <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-widest font-black">SUPPORT 24/7</p>
                  </div>
                </div>

                {/* Address Card */}
                <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-gray-100 p-3 rounded-xl text-gray-900">
                    <MapPin size={24} weight="duotone" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 uppercase text-xs mb-1 tracking-wider">Siège Social</h3>
                    <p className="text-sm font-medium text-gray-600 leading-relaxed">
                      Rua dos Girassóis, Nº 1 e 1A<br />
                      2860-274 Alhos Vedros — PORTUGAL
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative Mini Map / Hub Card */}
              <div className="bg-gray-900 rounded-2xl p-8 relative overflow-hidden text-center border-2 border-gray-800">
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #4b5563 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                
                <MapPin size={32} weight="fill" className="text-primary mx-auto mb-3 relative z-10" />
                <h4 className="text-white font-black uppercase text-sm mb-2 relative z-10">Portugal Operations</h4>
                <p className="text-gray-400 text-xs leading-relaxed mb-4 relative z-10 max-w-[200px] mx-auto">
                  Notre hub logistique central orchestre l'ensemble de nos expéditions européennes.
                </p>
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block relative z-10 bg-white/10 hover:bg-white hover:text-gray-900 text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-lg transition-colors border border-white/20 hover:border-transparent"
                >
                  Ouvrir Google Maps
                </a>
              </div>

            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
