import React, { useState } from 'react';
import { Phone, CaretDown } from '@imexmercado/ui';
import { Link } from 'react-router-dom';

const languages = [
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
];

export function TopBar() {
  const [currentLang, setCurrentLang] = useState(languages[0]);
  const [langOpen, setLangOpen] = useState(false);

  return (
    <div className="bg-[#1A1A1A] border-b border-white/10 text-xs text-gray-300 relative z-[100]">
      <div className="w-full px-4 md:px-4 lg:px-6 h-9 flex items-center justify-between gap-2 md:gap-4">
        
        {/* Left — Address */}
        <div className="hidden md:flex items-center gap-1">
          <span>📍</span>
          <span>Rua dos Girassóis, Nº 1 e 1A — 2860-274 Alhos Vedros, Moita — Portugal</span>
        </div>

        {/* Right — Links + Phone + Language Selector */}
        <div className="flex items-center gap-6 ml-auto">
          
          {/* Service Links */}
          <div className="hidden lg:flex items-center gap-4 border-r border-white/10 pr-4">
            <Link to="/faq" className="hover:text-primary transition-colors flex items-center gap-1">
              <span>❓</span>
              <span>FAQ</span>
            </Link>
            <Link to="/suivi-commande" className="hover:text-primary transition-colors flex items-center gap-1">
              <span>📦</span>
              <span>Suivi de commande</span>
            </Link>
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              id="lang-switcher"
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 hover:text-primary transition-colors font-semibold text-gray-300"
            >
              <span>{currentLang.flag}</span>
              <span>{currentLang.code.toUpperCase()}</span>
              <CaretDown size={12} weight="bold" className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>

            {langOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-gray-100 rounded-lg shadow-2xl z-[200] min-w-[150px] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="py-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setCurrentLang(lang); setLangOpen(false); }}
                      className={`w-full text-left flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-all
                        ${currentLang.code === lang.code ? 'text-primary bg-primary/5 font-bold' : 'text-gray-700'}
                      `}
                    >
                      <span className="text-base">{lang.flag}</span>
                      <span className="font-medium">{lang.label}</span>
                      {currentLang.code === lang.code && <span className="ml-auto text-[10px]">●</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
