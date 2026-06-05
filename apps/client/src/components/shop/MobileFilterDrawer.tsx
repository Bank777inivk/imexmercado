import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CaretDown, CaretUp, Check, X, Faders } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

const staticCategories = [
  "Téléphones & Hi-Tech",
  "Maison & Décoration",
  "Meubles & Lampes",
  "Bricolage",
  "Barbecues & Planchas",
  "Piscines & Spas",
];

const brands = [
  "Samsung",
  "Apple",
  "IKEA",
  "Bosch",
  "Weber",
  "Intex",
  "Philips",
  "Sony",
  "Herman Miller",
  "Roborock",
];

const colors = [
  { name: "Noir", hex: "#000000" },
  { name: "Blanc", hex: "#FFFFFF", border: true },
  { name: "Gris", hex: "#808080" },
  { name: "Rouge", hex: "#FF0000" },
  { name: "Bleu", hex: "#0000FF" },
  { name: "Vert", hex: "#008000" },
  { name: "Bois", hex: "#DEB887" },
  { name: "Titane", hex: "#A0A0A0" },
];

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeFilters: any;
  onFilterChange: (type: string, value: any) => void;
  sortValue: string;
  onSortChange: (value: string) => void;
  categories?: any[];
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  activeFilters,
  onFilterChange,
  sortValue,
  onSortChange,
  categories,
}: MobileFilterDrawerProps) {
  const { t, i18n } = useTranslation(["shop", "common"]);
  const currentLang = i18n.language || "pt";

  const [expandedSections, setExpandedSections] = useState({
    sort: true,
    categories: true,
    price: false,
    brands: false,
    colors: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev: any) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const categoriesList =
    categories && categories.length > 0 ? categories : staticCategories;

  const getCategoryLabel = (cat: any) => {
    if (typeof cat === "string") return cat;
    let name = currentLang === "pt" ? cat.namePT || cat.name : cat.name;
    if (name === cat.name) {
      name = t(`common:categories.${cat.short || cat.name}`, cat.name);
    }
    return name;
  };

  const getCategoryValue = (cat: any) => {
    return typeof cat === "string" ? cat : cat.name;
  };

  // Prevent background scrolling when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const activeFiltersCount =
    activeFilters.categories.length +
    activeFilters.brands.length +
    activeFilters.colors.length +
    (activeFilters.priceRange.min ? 1 : 0) +
    (activeFilters.priceRange.max ? 1 : 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[80] backdrop-blur-sm lg:hidden"
          />

          {/* Drawer Menu sliding from Bottom */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 h-[85vh] bg-gray-50 rounded-t-3xl z-[90] flex flex-col shadow-2xl lg:hidden"
          >
            {/* Header Sticky */}
            <div className="bg-white p-5 border-b border-gray-100 rounded-t-3xl flex items-center justify-between sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-3">
                <Faders size={24} className="text-gray-900" weight="bold" />
                <h2 className="font-black text-lg uppercase tracking-tight text-gray-900">
                  {t("shop:mobile_filter_btn")}
                </h2>
                {activeFiltersCount > 0 && (
                  <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <X size={16} weight="bold" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28">
              {/* SORTING BLOCK */}
              <div className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
                <button
                  onClick={() => toggleSection("sort")}
                  className="w-full flex items-center justify-between p-4 text-xs font-black uppercase tracking-widest text-gray-900 bg-white"
                >
                  <span className="text-primary flex items-center gap-2">
                    {t("shop:sort.label")} {expandedSections.sort ? "" : "..."}
                  </span>
                  {expandedSections.sort ? (
                    <CaretUp size={16} weight="bold" />
                  ) : (
                    <CaretDown size={16} weight="bold" />
                  )}
                </button>
                {expandedSections.sort && (
                  <div className="p-4 pt-0 space-y-2 border-t border-gray-50">
                    <select
                      value={sortValue}
                      onChange={(e) => onSortChange(e.target.value)}
                      className="w-full text-sm font-bold bg-gray-50 border border-gray-200 rounded-xl p-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer mt-2"
                    >
                      <option value="relevance">🌟 {t("shop:sort.relevance")}</option>
                      <option value="price-asc">
                        💶 {t("shop:sort.price_asc_detailed")}
                      </option>
                      <option value="price-desc">
                        💎 {t("shop:sort.price_desc_detailed")}
                      </option>
                      <option value="newest">🔥 {t("shop:sort.newest_detailed")}</option>
                      <option value="rating">
                        🏆 {t("shop:sort.rating_detailed")}
                      </option>
                    </select>
                  </div>
                )}
              </div>

              {/* CATEGORIES BLOCK */}
              <div className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden mt-6">
                <button
                  onClick={() => toggleSection("categories")}
                  className="w-full flex items-center justify-between p-4 text-xs font-black uppercase tracking-widest text-gray-900"
                >
                  <span>{t("shop:filters.category")}</span>
                  {expandedSections.categories ? (
                    <CaretUp size={16} weight="bold" />
                  ) : (
                    <CaretDown size={16} weight="bold" />
                  )}
                </button>
                {expandedSections.categories && (
                  <div className="p-4 pt-0 space-y-3 border-t border-gray-50">
                    <div className="grid grid-cols-1 gap-2 mt-3">
                      <label className="flex items-center gap-4 cursor-pointer p-3 bg-gray-50 rounded-xl active:scale-95 transition-transform">
                        <input
                          type="checkbox"
                          checked={activeFilters.categories.length === 0}
                          onChange={() => onFilterChange("categories", "all")}
                          className="w-5 h-5 rounded-lg border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm font-black text-gray-900">
                          {t("common:header.all_categories")}
                        </span>
                      </label>
                      <div className="border-t border-gray-100 my-1" />
                      {categoriesList.map((cat) => {
                        const val = getCategoryValue(cat);
                        const label = getCategoryLabel(cat);
                        return (
                          <label
                            key={val}
                            className="flex items-center gap-4 cursor-pointer p-3 bg-gray-50 rounded-xl active:scale-95 transition-transform"
                          >
                            <input
                              type="checkbox"
                              checked={activeFilters.categories.includes(val)}
                              onChange={() => onFilterChange("categories", val)}
                              className="w-5 h-5 rounded-lg border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="text-sm font-bold text-gray-800">
                              {label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* MARQUES BLOCK */}
              <div className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
                <button
                  onClick={() => toggleSection("brands")}
                  className="w-full flex items-center justify-between p-4 text-xs font-black uppercase tracking-widest text-gray-900"
                >
                  <span>{t("shop:filters.brand")}</span>
                  {expandedSections.brands ? (
                    <CaretUp size={16} weight="bold" />
                  ) : (
                    <CaretDown size={16} weight="bold" />
                  )}
                </button>
                {expandedSections.brands && (
                  <div className="p-4 pt-2 border-t border-gray-50 grid grid-cols-2 gap-2 mt-2">
                    {brands.map((brand) => (
                      <label
                        key={brand}
                        className="flex items-center gap-3 cursor-pointer p-2 bg-gray-50 rounded-lg active:scale-95 transition-transform"
                      >
                        <input
                          type="checkbox"
                          checked={activeFilters.brands.includes(brand)}
                          onChange={() => onFilterChange("brands", brand)}
                          className="w-4 h-4 rounded border-gray-300 text-primary"
                        />
                        <span className="text-xs font-bold text-gray-700">
                          {brand}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* PRIX BLOCK */}
              <div className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
                <button
                  onClick={() => toggleSection("price")}
                  className="w-full flex items-center justify-between p-4 text-xs font-black uppercase tracking-widest text-gray-900"
                >
                  <span>{t("shop:filters.price")}</span>
                  {expandedSections.price ? (
                    <CaretUp size={16} weight="bold" />
                  ) : (
                    <CaretDown size={16} weight="bold" />
                  )}
                </button>
                {expandedSections.price && (
                  <div className="p-4 pt-2 border-t border-gray-50 mt-2 flex gap-4">
                    <div className="flex-1 space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase">
                        {t("shop:filters.min")}
                      </label>
                      <input
                        type="number"
                        placeholder="Ex: 50"
                        value={activeFilters.priceRange.min}
                        onChange={(e) =>
                          onFilterChange("priceMin", e.target.value)
                        }
                        className="w-full text-sm font-bold p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary outline-none"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase">
                        {t("shop:filters.max")}
                      </label>
                      <input
                        type="number"
                        placeholder="Ex: 500"
                        value={activeFilters.priceRange.max}
                        onChange={(e) =>
                          onFilterChange("priceMax", e.target.value)
                        }
                        className="w-full text-sm font-bold p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* COULEURS BLOCK */}
              <div className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
                <button
                  onClick={() => toggleSection("colors")}
                  className="w-full flex items-center justify-between p-4 text-xs font-black uppercase tracking-widest text-gray-900"
                >
                  <span>{t("shop:filters.color")}</span>
                  {expandedSections.colors ? (
                    <CaretUp size={16} weight="bold" />
                  ) : (
                    <CaretDown size={16} weight="bold" />
                  )}
                </button>
                {expandedSections.colors && (
                  <div className="p-4 pt-2 border-t border-gray-50 mt-2 grid grid-cols-4 gap-4">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => onFilterChange("colors", color.name)}
                        className={`w-12 h-12 mx-auto rounded-full border-2 transition-all flex items-center justify-center active:scale-95 shadow-sm
                          ${activeFilters.colors.includes(color.name) ? "border-primary ring-2 ring-primary/30 ring-offset-2" : color.border ? "border-gray-200" : "border-transparent"}
                        `}
                        style={{ backgroundColor: color.hex }}
                      >
                        {activeFilters.colors.includes(color.name) && (
                          <Check
                            size={18}
                            weight="bold"
                            className={
                              color.name === "Blanc"
                                ? "text-black"
                                : "text-white"
                            }
                          />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Bottom Bar for Validation */}
            <div className="bg-white p-4 border-t border-gray-100 absolute bottom-0 left-0 right-0 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
              <button
                onClick={onClose}
                className="w-full bg-gray-900 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg hover:bg-black transition-all active:scale-95 text-xs"
              >
                {t("shop:view_results")}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
