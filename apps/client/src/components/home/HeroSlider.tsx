import React, { useState, useEffect } from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { CategorySidebar } from './CategorySidebar';

const slides = [
  {
    id: 1,
    image: 'https://placehold.co/800x500/662288/ffffff?text=Hi-Tech',
    title: 'OFFRE DE LANCEMENT',
    subtitle: 'Jusqu\'à 20% de réduction sur Téléphones & Hi-Tech',
    ctaText: 'VOIR LES PRODUITS',
  },
  {
    id: 2,
    image: 'https://placehold.co/800x500/0033cc/ffffff?text=Maison',
    title: 'AMÉNAGEZ VOTRE INTÉRIEUR',
    subtitle: 'Découvrez notre nouvelle collection de Meubles design',
    ctaText: 'VOIR LA COLLECTION',
  },
  {
    id: 3,
    image: 'https://placehold.co/800x500/009933/ffffff?text=Jardin',
    title: 'PRÉPAREZ L\'ÉTÉ',
    subtitle: 'Promotions exceptionnelles sur l\'univers BBQ et Piscines',
    ctaText: 'S\'ÉQUIPER MAINTENANT',
  }
];

export function HeroSlider({ isSidebarOpen = true }: { isSidebarOpen?: boolean }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent(current === slides.length - 1 ? 0 : current + 1);
  const prevSlide = () => setCurrent(current === 0 ? slides.length - 1 : current - 1);

  return (
    <div className="bg-bg-subtle pb-4">
      {/* Mobile-first wrapper, no padding on mobile to let slider stretch full width */}
      <div className="container mx-auto px-0 md:px-4">
        {/* Grille Principal : Sidebar (L) | Slider (M) | Banners (R) */}
        <div className="flex flex-col lg:flex-row">
          
          {/* 1. Category Sidebar — fixed 250px on desktop */}
          <div className="hidden lg:block">
             <CategorySidebar isOpen={isSidebarOpen} />
          </div>

          {/* 2. Right Side Content Segment (Slider + Banners) */}
          <div className={`flex-1 flex flex-col md:flex-row gap-2 mt-0 md:mt-4 lg:pt-4 lg:mt-0 ${isSidebarOpen ? 'lg:ml-2' : ''}`}>
            
            {/* Main Slider (Center) */}
            {/* Reduced height significantly on mobile! */}
            <div className="relative flex-[2] h-[220px] sm:h-[300px] lg:h-[450px] overflow-hidden group">
              <div 
                className="flex transition-transform duration-500 ease-out h-full"
                style={{ transform: `translateX(-${current * 100}%)` }}
              >
                {slides.map((slide) => (
                  <div key={slide.id} className="min-w-full h-full relative">
                    <img 
                      src={slide.image} 
                      alt={slide.title} 
                      className="w-full h-full object-cover"
                    />
                    {/* Dark gradient overlay for extreme text legibility on mobile */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute inset-0 flex flex-col justify-center items-start p-6 md:p-14 text-white max-w-sm md:max-w-lg">
                      <p className="text-[9px] md:text-sm font-black uppercase tracking-widest text-primary mb-2">
                        {slide.title}
                      </p>
                      <h2 className="text-xl md:text-3xl lg:text-5xl font-extrabold leading-tight mb-4 md:mb-8 drop-shadow-md">
                        {slide.subtitle}
                      </h2>
                      <button className="bg-white text-black font-black uppercase py-2 md:py-2.5 px-4 md:px-6 rounded-full md:hover:bg-gray-100 transition-colors shadow-lg text-[10px] md:text-sm active:scale-95">
                        {slide.ctaText}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows (Hidden on mobile to save space, relies on auto-slide or swipe) */}
              <button 
                onClick={prevSlide}
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-transparent text-white hover:bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <CaretLeft size={32} weight="bold" />
              </button>
              <button 
                onClick={nextSlide}
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-transparent text-white hover:bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <CaretRight size={32} weight="bold" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2">
                {slides.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className={`h-1.5 md:h-1.5 rounded-full transition-all ${current === idx ? 'w-6 md:w-8 bg-white' : 'w-2 bg-white/50'}`}
                  />
                ))}
              </div>
            </div>

            {/* Static Banners (Right) - HIDDEN ON MOBILE completely to prevent clutter */}
            <div className="hidden md:flex flex-1 flex-col gap-2 h-auto md:h-[300px] lg:h-[450px]">
               
               {/* Banner 1 */}
               <div className="relative w-full h-1/2 bg-[#5d3b8e] overflow-hidden group cursor-pointer block rounded-tr-md">
                  <img 
                    src="https://placehold.co/400x225/5d3b8e/ffffff?text=Promo+Bricolage" 
                    alt="Promo 1" 
                    className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-50 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 p-6 flex flex-col justify-center text-white">
                    <p className="text-[9px] font-bold uppercase tracking-wider mb-2">PROMOTION JUSQU'AU 21 AVRIL</p>
                    <h3 className="text-lg md:text-xl font-black leading-tight">
                      Jusqu'à -15% sur l'outillage de Bricolage
                    </h3>
                    <div className="mt-auto self-end">
                      <span className="text-xl font-bold">&rarr;</span>
                    </div>
                  </div>
               </div>

               {/* Banner 2 */}
               <div className="relative w-full h-1/2 bg-black overflow-hidden group cursor-pointer block rounded-br-md">
                  <img 
                    src="https://placehold.co/400x225/111111/ffffff?text=Promo+Maison" 
                    alt="Promo 2" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 p-6 flex flex-col justify-center text-white">
                    <p className="text-[9px] font-bold uppercase tracking-wider mb-2 text-gray-300">SÉLECTION MAISON</p>
                    <h3 className="text-lg md:text-xl font-black leading-tight text-white mb-2">
                      Jusqu'à 55% de réduction directe
                    </h3>
                    <div className="mt-auto self-end">
                      <span className="text-xl font-bold">&rarr;</span>
                    </div>
                  </div>
               </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
