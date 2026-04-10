import React, { useState } from 'react';
import { ShoppingCart, Heart } from '@imexmercado/ui';
import { useCart } from '../../context/CartContext';

// Shared ProductCard
export function ProductCard({
  product,
  index = 0,
  onViewDetails,
}: {
  product: any;
  index?: number;
  onViewDetails?: (product: any) => void;
}) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const btnClass = index % 2 === 0
    ? 'bg-primary hover:bg-primary-dark'
    : 'bg-secondary hover:bg-secondary-dark';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    addItem(product);
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleCardClick = () => {
    if (onViewDetails) onViewDetails(product);
  };

  const discount = product.oldPrice && product.oldPrice > product.price
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null;

  const badgeText = product.badge || (discount ? `-${discount}%` : null);

  return (
    <div
      className={`bg-white border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-200 flex flex-col group relative ${onViewDetails ? 'cursor-pointer' : ''}`}
      onClick={handleCardClick}
    >
      {/* Discount badge — rounded rectangle, top-left */}
      {badgeText && (
        <span className="absolute top-3 left-3 z-10 bg-primary text-white text-[10px] font-black px-2 py-1 rounded shadow-sm">
          {badgeText}
        </span>
      )}
      {product.isNew && (
        <span className="absolute top-3 right-3 z-10 bg-success text-white text-[10px] font-bold px-2 py-0.5 rounded">
          NOUVEAU
        </span>
      )}

      {/* Image */}
      <div className="flex items-center justify-center h-48 bg-gray-50 p-4 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-40 object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Wishlist on hover */}
      <button
        onClick={(e) => e.stopPropagation()}
        className={`absolute ${product.isNew ? 'top-10' : 'top-3'} right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-gray-200 rounded-full p-2 shadow-sm hover:border-primary hover:text-primary hover:scale-110 transition-transform duration-200`}
      >
        <Heart size={18} />
      </button>

      {/* Info */}
      <div className="p-2 md:p-3 flex flex-col flex-1 border-t border-gray-100">
        <p className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-wider mb-1 truncate">{product.category}</p>
        <h3 className="text-xs md:text-sm text-gray-800 line-clamp-2 flex-1 mb-2 leading-snug">{product.name}</h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          {product.oldPrice && (
            <span className="text-[10px] md:text-xs text-gray-400 line-through">€{product.oldPrice}</span>
          )}
          <span className="text-primary font-bold text-sm md:text-base">€{product.price}</span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`w-full flex items-center justify-center gap-1.5 ${btnClass} text-white text-[10px] md:text-xs font-bold py-2 rounded-sm transition-all disabled:opacity-50`}
        >
          {isAdding ? (
            <span className="flex items-center gap-2 animate-in fade-in">
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Prêt !
            </span>
          ) : (
            <>
              <ShoppingCart size={14} />
              Ajouter
            </>
          )}
        </button>
      </div>
    </div>
  );
}


