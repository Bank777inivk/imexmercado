import React from 'react';
import { SquaresFour, List, CaretRight, Faders } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

export function ShopHeader({ 
  totalResults, 
  onSortChange, 
  sortValue,
  viewMode,
  onViewModeChange,
  onMobileFilterClick,
  activeFiltersCount = 0
}: { 
  totalResults: number;
  onSortChange: (value: string) => void;
  sortValue: string;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onMobileFilterClick: () => void;
  activeFiltersCount?: number;
}) {
  return (
    <div className="bg-white p-4 border border-gray-100 shadow-sm rounded-xl mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Breadcrumbs & Meta */}
        <div className="space-y-1">
          <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
            <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
            <CaretRight size={10} weight="bold" />
            <span className="text-gray-900">Boutique</span>
          </nav>
          <p className="text-xs md:text-sm text-gray-500 font-medium">
            Affichage de <span className="font-bold text-gray-900">{totalResults}</span> produits
          </p>
        </div>

        {/* Mobile ONLY: Big Filter Button */}
        <div className="lg:hidden mt-2">
           <button 
             onClick={onMobileFilterClick}
             className="w-full bg-gray-50 border border-gray-200 text-gray-900 font-black uppercase tracking-widest py-3 rounded-xl shadow-sm hover:bg-gray-100 transition-all active:scale-95 text-xs flex items-center justify-center gap-2"
           >
             <Faders size={18} weight="bold" />
             <span>Filtrer & Trier</span>
             {activeFiltersCount > 0 && (
               <span className="bg-primary text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px] ml-1">
                 {activeFiltersCount}
               </span>
             )}
           </button>
        </div>

        {/* Right: Sort & View Toggle (DESKTOP ONLY) */}
        <div className="hidden lg:flex items-center gap-4">
          
          {/* Sorting */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">Trier par :</span>
            <select 
              value={sortValue}
              onChange={(e) => onSortChange(e.target.value)}
              className="text-xs font-bold bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 border-r-8 border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <option value="relevance">Pertinence</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="newest">Nouveautés</option>
              <option value="rating">Mieux notés</option>
            </select>
          </div>

          <div className="h-6 w-px bg-gray-100"></div>

          {/* View Toggles */}
          <div className="flex items-center gap-1">
            <button 
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary text-white shadow-sm' : 'text-gray-400 hover:bg-gray-100'}`}
              title="Vue grille"
            >
              <SquaresFour size={18} weight={viewMode === 'grid' ? 'fill' : 'bold'} />
            </button>
            <button 
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary text-white shadow-sm' : 'text-gray-400 hover:bg-gray-100'}`}
              title="Vue liste"
            >
              <List size={18} weight={viewMode === 'list' ? 'fill' : 'bold'} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
