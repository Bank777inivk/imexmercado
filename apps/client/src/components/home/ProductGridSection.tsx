import React from 'react';
import { ProductCard } from './ProductCard';

interface ProductGridSectionProps {
  title: string;
  emoji?: string;
  products: any[];
  viewAllLink?: string;
  bgClass?: string;
  onViewDetails?: (product: any) => void;
}

export function ProductGridSection({ title, emoji = '', products, viewAllLink = '#', bgClass = 'bg-bg-subtle', onViewDetails }: ProductGridSectionProps) {
  return (
    <section className={`${bgClass} py-8 border-b border-gray-100`}>
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">
            {emoji && <span className="mr-2">{emoji}</span>}{title}
          </h2>
          <a href={viewAllLink} className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
            Voir tout <span>&rarr;</span>
          </a>
        </div>

        {/* Grid — Fluid columns: 2 (mobile), 3 (sm), 4 (lg), 5 (xl), 6 (2xl) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-4">
          {products.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              index={idx}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
