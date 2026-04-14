import React, { useState, useEffect } from 'react';
import { subscribeToDocument } from '@imexmercado/firebase';

const DEFAULT_CATEGORIES = [
  {
    name: 'Téléphones & Hi-Tech',
    short: 'Tech',
    link: '/boutique?category=T%C3%A9l%C3%A9phones+%26+Hi-Tech',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=200',
  },
  {
    name: 'Maison & Décoration',
    short: 'Maison',
    link: '/boutique?category=Maison+%26+D%C3%A9coration',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=200',
  },
  {
    name: 'Meubles & Lampes',
    short: 'Meubles',
    link: '/boutique?category=Meubles+%26+Lampes',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=200',
  },
  {
    name: 'Bricolage',
    short: 'Brico',
    link: '/boutique?category=Bricolage',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=200',
  },
  {
    name: 'Barbecues & Planchas',
    short: 'BBQ',
    link: '/boutique?category=Barbecues+%26+Planchas',
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&q=80&w=200',
  },
  {
    name: 'Piscines & Spas',
    short: 'Piscines',
    link: '/boutique?category=Piscines+%26+Spas',
    image: 'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?auto=format&fit=crop&q=80&w=200',
  },
];

export function CategoryGrid() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [blogBanner, setBlogBanner] = useState({ 
    title: 'Actualités, conseils et inspiration', 
    link: '/actualites', 
    isActive: true 
  });

  useEffect(() => {
    const unsubscribe = subscribeToDocument('settings', 'homepage', (data) => {
      if (data) {
        if (data.homeCategories) setCategories(data.homeCategories);
        if (data.blogBanner) setBlogBanner(data.blogBanner);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-bg-subtle py-6 md:py-8 w-full px-4 md:px-8 lg:px-12">
      <div className="w-full">
        
        {/* Banner with arrow */}
        {blogBanner.isActive && (
          <a 
            href={blogBanner.link}
            className="mx-4 md:mx-0 bg-gray-200 rounded-lg py-3 px-6 flex justify-between items-center mb-6 md:mb-8 cursor-pointer hover:bg-gray-300 transition-colors"
          >
            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex flex-col gap-1">
                <span className="block w-5 h-0.5 bg-black"></span>
                <span className="block w-5 h-0.5 bg-black"></span>
                <span className="block w-5 h-0.5 bg-black"></span>
              </div>
              <span className="text-[11px] md:text-sm font-bold text-gray-800 uppercase tracking-tight">{blogBanner.title}</span>
            </div>
            <span className="text-xl font-bold text-primary">&gt;</span>
          </a>
        )}

        {/* Category Icons Grid */}
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-y-6 md:gap-y-8 gap-x-2 md:gap-x-4 justify-items-center px-4 lg:px-0">
          {categories.map((cat, idx) => (
            <a href={cat.link} key={idx} className="flex flex-col items-center gap-2 md:gap-3 w-full max-w-[85px] md:max-w-[112px] group">
              <div className="w-[70px] h-[70px] md:w-24 md:h-24 bg-white rounded-full overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.08)] group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all duration-300 md:group-hover:-translate-y-1.5 ring-2 ring-transparent group-hover:ring-primary/20">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => { e.currentTarget.src = `https://placehold.co/200x200/eeeeee/999999?text=${cat.short}`; }}
                />
              </div>
              <span className="text-[10px] md:text-xs font-bold text-center text-gray-700 leading-tight group-hover:text-primary transition-colors">
                {cat.short || cat.name}
              </span>
            </a>
          ))}
        </div>
        
      </div>
    </div>
  );
}
