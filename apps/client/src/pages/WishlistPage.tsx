import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "@phosphor-icons/react";
import { useWishlist } from "../context/WishlistContext";
import { useTranslation } from "react-i18next";
import { useLocale } from "../hooks/useLocale";

export function WishlistPage() {
  const { toggleWishlist, wishlist } = useWishlist();
  const { t, i18n } = useTranslation(["wishlist"]);
  const { localLink } = useLocale();
  const isFR = (i18n.language || "pt").startsWith("fr");

  return (
    <div className="bg-bg min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter mb-2">
              {t("wishlist:title_main")}{" "}
              <span className="text-primary">{t("wishlist:title_accent")}</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">
              {t("wishlist:items_count", { count: wishlist.length })}
            </p>
          </div>
          <Link
            to="/boutique"
            className="inline-flex items-center gap-2 bg-white border border-gray-100 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all shadow-sm"
          >
            {t("wishlist:continue_shopping")}
          </Link>
        </div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
            {wishlist.map((product: any) => {
              const displayName = isFR
                ? product.nameFR || product.name
                : product.name;
              return (
                <div
                  key={product.id}
                  className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col"
                >
                  <div className="aspect-square relative overflow-hidden bg-gray-50 flex-shrink-0">
                    <img
                      src={product.image}
                      alt={displayName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-xl text-primary shadow-sm hover:bg-primary hover:text-white transition-all group-hover:scale-110"
                    >
                      <Heart size={20} weight="fill" />
                    </button>
                  </div>
                  <div className="p-4 md:p-6 flex flex-col flex-grow text-left">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                      {product.category}
                    </p>
                    <h3 className="text-xs md:text-sm font-bold text-gray-900 line-clamp-2 mb-4 flex-grow">
                      {displayName}
                    </h3>
                    <div className="flex items-center justify-between mt-auto">
                      <p className="font-black text-gray-900 text-sm md:text-base">
                        {product.price?.toFixed(2)}€
                      </p>
                      <Link
                        to={localLink(`/?product=${product.id}`)}
                        className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                      >
                        {t("wishlist:view_product")}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white p-12 md:p-24 rounded-[40px] text-center border border-gray-100 shadow-sm">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart size={48} weight="fill" className="text-gray-200" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-4">
              {t("wishlist:empty_title")}
            </h2>
            <p className="text-gray-400 font-medium mb-10 max-w-md mx-auto leading-relaxed">
              {t("wishlist:empty_desc")}
            </p>
            <Link
              to="/boutique"
              className="inline-block bg-primary text-white text-xs font-black uppercase tracking-widest px-10 py-5 rounded-2xl hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 active:scale-95"
            >
              {t("wishlist:empty_cta")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
