import React, { useState, useMemo, useEffect } from 'react';
import { FilterSidebar } from '../components/shop/FilterSidebar';
import { MobileFilterDrawer } from '../components/shop/MobileFilterDrawer';
import { ShopHeader } from '../components/shop/ShopHeader';
import { ProductCard } from '../components/home/ProductCard';
import { ProductModal } from '../components/shop/ProductModal';
import { useParams, useSearchParams } from 'react-router-dom';
import { getCollection, seedProducts } from '@imexmercado/firebase';

interface Filters {
  categories: string[];
  priceRange: { min: string; max: string };
  brands: string[];
  colors: string[];
}

const CATEGORY_MAP: Record<string, string> = {
  'hitech': 'Téléphones & Hi-Tech',
  'maison': 'Maison & Décoration',
  'meubles': 'Meubles & Lampes',
  'bricolage': 'Bricolage',
  'jardin': 'Barbecues & Planchas',
  'loisirs': 'Piscines & Spas'
};

export function ShopPage() {
  const { categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const promoFilter = searchParams.get('filter') === 'promo';

  // Resolve actual category name from slug
  const activeCategory = useMemo(() => {
    if (!categorySlug) return null;
    return CATEGORY_MAP[categorySlug.toLowerCase()] || decodeURIComponent(categorySlug);
  }, [categorySlug]);

  // State
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<Filters>({
    categories: activeCategory ? [activeCategory] : [],
    priceRange: { min: '', max: '' },
    brands: [],
    colors: [],
  });

  const [sortValue, setSortValue] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Derive active filters count
  const activeFiltersCount = useMemo(() => {
    return activeFilters.categories.length + 
           activeFilters.brands.length + 
           activeFilters.colors.length + 
           (activeFilters.priceRange.min ? 1 : 0) + 
           (activeFilters.priceRange.max ? 1 : 0);
  }, [activeFilters]);

  // Effect to update filters when slug changes
  useEffect(() => {
    if (activeCategory) {
      setActiveFilters(prev => ({ ...prev, categories: [activeCategory] }));
    } else if (!categorySlug) {
      setActiveFilters(prev => ({ ...prev, categories: [] }));
    }
  }, [activeCategory, categorySlug]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        let data = await getCollection('products');
        
        if (data.length === 0) {
          console.log("🛠️ Aucun produit trouvé en base. Lancement du seeding...");
          try {
            await seedProducts();
            console.log("✅ Seeding terminé avec succès !");
            data = await getCollection('products');
          } catch (seedError) {
            console.error("❌ Échec du seeding :", seedError);
            throw seedError;
          }
        }
        
        // Search query filter (if any)
        const query = searchParams.get('search');
        if (query) {
           data = data.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
        }

        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [searchParams]);

  const handleFilterChange = (type: string, value: any) => {
    setActiveFilters((prev: any) => {
      const next = { ...prev };
      if (type === 'categories') {
        next.categories = prev.categories.includes(value)
          ? prev.categories.filter((c: string) => c !== value)
          : [...prev.categories, value];
      } else if (type === 'brands') {
        next.brands = prev.brands.includes(value)
          ? prev.brands.filter((b: string) => b !== value)
          : [...prev.brands, value];
      } else if (type === 'colors') {
        next.colors = prev.colors.includes(value)
          ? prev.colors.filter((c: string) => c !== value)
          : [...prev.colors, value];
      } else if (type === 'priceMin') {
        next.priceRange.min = value;
      } else if (type === 'priceMax') {
        next.priceRange.max = value;
      }
      return { ...next };
    });
  };

  // Logic: Filtering & Sorting
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (promoFilter) {
      result = result.filter(p => p.badge);
    }

    if (activeFilters.categories.length > 0) {
      result = result.filter(p => activeFilters.categories.includes(p.category));
    }

    if (activeFilters.brands.length > 0) {
      result = result.filter(p => activeFilters.brands.includes(p.brand));
    }

    if (activeFilters.colors.length > 0) {
      result = result.filter(p => activeFilters.colors.includes(p.color));
    }

    if (activeFilters.priceRange.min) {
      result = result.filter(p => p.price >= Number(activeFilters.priceRange.min));
    }

    if (activeFilters.priceRange.max) {
      result = result.filter(p => p.price <= Number(activeFilters.priceRange.max));
    }

    // Sort
    if (sortValue === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sortValue === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sortValue === 'rating') result.sort((a, b) => b.rating - a.rating);
    if (sortValue === 'newest') result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));

    return result;
  }, [products, activeFilters, sortValue, promoFilter]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Chargement de la boutique...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-screen">
      <div className="container mx-auto px-4 py-4 md:py-8">
        
        {/* Layout: Sidebar + Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Sidebar (Hidden on Mobile) */}
          <div className="hidden lg:block w-64 flex-shrink-0">
             <FilterSidebar 
               activeFilters={activeFilters} 
               onFilterChange={handleFilterChange} 
             />
          </div>

          {/* Main Column */}
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
              <div className={`grid gap-3 md:gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product, idx) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={idx}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white p-10 md:p-20 border border-gray-100 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
                <div className="text-4xl md:text-6xl mb-6 opacity-20">🔎</div>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase">Aucun produit trouvé</h2>
                <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                  Nous n'avons trouvé aucun article correspondant à vos critères de recherche.
                </p>
                <button 
                  onClick={() => {
                    setActiveFilters({ categories: [], priceRange: { min: '', max: '' }, brands: [], colors: [] });
                    setSortValue('relevance');
                  }}
                  className="mt-8 px-8 py-3 text-xs bg-gray-900 text-white font-black uppercase tracking-widest rounded-xl shadow-lg hover:bg-black transition-all"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
            
          </div>
        </div>
      </div>

      {/* Mobile Exclusives */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        sortValue={sortValue}
        onSortChange={setSortValue}
      />

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
