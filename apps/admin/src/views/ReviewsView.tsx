import React, { useEffect, useState, useMemo } from "react";
import {
  subscribeToCollection,
  deleteDocument,
  updateDocument,
} from "@imexmercado/firebase";
import {
  Star,
  Trash,
  CheckCircle,
  WarningCircle,
  MagnifyingGlass,
  Pencil,
  Check,
  X,
  CaretDown,
  CaretRight,
  Folder,
  FolderOpen,
} from "@phosphor-icons/react";

export function ReviewsView() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("product"); // 'date' or 'product'
  const [expandedProducts, setExpandedProducts] = useState<
    Record<string, boolean>
  >({});

  // Editing review state
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(5);

  useEffect(() => {
    const unsubscribe = subscribeToCollection("reviews", (data) => {
      setReviews(data || []);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet avis client ?"))
      return;
    try {
      await deleteDocument("reviews", id);
      alert("Avis supprimé avec succès.");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression.");
    }
  };

  const toggleApproval = async (review: any) => {
    try {
      await updateDocument("reviews", review.id, {
        approved: !review.approved,
      });
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du statut.");
    }
  };

  const startEdit = (review: any) => {
    setEditingReviewId(review.id);
    setEditText(review.text);
    setEditRating(review.rating);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editText.trim()) return;
    try {
      await updateDocument("reviews", id, {
        text: editText,
        rating: Number(editRating),
      });
      setEditingReviewId(null);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sauvegarde.");
    }
  };

  // Filter & sort logic
  const filteredReviews = reviews
    .filter((rev) => {
      const matchSearch =
        rev.name?.toLowerCase().includes(search.toLowerCase()) ||
        rev.productName?.toLowerCase().includes(search.toLowerCase()) ||
        rev.text?.toLowerCase().includes(search.toLowerCase()) ||
        rev.city?.toLowerCase().includes(search.toLowerCase());

      const matchRating =
        ratingFilter === "all" || Number(rev.rating) === Number(ratingFilter);

      return matchSearch && matchRating;
    })
    .sort((a, b) => {
      if (sortBy === "product") {
        return (a.productName || "").localeCompare(b.productName || "");
      }
      // Default: date descending
      return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
    });

  // Grouping logic if sortBy is 'product'
  const groupedReviews = useMemo(() => {
    if (sortBy !== "product") return null;
    const groups: Record<string, any[]> = {};
    filteredReviews.forEach((rev) => {
      const pName = rev.productName || "Sans produit";
      if (!groups[pName]) groups[pName] = [];
      groups[pName].push(rev);
    });
    return groups;
  }, [filteredReviews, sortBy]);

  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset page when search, rating filter, or sorting changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, ratingFilter, sortBy]);

  const paginatedGroupEntries = useMemo(() => {
    if (sortBy !== "product" || !groupedReviews) return [];
    return Object.entries(groupedReviews).slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [groupedReviews, sortBy, currentPage]);

  const paginatedReviews = useMemo(() => {
    if (sortBy === "product") return [];
    return filteredReviews.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [filteredReviews, sortBy, currentPage]);

  const totalPages = useMemo(() => {
    if (sortBy === "product" && groupedReviews) {
      return Math.ceil(Object.keys(groupedReviews).length / itemsPerPage) || 1;
    }
    return Math.ceil(filteredReviews.length / itemsPerPage) || 1;
  }, [filteredReviews, groupedReviews, sortBy]);

  const toggleProductExpand = (productName: string) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [productName]: !prev[productName],
    }));
  };

  const expandAll = (groups: Record<string, any[]>) => {
    const next: Record<string, boolean> = {};
    Object.keys(groups).forEach((key) => {
      next[key] = true;
    });
    setExpandedProducts(next);
  };

  const collapseAll = () => {
    setExpandedProducts({});
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
          Chargement des avis...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left pb-20">
      <div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          Modération des Avis Clients
        </h2>
        <p className="text-sm font-medium text-gray-400 mt-1">
          Gérez, éditez, approuvez ou supprimez les avis publiés par les
          clients.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            className="w-full bg-gray-50 border-none rounded-xl py-3 pl-10 pr-4 text-xs font-medium focus:ring-2 focus:ring-primary/10 outline-none"
            placeholder="Rechercher par client, produit, ville, texte..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <MagnifyingGlass
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Trier par
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-50 border-none rounded-xl py-3 px-4 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-primary/10 outline-none w-full sm:w-40"
            >
              <option value="date">Date (Récents)</option>
              <option value="product">Nom du produit</option>
            </select>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Filtrer par note
            </span>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="bg-gray-50 border-none rounded-xl py-3 px-4 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-primary/10 outline-none w-full sm:w-40"
            >
              <option value="all">Toutes les notes</option>
              <option value="5">5 Étoiles</option>
              <option value="4">4 Étoiles</option>
              <option value="3">3 Étoiles</option>
              <option value="2">2 Étoiles</option>
              <option value="1">1 Étoile</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table / Grid */}
      {sortBy === "product" && groupedReviews ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedGroupEntries.map(([productName, groupItems]) => (
            <div
              key={productName}
              onClick={() => setSelectedProduct(productName)}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between group min-h-[180px] relative overflow-hidden"
            >
              {/* Folder tab design accent */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-primary/80" />

              <div>
                <div className="flex items-start justify-between mb-4">
                  <Folder
                    size={40}
                    className="text-yellow-500 group-hover:scale-110 transition-transform duration-200"
                    weight="fill"
                  />
                  <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-1 rounded-full font-black uppercase tracking-wider">
                    {groupItems.length}{" "}
                    {groupItems.length > 1 ? "avis" : "avis"}
                  </span>
                </div>

                <h3
                  className="text-xs font-bold text-gray-800 line-clamp-3 group-hover:text-primary transition-colors leading-relaxed"
                  title={productName}
                >
                  {productName}
                </h3>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span>Ouvrir le dossier</span>
                <CaretRight size={12} weight="bold" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  <th className="p-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    Client & Ville
                  </th>
                  <th className="p-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    Produit
                  </th>
                  <th className="p-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    Note
                  </th>
                  <th className="p-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    Avis
                  </th>
                  <th className="p-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    Date
                  </th>
                  <th className="p-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    Statut
                  </th>
                  <th className="p-5 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedReviews.length > 0 ? (
                  paginatedReviews.map((rev) => {
                    const isEditing = editingReviewId === rev.id;
                    return (
                      <tr
                        key={rev.id}
                        className="hover:bg-gray-50/30 transition-colors"
                      >
                        <td className="p-5">
                          <p className="text-xs font-bold text-gray-900 leading-tight">
                            {rev.name}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                            {rev.city || "Portugal"}
                          </p>
                        </td>
                        <td className="p-5">
                          <p
                            className="text-xs font-bold text-gray-900 truncate max-w-[200px]"
                            title={rev.productName}
                          >
                            {rev.productName}
                          </p>
                        </td>
                        <td className="p-5">
                          {isEditing ? (
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setEditRating(star)}
                                  className="text-yellow-400"
                                >
                                  <Star
                                    size={14}
                                    weight={
                                      star <= editRating ? "fill" : "regular"
                                    }
                                  />
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={13}
                                  weight={i < rev.rating ? "fill" : "regular"}
                                />
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="p-5">
                          {isEditing ? (
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="bg-gray-50 border-none rounded-xl py-2 px-3 text-xs font-medium focus:ring-2 focus:ring-primary/10 outline-none w-full min-w-[250px] resize-y"
                              rows={3}
                            />
                          ) : (
                            <p className="text-xs text-gray-600 font-medium leading-relaxed max-w-[350px]">
                              {rev.text}
                            </p>
                          )}
                        </td>
                        <td className="p-5 text-xs text-gray-500 font-bold">
                          {new Date(rev.date).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="p-5">
                          <button
                            onClick={() => toggleApproval(rev)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              rev.approved
                                ? "bg-green-50 text-green-600"
                                : "bg-yellow-50 text-yellow-600"
                            }`}
                          >
                            {rev.approved ? (
                              <>
                                <CheckCircle size={12} weight="fill" />
                                Approuvé
                              </>
                            ) : (
                              <>
                                <WarningCircle size={12} weight="fill" />
                                Masqué
                              </>
                            )}
                          </button>
                        </td>
                        <td className="p-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => handleSaveEdit(rev.id)}
                                  className="w-8 h-8 rounded-xl bg-green-50 text-green-600 flex items-center justify-center hover:scale-105 transition-transform"
                                  title="Sauvegarder"
                                >
                                  <Check size={16} weight="bold" />
                                </button>
                                <button
                                  onClick={() => setEditingReviewId(null)}
                                  className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:scale-105 transition-transform"
                                  title="Annuler"
                                >
                                  <X size={16} weight="bold" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEdit(rev)}
                                  className="w-8 h-8 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center hover:scale-105 transition-transform hover:text-primary"
                                  title="Modifier"
                                >
                                  <Pencil size={16} weight="bold" />
                                </button>
                                <button
                                  onClick={() => handleDelete(rev.id)}
                                  className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:scale-105 transition-transform"
                                  title="Supprimer"
                                >
                                  <Trash size={16} weight="bold" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-12 text-center text-gray-400 text-xs font-bold uppercase tracking-widest"
                    >
                      Aucun avis trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <p className="text-xs text-gray-500 font-medium">
            Page <span className="font-bold text-gray-900">{currentPage}</span>{" "}
            sur <span className="font-bold text-gray-900">{totalPages}</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setCurrentPage((prev) => Math.max(prev - 1, 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold text-gray-700 rounded-xl transition-colors border border-gray-100"
            >
              Précédent
            </button>
            <button
              onClick={() => {
                setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold text-gray-700 rounded-xl transition-colors border border-gray-100"
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      {/* Centered Modal for Product Reviews */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            onClick={() => setSelectedProduct(null)}
            className="absolute inset-0 bg-gray-500 bg-opacity-40 transition-opacity backdrop-blur-sm"
          />

          <div className="relative bg-white shadow-2xl rounded-none border border-gray-100 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden z-10">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FolderOpen
                  size={24}
                  className="text-yellow-500"
                  weight="fill"
                />
                <div>
                  <h2 className="text-sm font-bold text-gray-900 line-clamp-1">
                    {selectedProduct}
                  </h2>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
                    Dossier contenant{" "}
                    {groupedReviews && groupedReviews[selectedProduct]
                      ? groupedReviews[selectedProduct].length
                      : 0}{" "}
                    avis
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 hover:bg-gray-100 rounded-none transition-colors text-gray-400 hover:text-gray-600"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              {groupedReviews && groupedReviews[selectedProduct] ? (
                <div className="space-y-4">
                  {groupedReviews[selectedProduct].map((rev) => {
                    const isEditing = editingReviewId === rev.id;
                    return (
                      <div
                        key={rev.id}
                        className="p-5 bg-gray-50/50 rounded-none border border-gray-100 hover:border-gray-200 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
                      >
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="text-xs font-bold text-gray-900">
                                {rev.name}
                              </p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                                {rev.city || "Portugal"}
                              </p>
                            </div>
                            <span className="text-xs text-gray-400 font-medium">
                              •
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold">
                              {new Date(rev.date).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>

                          {isEditing ? (
                            <div className="flex gap-1 py-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setEditRating(star)}
                                  className="text-yellow-400"
                                >
                                  <Star
                                    size={16}
                                    weight={
                                      star <= editRating ? "fill" : "regular"
                                    }
                                  />
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  weight={i < rev.rating ? "fill" : "regular"}
                                />
                              ))}
                            </div>
                          )}

                          {isEditing ? (
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="bg-white border border-gray-200 rounded-none py-2 px-3 text-xs font-medium focus:ring-2 focus:ring-primary/10 outline-none w-full resize-y mt-2"
                              rows={3}
                            />
                          ) : (
                            <p className="text-xs text-gray-600 font-medium leading-relaxed">
                              {rev.text}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3 self-end md:self-start">
                          <button
                            onClick={() => toggleApproval(rev)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-none text-[9px] font-black uppercase tracking-widest ${
                              rev.approved
                                ? "bg-green-50 text-green-600 border border-green-100"
                                : "bg-yellow-50 text-yellow-600 border border-yellow-100"
                            }`}
                          >
                            {rev.approved ? (
                              <>
                                <CheckCircle size={12} weight="fill" />
                                Approuvé
                              </>
                            ) : (
                              <>
                                <WarningCircle size={12} weight="fill" />
                                Masqué
                              </>
                            )}
                          </button>

                          <div className="h-4 w-px bg-gray-200" />

                          <div className="flex items-center gap-1.5">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => handleSaveEdit(rev.id)}
                                  className="w-8 h-8 rounded-none bg-green-50 text-green-600 flex items-center justify-center hover:scale-105 transition-transform"
                                  title="Sauvegarder"
                                >
                                  <Check size={16} weight="bold" />
                                </button>
                                <button
                                  onClick={() => setEditingReviewId(null)}
                                  className="w-8 h-8 rounded-none bg-red-50 text-red-500 flex items-center justify-center hover:scale-105 transition-transform"
                                  title="Annuler"
                                >
                                  <X size={16} weight="bold" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEdit(rev)}
                                  className="w-8 h-8 rounded-none bg-white border border-gray-100 text-gray-500 flex items-center justify-center hover:scale-105 transition-transform hover:text-primary"
                                  title="Modifier"
                                >
                                  <Pencil size={16} weight="bold" />
                                </button>
                                <button
                                  onClick={() => handleDelete(rev.id)}
                                  className="w-8 h-8 rounded-none bg-red-50 text-red-500 flex items-center justify-center hover:scale-105 transition-transform"
                                  title="Supprimer"
                                >
                                  <Trash size={16} weight="bold" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-400 text-xs font-bold uppercase tracking-widest py-10">
                  Aucun avis dans ce dossier.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
