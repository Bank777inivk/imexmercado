import React from 'react';

const stats = [
  { value: '300+', label: 'Références en stock', subtext: 'Mis à jour en temps réel', emoji: '📦' },
  { value: '50', label: 'Produits par catégorie', subtext: 'Sélectionnés avec soin', emoji: '🗂️' },
  { value: '24h', label: 'Traitement commande', subtext: 'Du lundi au vendredi', emoji: '⚡' },
  { value: '100%', label: 'Produits vérifiés', subtext: 'Contrôle qualité strict', emoji: '✅' },
];

export function StatsSection() {
  return (
    <section className="bg-white py-12 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary">Notre engagement produit</h2>
          <p className="text-text-secondary text-sm mt-2">Des chiffres qui témoignent de notre sérieux</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center text-center p-6 rounded-xl bg-bg-subtle hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200"
            >
              <span className="text-4xl mb-3">{stat.emoji}</span>
              <span className="text-4xl font-extrabold text-primary">{stat.value}</span>
              <span className="text-sm font-bold text-text-primary mt-1">{stat.label}</span>
              <span className="text-xs text-text-muted mt-0.5">{stat.subtext}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
