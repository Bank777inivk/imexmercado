import React, { useEffect, useState } from 'react';
import { 
  subscribeToCollection, 
  deleteDocument, 
  updateDocument 
} from '@imexmercado/firebase';
import { 
  Star, Trash, CheckCircle, WarningCircle, 
  MagnifyingGlass, Pencil, Check, X 
} from '@phosphor-icons/react';

export function ReviewsView() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  
  // Editing review state
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editRating, setEditRating] = useState(5);

  useEffect(() => {
    const unsubscribe = subscribeToCollection('reviews', (data) => {
      // Sort by date descending
      const sorted = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setReviews(sorted);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet avis client ?')) return;
    try {
      await deleteDocument('reviews', id);
      alert('Avis supprimé avec succès.');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression.');
    }
  };

  const toggleApproval = async (review: any) => {
    try {
      await updateDocument('reviews', review.id, {
        approved: !review.approved
      });
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la mise à jour du statut.');
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
      await updateDocument('reviews', id, {
        text: editText,
        rating: Number(editRating)
      });
      setEditingReviewId(null);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde.');
    }
  };

  // Filter logic
  const filteredReviews = reviews.filter(rev => {
    const matchSearch = 
      rev.name?.toLowerCase().includes(search.toLowerCase()) ||
      rev.productName?.toLowerCase().includes(search.toLowerCase()) ||
      rev.text?.toLowerCase().includes(search.toLowerCase()) ||
      rev.city?.toLowerCase().includes(search.toLowerCase());
      
    const matchRating = ratingFilter === 'all' || Number(rev.rating) === Number(ratingFilter);
    
    return matchSearch && matchRating;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Chargement des avis...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left pb-20">
      <div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Modération des Avis Clients</h2>
        <p className="text-sm font-medium text-gray-400 mt-1">Gérez, éditez, approuvez ou supprimez les avis publiés par les clients.</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            className="w-full bg-gray-50 border-none rounded-xl py-3 pl-10 pr-4 text-xs font-medium focus:ring-2 focus:ring-primary/10 outline-none"
            placeholder="Rechercher par client, produit, ville, texte..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Filtrer par note</span>
          <select
            value={ratingFilter}
            onChange={e => setRatingFilter(e.target.value)}
            className="bg-gray-50 border-none rounded-xl py-3 px-4 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-primary/10 outline-none w-full md:w-40"
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

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="p-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">Client & Ville</th>
                <th className="p-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">Produit</th>
                <th className="p-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">Note</th>
                <th className="p-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">Avis</th>
                <th className="p-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                <th className="p-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">Statut</th>
                <th className="p-5 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((rev) => {
                  const isEditing = editingReviewId === rev.id;
                  return (
                    <tr key={rev.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="p-5">
                        <p className="text-xs font-bold text-gray-900 leading-tight">{rev.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{rev.city || 'Portugal'}</p>
                      </td>
                      <td className="p-5">
                        <p className="text-xs font-bold text-gray-900 truncate max-w-[200px]" title={rev.productName}>
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
                                <Star size={14} weight={star <= editRating ? 'fill' : 'regular'} />
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={13} weight={i < rev.rating ? 'fill' : 'regular'} />
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="p-5">
                        {isEditing ? (
                          <textarea
                            value={editText}
                            onChange={e => setEditText(e.target.value)}
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
                        {new Date(rev.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-5">
                        <button
                          onClick={() => toggleApproval(rev)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            rev.approved 
                              ? 'bg-green-50 text-green-600' 
                              : 'bg-yellow-50 text-yellow-600'
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
                  <td colSpan={7} className="p-12 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">
                    Aucun avis trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
