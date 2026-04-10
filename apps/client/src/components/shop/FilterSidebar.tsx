import React, { useState } from 'react';
import { CaretDown, CaretUp, Check } from '@phosphor-icons/react';

const categories = [
  'Téléphones & Hi-Tech',
  'Maison & Décoration',
  'Meubles & Lampes',
  'Bricolage',
  'Barbecues & Planchas',
  'Piscines & Spas',
];

const brands = ['Samsung', 'Apple', 'IKEA', 'Bosch', 'Weber', 'Intex', 'Philips', 'Sony', 'Herman Miller', 'Roborock'];

const colors = [
  { name: 'Noir', hex: '#000000' },
  { name: 'Blanc', hex: '#FFFFFF', border: true },
  { name: 'Gris', hex: '#808080' },
  { name: 'Rouge', hex: '#FF0000' },
  { name: 'Bleu', hex: '#0000FF' },
  { name: 'Vert', hex: '#008000' },
  { name: 'Bois', hex: '#DEB887' },
  { name: 'Titane', hex: '#A0A0A0' },
];

export function FilterSidebar({ 
  activeFilters, 
  onFilterChange 
}: { 
  activeFilters: any; 
  onFilterChange: (type: string, value: any) => void 
}) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    brands: true,
    colors: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev: any) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <aside className="w-full lg:w-64 space-y-6">
      
      {/* Categories */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-lg overflow-hidden">
        <button 
          onClick={() => toggleSection('categories')}
          className="w-full flex items-center justify-between p-4 text-xs font-black uppercase tracking-widest text-gray-900 border-b border-gray-50 bg-gray-50/50"
        >
          <span>Catégories</span>
          {expandedSections.categories ? <CaretUp size={14} weight="bold" /> : <CaretDown size={14} weight="bold" />}
        </button>
        {expandedSections.categories && (
          <div className="p-4 space-y-2">
            {categories.map((cat) => (
              <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={activeFilters.categories.includes(cat)}
                  onChange={() => onFilterChange('categories', cat)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">{cat}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-lg overflow-hidden">
        <button 
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between p-4 text-xs font-black uppercase tracking-widest text-gray-900 border-b border-gray-50 bg-gray-50/50"
        >
          <span>Prix (€)</span>
          {expandedSections.price ? <CaretUp size={14} weight="bold" /> : <CaretDown size={14} weight="bold" />}
        </button>
        {expandedSections.price && (
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                placeholder="Min" 
                value={activeFilters.priceRange.min}
                onChange={(e) => onFilterChange('priceMin', e.target.value)}
                className="w-full text-xs p-2 border border-gray-200 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
              <span className="text-gray-400">—</span>
              <input 
                type="number" 
                placeholder="Max" 
                value={activeFilters.priceRange.max}
                onChange={(e) => onFilterChange('priceMax', e.target.value)}
                className="w-full text-xs p-2 border border-gray-200 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Brands */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-lg overflow-hidden">
        <button 
          onClick={() => toggleSection('brands')}
          className="w-full flex items-center justify-between p-4 text-xs font-black uppercase tracking-widest text-gray-900 border-b border-gray-50 bg-gray-50/50"
        >
          <span>Marques</span>
          {expandedSections.brands ? <CaretUp size={14} weight="bold" /> : <CaretDown size={14} weight="bold" />}
        </button>
        {expandedSections.brands && (
          <div className="p-4 space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={activeFilters.brands.includes(brand)}
                  onChange={() => onFilterChange('brands', brand)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Colors */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-lg overflow-hidden">
        <button 
          onClick={() => toggleSection('colors')}
          className="w-full flex items-center justify-between p-4 text-xs font-black uppercase tracking-widest text-gray-900 border-b border-gray-50 bg-gray-50/50"
        >
          <span>Couleurs</span>
          {expandedSections.colors ? <CaretUp size={14} weight="bold" /> : <CaretDown size={14} weight="bold" />}
        </button>
        {expandedSections.colors && (
          <div className="p-4 grid grid-cols-4 gap-3">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => onFilterChange('colors', color.name)}
                title={color.name}
                className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center
                  ${activeFilters.colors.includes(color.name) ? 'border-primary' : color.border ? 'border-gray-200' : 'border-transparent'}
                `}
                style={{ backgroundColor: color.hex }}
              >
                {activeFilters.colors.includes(color.name) && (
                  <Check size={14} weight="bold" className={color.name === 'Blanc' ? 'text-black' : 'text-white'} />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

    </aside>
  );
}
