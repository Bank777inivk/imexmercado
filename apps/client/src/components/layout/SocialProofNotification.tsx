import React, { useEffect, useState } from 'react';
import { subscribeToCollection } from '@imexmercado/firebase';
import { ShoppingBag, X } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

const CITIES = [
  'Lisboa', 'Porto', 'Braga', 'Coimbra', 'Setúbal', 'Faro', 'Aveiro', 'Funchal', 
  'Viseu', 'Leiria', 'Évora', 'Guimarães', 'Albufeira', 'Portimão', 'Vila Real',
  'Amadora', 'Queluz', 'Almada', 'Barreiro', 'Vila Nova de Gaia', 'Matosinhos'
];

export function SocialProofNotification() {
  const [products, setProducts] = useState<any[]>([]);
  const [activeNotification, setActiveNotification] = useState<any | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToCollection('products', (data) => {
      if (data && data.length > 0) {
        setProducts(data);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (products.length === 0) return;

    const triggerNotification = () => {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)];
      const randomMinutes = Math.floor(Math.random() * 58) + 2; // Between 2 and 59 minutes

      setActiveNotification({
        product: randomProduct,
        city: randomCity,
        minutes: randomMinutes
      });
      setVisible(true);

      // Hide after 6 seconds
      setTimeout(() => {
        setVisible(false);
      }, 6000);
    };

    // Initial trigger after 5 seconds
    const initialTimeout = setTimeout(triggerNotification, 5000);

    // Repeat every 20 seconds
    const interval = setInterval(triggerNotification, 20000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [products]);

  if (!activeNotification) return null;

  const { product, city, minutes } = activeNotification;
  const productSlug = product.id || product.name?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div 
      className={`fixed top-4 md:top-auto md:bottom-6 left-4 right-4 md:right-6 md:left-auto z-[200] max-w-sm bg-white md:bg-[#1F222A] rounded-2xl shadow-2xl border border-gray-150 md:border-gray-800 p-4 transition-all duration-500 flex items-center gap-4 ${
        visible 
          ? 'opacity-100 translate-x-0 translate-y-0 scale-100' 
          : 'opacity-0 -translate-x-full -translate-y-12 md:translate-x-0 md:translate-y-4 scale-75 md:scale-95 pointer-events-none'
      }`}
    >
      {/* Product Image */}
      <div className="w-12 h-12 rounded-xl bg-[#1F222A] md:bg-white flex-shrink-0 overflow-hidden border border-gray-800 md:border-gray-200 flex items-center justify-center">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain p-1" 
        />
      </div>

      {/* Text Info */}
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center gap-1 text-[9px] font-black text-primary uppercase tracking-widest mb-0.5">
          <ShoppingBag size={12} weight="fill" />
          <span>Nova Venda</span>
        </div>
        <p className="text-[11px] font-medium text-gray-600 md:text-gray-300 leading-tight">
          Um cliente de <strong className="text-gray-900 md:text-white font-black">{city}</strong> acabou de comprar <Link to={`/?product=${product.id}`} className="text-primary hover:underline font-bold inline">{product.name}</Link> há {minutes} minutes.
        </p>
      </div>

      {/* Close button */}
      <button 
        onClick={() => setVisible(false)}
        className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 md:bg-gray-800 md:hover:bg-gray-700 md:text-gray-400 hover:text-gray-700 md:hover:text-white transition-colors flex items-center justify-center flex-shrink-0"
        aria-label="Fechar"
      >
        <X size={12} weight="bold" />
      </button>
    </div>
  );
}
