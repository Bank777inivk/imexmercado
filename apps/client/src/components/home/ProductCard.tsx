import React, { useState } from "react";
import { ShoppingCart, Heart, getOptimizedImageUrl } from "@imexmercado/ui";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useTranslation } from "react-i18next";

const translateBadge = (text: string, lang: string) => {
  if (!text) return "";
  const clean = text.toUpperCase().trim();
  if (lang.startsWith("pt")) {
    if (clean === "NOUVEAU") return "NOVO";
    if (clean === "EXCLU") return "EXCLUSIVO";
    if (clean === "SOLDES") return "SALDOS";
    if (clean === "COUP DE CŒUR" || clean === "COUP DE COEUR")
      return "DESTAQUE";
    if (clean === "⭐ COUP DE CŒUR" || clean === "⭐ COUP DE COEUR")
      return "⭐ DESTAQUE";
  } else {
    if (clean === "NOVO") return "NOUVEAU";
    if (clean === "EXCLUSIVO") return "EXCLU";
    if (clean === "SALDOS") return "SOLDES";
    if (clean === "DESTAQUE" || clean === "FAVORITO") return "COUP DE CŒUR";
    if (clean === "⭐ DESTAQUE" || clean === "⭐ FAVORITO")
      return "⭐ COUP DE CŒUR";
  }
  return text;
};

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
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);
  const isFavorite = isInWishlist(product.id);
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "pt";

  const btnClass = "bg-secondary hover:bg-secondary-dark";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    addItem(product);
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleCardClick = () => {
    if (onViewDetails) onViewDetails(product);
  };

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round((1 - product.price / product.oldPrice) * 100)
      : null;

  const rawBadge = currentLang.startsWith("fr")
    ? product.badgeFR || product.badge
    : product.badge;
  const badgeText = rawBadge
    ? translateBadge(rawBadge, currentLang)
    : discount
      ? `-${discount}%`
      : null;

  const displayName = currentLang.startsWith("fr")
    ? product.nameFR || product.name
    : product.name;

  return (
    <div
      className={`bg-white border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-200 flex flex-col group relative ${onViewDetails ? "cursor-pointer" : ""}`}
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
          {currentLang.startsWith("pt") ? "NOVO" : "NOUVEAU"}
        </span>
      )}

      {/* Image */}
      <div className="w-full aspect-[4/3] sm:h-56 bg-gray-50 overflow-hidden relative">
        <img
          src={getOptimizedImageUrl(product.image, 600)}
          alt={displayName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/600x600/f8f9fa/adb5bd?text=Image+Non+Disponible";
            e.currentTarget.className =
              "w-full h-full object-contain p-4 opacity-50";
          }}
        />
      </div>

      {/* Wishlist on hover */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className={`absolute ${product.isNew ? "top-10" : "top-3"} right-3 z-10 ${isFavorite ? "opacity-100 bg-primary text-white border-primary" : "opacity-0 group-hover:opacity-100 bg-white border-gray-200"} transition-all duration-300 rounded-full p-2 shadow-sm hover:scale-110`}
      >
        <Heart size={18} weight={isFavorite ? "fill" : "bold"} />
      </button>

      {/* Info */}
      <div className="p-2 md:p-3 flex flex-col flex-1 border-t border-gray-100">
        <p className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-wider mb-1 truncate">
          {t(`categories.${product.category}`, product.category) as string}
        </p>
        <h3 className="text-xs md:text-sm text-gray-800 line-clamp-2 flex-1 mb-2 leading-snug">
          {displayName}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          {product.oldPrice && (
            <span className="text-[10px] md:text-xs text-gray-400 line-through">
              €{product.oldPrice}
            </span>
          )}
          <span className="text-primary font-bold text-sm md:text-base">
            €{product.price}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`w-full flex items-center justify-center gap-1.5 ${btnClass} text-white text-[10px] md:text-xs font-bold py-2 rounded-sm transition-all disabled:opacity-50`}
        >
          {isAdding ? (
            <span className="flex items-center gap-2 animate-in fade-in">
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {currentLang.startsWith("pt") ? "Adicionado!" : "Prêt !"}
            </span>
          ) : (
            <>
              <ShoppingCart size={14} />
              {currentLang.startsWith("pt") ? "Adicionar" : "Ajouter"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
