import React, { useState, useEffect, useRef } from 'react';
import { subscribeToDocument } from '@imexmercado/firebase';
import { CaretLeft, CaretRight } from '@imexmercado/ui';
import { ProductCard } from './ProductCard';

function useCountdown(settings: any) {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    if (!settings) return;

    const calculate = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(settings.endHour ?? 23, settings.endMinute ?? 59, 0, 0);
      
      let diff = target.getTime() - now.getTime();
      if (diff < 0) diff = 0;

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTime({ h, m, s });
    };

    calculate();
    const t = setInterval(calculate, 1000);
    return () => clearInterval(t);
  }, [settings]);

  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(time.h)}:${pad(time.m)}:${pad(time.s)}`;
}

interface FlashSaleSectionProps {
  products: any[];
  onViewDetails?: (product: any) => void;
}

export function FlashSaleSection({ products, onViewDetails }: FlashSaleSectionProps) {
  const [settings, setSettings] = useState<any>(null);
  const countdown = useCountdown(settings);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToDocument('settings', 'homepage', (data) => {
      if (data && data.flashSale) {
        setSettings(data.flashSale);
      }
    });
    return () => unsubscribe();
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    
    if (dir === 'right') {
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;
      if (isAtEnd) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
      }
    } else {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (isHovered || products.length === 0) return;
    const timer = setInterval(() => {
      scroll('right');
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovered, products.length]);

  if (products.length === 0) return null;

  return (
    <div 
      className="bg-white group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* Section Header — eMarket style */}
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-extrabold text-gray-900 uppercase tracking-wide border-b-2 border-primary pb-2 pr-4 -mb-[9px] z-10 whitespace-nowrap">
            {settings?.title || 'Offres du Jour'}
          </h2>
          <div className="flex items-center gap-1 bg-primary text-white text-[10px] font-bold px-2 py-1">
            <span>FLASHSALE</span>
            <span className="w-[60px] text-center">{countdown}</span>
          </div>
        </div>
      </div>

      {/* Scrollable Carousel Wrapper */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-2 md:gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-2"
        >
          {products.map((product, idx) => (
            <div key={product.id || idx} className="min-w-[160px] max-w-[160px] md:min-w-[210px] md:max-w-[210px]">
              <ProductCard product={product} index={idx} onViewDetails={onViewDetails} />
            </div>
          ))}
        </div>

        {/* Navigation Arrows — Floating on sides, visible on hover */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 flex items-center justify-center bg-white shadow-xl text-gray-600 hover:text-primary transition-all rounded-full opacity-0 group-hover:opacity-100 z-20 border border-gray-100"
        >
          <CaretLeft size={20} weight="bold" />
        </button>
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 flex items-center justify-center bg-white shadow-xl text-gray-600 hover:text-primary transition-all rounded-full opacity-0 group-hover:opacity-100 z-20 border border-gray-100"
        >
          <CaretRight size={20} weight="bold" />
        </button>
      </div>
    </div>
  );
}


