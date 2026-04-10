import React from 'react';

const categories = [
  { name: 'Téléphones & Hi-Tech', image: 'https://placehold.co/100x100/eeeeee/999999?text=Tech' },
  { name: 'Maison', image: 'https://placehold.co/100x100/eeeeee/999999?text=Maison' },
  { name: 'Meubles', image: 'https://placehold.co/100x100/eeeeee/999999?text=Meubles' },
  { name: 'Bricolage', image: 'https://placehold.co/100x100/eeeeee/999999?text=Brico' },
  { name: 'BBQ', image: 'https://placehold.co/100x100/eeeeee/999999?text=BBQ' },
  { name: 'Piscines', image: 'https://placehold.co/100x100/eeeeee/999999?text=Piscines' },
];

export function CategoryGrid() {
  return (
    <div className="bg-bg-subtle py-6 md:py-8">
      <div className="container mx-auto px-0 md:px-4">
        
        {/* Banner with arrow */}
        <div className="mx-4 md:mx-0 bg-gray-200 rounded-lg py-3 px-6 flex justify-between items-center mb-6 md:mb-8 cursor-pointer hover:bg-gray-300 transition-colors">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex flex-col gap-1">
              <span className="block w-5 h-0.5 bg-black"></span>
              <span className="block w-5 h-0.5 bg-black"></span>
              <span className="block w-5 h-0.5 bg-black"></span>
            </div>
            <span className="text-[11px] md:text-sm font-bold text-gray-800 uppercase tracking-tight">Actualités, conseils et inspiration</span>
          </div>
          <span className="text-xl font-bold text-primary">&gt;</span>
        </div>

        {/* Category Icons Grid */}
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-y-6 md:gap-y-8 gap-x-2 md:gap-x-4 justify-items-center px-4 lg:px-0">
          {categories.map((cat, idx) => (
            <a href="#" key={idx} className="flex flex-col items-center gap-2 md:gap-3 w-full max-w-[85px] md:max-w-[112px] group">
              <div className="w-[70px] h-[70px] md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center p-2 shadow-[0_2px_10px_rgba(0,0,0,0.06)] group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-all duration-300 md:group-hover:-translate-y-1">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="text-[10px] md:text-sm font-bold md:font-semibold text-center text-gray-800 leading-tight">
                {cat.name}
              </span>
            </a>
          ))}
        </div>
        
      </div>
    </div>
  );
}
