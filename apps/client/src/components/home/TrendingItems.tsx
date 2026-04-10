import React, { useState } from 'react';
import { ProductCard } from './ProductCard';

const trendingCategories = [
  { id: 'all', label: 'Tous' },
  { id: 'tech', label: 'Hi-Tech' },
  { id: 'maison', label: 'Maison' },
  { id: 'jardin', label: 'Jardin' },
  { id: 'meubles', label: 'Meubles' },
];

interface TrendingItemsProps {
  products: any[];
  onViewDetails?: (product: any) => void;
}

export function TrendingItems({ products, onViewDetails }: TrendingItemsProps) {
  const [activeTab, setActiveTab] = useState('all');

  if (products.length === 0) return null;

  return (
    <section className="bg-white py-6 w-full">
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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 min-h-[400px]">
        {products.map((product, idx) => (
          <ProductCard key={product.id || idx} product={product} index={idx} onViewDetails={onViewDetails} />
        ))}
      </div>
    </section>
  );
}
