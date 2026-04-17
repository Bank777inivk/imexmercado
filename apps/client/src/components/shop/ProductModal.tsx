import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  X, ShoppingCart, Heart, ArrowRight,
  Truck, ShieldCheck, ArrowsCounterClockwise,
  Star, Minus, Plus, Package
} from '@phosphor-icons/react';
import { useCart } from '../../context/CartContext';
import { subscribeToCollection } from '@imexmercado/firebase';
import { getOptimizedImageUrl } from '@imexmercado/ui';

interface ProductModalProps {
  product: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [isFullViewOpen, setIsFullViewOpen] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // Sync internal state with prop
  useEffect(() => {
    if (product) {
      setCurrentProduct(product);
      setSelectedImage(product.image || '');
      setQty(1);
      setIsDescExpanded(false);
    }
  }, [product]);

  // Fetch all products for recommendations
  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = subscribeToCollection('products', (data) => {
      setAllProducts(data);
    });
    return () => unsubscribe();
  }, [isOpen]);

  const p = currentProduct || product;

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Escape key to close
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (isFullViewOpen) setIsFullViewOpen(false);
      else onClose();
    }
  }, [onClose, isFullViewOpen]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleAddToCart = () => {
    if (!p) return;
    setIsAdding(true);
    for (let i = 0; i < qty; i++) addItem(p);
    setTimeout(() => setIsAdding(false), 1200);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomPos({ x, y });
  };

  if (!isOpen || !p) return null;

  // All images (main + gallery)
  const allImages = [p.image, ...(p.images || [])].filter(Boolean);
  const inStock = (p.stock ?? 1) > 0;
  const productSlug = p.id || p.name?.toLowerCase().replace(/\s+/g, '-');
  const discountPct = p.price && p.oldPrice
    ? Math.round((1 - p.price / p.oldPrice) * 100)
    : null;

  const tags: string[] = p.tags || [];

  // Compute similar products
  const similarProducts = allProducts
    .filter(item => item.id !== p.id && item.category === p.category)
    .slice(0, 4);

  const formatProductDescription = (text: string) => {
    if (!text) return "";
    return text
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\n\n/g, '<div class="h-4"></div>')
      .replace(/\n/g, '<br/>');
  };

  const extractSpecsFromText = (text: string) => {
    if (!text) return [];
    const extracted: { key: string; value: string }[] = [];
    // Regex pour capturer "Clé : Valeur" ou "**Clé** : Valeur"
    const regex = /(?:\n|^)(?:\*\*)?([^*:\n\r]{2,35})(?:\*\*)?\s*[:]\s*([^\n\r]+)/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      const key = match[1].trim();
      let value = match[2].trim();
      // On ignore les titres trop longs, les mots génériques ou les tags
      const isKeyword = ['Palavras-chave', 'Keywords', 'Mots-clés', 'Description', 'Garantie', 'Identificação'].some(k => key.toLowerCase().includes(k.toLowerCase()));
      
      if (key.length > 2 && value.length > 0 && key.length < 40 && !isKeyword) {
        // Nettoyage des pipes pour un meilleur rendu
        value = value.replace(/\|\s*/g, '\n');
        extracted.push({ key, value });
      }
    }
    return extracted;
  };

  // Merge native specs with auto-extracted ones
  const nativeSpecs = p.specs || [];
  const extractedSpecs = extractSpecsFromText(p.description);
  const specs: { key: string; value: string }[] = [...nativeSpecs];
  
  extractedSpecs.forEach(ext => {
    if (!specs.find(s => s.key.toLowerCase() === ext.key.toLowerCase())) {
      specs.push(ext);
    }
  });

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Modal Panel ── */}
      <div
        className="fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center z-[110] p-0 md:p-6"
        role="dialog"
        aria-modal="true"
      >
        <div className="relative bg-white w-full md:max-w-5xl md:rounded-[2.5rem] rounded-t-[2rem] overflow-hidden shadow-2xl max-h-[95dvh] md:max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-4 md:zoom-in-95 duration-300">
          
          {/* Mobile Handle */}
          <div className="md:hidden w-12 h-1.5 bg-gray-200 rounded-full mx-auto my-4 flex-shrink-0" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:top-5 md:right-5 z-20 w-10 h-10 flex items-center justify-center bg-gray-100/80 backdrop-blur-sm hover:bg-gray-200 text-gray-700 rounded-full transition-all"
            aria-label="Fermer"
          >
            <X size={20} weight="bold" />
          </button>

          {/* ── Scrollable Content ── */}
          <div className="overflow-y-auto flex-1 overscroll-contain">
            <div className="flex flex-col md:grid md:grid-cols-2">
              
              {/* ── Gallery Column ── */}
              <div className="bg-gray-50 flex flex-col gap-4 p-4 md:p-8 order-1 md:order-1">
                {/* Main image */}
                <div 
                  className="aspect-square rounded-2xl overflow-hidden bg-white flex items-center justify-center relative cursor-zoom-in group/main"
                  onMouseEnter={() => setIsZooming(true)}
                  onMouseLeave={() => setIsZooming(false)}
                  onMouseMove={handleMouseMove}
                  onClick={() => setIsFullViewOpen(true)}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover/main:bg-black/5 transition-colors z-10 flex items-center justify-center opacity-0 group-hover/main:opacity-100">
                    <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-xl transform translate-y-4 group-hover/main:translate-y-0 transition-all duration-300">
                      <ArrowRight size={20} className="text-gray-900 -rotate-45" />
                    </div>
                  </div>
                  <img
                    src={selectedImage || p.image}
                    alt={p.name}
                    className="w-full h-full object-contain p-6 transition-transform duration-300 ease-out"
                    style={{
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      transform: isZooming ? 'scale(2.5)' : 'scale(1)'
                    }}
                  />
                  {discountPct && discountPct > 0 && (
                    <span className="absolute top-4 right-4 bg-red-500 text-white text-[11px] font-black px-3 py-1.5 rounded-full shadow-lg">
                      -{discountPct}%
                    </span>
                  )}
                </div>
                {/* Thumbnails */}
                {allImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 order-3 md:order-2">
                    {allImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(img)}
                        className={`w-14 h-14 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                          selectedImage === img ? 'border-primary shadow-md' : 'border-gray-100 hover:border-gray-300'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Section: Similar Products (Desktop only here) */}
                {similarProducts.length > 0 && (
                  <div className="hidden md:block animate-in fade-in slide-in-from-bottom-2 duration-300 mt-8 pt-8 border-t border-gray-100 order-last">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900 mb-5 flex items-center justify-between">
                      <span>Vous aimerez aussi</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {similarProducts.map((item) => (
                        <button
                          key={item.id || item.name}
                          onClick={() => {
                            setCurrentProduct(item);
                            setSelectedImage(item.image || '');
                            setQty(1);
                            document.querySelector('.overflow-y-auto')?.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="flex items-center gap-3 p-2 rounded-2xl bg-white border border-gray-100 hover:border-primary/30 hover:shadow-sm transition-all group text-left"
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-50 group-hover:scale-105 transition-transform duration-300">
                            <img src={getOptimizedImageUrl(item.image, 200)} alt="" className="w-full h-full object-contain p-1" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <p className="text-[9px] font-black text-gray-900 truncate leading-tight uppercase group-hover:text-primary transition-colors">{item.name}</p>
                            <p className="text-[10px] font-black text-primary mt-0.5">{item.price?.toFixed(2)}€</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ── Info Column ── */}
              <div className="p-6 md:p-8 flex flex-col gap-5 text-left order-2 md:order-2">
                {/* Brand + name */}
                <div>
                  {p.brand && (
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg mb-2 inline-block">
                      {p.brand}
                    </span>
                  )}
                  <h2 className="text-lg md:text-xl font-black text-gray-900 leading-tight mt-2">
                    {p.name}
                  </h2>
                  {p.rating && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex text-primary">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={13} weight={i < Math.floor(p.rating) ? 'fill' : 'regular'} />
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold">
                        {p.rating} ({p.reviewCount || 0} avis)
                      </span>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="bg-gray-50 rounded-2xl p-4">
                  {p.oldPrice && (
                    <p className="text-sm text-gray-400 line-through font-bold">{p.oldPrice}€</p>
                  )}
                  <p className="text-3xl font-black text-primary">{p.price?.toFixed(2) ?? '—'}€</p>
                  <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">Prix TTC inclus</p>
                </div>

                {/* Stock status */}
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${inStock ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${inStock ? 'text-green-600' : 'text-red-500'}`}>
                    {inStock ? `En stock — ${p.stock} disponibles` : 'Rupture de stock'}
                  </span>
                </div>

                {/* Qty + Add to cart */}
                {inStock && (
                  <div className="flex gap-3">
                    <div className="flex items-center border-2 border-gray-100 rounded-xl bg-gray-50 p-1">
                      <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2.5 text-gray-400 hover:text-primary">
                        <Minus size={16} weight="bold" />
                      </button>
                      <span className="w-8 text-center font-black text-gray-900 text-sm">{qty}</span>
                      <button onClick={() => setQty(Math.min(p.stock, qty + 1))} className="p-2.5 text-gray-400 hover:text-primary">
                        <Plus size={16} weight="bold" />
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={isAdding}
                      className="flex-1 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-70"
                    >
                      {isAdding ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Ajouté !
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={17} weight="bold" />
                          Ajouter au panier
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* ── Content Sections (Vertical Flow) ── */}
                <div className="flex flex-col gap-8 mt-4">
                  
                  {/* Section: Description */}
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900 mb-3 flex items-center gap-2">
                       Description
                    </h4>
                    <div className="relative">
                      <div 
                        className={`text-[11px] leading-relaxed text-gray-600 font-medium overflow-hidden transition-all duration-500 ease-in-out ${!isDescExpanded ? 'max-h-[120px]' : 'max-h-[2000px]'}`}
                        dangerouslySetInnerHTML={{ __html: formatProductDescription(p.description) }}
                      />
                      {p.description && p.description.length > 250 && !isDescExpanded && (
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                      )}
                    </div>
                    {p.description && p.description.length > 250 && (
                      <button 
                        onClick={() => setIsDescExpanded(!isDescExpanded)}
                        className="mt-2 text-[9px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1"
                      >
                        {isDescExpanded ? (
                          <>Voir moins <Minus size={10} weight="bold" /></>
                        ) : (
                          <>Afficher la suite <Plus size={10} weight="bold" /></>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Section: Specifications */}
                  {specs.length > 0 && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 pt-6 border-t border-gray-100">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900 mb-4 flex items-center gap-2">
                        Caractéristiques
                      </h4>
                      <div className="grid gap-0 border-t border-gray-100">
                        {specs.map((spec, i) => (
                          <div key={i} className="grid grid-cols-[100px,1fr] md:grid-cols-[140px,1fr] gap-4 py-3 border-b border-gray-50 last:border-0 items-start group">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest pt-1 group-hover:text-primary transition-colors">{spec.key}</span>
                            <span className="text-[11px] font-bold text-gray-900 leading-relaxed whitespace-pre-line">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Section: Shipping & Security */}
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 pt-6 border-t border-gray-100">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900 mb-3 flex items-center gap-2">
                      Livraison & Garantie
                    </h4>
                    <div className="grid gap-3">
                      <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <Truck size={18} className="text-primary mt-0.5" />
                        <div>
                          <p className="text-[10px] font-black text-gray-900 uppercase">Livraison Standard Gratuit</p>
                          <p className="text-[10px] text-gray-500 font-bold">Expédition sous 24/48h.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <ShieldCheck size={18} className="text-primary mt-0.5" />
                        <div>
                          <p className="text-[10px] font-black text-gray-900 uppercase">Paiement Sécurisé</p>
                          <p className="text-[10px] text-gray-500 font-bold">Protection totale de vos achats.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section: Reviews Summary */}
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 pt-6 border-t border-gray-100 mb-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900 mb-3 flex items-center gap-2">
                      Avis Clients
                    </h4>
                    <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between border border-gray-100">
                      <div>
                        <div className="flex text-primary mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} weight={i < Math.floor(p.rating || 4) ? 'fill' : 'regular'} />
                          ))}
                        </div>
                        <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Note globale : {p.rating || '4.5'}/5</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-primary">{p.reviewCount || '12'} avis</p>
                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest underline cursor-pointer">Lire les avis</p>
                      </div>
                    </div>
                  </div>
                </div>

                  {/* Section: Similar Products (Mobile only here) */}
                  {similarProducts.length > 0 && (
                    <div className="md:hidden animate-in fade-in slide-in-from-bottom-2 duration-300 mt-8 pt-8 border-t border-gray-100">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900 mb-5 flex items-center justify-between">
                        <span>Vous aimerez aussi</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {similarProducts.map((item) => (
                          <button
                            key={item.id || item.name}
                            onClick={() => {
                              setCurrentProduct(item);
                              setSelectedImage(item.image || '');
                              setQty(1);
                              document.querySelector('.overflow-y-auto')?.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="flex items-center gap-2 p-2 rounded-2xl bg-gray-50 border border-gray-100 active:scale-95 transition-all text-left"
                          >
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-gray-50">
                              <img src={getOptimizedImageUrl(item.image, 200)} alt="" className="w-full h-full object-contain p-1" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <p className="text-[8px] font-black text-gray-900 truncate leading-tight uppercase">{item.name}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Trust Footer (Icones simples) */}
                <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-6 mt-4">
                  {[
                    { icon: Truck, label: 'Livraison Rapide' },
                    { icon: ArrowsCounterClockwise, label: 'Retours Faciles' },
                    { icon: ShieldCheck, label: 'Sécurisé' },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center mb-2">
                        <Icon size={16} className="text-primary" />
                      </div>
                      <p className="text-[7px] font-black uppercase text-gray-400 tracking-tighter">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Image Full View (Lightbox) ── */}
      {isFullViewOpen && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300 p-4 md:p-12"
          onClick={() => setIsFullViewOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setIsFullViewOpen(false)}
            className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/10 backdrop-blur-md"
            aria-label="Fermer la vue plein écran"
          >
            <X size={24} weight="bold" />
          </button>

          <div 
            className="relative w-full h-full flex items-center justify-center animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImage || p.image} 
              alt={p.name} 
              className="max-w-full max-h-full object-contain drop-shadow-2xl" 
            />
            {p.brand && (
              <div className="absolute bottom-0 left-0 right-0 p-8 text-center bg-gradient-to-t from-black/50 to-transparent pointer-events-none">
                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">{p.brand}</p>
                <h3 className="text-white font-black text-xl uppercase tracking-tight">{p.name}</h3>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
