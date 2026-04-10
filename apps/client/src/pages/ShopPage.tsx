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

  // Resolve actual category name from slug or query param
  const activeCategory = useMemo(() => {
    const queryCat = searchParams.get('category');
    if (queryCat) return queryCat;
    if (!categorySlug) return null;
    return CATEGORY_MAP[categorySlug.toLowerCase()] || decodeURIComponent(categorySlug);
  }, [categorySlug, searchParams]);

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
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(window.innerWidth < 1024 ? 12 : 20);

  // Responsive page size listener
  useEffect(() => {
    const handleResize = () => setItemsPerPage(window.innerWidth < 1024 ? 12 : 20);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Reset to page 1 when any filter or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilters, sortValue, promoFilter, categorySlug, searchParams]);

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

  // Effect to update filters when slug or query param changes
  useEffect(() => {
    if (activeCategory) {
      setActiveFilters(prev => ({ ...prev, categories: [activeCategory] }));
    } else if (!categorySlug && !searchParams.get('category')) {
      setActiveFilters(prev => ({ ...prev, categories: [] }));
    }
  }, [activeCategory, categorySlug, searchParams]);

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
      result = result.filter(p => p.oldPrice && p.oldPrice > p.price);
    }

    if (activeFilters.categories.length > 0) {
      result = result.filter(p => activeFilters.categories.includes(p.category));
    }

    if (activeFilters.brands.length > 0) {
      result = result.filter(p => activeFilters.brands.includes(p.brand));
    }

    if (activeFilters.priceRange.min) {
      result = result.filter(p => p.price >= Number(activeFilters.priceRange.min));
    }

    if (activeFilters.priceRange.max) {
      result = result.filter(p => p.price <= Number(activeFilters.priceRange.max));
    }

    if (sortValue === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sortValue === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sortValue === 'rating') result.sort((a, b) => b.rating - a.rating);
    if (sortValue === 'newest') result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));

    return result;
  }, [products, activeFilters, sortValue, promoFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

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
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          <div className="hidden lg:block w-64 flex-shrink-0">
             <FilterSidebar 
               activeFilters={activeFilters} 
               onFilterChange={handleFilterChange} 
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
                <div className={`grid gap-3 md:gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}>
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
                      Affichage de {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredProducts.length)} sur {filteredProducts.length} produits
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl text-gray-400 hover:text-primary disabled:opacity-30 transition-all border border-transparent hover:border-gray-100"
                      >
                        ←
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {[...Array(totalPages)].map((_, i) => {
                          const page = i + 1;
                          if (totalPages > 5 && Math.abs(page - currentPage) > 2 && page !== 1 && page !== totalPages) {
                             if (Math.abs(page - currentPage) === 3) return <span key={page} className="text-gray-300">...</span>;
                             return null;
                          }
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${currentPage === page ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                            >
                              {page}
                            </button>
                          );
                        })}
                      </div>

                      <button 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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

      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        sortValue={sortValue}
        onSortChange={setSortValue}
      />

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
