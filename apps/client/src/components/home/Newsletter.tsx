import React, { useState } from 'react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSent(true); }
  };

  return (
    <section className="bg-primary py-12">
      <div className="container mx-auto px-4 text-center text-white">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-2">
          Restez informé de nos meilleures offres !
        </h2>
        <p className="text-sm md:text-base opacity-90 mb-6">
          Inscrivez-vous à notre newsletter et obtenez <strong>-10%</strong> sur votre première commande.
        </p>

        {sent ? (
          <div className="inline-block bg-white text-primary font-bold px-8 py-3 rounded-full">
            ✓ Merci ! Votre code de bienvenue vous a été envoyé.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email..."
              required
              className="flex-1 px-5 py-3 rounded-full text-black outline-none focus:ring-2 focus:ring-white text-sm"
            />
            <button
              type="submit"
              className="bg-white text-primary font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors text-sm shadow-md whitespace-nowrap"
            >
              Je m'inscris — 10% OFF
            </button>
          </form>
        )}
        <p className="text-xs mt-4 opacity-60">Pas de spam. Désinscription possible à tout moment.</p>
      </div>
    </section>
  );
}
