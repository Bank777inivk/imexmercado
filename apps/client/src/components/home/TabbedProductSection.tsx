import React, { useState } from 'react';
import { ProductCard, mockProducts, newProducts } from './ProductCard';

const tabs = [
  { id: 'phares', label: '⭐ Phares', products: mockProducts },
  { id: 'nouveautes', label: '✨ Nouveautés', products: newProducts },
  { id: 'promos', label: '🔥 Promos', products: [...mockProducts].sort(() => Math.random() - 0.5) },
];

export function TabbedProductSection() {
  const [activeTab, setActiveTab] = useState('phares');
  const current = tabs.find(t => t.id === activeTab)!;

  return (
    <section className="bg-white py-10 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-text-primary">Nos Sélections</h2>

          {/* Tabs */}
          <div className="flex gap-2 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all border
                  ${activeTab === tab.id
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-primary hover:text-primary'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {current.products.slice(0, 4).map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-8">
          <a href="#" className="inline-block border-2 border-primary text-primary font-bold px-10 py-2.5 rounded-full hover:bg-primary hover:text-white transition-all text-sm">
            Voir tous les produits &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
