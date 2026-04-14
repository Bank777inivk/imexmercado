import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, ShoppingCart, Heart, ShareNetwork, 
  Truck, ArrowsCounterClockwise, ShieldCheck,
  Check, WarningCircle, Minus, Plus
} from '@phosphor-icons/react';
import { ProductCard as ProductCardComponent } from '../components/home/ProductCard';
import { subscribeToDocument } from '@imexmercado/firebase';
import { getOptimizedImageUrl } from '@imexmercado/ui';
import { useCart } from '../context/CartContext';

export function ProductPage() {
  const { productSlug } = useParams();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const { addItem, setDrawerOpen } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    if (!product) return;
    setIsAdding(true);
    for (let i = 0; i < qty; i++) {
      addItem(product);
    }
    setTimeout(() => setIsAdding(false), 1000);
  };

  useEffect(() => {
    if (!productSlug) return;
    setLoading(true);
    const unsubscribe = subscribeToDocument('products', productSlug, (data) => {
      if (data) {
        setProduct(data);
        // Only set initial image if not already set or if product changed
        if (!selectedImage) {
          setSelectedImage(data.image || '');
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [productSlug]);

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
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 p-4 sm:p-6 md:p-12">
            
            {/* Gallery Column */}
            <div className="space-y-6">
              <div className="aspect-square bg-white border border-gray-100 rounded-2xl overflow-hidden relative group">
                <img 
                  src={getOptimizedImageUrl(selectedImage, 900)} 
                  alt={product.name} 
                  className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-110"
                />
                {product.badge && (
                  <div className="absolute top-6 left-6 bg-primary text-white font-black text-sm px-4 py-1.5 rounded-full shadow-lg">
                    {product.badge}
                  </div>
                )}
              </div>
              
              {/* Thumbnails */}
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {[product.image, ...(product.images || [])].filter(Boolean).map((img: string, i: number) => (
                  <button 
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 flex-shrink-0 border-2 rounded-xl overflow-hidden transition-all ${selectedImage === img ? 'border-primary shadow-md' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <img src={getOptimizedImageUrl(img, 200)} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Info Column */}
            <div className="flex flex-col">
              <div className="mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-3 py-1 rounded">{product.brand}</span>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight mt-3 mb-2 leading-tight">
                  {product.name}
                </h1>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">SKU: IMX-PROD-{product.id}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-1 text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} weight={i < Math.floor(product.rating) ? "fill" : "bold"} />
                  ))}
                </div>
                <button className="text-xs font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-widest">
                  (12 avis clients)
                </button>
              </div>

              {/* Price */}
              <div className="bg-gray-50 px-6 py-8 rounded-2xl mb-8 relative overflow-hidden">
                <div className="relative z-10">
                  {product.oldPrice && (
                    <span className="text-lg text-gray-400 line-through font-bold mb-1 block">
                      {product.oldPrice}€
                    </span>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-primary">{product.price}€</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Prix TTC inclus</span>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-8">
                <div className="w-2.5 h-2.5 bg-success rounded-full animate-pulse"></div>
                <span className="text-xs font-black uppercase tracking-widest text-success">En stock — Expédition immédiate</span>
              </div>

              {/* Actions */}
              <div className="space-y-4 mb-10">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Qty Selector */}
                  <div className="flex items-center border-2 border-gray-100 rounded-xl bg-gray-50 p-1">
                    <button 
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="p-3 text-gray-400 hover:text-primary transition-colors"
                    >
                      <Minus size={18} weight="bold" />
                    </button>
                    <input 
                      type="number" 
                      value={qty}
                      onChange={(e) => setQty(parseInt(e.target.value) || 1)}
                      className="w-12 text-center bg-transparent font-black text-gray-900 outline-none"
                    />
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
                    className="flex-1 bg-primary text-white font-black uppercase tracking-widest h-14 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70"
                  >
                    {isAdding ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Ajouté !</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={22} weight="bold" />
                        <span>Ajouter au Panier</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 border-2 border-gray-100 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] text-gray-400 hover:border-gray-200 hover:text-gray-900 transition-all flex items-center justify-center gap-2">
                    <Heart size={16} weight="bold" />
                    <span>Favoris</span>
                  </button>
                  <button className="flex-1 border-2 border-gray-100 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] text-gray-400 hover:border-gray-200 hover:text-gray-900 transition-all flex items-center justify-center gap-2">
                    <ShareNetwork size={16} weight="bold" />
                    <span>Partager</span>
                  </button>
                </div>
              </div>

              {/* Trust Section */}
              <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-8">
                <div className="text-center">
                  <Truck size={24} className="mx-auto mb-2 text-primary" />
                  <p className="text-[9px] font-black uppercase text-gray-400">Livraison<br/>Gratiute</p>
                </div>
                <div className="text-center">
                  <ArrowsCounterClockwise size={24} className="mx-auto mb-2 text-primary" />
                  <p className="text-[9px] font-black uppercase text-gray-400">Retours<br/>14 Jours</p>
                </div>
                <div className="text-center">
                  <ShieldCheck size={24} className="mx-auto mb-2 text-primary" />
                  <p className="text-[9px] font-black uppercase text-gray-400">Paiement<br/>Sécurisé</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Tabs */}
          <div className="border-t border-gray-100">
            <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
              {['description', 'specs', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-4 md:px-8 md:py-6 text-[10px] sm:text-xs whitespace-nowrap font-black uppercase tracking-widest transition-all border-b-2 ${
                    activeTab === tab ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-400 hover:text-gray-900'
                  }`}
                >
                  {tab === 'description' ? 'Description' : tab === 'specs' ? 'Caractéristiques' : 'Avis Clients'}
                </button>
              ))}
            </div>
            <div className="p-6 md:p-12">
              {activeTab === 'description' && (
                <div className="max-w-4xl space-y-6 text-gray-600 leading-relaxed">
                  <p className="font-bold text-gray-900">Une performance exceptionnelle au bout des doigts.</p>
                  <p>Découvrez le nouveau {product.name}, une prouesse technologique conçue pour redéfinir vos standards. Avec son design élégant et ses performances de pointe, cet appareil est l'allié idéal pour votre quotidien.</p>
                  <p>Inspiré par le dynamisme du marché européen et l'expertise import-export d'IMEXSULTING, ce produit allie robustesse et élégance. Chaque détail a été pensé pour vous offrir une expérience utilisateur fluide et intuitive.</p>
                </div>
              )}
              {activeTab === 'specs' && (
                <div className="max-w-2xl">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-gray-50">
                        <td className="py-4 text-xs font-black uppercase text-gray-400 tracking-widest w-1/3">Marque</td>
                        <td className="py-4 text-sm font-bold text-gray-900">{product.brand}</td>
                      </tr>
                      <tr className="border-b border-gray-50">
                        <td className="py-4 text-xs font-black uppercase text-gray-400 tracking-widest">Modèle</td>
                        <td className="py-4 text-sm font-bold text-gray-900">{product.name.split('—')[0]}</td>
                      </tr>
                      <tr className="border-b border-gray-50">
                        <td className="py-4 text-xs font-black uppercase text-gray-400 tracking-widest">Couleur</td>
                        <td className="py-4 text-sm font-bold text-gray-900">{product.color}</td>
                      </tr>
                      <tr className="border-b border-gray-50">
                        <td className="py-4 text-xs font-black uppercase text-gray-400 tracking-widest">Dimensions</td>
                        <td className="py-4 text-sm font-bold text-gray-900">{product.size}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              {activeTab === 'reviews' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-12 border-b border-gray-50 pb-8">
                    <div className="text-center">
                      <p className="text-5xl font-black text-gray-900 mb-2">{product.rating}</p>
                      <div className="flex items-center gap-1 text-primary justify-center mb-1">
                        {[...Array(5)].map((_, i) => <Star key={i} size={16} weight="fill" />)}
                      </div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Basé sur 12 avis</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-500 italic">"Excellent produit, la livraison a été très rapide au Portugal. Je recommande vivement !" - Maria S.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products (Pending dynamic fetch) */}
        {/* 
        <section className="mt-12 md:mt-20">
          <div className="flex items-center justify-between mb-8 md:mb-10">
            <h2 className="text-xl md:text-3xl font-black text-gray-900 uppercase tracking-tight leading-tight">Vous pourriez <br className="md:hidden" /><span className="text-primary">aussi aimer</span></h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            
          </div>
        </section>
        */}
      </div>
    </div>
  );
}
