import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Check, Plus, Trash, Tag, ListBullets, X
} from '@phosphor-icons/react';
import { setDocument, getDocument, updateDocument } from '@imexmercado/firebase';
import { CloudinaryUploader } from '../components/CloudinaryUploader';

const CATEGORIES = [
  'Téléphones & Hi-Tech',
  'Maison & Décoration',
  'Meubles & Lampes',
  'Bricolage',
  'Barbecues & Planchas',
  'Piscines & Spas',
];

interface Spec {
  key: string;
  value: string;
}

export function ProductFormView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [tagInput, setTagInput] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    price: '',
    oldPrice: '',
    stock: '10',
    description: '',
    image: '',
    images: [] as string[],
    tags: [] as string[],
    specs: [] as Spec[],
    isNew: false,
    featured: false,
    isFlashSale: false,
    isTrending: false,
    isSelection: false,
    published: true,
  });

  useEffect(() => {
    if (isEdit) {
      (async () => {
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
              images: data.images || [],
              tags: data.tags || [],
              specs: data.specs || [],
              isNew: data.isNew || false,
              featured: data.featured || false,
              isFlashSale: data.isFlashSale || false,
              isTrending: data.isTrending || false,
              isSelection: data.isSelection || false,
              published: data.published !== false,
            });
          }
        } catch (error) {
          console.error('Error fetching product:', error);
        } finally {
          setInitialLoading(false);
        }
      })();
    }
  }, [id, isEdit]);

  // ─── Helpers ────────────────────────────────────────────────────────────────
  const set = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !formData.tags.includes(t)) {
      set('tags', [...formData.tags, t]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => set('tags', formData.tags.filter(t => t !== tag));

  const addSpec = () => set('specs', [...formData.specs, { key: '', value: '' }]);

  const updateSpec = (i: number, field: 'key' | 'value', val: string) => {
    const updated = formData.specs.map((s, idx) => idx === i ? { ...s, [field]: val } : s);
    set('specs', updated);
  };

  const removeSpec = (i: number) => set('specs', formData.specs.filter((_, idx) => idx !== i));

  // ─── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      alert('⚠️ Veuillez ajouter au moins une image principale.');
      return;
    }
    setLoading(true);
    try {
      const productId = isEdit ? id! : 'p' + Date.now();
      const productData: any = {
        ...formData,
        id: productId,
        price: parseFloat(formData.price),
        oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
        stock: parseInt(formData.stock),
        updatedAt: new Date().toISOString(),
      };
      if (!isEdit) {
        productData.createdAt = new Date().toISOString();
        productData.rating = 5.0;
        productData.reviewCount = 0;
        await setDocument('products', productId, productData);
      } else {
        await updateDocument('products', productId, productData);
      }
      navigate('/produits');
    } catch (error) {
      console.error('Error saving product:', error);
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Loading skeleton ─────────────────────────────────────────────────────
  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Chargement du produit...</p>
      </div>
    );
  }

  // ─── Discount calc ──────────────────────────────────────────────────────────
  const discountPct = formData.price && formData.oldPrice
    ? Math.round((1 - parseFloat(formData.price) / parseFloat(formData.oldPrice)) * 100)
    : null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-28 md:pb-10">

      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-left">
          <button
            onClick={() => navigate('/produits')}
            className="p-3 bg-white border border-gray-200 rounded-2xl text-gray-400 hover:text-gray-900 transition-all shadow-sm active:scale-90"
          >
            <ArrowLeft size={20} weight="bold" />
          </button>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
              {isEdit ? 'Modifier le produit' : 'Nouveau produit'}
            </h2>
            <p className="text-sm font-medium text-gray-400">
              {isEdit ? `ID: ${id?.substring(0, 8)}` : 'Remplissez tous les champs ci-dessous.'}
            </p>
          </div>
        </div>
        <button
          form="product-form"
          type="submit"
          disabled={loading}
          className="hidden md:flex items-center gap-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50"
        >
          {loading
            ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <Check size={18} weight="bold" />}
          {isEdit ? 'Enregistrer' : 'Publier'}
        </button>
      </div>

      <form id="product-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ══════════════════════════════════════════════
            LEFT COLUMN — Info, Prix, Specs, Tags
        ══════════════════════════════════════════════ */}
        <div className="lg:col-span-2 space-y-6">

          {/* Information Générales */}
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-200 shadow-sm space-y-5 text-left">
            <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em]">Informations Générales</h3>

            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1">Nom du produit *</label>
              <input
                type="text" required
                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 text-sm font-medium focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                placeholder="Ex: Samsung Galaxy S24 Ultra 256 Go"
                value={formData.name}
                onChange={e => set('name', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1">Catégorie *</label>
                <select
                  required
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 text-sm font-medium text-gray-700 focus:ring-4 focus:ring-primary/5 outline-none appearance-none cursor-pointer"
                  value={formData.category}
                  onChange={e => set('category', e.target.value)}
                >
                  <option value="">Sélectionner...</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1">Marque</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 text-sm font-medium focus:ring-4 focus:ring-primary/5 outline-none"
                  placeholder="Ex: Apple, Samsung..."
                  value={formData.brand}
                  onChange={e => set('brand', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1">Description complète</label>
              <textarea
                rows={5}
                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 text-sm font-medium focus:ring-4 focus:ring-primary/5 outline-none resize-none"
                placeholder="Décrivez les caractéristiques clés, avantages et usages du produit..."
                value={formData.description}
                onChange={e => set('description', e.target.value)}
              />
            </div>
          </div>

          {/* Prix & Stock */}
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-200 shadow-sm space-y-5 text-left">
            <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em]">Prix & Stock</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1">Ancien prix (€)</label>
                <input
                  type="number" step="0.01"
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 text-sm font-medium focus:ring-4 focus:ring-primary/5 outline-none"
                  placeholder="0.00"
                  value={formData.oldPrice}
                  onChange={e => {
                    const oldPrice = parseFloat(e.target.value);
                    set('oldPrice', e.target.value);
                    // Retain current discount % if both prices exist
                    if (oldPrice > 0 && formData.price) {
                      // Just re-calculate the percentage for display
                    }
                  }}
                />
              </div>

              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1 text-primary">Remise (%)</label>
                <input
                  type="number"
                  className="w-full bg-primary/5 border-none rounded-2xl py-4 px-5 text-sm font-black text-primary focus:ring-4 focus:ring-primary/10 outline-none"
                  placeholder="0"
                  value={discountPct || ''}
                  onChange={e => {
                    const pct = parseFloat(e.target.value);
                    if (pct >= 0 && pct <= 100 && formData.oldPrice) {
                      const oldP = parseFloat(formData.oldPrice);
                      const newP = (oldP * (1 - pct / 100)).toFixed(2);
                      set('price', newP);
                    }
                  }}
                />
              </div>

              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1">Prix de vente (€) *</label>
                <input
                  type="number" step="0.01" required
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 text-sm font-medium focus:ring-4 focus:ring-primary/5 outline-none"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={e => set('price', e.target.value)}
                />
              </div>

              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1">Stock actuel *</label>
                <input
                  type="number" required
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 text-sm font-medium focus:ring-4 focus:ring-primary/5 outline-none"
                  placeholder="0"
                  value={formData.stock}
                  onChange={e => set('stock', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Caractéristiques Techniques */}
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-200 shadow-sm space-y-5 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center">
                  <ListBullets size={18} className="text-gray-400" weight="bold" />
                </div>
                <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em]">Caractéristiques Techniques</h3>
              </div>
              <button
                type="button"
                onClick={addSpec}
                className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:text-primary-dark transition-colors"
              >
                <Plus size={14} weight="bold" /> Ajouter
              </button>
            </div>

            {formData.specs.length === 0 ? (
              <div className="text-center py-8 text-gray-300">
                <ListBullets size={36} className="mx-auto mb-2" weight="thin" />
                <p className="text-[10px] font-black uppercase tracking-widest">Aucune caractéristique</p>
                <button type="button" onClick={addSpec} className="mt-3 text-primary text-[10px] font-black uppercase tracking-widest">+ Ajouter la première</button>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.specs.map((spec, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <input
                      type="text"
                      placeholder="Ex: Écran"
                      className="flex-1 bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/10 outline-none"
                      value={spec.key}
                      onChange={e => updateSpec(i, 'key', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Ex: 6.8 pouces AMOLED"
                      className="flex-[2] bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/10 outline-none"
                      value={spec.value}
                      onChange={e => updateSpec(i, 'value', e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeSpec(i)}
                      className="p-2.5 text-red-400 bg-red-50 rounded-xl hover:bg-red-100 transition-colors active:scale-90"
                    >
                      <Trash size={16} weight="bold" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-200 shadow-sm space-y-5 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center">
                <Tag size={18} className="text-gray-400" weight="bold" />
              </div>
              <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em]">Tags & Mots-clés</h3>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 bg-gray-50 border-none rounded-2xl py-3 px-5 text-sm font-medium focus:ring-2 focus:ring-primary/10 outline-none"
                placeholder="Ex: samsung, smartphone, 5g..."
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
              />
              <button
                type="button"
                onClick={addTag}
                className="px-5 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-primary/20 active:scale-95"
              >
                <Plus size={16} weight="bold" />
              </button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border border-primary/10"
                  >
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                      <X size={12} weight="bold" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            RIGHT COLUMN — Image, Visibilité
        ══════════════════════════════════════════════ */}
        <div className="space-y-6">

          {/* Upload Image Principale */}
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-200 shadow-sm text-left">
            <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-6">Média Principal</h3>
            <CloudinaryUploader
              value={formData.image}
              onChange={(url) => set('image', url)}
              label="Image principale *"
            />
          </div>

          {/* Images secondaires */}
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-200 shadow-sm text-left space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em]">Galerie</h3>
              {formData.images.length < 4 && (
                <button
                  type="button"
                  onClick={() => set('images', [...formData.images, ''])}
                  className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-1"
                >
                  <Plus size={12} weight="bold" /> Ajouter
                </button>
              )}
            </div>
            {formData.images.length === 0 ? (
              <p className="text-[10px] text-gray-300 font-bold text-center py-4">Jusqu'à 4 images supplémentaires</p>
            ) : (
              <div className="space-y-3">
                {formData.images.map((img, i) => (
                  <CloudinaryUploader
                    key={i}
                    value={img}
                    onChange={(url) => {
                      const updated = [...formData.images];
                      updated[i] = url;
                      set('images', updated);
                    }}
                    label={`Vue ${i + 2}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Visibilité */}
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-200 shadow-sm text-left space-y-3">
            <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-2">Options</h3>

            {([
              { key: 'published', label: 'En Ligne', color: 'green' },
              { key: 'featured', label: 'Mis en avant', color: 'primary' },
              { key: 'isNew', label: 'Badge Nouveau', color: 'blue' },
              { key: 'isFlashSale', label: 'Offre du Jour', color: 'orange' },
              { key: 'isTrending', label: 'Produit Tendance', color: 'purple' },
              { key: 'isSelection', label: 'Sélection Boutique', color: 'teal' },
            ] as { key: keyof typeof formData; label: string; color: string }[]).map(({ key, label, color }) => {
              const isOn = !!formData[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => set(key, !formData[key])}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                    isOn
                      ? color === 'green' ? 'bg-green-50 text-green-700'
                        : color === 'orange' ? 'bg-orange-50 text-orange-700'
                        : color === 'purple' ? 'bg-purple-50 text-purple-700'
                        : color === 'teal' ? 'bg-teal-50 text-teal-700'
                        : color === 'primary' ? 'bg-primary/5 text-primary'
                        : 'bg-blue-50 text-blue-600'
                      : 'bg-gray-50 text-gray-400'
                  }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
                  <div className={`w-11 h-6 rounded-full relative transition-all ${isOn
                    ? color === 'green' ? 'bg-green-500'
                      : color === 'orange' ? 'bg-orange-500'
                      : color === 'purple' ? 'bg-purple-500'
                      : color === 'teal' ? 'bg-teal-500'
                      : color === 'primary' ? 'bg-primary'
                      : 'bg-blue-500'
                    : 'bg-gray-200'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all ${isOn ? 'right-1' : 'left-1'}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </form>

      {/* ── Mobile Sticky CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-gray-100 flex md:hidden z-50">
        <button
          form="product-form"
          type="submit"
          disabled={loading}
          className="flex-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest py-5 rounded-[1.5rem] shadow-xl shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading
            ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <Check size={18} weight="bold" />}
          {isEdit ? 'Enregistrer les modifications' : 'Publier le produit'}
        </button>
      </div>
    </div>
  );
}
