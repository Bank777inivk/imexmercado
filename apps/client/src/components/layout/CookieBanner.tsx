import React, { useState, useEffect } from 'react';
import { Cookie, Check, X, ShieldCheck } from '@phosphor-icons/react';

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('imex_cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const consent = { necessary: true, analytics: true, marketing: true };
    localStorage.setItem('imex_cookie_consent', JSON.stringify(consent));
    window.dispatchEvent(new Event('imex_cookie_consent_changed'));
    setShowBanner(false);
  };

  const handleRefuseAll = () => {
    const consent = { necessary: true, analytics: false, marketing: false };
    localStorage.setItem('imex_cookie_consent', JSON.stringify(consent));
    window.dispatchEvent(new Event('imex_cookie_consent_changed'));
    setShowBanner(false);
  };

  const handleSaveCustom = () => {
    const consent = { necessary: true, analytics, marketing };
    localStorage.setItem('imex_cookie_consent', JSON.stringify(consent));
    window.dispatchEvent(new Event('imex_cookie_consent_changed'));
    setShowBanner(false);
  };

  if (!showBanner) {
    // Elegant tiny floating shortcut to reopen cookie settings at any time (RGPD compliant)
    return (
      <button
        onClick={() => {
          const consent = localStorage.getItem('imex_cookie_consent');
          if (consent) {
            const parsed = JSON.parse(consent);
            setAnalytics(parsed.analytics || false);
            setMarketing(parsed.marketing || false);
          }
          setShowBanner(true);
        }}
        title="Paramètres des Cookies"
        className="fixed bottom-4 left-4 z-40 bg-white hover:bg-gray-100 text-gray-700 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border border-gray-200 hover:scale-110 active:scale-95 transition-all"
      >
        <Cookie size={20} weight="bold" className="text-primary" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-[#1F222A]/95 backdrop-blur-md border-t border-[#2D3039] text-white shadow-2xl text-left">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left Side: Explanations */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <Cookie size={24} className="text-primary animate-pulse" weight="fill" />
            <h3 className="font-bold text-base md:text-lg tracking-tight">Respect de votre vie privée (RGPD)</h3>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed max-w-4xl">
            Nous utilisons des cookies pour optimiser votre expérience, analyser le trafic du site (Google Analytics) et vous proposer des publicités ciblées sur les réseaux sociaux (Meta Pixel). Les cookies non essentiels sont bloqués par défaut tant que vous n'avez pas fait votre choix. Vous pouvez modifier vos préférences à tout moment.
          </p>
        </div>

        {/* Right Side: Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white transition-colors"
          >
            {showDetails ? 'Masquer' : 'Personnaliser'}
          </button>
          <button
            onClick={handleRefuseAll}
            className="px-5 py-2.5 text-xs font-black uppercase tracking-wider bg-[#2D3039] hover:bg-[#3E424B] text-gray-200 rounded-xl transition-all"
          >
            Refuser tout
          </button>
          <button
            onClick={handleAcceptAll}
            className="px-6 py-2.5 text-xs font-black uppercase tracking-wider bg-primary hover:bg-primary-dark text-white rounded-xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            Tout accepter
          </button>
        </div>

      </div>

      {/* Details settings box */}
      {showDetails && (
        <div className="max-w-6xl mx-auto mt-6 pt-6 border-t border-[#2D3039] grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {/* Category 1: Necessary */}
          <div className="p-4 bg-[#2D3039]/50 rounded-2xl space-y-2 relative border border-[#2D3039]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-white">Nécessaires</span>
              <span className="text-[10px] font-black text-green-500 uppercase">Toujours Actif</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Indispensables au fonctionnement du site, à la gestion du panier et à la connexion sécurisée. Ils ne collectent aucune donnée personnelle.
            </p>
          </div>

          {/* Category 2: Analytics */}
          <div className="p-4 bg-[#2D3039]/50 rounded-2xl space-y-3 border border-[#2D3039]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-white">Analytiques</span>
              <button
                type="button"
                onClick={() => setAnalytics(!analytics)}
                className={`w-10 h-5 rounded-full relative transition-all ${analytics ? 'bg-primary' : 'bg-gray-600'}`}
              >
                <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${analytics ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Nous aident à comprendre comment les visiteurs interagissent avec la boutique (ex : pages les plus visitées, temps passé) grâce à Google Analytics.
            </p>
          </div>

          {/* Category 3: Marketing */}
          <div className="p-4 bg-[#2D3039]/50 rounded-2xl space-y-3 border border-[#2D3039]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-white">Publicité & Marketing</span>
              <button
                type="button"
                onClick={() => setMarketing(!marketing)}
                className={`w-10 h-5 rounded-full relative transition-all ${marketing ? 'bg-primary' : 'bg-gray-600'}`}
              >
                <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${marketing ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Permettent de suivre l'efficacité des publicités sur Facebook, Instagram (Meta Pixel) et TikTok afin de vous suggérer des produits pertinents.
            </p>
          </div>

          {/* Save button for custom settings */}
          <div className="md:col-span-3 flex justify-end">
            <button
              onClick={handleSaveCustom}
              className="px-6 py-2.5 text-xs font-black uppercase tracking-wider bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-all flex items-center gap-2"
            >
              <Check size={16} weight="bold" /> Enregistrer mes choix
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
