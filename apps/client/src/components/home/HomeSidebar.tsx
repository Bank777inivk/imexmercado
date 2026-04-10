import React, { useState, useEffect } from 'react';
import { Star, Quotes } from '@phosphor-icons/react';
import { getCollection } from '@imexmercado/firebase';

const adSlides = [
  {
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400&h=600',
    title: 'Interior Design',
    subtitle: 'Shop now',
    bgColor: 'bg-black/20'
  },
  {
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400&h=600',
    title: 'Living Room',
    subtitle: 'Collection 2026',
    bgColor: 'bg-blue-900/20'
  },
  {
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=400&h=600',
    title: 'Office Style',
    subtitle: 'Up to -30%',
    bgColor: 'bg-green-900/20'
  }
];

export function VerticalAdBanner() {
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === adSlides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[450px] overflow-hidden group mb-6">
      {adSlides.map((slide, idx) => (
        <div 
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${current === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <img 
            src={slide.image} 
            alt={slide.title} 
            className="w-full h-full object-cover transform transition-transform [transition-duration:10000ms] ease-linear scale-100 group-hover:scale-110"
          />
          <div className={`absolute inset-0 ${slide.bgColor} group-hover:bg-black/10 transition-colors p-6 flex flex-col justify-start`}>
            <h3 className="text-white text-2xl font-black leading-tight uppercase tracking-tighter shadow-sm mb-2">
              {slide.title.split(' ')[0]}<br/>{slide.title.split(' ')[1] || ''}
            </h3>
            <a href="#" className="text-white text-xs font-bold underline hover:no-underline transition-all">{slide.subtitle}</a>
          </div>
        </div>
      ))}
      
      {/* Dots for navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {adSlides.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${current === idx ? 'w-4 bg-white' : 'bg-white/50'}`}
          />
        ))}
      </div>

      {/* Decorative lines */}
      <div className="absolute top-4 left-4 right-4 bottom-4 border border-white/20 pointer-events-none z-20"></div>
    </div>
  );
}


