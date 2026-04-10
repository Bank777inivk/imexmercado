import React, { useState } from 'react';
import { ProductCard, mockProducts } from './ProductCard';

const trendingCategories = [
  { id: 'all', label: 'Tous' },
  { id: 'tech', label: 'Hi-Tech' },
  { id: 'maison', label: 'Maison' },
  { id: 'jardin', label: 'Jardin' },
  { id: 'meubles', label: 'Meubles' },
];

export function TrendingItems() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <section className="bg-white py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-gray-100 pb-2">
        <h2 className="text-lg font-extrabold text-gray-900 uppercase tracking-wide border-b-2 border-primary pb-2 pr-4 -mb-[11px] z-10 whitespace-nowrap">
          Produits Tendances
        </h2>
        
        {/* Category Links on the right */}
        <div className="flex items-center gap-4 flex-wrap">
          {trendingCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`text-xs font-bold uppercase tracking-tight transition-colors hover:text-primary
                ${activeTab === cat.id ? 'text-primary' : 'text-gray-400'}
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {mockProducts.slice(0, 4).map((product, idx) => (
          <ProductCard key={product.id} product={product} index={idx} />
        ))}
      </div>
    </section>
  );
}
