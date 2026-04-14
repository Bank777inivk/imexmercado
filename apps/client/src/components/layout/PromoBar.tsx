import React, { useEffect, useState } from 'react';
import { subscribeToDocument } from '@imexmercado/firebase';

export function PromoBar() {
  const [promo, setPromo] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = subscribeToDocument('settings', 'homepage', (data) => {
      if (data && data.promoBar) {
        setPromo(data.promoBar);
      }
    });
    return () => unsubscribe();
  }, []);

  if (!promo || !promo.isActive) return null;

  return (
    <div 
      className="text-white py-2 text-center text-[10px] md:text-sm font-black uppercase tracking-widest relative z-[60] overflow-hidden"
      style={{ backgroundColor: promo.color || '#CC0000' }}
    >
      <div className="w-full px-4 md:px-8 lg:px-12">
        {promo.text}
      </div>
    </div>
  );
}
