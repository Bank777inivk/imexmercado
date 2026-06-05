import React, { useState, useEffect } from "react";
import {
  Folder,
  Plus,
  Trash,
  DotsThreeVertical,
  Check,
  ArrowClockwise,
  List,
  DeviceMobile,
  House,
  Couch,
  Screwdriver,
  Tree,
  SwimmingPool,
  Armchair,
  Cpu,
  Lamp,
  Package,
  CaretRight,
} from "@phosphor-icons/react";
import {
  subscribeToCollection,
  setDocument,
  deleteDocument,
  addDocument,
} from "@imexmercado/firebase";

const ICON_OPTIONS = [
  { id: "DeviceMobile", label: "Tech / Mobile", icon: DeviceMobile },
  { id: "House", label: "Maison", icon: House },
  { id: "Couch", label: "Meubles", icon: Couch },
  { id: "Screwdriver", label: "Bricolage", icon: Screwdriver },
  { id: "Tree", label: "Jardin / BBQ", icon: Tree },
  { id: "SwimmingPool", label: "Piscines / Loisirs", icon: SwimmingPool },
  { id: "Armchair", label: "Confort", icon: Armchair },
  { id: "Cpu", label: "Informatique", icon: Cpu },
  { id: "Lamp", label: "Luminaire", icon: Lamp },
  { id: "Package", label: "Autre", icon: Package },
];

// Helper translation button
function TranslateButton({
  sourceText,
  onTranslate,
}: {
  sourceText: string;
  onTranslate: (translated: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const translate = async () => {
    if (!sourceText?.trim()) return;
    setLoading(true);
    setError("");
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(sourceText)}&langpair=fr|pt`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.responseStatus === 200 && json.responseData?.translatedText) {
        onTranslate(json.responseData.translatedText);
      } else {
        setError("Erreur");
        setTimeout(() => setError(""), 3000);
      }
    } catch {
      setError("Erreur");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={translate}
      disabled={loading || !sourceText?.trim()}
      title={
        sourceText
          ? `Traduire : "${sourceText.slice(0, 40)}..."`
          : "Aucun texte FR à traduire"
      }
      className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg transition-all
        ${
          loading
            ? "bg-blue-50 text-blue-400 cursor-wait"
            : error
              ? "bg-red-50 text-red-400"
              : !sourceText?.trim()
                ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:scale-105 active:scale-95"
        }`}
    >
      {loading ? (
        <>
          <svg
            className="w-2.5 h-2.5 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          ...
        </>
      ) : error ? (
        <>⚠ {error}</>
      ) : (
        <>🌐 Traduire FR→PT</>
      )}
    </button>
  );
}

