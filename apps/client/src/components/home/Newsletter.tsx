import React, { useState, useEffect } from 'react';
import { subscribeToDocument } from '@imexmercado/firebase';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = subscribeToDocument('settings', 'homepage', (data) => {
      if (data && data.newsletter) {
        setSettings(data.newsletter);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSent(true); }
  };

  return (
    <section className="bg-[#1A1A1A] text-white py-16 relative overflow-hidden">
      {/* Decorative element to add depth */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-3 text-white">
          {settings?.title || 'Restez informé de nos offres !'}
        </h2>
        <p className="text-sm md:text-base text-gray-400 mb-8 max-w-xl mx-auto">
          {settings?.subtitle || 'Inscrivez-vous à notre newsletter et obtenez 10% de réduction sur votre première commande.'}
        </p>

        {sent ? (
          <div className="inline-flex items-center gap-2 bg-success/20 text-success border border-success/30 font-black uppercase tracking-widest px-8 py-3.5 rounded-full">
            <span>✓ Code envoyé avec succès</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse e-mail"
              required
              className="flex-1 px-6 py-3.5 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-primary focus:bg-white/10 transition-all font-medium text-sm"
            />
            <button
              type="submit"
              className="bg-primary text-white font-black uppercase tracking-widest px-8 py-3.5 rounded-full hover:bg-primary-dark transition-colors text-[11px] shadow-lg shadow-primary/20 whitespace-nowrap active:scale-95"
            >
              {settings?.buttonText || 'Obtenir mes -10%'}
            </button>
          </form>
        )}
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-6">
          Zéro spam. Désinscription possible à tout moment.
        </p>
      </div>
    </section>
  );
}
