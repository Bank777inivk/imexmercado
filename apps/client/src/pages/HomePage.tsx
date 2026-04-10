import React, { useState } from 'react';
import { HeroSlider } from '../components/home/HeroSlider';
import { TrustBar } from '../components/home/TrustBar';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { HomeSidebar } from '../components/home/HomeSidebar';
import { FlashSaleSection } from '../components/home/FlashSaleSection';
import { ProductGridSection } from '../components/home/ProductGridSection';
import { BannerCTA } from '../components/home/BannerCTA';
import { PromotionalBlocks } from '../components/home/PromotionalBlocks';
import { TrendingItems } from '../components/home/TrendingItems';
import { BrandCarousel } from '../components/home/BrandCarousel';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { TabbedProductSection } from '../components/home/TabbedProductSection';
import { Newsletter } from '../components/home/Newsletter';
import { mockProducts, newProducts } from '../components/home/ProductCard';
import { ProductModal } from '../components/shop/ProductModal';

interface HomePageProps {
  isSidebarOpen: boolean;
}

export function HomePage({ isSidebarOpen }: HomePageProps) {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* ① HERO — Slider + Bannières latérales */}
      <HeroSlider isSidebarOpen={isSidebarOpen} />

      {/* ② TRUST BAR — Réassurance immédiate sous le hero */}
      <TrustBar />

      {/* ③ CATÉGORIES — Accès rapide avec icônes circulaires */}
      <CategoryGrid />

      {/* ─── Layout Principal avec Sidebar ─── */}
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar Gauche — Pubs + Derniers Produits (Sticky) */}
        <HomeSidebar />

        {/* Colonne Principale — Tous les blocs rich content */}
        <div className="flex-1 min-w-0 flex flex-col gap-10 lg:gap-16 w-full">
          
          {/* ④ FLASH SALE — Offres du jour avec slider défilant */}
          <FlashSaleSection />

          {/* ⑤ BANNIÈRE JARDIN — Horizontal banner */}
          <BannerCTA
            bgColor="bg-gradient-to-r from-[#1a6b2e] to-[#2d9e47]"
            subtitle="Collection Printemps — Été 2026"
            title="Équipez votre jardin et vivez vos BBQ"
            ctaText="Découvrir l'univers Jardin →"
            imageSrc="https://placehold.co/700x360/1a6b2e/ffffff?text=BBQ+%26+Jardin"
            imageAlt="BBQ et Jardin"
          />

          {/* ⑥ TRENDING ITEMS — Produits tendances avec onglets */}
          <TrendingItems />

          {/* ⑦ SÉLECTIONS TABULÉES — Phares / Nouveautés / Promos */}
          <TabbedProductSection />

          {/* ⑧ NOUVEAUTÉS — Grille intégrée dans le flux principal */}
          <ProductGridSection
            title="Derniers Arrivages"
            emoji="✨"
            products={newProducts}
            bgClass="bg-white"
            onViewDetails={handleViewDetails}
          />

          {/* ⑨ BLOCS PROMOS — 4 cartes colorées catégories */}
          <PromotionalBlocks />

          {/* ⑩ PRODUITS PHARES — Grille large */}
          <ProductGridSection
            title="Sélection de la Boutique"
            emoji="⭐"
            products={mockProducts}
            bgClass="bg-white"
            onViewDetails={handleViewDetails}
          />

          {/* ⑫ BANNIÈRE HI-TECH — Full width inversée */}
          <BannerCTA
            bgColor="bg-gradient-to-r from-[#001a80] to-[#0044dd]"
            subtitle="Offre Limitée — Stocks Réduits"
            title="Jusqu'à -30% sur les smartphones et accessoires"
            ctaText="Explorer les offres Hi-Tech →"
            imageSrc="https://placehold.co/700x360/0033cc/ffffff?text=Smartphones"
            imageAlt="Téléphones et Hi-Tech"
            reversed
          />

          {/* ⑬ BRAND CAROUSEL — Logos des partenaires */}
          <BrandCarousel />

          {/* ⑭ AVIS CLIENTS — Témoignages multilingues */}
          <TestimonialsSection />
          
        </div>
      </div>

      {/* ⑮ NEWSLETTER — -10% première commande (Full Width) */}
      <Newsletter />

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}



