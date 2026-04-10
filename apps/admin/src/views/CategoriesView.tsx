import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCollection } from '@imexmercado/firebase';
import { 
  Layout, Plus, MagnifyingGlass, 
  Trash, PencilSimple, CaretLeft, CaretRight 
} from '@phosphor-icons/react';

export function CategoriesView() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCollection('categories');
        setCategories(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-left">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Gestion des Catégories</h2>
          <p className="text-sm font-medium text-gray-500">Organisez l'architecture de votre boutique.</p>
        </div>
        <button 
          onClick={() => navigate('/categories/nouveau')}
          className="flex items-center justify-center gap-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
        >
          <Plus size={18} weight="bold" />
          Nouvelle catégorie
        </button>
      </div>

      {/* Grid Layout for Categories (More visual than products) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm animate-pulse h-48" />
          ))
        ) : categories.length === 0 ? (
          <div className="col-span-full bg-white p-20 rounded-3xl border border-gray-100 shadow-sm text-center">
            <Layout size={48} className="mx-auto text-gray-200 mb-4" weight="thin" />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Aucune catégorie définie</p>
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md group relative overflow-hidden">
              <div className="flex items-start justify-between relative z-10">
                <div className="flex flex-col gap-4 text-left">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl shadow-sm">
                    {cat.icon?.startsWith('http') ? (
                      <img src={cat.icon} alt="" className="w-8 h-8 object-contain" />
                    ) : (
                      cat.icon || '📂'
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 tracking-tight">{cat.name}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Order: {cat.order || 0} • {cat.productCount || 0} Produits</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <button className="p-2 text-gray-400 hover:text-primary transition-colors hover:bg-gray-50 rounded-xl">
                    <PencilSimple size={20} weight="bold" />
                  </button>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-8 flex items-center justify-between relative z-10">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  cat.isActive !== false ? 'bg-green-50 text-green-500 border-green-100' : 'bg-red-50 text-red-500 border-red-100'
                }`}>
                  {cat.isActive !== false ? 'Actif' : 'Inactif'}
                </span>
                <button className="text-red-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash size={18} weight="bold" />
                </button>
              </div>

              {/* Subtle background icon */}
              <div className="absolute -right-4 -bottom-4 text-gray-50 opacity-10 transform -rotate-12 pointer-events-none">
                <Layout size={120} weight="fill" />
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
