import React from 'react';
import { InstagramLogo, FacebookLogo, LinkedinLogo } from '@imexmercado/ui';
import { Link } from 'react-router-dom';

const footerLinks = [
  {
    title: "Aide",
    links: [
      { label: 'Contact', path: '/contact' },
      { label: 'FAQ', path: '/faq' },
      { label: 'Suivi de commande', path: '/suivi-commande' },
      { label: 'Livraison', path: '/livraison' },
      { label: 'Retours', path: '/retours' },
    ]
  },

  {
    title: "Catégories",
    links: [
      { label: 'Téléphones & Hi-Tech', path: '/category/hitech' },
      { label: 'Maison', path: '/category/maison' },
      { label: 'Meubles & Déco', path: '/category/meubles' },
      { label: 'Bricolage', path: '/category/bricolage' },
      { label: 'BBQ & Jardin', path: '/category/jardin' },
      { label: 'Piscines & Loisirs', path: '/category/loisirs' },
    ]
  },
  {
    title: "Légal",
    links: [
      { label: 'CGV', path: '/cgv' },
      { label: 'Politique de confidentialité', path: '/confidentialite' },
      { label: 'Mentions légales', path: '/mentions-legales' },
      { label: 'Cookies', path: '/cookies' },
    ]
  },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* 
        The extra `pb-28 md:pb-12` pushes content up so it is not 
        hidden behind the MobileBottomNav on small screens!
      */}
      <div className="w-full px-2 md:px-4 lg:px-6 pt-12 pb-28 md:pb-12">
        
        {/* Always 3 Columns */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8 mb-12">
          {footerLinks.map((section) => (
            <div key={section.title} className="pb-0">
              <h4 className="text-white font-black text-[9px] sm:text-[11px] md:text-sm mb-2 md:mb-4 uppercase tracking-wider">{section.title}</h4>
              <ul className="space-y-2 md:space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path} className="text-[9px] sm:text-[11px] md:text-sm font-medium hover:text-white transition-colors block leading-tight">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment icons */}
        <div className="border-t border-gray-800 pt-8 mb-8 flex flex-col items-center md:items-start text-center md:text-left">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">Moyens de paiement sécurisés</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            {['VISA', 'Mastercard', 'PayPal', 'MBWay', 'SEPA', 'Stripe'].map((pm) => (
              <span key={pm} className="bg-gray-800/80 text-gray-400 text-[10px] font-black tracking-widest px-3 py-2 rounded-lg border border-gray-700/50">
                {pm}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col items-center md:flex-row md:justify-between gap-6 text-center md:text-left">
          <div>
            <Link to="/" className="text-2xl font-black text-white tracking-tighter mb-2 block hover:opacity-80 transition-opacity">
              IMEX<span className="text-primary">MERCADO</span>
            </Link>
            <p className="text-[10px] font-bold text-gray-500 tracking-wider">
              © 2026 IMEXSULTING Lda — imexmercado.pt — Tous droits réservés
            </p>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-500 hover:text-white transition-colors p-2 bg-gray-800 rounded-full"><FacebookLogo size={20} weight="fill" /></a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors p-2 bg-gray-800 rounded-full"><InstagramLogo size={20} weight="fill" /></a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors p-2 bg-gray-800 rounded-full"><LinkedinLogo size={20} weight="fill" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