export function LatestProductsSidebar({ products }: { products: any[] }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="bg-white p-5 border border-gray-200">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-widest border-l-4 border-primary pl-3">
          Derniers Produits
        </h3>
        <div className="flex gap-1">
          <div className="w-2 h-0.5 bg-primary"></div>
          <div className="w-1 h-0.5 bg-gray-300"></div>
        </div>
      </div>
      
      <div className="space-y-6">
        {products.slice(0, 3).map((product: any) => (
          <div key={product.id} className="flex gap-3 group cursor-pointer">
            <div className="w-16 h-16 bg-gray-50 flex-shrink-0 flex items-center justify-center border border-gray-100 group-hover:border-primary transition-colors">
              <img src={product.image} alt={product.name} className="w-12 h-12 object-contain" />
            </div>
            <div className="flex flex-col">
              <h4 className="text-[11px] font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-primary transition-colors mb-1">
                {product.name}
              </h4>
              <div className="flex items-center gap-0.5 text-yellow-400 mb-1">
                <Star size={10} weight="fill" />
                <Star size={10} weight="fill" />
                <Star size={10} weight="fill" />
                <Star size={10} weight="fill" />
                <Star size={10} weight="regular" className="text-gray-300" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary font-bold text-xs">€{product.price}</span>
                {product.oldPrice && (
                  <span className="text-[10px] text-gray-400 line-through">€{product.oldPrice}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PopularProductsSidebar({ products }: { products: any[] }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="bg-white p-5 border border-gray-200 mt-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-widest border-l-4 border-secondary pl-3">
          Populaires
        </h3>
        <div className="flex gap-1">
          <div className="w-2 h-0.5 bg-secondary"></div>
          <div className="w-1 h-0.5 bg-gray-300"></div>
        </div>
      </div>
      
      <div className="space-y-6">
        {products.slice(0, 3).map((product: any) => (
          <div key={product.id} className="flex gap-3 group cursor-pointer">
            <div className="w-16 h-16 bg-gray-50 flex-shrink-0 flex items-center justify-center border border-gray-100 group-hover:border-secondary transition-colors">
              <img src={product.image} alt={product.name} className="w-12 h-12 object-contain" />
            </div>
            <div className="flex flex-col">
              <h4 className="text-[11px] font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-secondary transition-colors mb-1">
                {product.name}
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-secondary font-bold text-xs">€{product.price}</span>
                {product.oldPrice && (
                  <span className="text-[10px] text-gray-400 line-through">€{product.oldPrice}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const stats = [
  { value: '300+', label: 'Références', subtext: 'En stock réel', emoji: '📦' },
  { value: '50', label: 'Produits', subtext: 'Par catégorie', emoji: '🗂️' },
  { value: '24h', label: 'Traitement', subtext: 'Commande express', emoji: '⚡' },
  { value: '100%', label: 'Vérifiés', subtext: 'Contrôle strict', emoji: '✅' },
];

export function EngagementSidebar() {
  return (
    <div className="bg-white p-5 border border-gray-200 mt-6 mb-10">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-widest border-l-4 border-primary pl-3">
          Engagement
        </h3>
        <div className="flex gap-1">
          <div className="w-2 h-0.5 bg-primary"></div>
          <div className="w-1 h-0.5 bg-gray-300"></div>
        </div>
      </div>
      
      <div className="space-y-3">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-transparent hover:border-primary transition-all group">
            <span className="text-xl">{stat.emoji}</span>
            <div className="flex flex-col">
              <span className="text-xs font-black text-gray-900 leading-none">{stat.value}</span>
              <span className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TestimonialSidebar() {
  const [data, setData] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const docs = await getCollection('testimonials');
        if (docs && docs.length > 0) {
          setData(docs);
          setIndex(Math.floor(Math.random() * docs.length));
        }
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (data.length === 0) return;
    const interval = setInterval(() => {
      setIndex(Math.floor(Math.random() * data.length));
    }, 20000);
    return () => clearInterval(interval);
  }, [data]);

  if (loading) return (
    <div className="bg-[#111111] rounded-2xl p-8 flex flex-col items-center gap-4 mt-6">
      <div className="w-16 h-16 rounded-full bg-white/5 animate-pulse" />
      <div className="h-2 w-24 bg-white/5 animate-pulse rounded" />
    </div>
  );

  if (data.length === 0) return null;

  const testimonial = data[index];

  return (
    <div className="bg-[#111111] rounded-2xl overflow-hidden mt-6 mb-10 shadow-xl border border-white/5 group relative">
      <div className="bg-primary/10 px-5 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Feedback em Tempo Real</span>
        </div>
        <Quotes size={24} weight="fill" className="text-primary/40 group-hover:scale-110 transition-transform" />
      </div>

      <div className="p-6 flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-full border-2 border-primary overflow-hidden shadow-lg shadow-primary/20">
            <img 
              src={testimonial.image} 
              alt={testimonial.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full text-[10px] shadow-md">
            ✅
          </div>
        </div>

        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} weight="fill" className="text-yellow-400" />
          ))}
        </div>

        <blockquote className="mt-2 group-hover:scale-[1.02] transition-transform duration-500">
          <p className="text-sm font-medium text-gray-200 leading-relaxed italic">
            "{testimonial.text}"
          </p>
        </blockquote>

        <div className="mt-6 pt-4 border-t border-white/10 w-full">
          <p className="text-xs font-black text-white uppercase">{testimonial.name}</p>
          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-tight">
            {testimonial.location}, PT — <span className="text-primary/70">{testimonial.category}</span>
          </p>
        </div>
      </div>
    </div>
  );
}


export function HomeSidebar({ latestProducts, popularProducts }: { latestProducts: any[], popularProducts: any[] }) {
  return (
    <aside className="w-[250px] hidden lg:block flex-shrink-0">
      <div className="sticky top-20">
        <VerticalAdBanner />
        <LatestProductsSidebar products={latestProducts} />
        <PopularProductsSidebar products={popularProducts} />
        <EngagementSidebar />
        <TestimonialSidebar />
      </div>
    </aside>
  );
}
