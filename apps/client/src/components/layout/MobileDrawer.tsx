import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, CaretRight, Question, EnvelopeSimple, BookOpen, Package } from '@phosphor-icons/react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  // Mobile main menu sections
  const menuCategories = [
    { label: 'Tous les produits', path: '/boutique' },
    { label: 'Promotions 🔥', path: '/boutique?filter=promo' },
    { label: 'Nouveautés', path: '/boutique?filter=new' },
  ];

  const infoLinks = [
    { label: 'À Propos', path: '/a-propos', icon: <Question size={20} /> },
    { label: 'Suivi de Commande', path: '/suivi-commande', icon: <Package size={20} /> },
    { label: 'Contact', path: '/contact', icon: <EnvelopeSimple size={20} /> },
    { label: 'FAQ', path: '/faq', icon: <Question size={20} /> },
    { label: 'Mentions Légales', path: '/mentions-legales', icon: <BookOpen size={20} /> },
    { label: 'CGV', path: '/cgv', icon: <BookOpen size={20} /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm md:hidden"
          />
          
          {/* Drawer Menu */}
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white z-[70] shadow-2xl flex flex-col md:hidden"
          >
            {/* Header Drawer */}
            <div className="bg-[#1A1A1A] p-6 flex items-center justify-between">
              <Link to="/" onClick={onClose} className="font-black text-xl tracking-tighter text-white">
                IMEX<span className="text-primary">MERCADO</span>
              </Link>
              <button 
                onClick={onClose}
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pb-24">
              
              {/* Boutique links */}
              <div className="p-6 pb-2">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 px-2">Boutique</h3>
                <ul className="space-y-1">
                  {menuCategories.map((item, idx) => (
                    <li key={idx}>
                      <Link 
                        to={item.path} 
                        onClick={onClose}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                      >
                        <span className="text-sm font-black uppercase tracking-tight text-gray-900">{item.label}</span>
                        <CaretRight size={16} className="text-gray-400 group-hover:text-primary transition-colors" weight="bold" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mon Compte shortcut */}
              <div className="p-6 py-2 border-t border-gray-100 mt-4">
                 <Link 
                    to="/compte" 
                    onClick={onClose}
                    className="w-full bg-primary text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg hover:bg-primary-dark transition-all flex items-center justify-center gap-3 text-xs"
                  >
                    Espace Membre
                  </Link>
              </div>

              {/* Informational Links */}
              <div className="p-6 pt-4 border-t border-gray-100 mt-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 px-2">Assistance & Info</h3>
                <ul className="space-y-1">
                  {infoLinks.map((item, idx) => (
                    <li key={idx}>
                      <Link 
                        to={item.path} 
                        onClick={onClose}
                        className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors text-gray-600 hover:text-primary group"
                      >
                        <div className="text-gray-400 group-hover:text-primary transition-colors">
                          {item.icon}
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest leading-none mt-1">{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
               <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">© 2026 ImexMercado.pt</p>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
