import React, { useState } from 'react';
import { ProductCard } from './ProductCard';

interface TabbedProductSectionProps {
  selections: any[];
  newArrivals: any[];
  promotions: any[];
  onViewDetails?: (product: any) => void;
}

export function TabbedProductSection({ selections, newArrivals, promotions, onViewDetails }: TabbedProductSectionProps) {
  const [activeTab, setActiveTab] = useState('phares');

  const tabs = [
    { id: 'phares', label: '⭐ Phares', products: selections },
    { id: 'nouveautes', label: '✨ Nouveautés', products: newArrivals },
    { id: 'promos', label: '🔥 Promos', products: promotions },
  ];

  const current = tabs.find(t => t.id === activeTab) || tabs[0];

  if (selections.length === 0 && newArrivals.length === 0 && promotions.length === 0) return null;

  return (
    <section className="bg-white py-10 border-b border-gray-100 w-full">
      <div className="w-full px-4 md:px-4 lg:px-6">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 min-h-[400px]">
          {current.products.map((product, idx) => (
            <ProductCard 
              key={product.id || idx} 
              product={product} 
              index={idx} 
              onViewDetails={onViewDetails}
            />
          ))}
          {current.products.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
              <p className="font-bold uppercase tracking-widest text-[10px]">Aucun produit dans cette catégorie</p>
            </div>
          )}
        </div>

        {/* View All */}
        <div className="text-center mt-8">
          <a href="/boutique" className="inline-block border-2 border-primary text-primary font-bold px-10 py-2.5 rounded-full hover:bg-primary hover:text-white transition-all text-sm">
            Voir tous les produits &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
