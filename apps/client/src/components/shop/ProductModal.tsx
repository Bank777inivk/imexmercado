import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  X, ShoppingCart, Heart, ArrowRight,
  Truck, ShieldCheck, ArrowsCounterClockwise,
  Star, Minus, Plus, Package
} from '@phosphor-icons/react';
import { useCart } from '../../context/CartContext';

interface ProductModalProps {
  product: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews' | 'shipping'>('description');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedImage(product.image || '');
      setQty(1);
      setActiveTab('description');
    }
  }, [product]);

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
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleAddToCart = () => {
    if (!product) return;
    setIsAdding(true);
    for (let i = 0; i < qty; i++) addItem(product);
    setTimeout(() => setIsAdding(false), 1200);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  if (!isOpen || !product) return null;

  // All images (main + gallery)
  const allImages = [product.image, ...(product.images || [])].filter(Boolean);
  const inStock = (product.stock ?? 1) > 0;
  const productSlug = product.id || product.name?.toLowerCase().replace(/\s+/g, '-');
  const discountPct = product.price && product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null;

  const specs: { key: string; value: string }[] = product.specs || [];
  const tags: string[] = product.tags || [];

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
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-10 w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-all"
            aria-label="Fermer"
          >
            <X size={20} weight="bold" />
          </button>

          {/* ── Scrollable Content ── */}
          <div className="overflow-y-auto flex-1 overscroll-contain">
            <div className="grid grid-cols-1 md:grid-cols-2">
              
              {/* ── Gallery Column ── */}
              <div className="bg-gray-50 p-6 md:p-8 flex flex-col gap-4">
                {/* Main image */}
                <div 
                  className="aspect-square rounded-2xl overflow-hidden bg-white flex items-center justify-center relative cursor-zoom-in"
                  onMouseEnter={() => setIsZooming(true)}
                  onMouseLeave={() => setIsZooming(false)}
                  onMouseMove={handleMouseMove}
                >
                  <img
                    src={selectedImage || product.image}
                    alt={product.name}
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
                  <div className="flex gap-2 overflow-x-auto pb-1">
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
              </div>

              {/* ── Info Column ── */}
              <div className="p-6 md:p-8 flex flex-col gap-5 text-left">
                {/* Brand + name */}
                <div>
                  {product.brand && (
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg mb-2 inline-block">
                      {product.brand}
                    </span>
                  )}
                  <h2 className="text-lg md:text-xl font-black text-gray-900 leading-tight mt-2">
                    {product.name}
                  </h2>
                  {product.rating && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex text-primary">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={13} weight={i < Math.floor(product.rating) ? 'fill' : 'regular'} />
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold">
                        {product.rating} ({product.reviewCount || 0} avis)
                      </span>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="bg-gray-50 rounded-2xl p-4">
                  {product.oldPrice && (
                    <p className="text-sm text-gray-400 line-through font-bold">{product.oldPrice}€</p>
                  )}
                  <p className="text-3xl font-black text-primary">{product.price?.toFixed(2) ?? '—'}€</p>
                  <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">Prix TTC inclus</p>
                </div>

                {/* Stock status */}
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${inStock ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${inStock ? 'text-green-600' : 'text-red-500'}`}>
                    {inStock ? `En stock — ${product.stock} disponibles` : 'Rupture de stock'}
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
                      <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="p-2.5 text-gray-400 hover:text-primary">
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

                {/* Tabs Navigation */}
                <div className="flex border-b border-gray-100 mt-2">
                  {[
                    { id: 'description', label: 'Description' },
                    { id: 'specs', label: 'Caractéristiques' },
                    { id: 'shipping', label: 'Livraison' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`pb-3 px-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                        activeTab === tab.id ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {tab.label}
                      {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-in fade-in zoom-in duration-300" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[150px] py-2">
                  {activeTab === 'description' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <p className="text-xs leading-relaxed text-gray-500 font-medium">
                        {product.description || "Aucune description disponible pour ce produit."}
                      </p>
                    </div>
                  )}

                  {activeTab === 'specs' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {specs.length > 0 ? (
                        <div className="grid gap-2">
                          {specs.map((spec, i) => (
                            <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{spec.key}</span>
                              <span className="text-[10px] font-black text-gray-900">{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic">Aucune spécification technique.</p>
                      )}
                    </div>
                  )}

                  {activeTab === 'shipping' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
                      <div className="flex items-start gap-3 bg-blue-50/50 p-3 rounded-xl">
                        <Truck size={18} className="text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-black text-blue-900 uppercase">Livraison Standard</p>
                          <p className="text-[10px] text-blue-700/70 font-bold">Entre 3 et 5 jours ouvrés.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-green-50/50 p-3 rounded-xl">
                        <ShieldCheck size={18} className="text-green-500 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-black text-green-900 uppercase">Paiement 100% Sécurisé</p>
                          <p className="text-[10px] text-green-700/70 font-bold">SSL & Protection des données.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Trust Footer */}
                <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-6 mt-auto">
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
    </>
  );
}
