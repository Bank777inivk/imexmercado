import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { LockKey, Question } from '@phosphor-icons/react';

export function CheckoutLayout() {
  return (
    <div className="min-h-screen bg-white">
      {/* Checkout Minimal Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4 lg:py-6">
        <div className="w-full max-w-[1600px] lg:px-8 mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-black tracking-tighter text-gray-900 group">
            IMEX<span className="text-secondary opacity-80 group-hover:opacity-100 transition-opacity">SULTING</span>
          </Link>

          <div className="flex items-center gap-4 text-gray-500">
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#00A859]">
              <LockKey weight="bold" size={14} />
              <span className="mt-0.5">Paiement 100% Sécurisé</span>
            </div>
            
            <a href="mailto:contact@imexsulting.com" className="p-2 -mr-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors" title="Besoin d'aide ?">
              <Question size={20} weight="bold" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Checkout Content */}
      <main className="w-full">
        <Outlet />
      </main>
      
      {/* Checkout Minimal Footer */}
      <footer className="border-t border-gray-100 bg-gray-50/50 py-8 px-6 mt-20">
         <div className="w-full max-w-[1600px] lg:px-8 mx-auto flex flex-col md:flex-row items-center justify-between text-[10px] uppercase font-bold tracking-widest text-gray-400 gap-4">
            <p>© {new Date().getFullYear()} IMEXSULTING. Tous droits réservés.</p>
            <div className="flex items-center gap-6">
               <Link to="/cgv" className="hover:text-gray-900">Conditions Générales</Link>
               <Link to="/confidentialite" className="hover:text-gray-900">Confidentialité</Link>
            </div>
         </div>
      </footer>
    </div>
  );
}
