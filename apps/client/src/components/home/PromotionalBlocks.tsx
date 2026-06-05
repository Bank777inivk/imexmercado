import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { subscribeToDocument } from "@imexmercado/firebase";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../hooks/useLocale";

const FALLBACK_BLOCKS = [
  {
    id: "pb1",
    title: "SÉLECTION HI-TECH",
    discount: "Jusqu'à 60 % de réduction",
    description: "sur une sélection de smartphones reconditionnés",
    color: "#00ADC6",
    link: "/boutique?category=T%C3%A9l%C3%A9phones+%26+Hi-Tech",
  },
  {
    id: "pb2",
    title: "AMÉNAGEMENT JARDIN",
    discount: "Jusqu'à 20 % de réduction",
    description: "sur notre gamme BBQ et salons d'extérieur",
    color: "#00A7C1",
    link: "/boutique?category=Barbecues+%26+Planchas",
  },
  {
    id: "pb3",
    title: "OFFRE BRICOLAGE",
    discount: "Jusqu'à 30 % de réduction",
    description: "sur l'outillage électroportatif professionnel",
    color: "#00B4CC",
    link: "/boutique?category=Bricolage",
  },
  {
    id: "pb4",
    title: "PROMO MOBILIER",
    discount: "10 % avec code MAISON10",
    description: "à l'achat de 2 meubles ou canapés",
    color: "#00B9D6",
    link: "/boutique?category=Meubles+%26+Lampes",
  },
];

export function PromotionalBlocks() {
  const [blocks, setBlocks] = useState<any[]>(FALLBACK_BLOCKS);
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "pt";
  const { localLink } = useLocale();

  useEffect(() => {
    const unsubscribe = subscribeToDocument("settings", "homepage", (data) => {
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
            <Link
              key={block.id || idx}
              to={localLink(block.link || "/boutique")}
              className="rounded-lg overflow-hidden flex flex-col min-h-[380px] relative text-white group cursor-pointer shadow-worten transition-shadow hover:shadow-worten-hover"
              style={
                !block.color?.startsWith("bg-")
                  ? { backgroundColor: block.color }
                  : undefined
              }
            >
              {/* Image Container */}
              <div className="h-[160px] w-full overflow-hidden bg-white flex items-center justify-center relative">
                <img
                  src={
                    block.image ||
                    `https://placehold.co/400x200/ffffff/cccccc?text=Produit+${idx + 1}`
                  }
                  alt="Promo"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Text Content Container */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2 opacity-95 leading-tight">
                    {currentLang === "pt"
                      ? block.titlePT || block.title
                      : block.title}
                  </p>
                  <h3 className="text-xl font-extrabold leading-tight mb-2">
                    {currentLang === "pt"
                      ? block.discountPT || block.discount
                      : block.discount}
                  </h3>
                  <p className="text-xs font-medium mb-4 opacity-90 leading-relaxed">
                    {currentLang === "pt"
                      ? block.descriptionPT || block.description
                      : block.description}
                  </p>
                </div>
                <button className="bg-white text-gray-800 font-bold text-[11px] px-5 py-2.5 rounded-full w-max hover:bg-gray-100 transition-colors shadow-sm mt-auto">
                  {currentLang === "pt" ? "VER PRODUTOS" : "VOIR LES PRODUITS"}
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