export function CategoriesView() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCat, setEditingCat] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToCollection("categories", (data) => {
      setCategories(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenModal = (cat: any = null) => {
    setEditingCat(
      cat
        ? {
            ...cat,
            namePT: cat.namePT || "",
            subcategories: cat.subcategories || [],
            subcategoriesPT: cat.subcategoriesPT || [],
          }
        : {
            name: "",
            namePT: "",
            icon: "Package",
            order: categories.length,
            isActive: true,
            hasSubmenu: false,
            subcategories: [],
            subcategoriesPT: [],
          },
    );
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingCat.name) return alert("Le nom est obligatoire");
    setSaving(true);
    try {
      const cleanSubs = (editingCat.subcategories || []).map((s: string) =>
        s.trim(),
      );
      const cleanSubsPT = (editingCat.subcategoriesPT || []).map((s: string) =>
        s.trim(),
      );

      const toSave = {
        ...editingCat,
        subcategories: cleanSubs,
        subcategoriesPT: cleanSubsPT,
        hasSubmenu: cleanSubs.length > 0,
      };

      if (editingCat.id) {
        await setDocument("categories", editingCat.id, toSave);
      } else {
        await addDocument("categories", toSave);
      }
      setIsModalOpen(false);
      setEditingCat(null);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette catégorie ?")) return;
    try {
      await deleteDocument("categories", id);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression");
    }
  };

  const handleAddSubcategory = () => {
    setEditingCat({
      ...editingCat,
      subcategories: [...(editingCat.subcategories || []), ""],
      subcategoriesPT: [...(editingCat.subcategoriesPT || []), ""],
      hasSubmenu: true,
    });
  };

  const updateSubcategoryValue = (
    index: number,
    val: string,
    isPT: boolean,
  ) => {
    if (isPT) {
      const newSubsPT = [...(editingCat.subcategoriesPT || [])];
      newSubsPT[index] = val;
      setEditingCat({ ...editingCat, subcategoriesPT: newSubsPT });
    } else {
      const newSubs = [...(editingCat.subcategories || [])];
      newSubs[index] = val;
      setEditingCat({ ...editingCat, subcategories: newSubs });
    }
  };

  const removeSubcategory = (idx: number) => {
    const newSubs = editingCat.subcategories.filter(
      (_: any, i: number) => i !== idx,
    );
    const newSubsPT = (editingCat.subcategoriesPT || []).filter(
      (_: any, i: number) => i !== idx,
    );
    setEditingCat({
      ...editingCat,
      subcategories: newSubs,
      subcategoriesPT: newSubsPT,
      hasSubmenu: newSubs.length > 0,
    });
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest text-center">
          Chargement des catégories...
        </p>
      </div>
    );

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Gestion des Catégories
          </h2>
          <p className="text-sm font-medium text-gray-500">
            Organisez l'architecture de votre boutique et vos sous-menus.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-gray-200 hover:scale-105 transition-transform active:scale-95"
        >
          <Plus size={16} weight="bold" />
          Nouvelle Catégorie
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const IconComp =
            ICON_OPTIONS.find((i) => i.id === cat.icon)?.icon || Package;
          return (
            <div
              key={cat.id}
              className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/10 transition-all group"
            >
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
                <div className="flex items-start justify-between mb-1">
                  <div className="flex flex-col">
                    <h3 className="text-lg font-black text-gray-900 tracking-tight">
                      {cat.name}
                    </h3>
                    {cat.namePT && (
                      <span className="text-xs font-semibold text-emerald-600">
                        PT: {cat.namePT}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${cat.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}
                  >
                    {cat.isActive ? "Actif" : "Inactif"}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-4">
                  Ordre: {cat.order}
                </p>

                {cat.subcategories?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {cat.subcategories.map((sub: string, i: number) => {
                      const subPT = cat.subcategoriesPT?.[i];
                      return (
                        <span
                          key={i}
                          className="text-[9px] font-bold bg-gray-50 text-gray-500 px-3 py-1.5 rounded-xl border border-gray-100 flex flex-col items-start gap-0.5"
                        >
                          <span>{sub}</span>
                          {subPT && (
                            <span className="text-[8px] text-emerald-600 font-medium border-t border-gray-100/50 pt-0.5 w-full">
                              PT: {subPT}
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-[10px] text-gray-300 italic">
                    Aucune sous-catégorie
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 md:p-10 max-h-[85vh] overflow-y-auto">
              <h3 className="text-2xl font-black text-gray-900 mb-2">
                {editingCat.id
                  ? "Modifier la catégorie"
                  : "Créer une catégorie"}
              </h3>
              <p className="text-sm text-gray-500 mb-8 font-medium">
                Définissez les détails et les sous-menus.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block ml-1">
                    Nom de la catégorie (FR)
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                    placeholder="Ex: Téléphones & Hi-Tech"
                    value={editingCat.name}
                    onChange={(e) =>
                      setEditingCat({ ...editingCat, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2 ml-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Nom de la catégorie (PT)
                    </label>
                    <TranslateButton
                      sourceText={editingCat.name}
                      onTranslate={(val) =>
                        setEditingCat({ ...editingCat, namePT: val })
                      }
                    />
                  </div>
                  <input
                    type="text"
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                    placeholder="Ex: Telemóveis & Hi-Tech"
                    value={editingCat.namePT}
                    onChange={(e) =>
                      setEditingCat({ ...editingCat, namePT: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block ml-1">
                      Ordre d'affichage
                    </label>
                    <input
                      type="number"
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                      value={editingCat.order}
                      onChange={(e) =>
                        setEditingCat({
                          ...editingCat,
                          order: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block ml-1">
                      Icône
                    </label>
                    <select
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all appearance-none cursor-pointer"
                      value={editingCat.icon}
                      onChange={(e) =>
                        setEditingCat({ ...editingCat, icon: e.target.value })
                      }
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1">
                      Sous-catégories
                    </label>
                    <button
                      onClick={handleAddSubcategory}
                      className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline"
                    >
                      + Ajouter
                    </button>
                  </div>

                  <div className="space-y-3 bg-gray-50 rounded-2xl p-4 max-h-[300px] overflow-y-auto">
                    {editingCat.subcategories?.map((sub: string, i: number) => {
                      const subPT = editingCat.subcategoriesPT?.[i] || "";
                      return (
                        <div
                          key={i}
                          className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm space-y-2 relative group/sub"
                        >
                          <button
                            onClick={() => removeSubcategory(i)}
                            className="absolute top-2 right-2 p-1.5 text-gray-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                            title="Supprimer la sous-catégorie"
                          >
                            <Trash size={14} weight="bold" />
                          </button>

                          <div className="flex flex-col gap-1 pr-6">
                            <label className="text-[8px] font-black uppercase tracking-wider text-gray-400">
                              Nom (FR)
                            </label>
                            <input
                              type="text"
                              className="w-full bg-gray-50 border-none rounded-lg py-1.5 px-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10"
                              placeholder="Ex: iPhone"
                              value={sub}
                              onChange={(e) =>
                                updateSubcategoryValue(i, e.target.value, false)
                              }
                            />
                          </div>

                          <div className="flex flex-col gap-1 pr-6">
                            <div className="flex items-center justify-between">
                              <label className="text-[8px] font-black uppercase tracking-wider text-gray-400">
                                Nom (PT)
                              </label>
                              <TranslateButton
                                sourceText={sub}
                                onTranslate={(val) =>
                                  updateSubcategoryValue(i, val, true)
                                }
                              />
                            </div>
                            <input
                              type="text"
                              className="w-full bg-gray-50 border-none rounded-lg py-1.5 px-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10"
                              placeholder="Ex: iPhone"
                              value={subPT}
                              onChange={(e) =>
                                updateSubcategoryValue(i, e.target.value, true)
                              }
                            />
                          </div>
                        </div>
                      );
                    })}
                    {(!editingCat.subcategories ||
                      editingCat.subcategories.length === 0) && (
                      <p className="text-xs text-gray-400 italic w-full text-center py-4">
                        Cliquez sur "+" pour ajouter des sous-catégories (ex:
                        iPhone, Samsung...)
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl">
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">
                      Catégorie active
                    </p>
                    <p className="text-[10px] text-primary/60 font-medium">
                      Sera visible par vos clients sur la boutique.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setEditingCat({
                        ...editingCat,
                        isActive: !editingCat.isActive,
                      })
                    }
                    className={`w-12 h-6 rounded-full relative transition-all ${editingCat.isActive ? "bg-primary" : "bg-gray-200"}`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${editingCat.isActive ? "right-1" : "left-1"}`}
                    />
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
                  {saving ? (
                    <ArrowClockwise
                      size={18}
                      className="animate-spin mx-auto"
                    />
                  ) : (
                    "Enregistrer"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
