import React from 'react';
import { ProductCard } from './ProductCard';

interface ProductGridSectionProps {
  title: string;
  emoji?: string;
  products: any[];
  viewAllLink?: string;
  bgClass?: string;
}

export function ProductGridSection({ title, emoji = '', products, viewAllLink = '#', bgClass = 'bg-bg-subtle' }: ProductGridSectionProps) {
  return (
    <section className={`${bgClass} py-8 border-b border-gray-100`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">
            {emoji && <span className="mr-2">{emoji}</span>}{title}
          </h2>
          <a href={viewAllLink} className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
            Voir tout <span>&rarr;</span>
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.slice(0, 8).map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
