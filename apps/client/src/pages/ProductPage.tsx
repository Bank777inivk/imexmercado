import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, ShoppingCart, Heart, ShareNetwork, 
  Truck, ArrowsCounterClockwise, ShieldCheck,
  Minus, Plus, Check
} from '@phosphor-icons/react';
import { ProductCard as ProductCardComponent } from '../components/home/ProductCard';
import { subscribeToDocument, subscribeToCollection } from '@imexmercado/firebase';
import { getOptimizedImageUrl } from '@imexmercado/ui';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export function ProductPage() {
  const { productSlug } = useParams();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);
  const [copied, setCopied] = useState(false);

  const isFavorite = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    if (!productSlug) return;
    setLoading(true);
    const unsubscribe = subscribeToDocument('products', productSlug, (data) => {
      if (data) {
        setProduct(data);
        if (!selectedImage) {
          setSelectedImage(data.image || '');
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [productSlug, selectedImage]);

  useEffect(() => {
    if (!product) return;
    const unsubscribe = subscribeToCollection('products', (data) => {
      const filtered = data
        .filter((p: any) => p.category === product.category && p.id !== product.id)
        .slice(0, 4);
      setRelatedProducts(filtered);
    });
    return () => unsubscribe();
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    setIsAdding(true);
    for (let i = 0; i < qty; i++) {
      addItem(product);
    }
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Découvrez ${product.name} sur ImexMercado`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Error copying:', err);
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-bg flex items-center justify-center font-black uppercase text-gray-400 tracking-widest text-xs">Chargement...</div>;
  }

  if (!product) {
    return <div className="min-h-screen bg-bg flex items-center justify-center font-black uppercase text-gray-400 tracking-widest text-xs">Produit introuvable.</div>;
  }

  return (
    <div className="bg-bg min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
          <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
          <span className="text-gray-300">/</span>
          <Link to="/boutique" className="hover:text-primary transition-colors">Boutique</Link>
          <span className="text-gray-300">/</span>
          <Link to={`/category/${product.category}`} className="hover:text-primary transition-colors">{product.category}</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 p-4 sm:p-6 md:p-12">
            
            {/* Gallery Column */}
            <div className="space-y-6">
              <div className="aspect-square bg-white border border-gray-100 rounded-3xl overflow-hidden relative group">
                <img 
                  src={getOptimizedImageUrl(selectedImage, 900)} 
                  alt={product.name} 
                  className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-110"
                />
                {(product.oldPrice && product.oldPrice > product.price) && (
                  <div className="absolute top-6 left-6 bg-primary text-white font-black text-sm px-4 py-1.5 rounded-full shadow-lg">
                    -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                  </div>
                )}
              </div>
              
              {/* Thumbnails */}
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {[product.image, ...(product.images || [])].filter(Boolean).map((img: string, i: number) => (
                  <button 
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 flex-shrink-0 border-2 rounded-2xl overflow-hidden transition-all ${selectedImage === img ? 'border-primary shadow-md' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <img src={getOptimizedImageUrl(img, 200)} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Info Column */}
            <div className="flex flex-col">
              <div className="mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-3 py-1 rounded-lg">{product.brand || 'Premium'}</span>
                <h1 className="text-2xl md:text-4xl font-black text-gray-900 uppercase tracking-tight mt-3 mb-2 leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} weight="fill" />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">5 (12 avis)</span>
              </div>

              {/* Price Block */}
              <div className="bg-gray-50 rounded-[2rem] p-6 md:p-8 mb-8 relative overflow-hidden group">
                <div className="relative z-10">
                  {product.oldPrice && (
                    <span className="text-sm md:text-base text-gray-400 line-through font-bold mb-1 block">
                      {product.oldPrice.toFixed(2)}€
                    </span>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-black text-primary drop-shadow-sm">{product.price?.toFixed(2)}€</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Prix TTC inclus</span>
                  </div>
                </div>
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary/5 rounded-full group-hover:scale-110 transition-transform duration-700"></div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-8">
                <div className="w-2.5 h-2.5 bg-success rounded-full animate-pulse"></div>
                <span className="text-xs font-black uppercase tracking-widest text-success">En stock — 50 disponibles</span>
              </div>

              {/* Actions */}
              <div className="space-y-4 mb-8">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Qty Selector */}
                  <div className="flex items-center border-2 border-gray-100 rounded-2xl bg-gray-50 p-1">
                    <button 
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="p-3 text-gray-400 hover:text-primary transition-colors"
                    >
                      <Minus size={18} weight="bold" />
                    </button>
                    <span className="w-10 text-center font-black text-gray-900">{qty}</span>
                    <button 
                      onClick={() => setQty(qty + 1)}
                      className="p-3 text-gray-400 hover:text-primary transition-colors"
                    >
                      <Plus size={18} weight="bold" />
                    </button>
                  </div>

                  <button 
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex-1 bg-primary text-white font-black uppercase tracking-widest h-14 rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70 group"
                  >
                    {isAdding ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Ajouté !</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={22} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                        <span>Ajouter au Panier</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Expandable Description */}
              <div className="mb-8 border-t border-gray-100 pt-8">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900 mb-4">Description</h4>
                <div className={`relative overflow-hidden transition-all duration-500 ${activeTab === 'description' ? 'max-h-[1000px]' : 'max-h-[100px]'}`}>
                  <div 
                    className="text-xs md:text-sm text-gray-500 font-medium leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: product.description?.replace(/\n/g, '<br/>') || 'Aucune description disponible.' }}
                  />
                  {activeTab !== 'description' && (
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
                  )}
                </div>
                <button 
                  onClick={() => setActiveTab(activeTab === 'description' ? '' : 'description')}
                  className="mt-4 text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                >
                  {activeTab === 'description' ? 'Voir moins -' : 'Afficher la suite +'}
                </button>
              </div>

              {/* Social / Wishlist */}
              <div className="flex gap-4 border-t border-gray-100 pt-8">
                <button 
                  onClick={() => toggleWishlist(product)}
                  className={`flex-1 border-2 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 ${
                    isFavorite 
                      ? 'bg-primary border-primary text-white' 
                      : 'border-gray-100 text-gray-400 hover:border-gray-200 hover:text-gray-900'
                  }`}
                >
                  <Heart size={16} weight={isFavorite ? "fill" : "bold"} />
                  <span>{isFavorite ? 'Favori' : 'Favoris'}</span>
                </button>
                <button 
                  onClick={handleShare}
                  className={`flex-1 border-2 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 ${
                    copied ? 'bg-success border-success text-white' : 'border-gray-100 text-gray-400 hover:border-gray-200 hover:text-gray-900'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check size={16} weight="bold" />
                      <span>Copié !</span>
                    </>
                  ) : (
                    <>
                      <ShareNetwork size={16} weight="bold" />
                      <span>Partager</span>
                    </>
                  )}
                </button>
              </div>

              {/* Trust Section */}
              <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-8 mt-8">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                    <Truck size={20} className="text-primary" />
                  </div>
                  <p className="text-[8px] font-black uppercase text-gray-400 text-center leading-tight">Livraison<br/>Gratuite</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                    <ArrowsCounterClockwise size={20} className="text-primary" />
                  </div>
                  <p className="text-[8px] font-black uppercase text-gray-400 text-center leading-tight">Retours<br/>14 Jours</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                    <ShieldCheck size={20} className="text-primary" />
                  </div>
                  <p className="text-[8px] font-black uppercase text-gray-400 text-center leading-tight">Paiement<br/>Sécurisé</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-12 md:mt-20">
            <div className="flex items-center justify-between mb-8 md:mb-10">
              <h2 className="text-xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">
                Vous aimerez <span className="text-primary">aussi</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {relatedProducts.map((p, idx) => (
                <ProductCardComponent key={p.id} product={p} index={idx} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
