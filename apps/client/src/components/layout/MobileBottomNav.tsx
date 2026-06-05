import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  House,
  MagnifyingGlass,
  ShoppingCart,
  User,
  Heart,
} from "@phosphor-icons/react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useLocale } from "../../hooks/useLocale";
import { useTranslation } from "react-i18next";

export function MobileBottomNav() {
  const location = useLocation();
  const { totalItems, isDrawerOpen, setDrawerOpen } = useCart();
  const { wishlist } = useWishlist();
  const { localLink } = useLocale();
  const { t } = useTranslation();

  const isActive = (path: string) => location.pathname === localLink(path);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[60] px-6 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
      <div className="flex justify-between items-center">
        {/* Accueil */}
        <Link
          to={localLink("/")}
          className={`flex flex-col items-center justify-center w-16 h-12 transition-colors ${isActive("/") ? "text-primary" : "text-gray-400 hover:text-gray-900"}`}
        >
          <House size={26} weight={isActive("/") ? "fill" : "regular"} />
          <span className="text-[9px] font-black uppercase tracking-tight mt-1">
            {t("nav.home")}
          </span>
        </Link>

        {/* Boutique (Search) */}
        <Link
          to={localLink("/boutique")}
          className={`flex flex-col items-center justify-center w-16 h-12 transition-colors ${isActive("/boutique") ? "text-primary" : "text-gray-400 hover:text-gray-900"}`}
        >
          <MagnifyingGlass
            size={26}
            weight={isActive("/boutique") ? "fill" : "regular"}
          />
          <span className="text-[9px] font-black uppercase tracking-tight mt-1">
            {t("nav.shop")}
          </span>
        </Link>

        {/* Panier */}
        <button
          onClick={() => setDrawerOpen(true)}
          className={`flex flex-col items-center justify-center w-16 h-12 transition-colors relative ${isDrawerOpen ? "text-primary" : "text-gray-400 hover:text-gray-900"}`}
        >
          <div className="relative">
            <ShoppingCart
              size={26}
              weight={isDrawerOpen ? "fill" : "regular"}
            />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-primary text-white text-[9px] font-black h-4 w-4 flex items-center justify-center rounded-full ring-2 ring-white shadow-sm">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[9px] font-black uppercase tracking-tight mt-1">
            {t("header.cart")}
          </span>
        </button>

        {/* Favoris */}
        <Link
          to={localLink("/favoris")}
          className={`flex flex-col items-center justify-center w-16 h-12 transition-colors relative ${isActive("/favoris") ? "text-primary" : "text-gray-400 hover:text-gray-900"}`}
        >
          <div className="relative">
            <Heart
              size={26}
              weight={isActive("/favoris") ? "fill" : "regular"}
            />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-primary text-white text-[9px] font-black h-4 w-4 flex items-center justify-center rounded-full ring-2 ring-white shadow-sm">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[9px] font-black uppercase tracking-tight mt-1">
            {t("header.favorites")}
          </span>
        </Link>

        {/* Compte */}
        <Link
          to={localLink("/compte")}
          className={`flex flex-col items-center justify-center w-16 h-12 transition-colors ${isActive("/compte") || isActive("/connexion") || isActive("/inscription") ? "text-primary" : "text-gray-400 hover:text-gray-900"}`}
        >
          <User size={26} weight={isActive("/compte") ? "fill" : "regular"} />
          <span className="text-[9px] font-black uppercase tracking-tight mt-1">
            {t("header.my_account")}
          </span>
        </Link>
      </div>
    </nav>
  );
}
