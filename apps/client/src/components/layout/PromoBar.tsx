import React, { useEffect, useState } from 'react';
import { getDocument } from '@imexmercado/firebase';

export function PromoBar() {
  const [promo, setPromo] = useState<any>(null);

  useEffect(() => {
    async function fetchPromo() {
      try {
        const data = await getDocument('settings', 'homepage');
        if (data && data.promoBar) {
          setPromo(data.promoBar);
        }
      } catch (error) {
        console.error("Error fetching promo:", error);
      }
    }
    fetchPromo();
  }, []);

  if (!promo || !promo.isActive) return null;

  return (
    <div 
      className="text-white py-2 text-center text-[10px] md:text-sm font-black uppercase tracking-widest relative z-[60]"
      style={{ backgroundColor: promo.color || '#CC0000' }}
    >
      <div className="container mx-auto px-4">
        {promo.text}
      </div>
    </div>
  );
}
