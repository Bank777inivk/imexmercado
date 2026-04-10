import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCollection } from '@imexmercado/firebase';
import { 
  Layout, Plus, MagnifyingGlass, 
  Trash, PencilSimple, CaretLeft, CaretRight,
  ArrowClockwise
} from '@phosphor-icons/react';

export function CategoriesView() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCollection('categories');
      setCategories(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="space-y-6 md:space-y-10">
      
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-left">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Catégories</h2>
          <p className="text-sm font-medium text-gray-500">Structurez votre navigation boutique.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchCategories}
            className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-all shadow-sm active:scale-90"
          >
            <ArrowClockwise size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => navigate('/categories/nouveau')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform active:scale-95"
          >
            <Plus size={18} weight="bold" />
            Nouveau
          </button>
        </div>
      </div>

      {/* Grid Layout for Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
        {loading && categories.length === 0 ? (
          [1, 2, 3].map(i => (
            <div key={`loading-${i}`} className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm animate-pulse h-48" />
          ))
        ) : categories.length === 0 ? (
          <div className="col-span-full bg-white p-20 rounded-[2.5rem] border border-gray-200 shadow-sm text-center">
            <Layout size={48} className="mx-auto text-gray-200 mb-4" weight="thin" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {loading ? "Chargement..." : "Aucune catégorie trouvée ou accès restreint"}
            </p>
          </div>
        ) : (
          categories.map((cat) => (
            <div key={`cat-${cat.id}`} className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-200 shadow-sm transition-all hover:shadow-xl hover:border-primary/10 group relative overflow-hidden">
              <div className="flex items-start justify-between relative z-10">
                <div className="flex flex-col gap-4 text-left">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-gray-100 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                    {cat.icon?.startsWith('http') ? (
                      <img src={cat.icon} alt="" className="w-8 h-8 object-contain" />
                    ) : (
                      cat.icon || '📂'
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 tracking-tight">{cat.name}</h3>
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-1">
                      Ordre: {cat.order || 0} • {cat.productCount || 0} Articles
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <button className="p-3 bg-gray-50 text-gray-400 hover:text-primary transition-all hover:bg-primary/10 rounded-xl active:scale-90">
                    <PencilSimple size={20} weight="bold" />
                  </button>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-8 flex items-center justify-between relative z-10 pt-6 border-t border-gray-50">
                <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                  cat.isActive !== false ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                }`}>
                  {cat.isActive !== false ? 'En ligne' : 'Masqué'}
                </span>
                <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-90 md:opacity-0 md:group-hover:opacity-100">
                  <Trash size={18} weight="bold" />
                </button>
              </div>

              {/* Subtle background icon */}
              <div className="absolute -right-6 -bottom-6 text-gray-50 opacity-10 group-hover:text-primary/5 group-hover:opacity-100 transition-colors duration-700 transform -rotate-12 pointer-events-none">
                <Layout size={140} weight="fill" />
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
