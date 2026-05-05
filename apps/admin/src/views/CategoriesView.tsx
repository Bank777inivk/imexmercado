import React, { useState, useEffect } from 'react';
import { 
  Folder, Plus, Trash, DotsThreeVertical, 
  Check, ArrowClockwise, List, 
  DeviceMobile, House, Couch, 
  Screwdriver, Tree, SwimmingPool, 
  Armchair, Cpu, Lamp, Package,
  CaretRight
} from '@phosphor-icons/react';
import { subscribeToCollection, setDocument, deleteDocument, addDocument } from '@imexmercado/firebase';

const ICON_OPTIONS = [
  { id: 'DeviceMobile', label: 'Tech / Mobile', icon: DeviceMobile },
  { id: 'House', label: 'Maison', icon: House },
  { id: 'Couch', label: 'Meubles', icon: Couch },
  { id: 'Screwdriver', label: 'Bricolage', icon: Screwdriver },
  { id: 'Tree', label: 'Jardin / BBQ', icon: Tree },
  { id: 'SwimmingPool', label: 'Piscines / Loisirs', icon: SwimmingPool },
  { id: 'Armchair', label: 'Confort', icon: Armchair },
  { id: 'Cpu', label: 'Informatique', icon: Cpu },
  { id: 'Lamp', label: 'Luminaire', icon: Lamp },
  { id: 'Package', label: 'Autre', icon: Package },
];

export function CategoriesView() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCat, setEditingCat] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToCollection('categories', (data) => {
      setCategories(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenModal = (cat: any = null) => {
    setEditingCat(cat || {
      name: '',
      icon: 'Package',
      order: categories.length,
      isActive: true,
      hasSubmenu: false,
      subcategories: []
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingCat.name) return alert('Le nom est obligatoire');
    setSaving(true);
    try {
      if (editingCat.id) {
        await setDocument('categories', editingCat.id, editingCat);
      } else {
        await addDocument('categories', editingCat);
      }
      setIsModalOpen(false);
      setEditingCat(null);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cette catégorie ?')) return;
    try {
      await deleteDocument('categories', id);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression');
    }
  };

  const handleAddSubcategory = () => {
    const sub = prompt('Nom de la sous-catégorie :');
    if (sub) {
      setEditingCat({
        ...editingCat,
        subcategories: [...(editingCat.subcategories || []), sub],
        hasSubmenu: true
      });
    }
  };

  const removeSubcategory = (idx: number) => {
    const newSubs = editingCat.subcategories.filter((_: any, i: number) => i !== idx);
    setEditingCat({
      ...editingCat,
      subcategories: newSubs,
      hasSubmenu: newSubs.length > 0
    });
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest text-center">Chargement des catégories...</p>
    </div>
  );

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Gestion des Catégories</h2>
          <p className="text-sm font-medium text-gray-500">Organisez l'architecture de votre boutique et vos sous-menus.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-gray-200 hover:scale-105 transition-transform active:scale-95"
        >
          <Plus size={16} weight="bold" />
          Nouvelle Catégorie
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const IconComp = ICON_OPTIONS.find(i => i.id === cat.icon)?.icon || Package;
          return (
            <div key={cat.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/10 transition-all group">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                  <IconComp size={24} weight="bold" />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleOpenModal(cat)}
                    className="p-2 text-gray-400 hover:text-primary transition-colors"
                  >
                    <List size={20} weight="bold" />
                  </button>
                  <button 
                    onClick={() => handleDelete(cat.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash size={20} weight="bold" />
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                   <h3 className="text-lg font-black text-gray-900 tracking-tight">{cat.name}</h3>
                   <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${cat.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                     {cat.isActive ? 'Actif' : 'Inactif'}
                   </span>
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-4">Ordre: {cat.order}</p>
                
                {cat.subcategories?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {cat.subcategories.map((sub: string, i: number) => (
                      <span key={i} className="text-[9px] font-bold bg-gray-50 text-gray-500 px-3 py-1 rounded-full border border-gray-100">
                        {sub}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-gray-300 italic">Aucune sous-catégorie</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 md:p-10">
              <h3 className="text-2xl font-black text-gray-900 mb-2">{editingCat.id ? 'Modifier la catégorie' : 'Créer une catégorie'}</h3>
              <p className="text-sm text-gray-500 mb-8 font-medium">Définissez les détails et les sous-menus.</p>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block ml-1">Nom de la catégorie</label>
                  <input 
                    type="text"
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                    placeholder="Ex: Téléphones & Hi-Tech"
                    value={editingCat.name}
                    onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block ml-1">Ordre d'affichage</label>
                    <input 
                      type="number"
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                      value={editingCat.order}
                      onChange={(e) => setEditingCat({ ...editingCat, order: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block ml-1">Icône</label>
                    <select 
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all appearance-none cursor-pointer"
                      value={editingCat.icon}
                      onChange={(e) => setEditingCat({ ...editingCat, icon: e.target.value })}
                    >
                      {ICON_OPTIONS.map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1">Sous-catégories</label>
                    <button 
                      onClick={handleAddSubcategory}
                      className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline"
                    >
                      + Ajouter
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 min-h-[100px] flex flex-wrap gap-2 items-start content-start">
                    {editingCat.subcategories?.map((sub: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl group/sub">
                        <span className="text-xs font-bold text-gray-700">{sub}</span>
                        <button 
                          onClick={() => removeSubcategory(i)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash size={14} weight="bold" />
                        </button>
                      </div>
                    ))}
                    {(!editingCat.subcategories || editingCat.subcategories.length === 0) && (
                      <p className="text-xs text-gray-400 italic w-full text-center py-4">Cliquez sur "+" pour ajouter des sous-catégories (ex: iPhone, Samsung...)</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl">
                   <div className="flex-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Catégorie active</p>
                      <p className="text-[10px] text-primary/60 font-medium">Sera visible par vos clients sur la boutique.</p>
                   </div>
                   <button 
                     onClick={() => setEditingCat({ ...editingCat, isActive: !editingCat.isActive })}
                     className={`w-12 h-6 rounded-full relative transition-all ${editingCat.isActive ? 'bg-primary' : 'bg-gray-200'}`}
                   >
                     <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${editingCat.isActive ? 'right-1' : 'left-1'}`} />
                   </button>
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-500 font-black uppercase text-[10px] tracking-widest py-5 rounded-2xl hover:bg-gray-200 transition-all"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-gray-900 text-white font-black uppercase text-[10px] tracking-widest py-5 rounded-2xl shadow-xl shadow-gray-200 hover:scale-105 transition-all active:scale-95 disabled:opacity-50"
                >
                  {saving ? <ArrowClockwise size={18} className="animate-spin mx-auto" /> : 'Enregistrer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
