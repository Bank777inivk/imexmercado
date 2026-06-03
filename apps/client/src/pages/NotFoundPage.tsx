import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { House, ShoppingBag, WarningOctagon } from '@phosphor-icons/react';

export function NotFoundPage() {
  return (
    <div className="bg-[#0F1115] min-h-screen text-white flex flex-col justify-center items-center px-6 relative overflow-hidden font-sans">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center relative z-10 space-y-8"
      >
        {/* Animated Icon */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="inline-flex bg-primary/10 border border-primary/20 text-primary w-24 h-24 rounded-3xl items-center justify-center shadow-xl shadow-primary/5"
        >
          <WarningOctagon size={48} weight="duotone" />
        </motion.div>

        {/* Error code */}
        <div className="space-y-2">
          <h1 className="text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 leading-none">
            404
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
            Page non trouvée
          </p>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto font-medium">
          Désolé, la page que vous recherchez semble introuvable ou a été déplacée. Retournez sur la boutique ou à l'accueil pour continuer.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-white text-gray-900 text-[10px] font-black uppercase tracking-widest px-8 py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            <House size={16} weight="bold" />
            Accueil
          </Link>
          <Link
            to="/boutique"
            className="flex items-center justify-center gap-2 bg-[#1F222A] border border-gray-800 text-white text-[10px] font-black uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all"
          >
            <ShoppingBag size={16} weight="bold" />
            Boutique
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
