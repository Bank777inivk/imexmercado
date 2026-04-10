import React from 'react';

const testimonials = [
  {
    name: 'Maria S.',
    country: '🇵🇹 Portugal',
    rating: 5,
    text: 'Livraison très rapide, produits conformes à la description. Je recommande sans hésiter imexmercado pour ses prix imbattables.',
    date: 'Mars 2026',
  },
  {
    name: 'Jean-Pierre M.',
    country: '🇫🇷 France',
    rating: 5,
    text: 'Site très bien conçu, navigation intuitive. J\'ai commandé un canapé et il est arrivé parfaitement emballé en 4 jours.',
    date: 'Avril 2026',
  },
  {
    name: 'Klaus W.',
    country: '🇩🇪 Allemagne',
    rating: 4,
    text: 'Très bonne expérience d\'achat. Les produits sont de bonne qualité et le support client est réactif. Je reviendrai !',
    date: 'Avril 2026',
  },
  {
    name: 'Sofia R.',
    country: '🇮🇹 Italie',
    rating: 5,
    text: 'Excellente plateforme pour l\'import-export. Les prix sont compétitifs et la qualité au rendez-vous. Très satisfaite !',
    date: 'Mars 2026',
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= count ? 'text-yellow-400' : 'text-gray-300'}>★</span>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="bg-bg-subtle py-12 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary mb-2">
            💬 Ce que nos clients disent
          </h2>
          <p className="text-text-secondary text-sm">Plus de <strong>1 000 avis vérifiés</strong> de clients satisfaits à travers l'Europe</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white rounded-lg p-5 shadow-worten hover:shadow-worten-hover transition-shadow flex flex-col">
              <Stars count={t.rating} />
              <p className="text-sm text-text-secondary italic mt-3 flex-1">"{t.text}"</p>
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm text-text-primary">{t.name}</p>
                  <p className="text-xs text-text-muted">{t.country}</p>
                </div>
                <span className="text-xs text-text-muted">{t.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
