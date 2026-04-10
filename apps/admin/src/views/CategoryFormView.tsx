import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CloudArrowUp, 
  Check 
} from '@phosphor-icons/react';
import { setDocument } from '@imexmercado/firebase';

export function CategoryFormView() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: '📂',
    order: '0',
    description: '',
    image: '',
    isActive: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const id = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-');
      const categoryData = {
        ...formData,
        id,
        order: parseInt(formData.order),
        createdAt: new Date().toISOString()
      };
      
      await setDocument('categories', id, categoryData);
      navigate('/categories');
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Erreur lors de la création de la catégorie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-left">
          <button 
            onClick={() => navigate('/categories')}
            className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-all shadow-sm"
          >
            <ArrowLeft size={20} weight="bold" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Nouvelle catégorie</h2>
            <p className="text-sm font-medium text-gray-500">Définissez une nouvelle catégorie pour organiser vos produits.</p>
          </div>
        </div>
        <button 
          form="category-form"
          type="submit"
          disabled={loading}
          className="bg-primary text-white text-xs font-black uppercase tracking-widest px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Check size={18} weight="bold" />
          )}
          Enregistrer
        </button>
      </div>

      <form id="category-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Détails</h3>
            
            <div className="space-y-4 text-left">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5 ml-1">Nom de la catégorie</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="Ex: Électroménager"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5 ml-1">Slug (URL)</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="ex: electromenager"
                  value={formData.slug}
                  onChange={e => setFormData({...formData, slug: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5 ml-1">Description</label>
                <textarea 
                  rows={4}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  placeholder="Courte description de la catégorie..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 text-left">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Apparence</h3>
            
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5 ml-1">Icône (Emoji ou URL)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  value={formData.icon}
                  onChange={e => setFormData({...formData, icon: e.target.value})}
                />
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl border border-gray-100">
                  {formData.icon}
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5 ml-1">Ordre d'affichage</label>
              <input 
                type="number" 
                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                value={formData.order}
                onChange={e => setFormData({...formData, order: e.target.value})}
              />
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4 text-left">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-2">Paramètres</h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <span className="text-xs font-bold text-gray-600">Catégorie active</span>
              <button 
                type="button"
                onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                className={`w-12 h-6 rounded-full relative transition-colors ${formData.isActive ? 'bg-primary' : 'bg-gray-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${formData.isActive ? 'right-1' : 'left-1'} shadow-sm`} />
              </button>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
