import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { House, ShieldCheck, ShoppingCart, CaretLeft, Bank } from '@phosphor-icons/react';
import { CartDrawer } from './CartDrawer';
import { useCart } from '../../context/CartContext';

export function CheckoutLayout() {
  const { setDrawerOpen } = useCart();
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);
  const securityRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (securityRef.current && !securityRef.current.contains(event.target as Node)) {
        setShowSecurityInfo(false);
      }
    }

    if (showSecurityInfo) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSecurityInfo]);
  
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* Checkout Minimalist Header — DESIGN PREMIUM FIXED */}
      <header className="fixed top-0 left-0 right-0 z-[60] bg-white/90 backdrop-blur-xl border-b border-gray-100 px-4 py-3 lg:py-5">
        <div className="w-full max-w-[1600px] lg:px-8 mx-auto grid grid-cols-3 items-center">
          
          {/* Left: Boutique Navigation — Home Icon */}
          <div className="flex justify-start">
            <Link 
              to="/boutique" 
              className="group flex items-center gap-2 text-primary hover:text-primary/80 transition-all ml-1"
              title="Retour à la boutique"
            >
              <div className="p-2 rounded-full bg-primary/5 border border-primary/10 group-hover:bg-primary/10 transition-all shadow-sm shadow-primary/5">
                <House size={20} weight="fill" />
              </div>
            </Link>
          </div>

          {/* Center: Brand Identity */}
          <div className="flex justify-center">
            <Link to="/" className="text-xl lg:text-2xl font-black tracking-tighter text-gray-900 group">
              IMEX<span className="text-primary group-hover:opacity-80 transition-opacity">MERCADO</span>
            </Link>
          </div>

          {/* Right: Trust Signals */}
          <div className="flex justify-end relative" ref={securityRef}>
            <button 
              onClick={() => setShowSecurityInfo(!showSecurityInfo)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-success/5 border border-success/10 rounded-full text-success transition-all active:scale-95 z-20"
            >
              <ShieldCheck size={14} weight="fill" className="opacity-80" />
              <span className="text-[9px] font-black uppercase tracking-tight">Sécurisé</span>
            </button>

            {/* Downward Pop-over */}
            <div className={`absolute top-full right-0 mt-2 transition-all duration-300 origin-top-right z-30 ${showSecurityInfo ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
              <div className="relative bg-white border border-success/20 shadow-xl shadow-success/10 rounded-xl px-4 py-3 min-w-[220px]">
                {/* Little Arrow */}
                <div className="absolute -top-1.5 right-6 w-3 h-3 bg-white border-t border-l border-success/20 rotate-45" />
                
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-success">
                    <ShieldCheck size={16} weight="fill" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#00A859]">100% Sécurisé</span>
                  </div>
                  <p className="text-[9px] text-gray-500 font-medium leading-relaxed">
                    Vos données de paiement sont cryptées et traitées via nos partenaires bancaires certifiés.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Main Checkout Content — Account for fixed header */}
      <main className="w-full pt-[57px] lg:pt-[77px]">
        <Outlet />
      </main>
      
      {/* Global Overlays */}
      <CartDrawer />
    </div>
  );
}
