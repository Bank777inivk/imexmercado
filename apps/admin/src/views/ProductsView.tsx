import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCollection, deleteDocument, seedProducts } from '@imexmercado/firebase';
import { 
  Package, Plus, MagnifyingGlass, 
  Trash, PencilSimple, DotsThreeVertical,
  CaretLeft, CaretRight, ArrowClockwise
} from '@phosphor-icons/react';

export function ProductsView() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [stockFilter, setStockFilter] = useState('ALL');
  const [optionFilter, setOptionFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(window.innerWidth < 768 ? 10 : 20);

  // Extract unique categories for the filter
  const categories = useMemo(() => {
    const cats = products.map(p => p.category);
    return ['ALL', ...Array.from(new Set(cats))].sort();
  }, [products]);

  // Responsive page size
  useEffect(() => {
    const handleResize = () => setItemsPerPage(window.innerWidth < 768 ? 10 : 20);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getCollection('products');
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, stockFilter, optionFilter]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`⚠️ Êtes-vous sûr de vouloir supprimer le produit "${name}" ? Cette action est irréversible.`)) {
      return;
    }

    try {
      await deleteDocument('products', id);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Erreur lors de la suppression.");
    }
  };

  const filteredProducts = products.filter(p => {
    // 1. Search Filter
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Category Filter
    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;

    // 3. Stock Filter
    let matchesStock = true;
    if (stockFilter === 'IN_STOCK') matchesStock = p.stock > 0;
    if (stockFilter === 'OUT_OF_STOCK') matchesStock = p.stock === 0;
    if (stockFilter === 'LOW_STOCK') matchesStock = p.stock > 0 && p.stock < 5;

    // 4. Option Filter
    let matchesOption = true;
    if (optionFilter === 'PROMO') matchesOption = !!p.oldPrice && p.oldPrice > p.price;
    if (optionFilter === 'NEW') matchesOption = !!p.isNew;
    if (optionFilter === 'FLASH') matchesOption = !!p.isFlashSale;
    if (optionFilter === 'TRENDING') matchesOption = !!p.isTrending;
    if (optionFilter === 'SELECTION') matchesOption = !!p.isSelection;
    if (optionFilter === 'FEATURED') matchesOption = !!p.featured;
    if (optionFilter === 'OFFLINE') matchesOption = p.published === false;

    return matchesSearch && matchesCategory && matchesStock && matchesOption;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-8">
      
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-left">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Catalogue Produits</h2>
          <p className="text-sm font-medium text-gray-500">Gérez vos articles, stocks et prix en un clin d'œil.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={async () => {
              if (window.confirm("🔥 ATTENTION : Vous allez régénérer 350 produits et 100 témoignages. Les IDs existants seront conservés ou écrasés. Continuer ?")) {
                setLoading(true);
                try {
                  await seedProducts();
                  alert("✅ BOMBARDEMENT RÉUSSI ! Les produits et témoignages sont en ligne.");
                  fetchProducts();
                } catch (err) {
                  console.error("Erreur Bombardement :", err);
                  alert("❌ Erreur lors du bombardement. Vérifiez la console pour plus de détails.");
                } finally {
                  setLoading(false);
                }
              }
            }}
            className="flex items-center gap-2 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-6 py-4 rounded-2xl shadow-xl shadow-red-500/20 hover:scale-105 active:scale-95 transition-all"
            title="Réinitialiser et peupler la base de données"
          >
            <ArrowClockwise size={18} weight="bold" className={loading ? 'animate-spin' : ''} />
            Bombardement
          </button>
          
          <button 
            onClick={fetchProducts}
            className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-all shadow-sm"
          >
            <ArrowClockwise size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => navigate('/produits/nouveau')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
          >
            <Plus size={18} weight="bold" />
            Ajouter un produit
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Rechercher un produit..." 
            className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex items-center gap-2 w-full lg:w-auto">
          <select 
            className="bg-gray-50 border-none rounded-2xl py-4 px-3 md:px-6 text-[10px] font-black uppercase tracking-widest text-gray-500 outline-none w-full lg:w-44 appearance-none cursor-pointer"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((cat: string) => (
              <option key={cat} value={cat}>{cat === 'ALL' ? 'Toutes les Catégories' : cat}</option>
            ))}
          </select>
          
          <select 
            className="bg-gray-50 border-none rounded-2xl py-4 px-3 md:px-6 text-[10px] font-black uppercase tracking-widest text-gray-500 outline-none w-full lg:w-44 appearance-none cursor-pointer"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="ALL">Tous les Stocks</option>
            <option value="IN_STOCK">En Stock</option>
            <option value="LOW_STOCK">Stock Faible {"(< 5)"}</option>
            <option value="OUT_OF_STOCK">Rupture</option>
          </select>

          <select 
            className="bg-gray-50 border-none rounded-2xl py-4 px-3 md:px-6 text-[10px] font-black uppercase tracking-widest text-gray-500 outline-none w-full lg:w-44 appearance-none cursor-pointer"
            value={optionFilter}
            onChange={(e) => setOptionFilter(e.target.value)}
          >
            <option value="ALL">Toutes les Options</option>
            <option value="PROMO">En Promotion</option>
            <option value="NEW">Nouveautés</option>
            <option value="FLASH">Offres du Jour</option>
            <option value="TRENDING">Tendances</option>
            <option value="SELECTION">Sélection</option>
            <option value="OFFLINE">Hors Ligne</option>
          </select>
        </div>
      </div>

      {/* Unified Handling of Loading & Empty States */}
      {(loading && products.length === 0) || filteredProducts.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-10 md:p-20 text-center border border-gray-200 shadow-sm animate-in fade-in zoom-in-95 duration-500">
          {loading && products.length === 0 ? (
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Chargement du catalogue...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Package size={48} className="text-gray-200 mb-4" weight="thin" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Aucun produit trouvé</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-transparent md:bg-white md:rounded-[2.5rem] md:border md:border-gray-200 md:shadow-sm overflow-hidden">
          
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Produit</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-left">Catégorie</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-left">Prix</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-left">Stock</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedProducts.map((product) => (
                  <tr key={`table-${product.id}`} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                          <img src={product.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{product.brand || 'No Brand'} • ID: {product.id.substring(0,8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-left">
                      <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-lg uppercase tracking-wider">{product.category}</span>
                    </td>
                    <td className="px-8 py-6 text-left">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <p className="text-sm font-black text-gray-900">{product.price.toFixed(2)}€</p>
                          {product.oldPrice && <p className="text-[10px] text-red-400 line-through font-bold">{product.oldPrice}€</p>}
                        </div>
                        {product.oldPrice && product.oldPrice > product.price && (
                          <span className="bg-red-50 text-red-500 text-[10px] font-black px-2 py-1 rounded-lg border border-red-100 animate-in fade-in zoom-in">
                            -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-left">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-xs font-bold text-gray-600">
                          {product.stock > 0 ? `En stock (${product.stock})` : 'Rupture'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => navigate(`/produits/modifier/${product.id}`)}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-white rounded-xl shadow-sm transition-all border border-transparent hover:border-gray-100"
                        >
                          <PencilSimple size={20} weight="bold" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-xl shadow-sm transition-all border border-transparent hover:border-gray-100"
                        >
                          <Trash size={20} weight="bold" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {paginatedProducts.map((product) => (
              <div key={`card-${product.id}`} className="bg-white p-6 rounded-[2rem] border border-gray-200 shadow-sm space-y-4 active:scale-[0.98] transition-all animate-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shrink-0">
                    <img src={product.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest truncate">{product.category}</span>
                      <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                    </div>
                    <p className="text-sm font-black text-gray-900 mb-1 leading-tight">{product.name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <p className="text-base font-black text-primary">{product.price.toFixed(2)}€</p>
                          {product.oldPrice && <p className="text-[10px] text-gray-400 line-through font-bold">{product.oldPrice}€</p>}
                        </div>
                        {product.oldPrice && product.oldPrice > product.price && (
                          <span className="bg-red-50 text-red-500 text-[9px] font-black px-2 py-1 rounded-lg border border-red-100">
                            -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-lg">Stock: {product.stock}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                  <button 
                    onClick={() => navigate(`/produits/modifier/${product.id}`)}
                    className="flex-1 bg-gray-50 text-gray-900 text-[10px] font-black uppercase tracking-widest py-3.5 rounded-xl border border-gray-100 flex items-center justify-center gap-2 active:bg-gray-100"
                  >
                    <PencilSimple size={16} weight="bold" />
                    Modifier
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id, product.name)}
                    className="aspect-square bg-red-50 text-red-500 p-3.5 rounded-xl border border-red-100 flex items-center justify-center active:bg-red-100"
                  >
                    <Trash size={18} weight="bold" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Affichage de {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredProducts.length)} sur {filteredProducts.length} produits
        </p>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-3 text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-30"
          >
            <CaretLeft size={20} weight="bold" />
          </button>
          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              // Only show limited pages for better UX if many
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
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-3 text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-30"
          >
            <CaretRight size={20} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
}
