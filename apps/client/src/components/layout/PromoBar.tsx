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
      className="text-white py-2 text-center text-[10px] md:text-sm font-black uppercase tracking-widest relative z-[60] overflow-hidden"
      style={{ backgroundColor: promo.color || '#CC0000' }}
    >
      <div className="w-full px-4 md:px-8 lg:px-12">
        {promo.text}
      </div>
    </div>
  );
}
