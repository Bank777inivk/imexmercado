import React, { useState, useEffect } from 'react';
import { subscribeToDocument } from '@imexmercado/firebase';

const FALLBACK_BLOCKS = [
  { id: 'pb1', title: "SÉLECTION HI-TECH", discount: "Jusqu'à 60 % de réduction", description: "sur une sélection de smartphones reconditionnés", color: "#00ADC6", link: '#' },
  { id: 'pb2', title: "AMÉNAGEMENT JARDIN", discount: "Jusqu'à 20 % de réduction", description: "sur notre gamme BBQ et salons d'extérieur", color: "#00A7C1", link: '#' },
  { id: 'pb3', title: "OFFRE BRICOLAGE", discount: "Jusqu'à 30 % de réduction", description: "sur l'outillage électroportatif professionnel", color: "#00B4CC", link: '#' },
  { id: 'pb4', title: "PROMO MOBILIER", discount: "10 % avec code MAISON10", description: "à l'achat de 2 meubles ou canapés", color: "#00B9D6", link: '#' }
];

export function PromotionalBlocks() {
  const [blocks, setBlocks] = useState<any[]>(FALLBACK_BLOCKS);

  useEffect(() => {
    const unsubscribe = subscribeToDocument('settings', 'homepage', (data) => {
      if (data && data.promoBlocks && data.promoBlocks.length > 0) {
        setBlocks(data.promoBlocks);
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    <div className="bg-bg-subtle pb-12">
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {blocks.map((block, idx) => (
            <a 
              key={block.id || idx}
              href={block.link || '#'}
              className={`rounded-lg overflow-hidden flex flex-col justify-end p-6 min-h-[350px] relative text-white group cursor-pointer shadow-worten transition-shadow hover:shadow-worten-hover ${block.color?.startsWith('bg-') ? block.color : ''}`}
              style={!block.color?.startsWith('bg-') ? { backgroundColor: block.color } : undefined}
            >
              <div className="absolute top-0 left-0 w-full h-1/2 overflow-hidden bg-white/10">
                <img 
                  src={block.image || `https://placehold.co/400x200/ffffff/cccccc?text=Produit+${idx+1}`} 
                  alt="Promo" 
                  className="w-full h-full object-cover mix-blend-multiply opacity-50 group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="relative z-10 mt-auto">
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2 opacity-90 leading-tight">
                  {block.title}
                </p>
                <h3 className="text-xl md:text-2xl font-extrabold leading-tight mb-3">
                  {block.discount}
                </h3>
                <p className="text-sm font-medium mb-6 opacity-90">
                  {block.description}
                </p>
                <button className="bg-white text-gray-800 font-bold text-sm px-6 py-2.5 rounded-full w-max hover:bg-gray-100 transition-colors shadow-sm">
                  VOIR LES PRODUITS
                </button>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
