import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, CloudArrowUp, 
  Trash, Plus, Check, Info 
} from '@phosphor-icons/react';
import { setDocument, getDocument, updateDocument } from '@imexmercado/firebase';

export function ProductFormView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    price: '',
    oldPrice: '',
    stock: '10',
    description: '',
    image: 'https://placehold.co/600x600/f5f5f5/999?text=Image+Produit',
    isNew: false,
    featured: false,
    published: true
  });

  const categories = [
    'Téléphones & Hi-Tech',
    'Maison & Décoration',
    'Meubles & Lampes',
    'Bricolage',
    'Barbecues & Planchas',
    'Piscines & Spas'
  ];

  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const data = await getDocument('products', id!);
          if (data) {
            setFormData({
              name: data.name || '',
              category: data.category || '',
              brand: data.brand || '',
              price: data.price?.toString() || '',
              oldPrice: data.oldPrice?.toString() || '',
              stock: data.stock?.toString() || '0',
              description: data.description || '',
              image: data.image || '',
              isNew: data.isNew || false,
              featured: data.featured || false,
              published: data.published !== false 
            });
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        } finally {
          setInitialLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const productId = isEdit ? id : 'p' + Math.floor(Math.random() * 1000000);
      const productData = {
        ...formData,
        id: productId,
        price: parseFloat(formData.price),
        oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
        stock: parseInt(formData.stock),
        updatedAt: new Date().toISOString()
      };

      if (!isEdit) {
        (productData as any).createdAt = new Date().toISOString();
        (productData as any).rating = 5.0;
        await setDocument('products', productId!, productData);
      } else {
        await updateDocument('products', id!, productData);
      }
      
      navigate('/produits');
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Erreur lors de l'enregistrement du produit.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Chargement des données...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-left">
          <button 
            onClick={() => navigate('/produits')}
            className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-all shadow-sm"
          >
            <ArrowLeft size={20} weight="bold" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              {isEdit ? 'Modifier le produit' : 'Ajouter un produit'}
            </h2>
            <p className="text-sm font-medium text-gray-500">
              {isEdit ? `ID: ${id?.substring(0,8)}` : 'Remplissez les informations pour publier un nouvel article.'}
            </p>
          </div>
        </div>
        <button 
          form="product-form"
          type="submit"
          disabled={loading}
          className="bg-primary text-white text-xs font-black uppercase tracking-widest px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Check size={18} weight="bold" />
          )}
          {isEdit ? 'Enregistrer les modifications' : 'Publier le produit'}
        </button>
      </div>

      <form id="product-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 text-left">Informations Générales</h3>
            
            <div className="space-y-4 text-left">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5 ml-1">Nom du produit</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="Ex: Samsung Galaxy S24 Ultra"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5 ml-1">Catégorie</label>
                  <select 
                    required
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">Sélectionner...</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5 ml-1">Marque</label>
                  <input 
                    type="text" 
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="Ex: Apple, Samsung..."
                    value={formData.brand}
                    onChange={e => setFormData({...formData, brand: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5 ml-1">Description</label>
                <textarea 
                  rows={6}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  placeholder="Décrivez les caractéristiques du produit..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 text-left">Prix & Stocks</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5 ml-1">Prix de vente (€)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5 ml-1">Ancien Prix (Promo)</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="0.00"
                  value={formData.oldPrice}
                  onChange={e => setFormData({...formData, oldPrice: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5 ml-1">Stock Actuel</label>
                <input 
                  type="number" 
                  required
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="0"
                  value={formData.stock}
                  onChange={e => setFormData({...formData, stock: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Image & Status */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 text-left">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Image Principale</h3>
            
            <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-4 relative group">
              <img src={formData.image} alt="Preview" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <CloudArrowUp size={32} className="text-primary mb-2" />
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">Changer l'image</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1">URL de l'image</label>
              <input 
                type="text" 
                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-xs font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="https://..."
                value={formData.image}
                onChange={e => setFormData({...formData, image: e.target.value})}
              />
              <p className="text-[10px] text-gray-400 font-medium px-2 italic">Note: Utilisez une URL d'image existante pour vos tests.</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4 text-left">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-2">Options & Visibilité</h3>
            
            <button 
              type="button"
              onClick={() => setFormData({...formData, published: !formData.published})}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${formData.published ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'}`}
            >
              <span className="text-xs font-bold uppercase tracking-widest">En Ligne</span>
              <div className={`w-12 h-6 rounded-full relative transition-all ${formData.published ? 'bg-green-500' : 'bg-gray-200'}`}>
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all ${formData.published ? 'right-1' : 'left-1'}`} />
              </div>
            </button>

            <button 
              type="button"
              onClick={() => setFormData({...formData, featured: !formData.featured})}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${formData.featured ? 'bg-primary/5 text-primary' : 'bg-gray-50 text-gray-400'}`}
            >
              <span className="text-xs font-bold uppercase tracking-widest">Mettre en avant</span>
              <div className={`w-12 h-6 rounded-full relative transition-all ${formData.featured ? 'bg-primary' : 'bg-gray-200'}`}>
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all ${formData.featured ? 'right-1' : 'left-1'}`} />
              </div>
            </button>

            <button 
              type="button"
              onClick={() => setFormData({...formData, isNew: !formData.isNew})}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${formData.isNew ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'}`}
            >
              <span className="text-xs font-bold uppercase tracking-widest">Badges "Nouveau"</span>
              <div className={`w-12 h-6 rounded-full relative transition-all ${formData.isNew ? 'bg-blue-500' : 'bg-gray-200'}`}>
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all ${formData.isNew ? 'right-1' : 'left-1'}`} />
              </div>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
