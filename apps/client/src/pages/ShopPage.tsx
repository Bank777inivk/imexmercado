import React, { useState, useMemo, useEffect } from "react";
import { FilterSidebar } from "../components/shop/FilterSidebar";
import { MobileFilterDrawer } from "../components/shop/MobileFilterDrawer";
import { ShopHeader } from "../components/shop/ShopHeader";
import { ProductCard } from "../components/home/ProductCard";
import { ProductModal } from "../components/shop/ProductModal";
import { useParams, useSearchParams } from "react-router-dom";
import {
  subscribeToCollection,
  seedProducts,
  subscribeToDocument,
} from "@imexmercado/firebase";
import { useSEO } from "../hooks/useSEO";
import { useTranslation } from "react-i18next";

interface Filters {
  categories: string[];
  priceRange: { min: string; max: string };
  brands: string[];
  colors: string[];
}

const CATEGORY_MAP: Record<string, string> = {
  hitech: "Téléphones & Hi-Tech",
  maison: "Maison & Décoration",
  meubles: "Meubles & Lampes",
  bricolage: "Bricolage",
  jardin: "Barbecues & Planchas",
  loisirs: "Piscines & Spas",
};

export function ShopPage() {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const promoFilter = searchParams.get("filter") === "promo";
  const newFilter = searchParams.get("filter") === "new";
  const { t, i18n } = useTranslation(["shop"]);
  const isFR = (i18n.language || "pt").startsWith("fr");

  const [categoriesList, setCategoriesList] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToCollection("categories", (data) => {
      const uniqueCats: any[] = [];
      const seenNames = new Set<string>();
      data.forEach((cat) => {
        if (cat.name) {
          const cleanName = cat.name.trim();
          if (!seenNames.has(cleanName.toLowerCase())) {
            seenNames.add(cleanName.toLowerCase());
            uniqueCats.push(cat);
          }
        }
      });
      setCategoriesList(
        uniqueCats.sort((a, b) => (a.order || 0) - (b.order || 0)),
      );
    });
    return () => unsubscribe();
  }, []);

  // Resolve actual category name from slug or query param
  const activeCategory = useMemo(() => {
    const queryCat = searchParams.get("category");
    if (!queryCat && !categorySlug) return null;
    const term =
      queryCat ||
      (categorySlug
        ? CATEGORY_MAP[categorySlug.toLowerCase()] ||
          decodeURIComponent(categorySlug)
        : "");
    if (!term) return null;

    // Search in categories list
    const found = categoriesList.find(
      (cat) =>
        cat.name?.toLowerCase() === term.toLowerCase() ||
        cat.namePT?.toLowerCase() === term.toLowerCase() ||
        cat.short?.toLowerCase() === term.toLowerCase() ||
        cat.shortPT?.toLowerCase() === term.toLowerCase() ||
        (term.length >= 4 && (
          cat.name?.toLowerCase().includes(term.toLowerCase()) ||
          cat.namePT?.toLowerCase().includes(term.toLowerCase())
        ))
    );
    return found ? found.name : term;
  }, [categorySlug, searchParams, categoriesList]);

  // State
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inventoryConfig, setInventoryConfig] = useState<any>({
    lowStockThreshold: 5,
    hideOutOfStock: false,
  });

  useEffect(() => {
    const unsubscribe = subscribeToDocument("settings", "inventory", (data) => {
      if (data) setInventoryConfig(data);
    });
    return () => unsubscribe();
  }, []);

  const [activeFilters, setActiveFilters] = useState<Filters>({
    categories: activeCategory ? [activeCategory] : [],
    priceRange: { min: "", max: "" },
    brands: [],
    colors: [],
  });

  const [sortValue, setSortValue] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const productParam = searchParams.get("product");

  const manualSEO = useMemo(() => {
    if (isModalOpen && selectedProduct) {
      return {
        title: selectedProduct.metaTitle || selectedProduct.name,
        description:
          selectedProduct.metaDescription ||
          selectedProduct.description?.substring(0, 160) ||
          "",
        image: selectedProduct.image,
        type: "product",
      };
    }
    return undefined;
  }, [isModalOpen, selectedProduct]);

  useSEO("shop", manualSEO);

  // Listen to product query param to open modal
  useEffect(() => {
    if (!productParam || products.length === 0) return;
    const prod = products.find((p) => p.id === productParam);
    if (prod) {
      setSelectedProduct(prod);
      setIsModalOpen(true);
    }
  }, [productParam, products]);

  // Handle URL cleanup on close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("product");
    setSearchParams(newParams, { replace: true });
  };

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(
    window.innerWidth < 1024 ? 12 : 20,
  );

  // Responsive page size listener
  useEffect(() => {
    const handleResize = () =>
      setItemsPerPage(window.innerWidth < 1024 ? 12 : 20);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Reset to page 1 when any filter or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilters, sortValue, promoFilter, newFilter, categorySlug, searchParams]);

  const handleViewDetails = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("product", product.id);
    setSearchParams(newParams, { replace: true });
  };

  // Derive active filters count
  const activeFiltersCount = useMemo(() => {
    return (
      activeFilters.categories.length +
      activeFilters.brands.length +
      activeFilters.colors.length +
      (activeFilters.priceRange.min ? 1 : 0) +
      (activeFilters.priceRange.max ? 1 : 0)
    );
  }, [activeFilters]);

  // Effect to update filters when slug or query param changes
  useEffect(() => {
    if (activeCategory) {
      setActiveFilters((prev) => ({ ...prev, categories: [activeCategory] }));
    } else if (!categorySlug && !searchParams.get("category")) {
      setActiveFilters((prev) => ({ ...prev, categories: [] }));
    }
  }, [activeCategory, categorySlug, searchParams]);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToCollection("products", async (data) => {
      if (data.length === 0) {
        console.log("🛠️ Aucun produit trouvé en base. Lancement du seeding...");
        try {
          await seedProducts();
          console.log("✅ Seeding terminé avec succès !");
        } catch (seedError) {
          console.error("❌ Échec du seeding :", seedError);
        }
      }
      setProducts(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleFilterChange = (type: string, value: any) => {
    setActiveFilters((prev: any) => {
      const next = { ...prev };
      if (type === "categories") {
        if (value === "all") {
          next.categories = [];
        } else {
          next.categories = prev.categories.includes(value)
            ? prev.categories.filter((c: string) => c !== value)
            : [...prev.categories, value];
        }
      } else if (type === "brands") {
        next.brands = prev.brands.includes(value)
          ? prev.brands.filter((b: string) => b !== value)
          : [...prev.brands, value];
      } else if (type === "colors") {
        next.colors = prev.colors.includes(value)
          ? prev.colors.filter((c: string) => c !== value)
          : [...prev.colors, value];
      } else if (type === "priceMin") {
        next.priceRange.min = value;
      } else if (type === "priceMax") {
        next.priceRange.max = value;
      }
      return { ...next };
    });
  };

  // Logic: Filtering & Sorting
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (inventoryConfig?.hideOutOfStock) {
      result = result.filter((p) => p.stock > 0);
    }

    if (promoFilter) {
      result = result.filter(
        (p) =>
          p.oldPrice &&
          Number(p.oldPrice) > 0 &&
          Number(p.oldPrice) > Number(p.price),
      );
    }

    if (newFilter) {
      result = result.filter((p) => p.isNew);
    }

    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      result = result.filter((p) =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (activeFilters.categories.length > 0) {
      result = result.filter((p) =>
        activeFilters.categories.includes(p.category),
      );
    }

    if (activeFilters.brands.length > 0) {
      result = result.filter((p) => activeFilters.brands.includes(p.brand));
    }

    if (activeFilters.priceRange.min) {
      result = result.filter(
        (p) => p.price >= Number(activeFilters.priceRange.min),
      );
    }

    if (activeFilters.priceRange.max) {
      result = result.filter(
        (p) => p.price <= Number(activeFilters.priceRange.max),
      );
    }

    if (sortValue === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortValue === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sortValue === "rating") result.sort((a, b) => b.rating - a.rating);
    if (sortValue === "newest")
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));

    return result;
  }, [products, activeFilters, sortValue, promoFilter, newFilter, inventoryConfig]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-screen">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              categories={categoriesList}
            />
          </div>

          <div className="flex-1 min-w-0 w-full">
            <ShopHeader
              totalResults={filteredProducts.length}
              sortValue={sortValue}
              onSortChange={setSortValue}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onMobileFilterClick={() => setIsMobileFilterOpen(true)}
              activeFiltersCount={activeFiltersCount}
            />

            {filteredProducts.length > 0 ? (
              <>
                <div
                  className={`grid gap-3 md:gap-6 ${
                    viewMode === "grid"
                      ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1"
                  }`}
                >
                  {paginatedProducts.map((product, idx) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={idx}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      {t("shop:pagination_showing", {
                        start: startIndex + 1,
                        end: Math.min(
                          startIndex + itemsPerPage,
                          filteredProducts.length,
                        ),
                        total: filteredProducts.length,
                      })}
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentPage === 1}
                        className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl text-gray-400 hover:text-primary disabled:opacity-30 transition-all border border-transparent hover:border-gray-100"
                      >
                        ←
                      </button>

                      <div className="flex items-center gap-1">
                        {[...Array(totalPages)].map((_, i) => {
                          const page = i + 1;
                          if (
                            totalPages > 5 &&
                            Math.abs(page - currentPage) > 2 &&
                            page !== 1 &&
                            page !== totalPages
                          ) {
                            if (Math.abs(page - currentPage) === 3)
                              return (
                                <span key={page} className="text-gray-300">
                                  ...
                                </span>
                              );
                            return null;
                          }
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${currentPage === page ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
                            >
                              {page}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1),
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl text-gray-400 hover:text-primary disabled:opacity-30 transition-all border border-transparent hover:border-gray-100"
                      >
                        →
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white p-10 md:p-20 border border-gray-100 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
                <div className="text-4xl md:text-6xl mb-6 opacity-20">🔎</div>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase">
                  {t("shop:no_products")}
                </h2>
                <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                  {t("shop:no_products_desc")}
                </p>
                <button
                  onClick={() => {
                    setActiveFilters({
                      categories: [],
                      priceRange: { min: "", max: "" },
                      brands: [],
                      colors: [],
                    });
                    setSortValue("relevance");
                  }}
                  className="mt-8 px-8 py-3 text-xs bg-gray-900 text-white font-black uppercase tracking-widest rounded-xl shadow-lg hover:bg-black transition-all"
                >
                  {t("shop:filters.reset")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        sortValue={sortValue}
        onSortChange={setSortValue}
        categories={categoriesList}
      />

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
