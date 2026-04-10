import React, { useState, useEffect, useMemo } from 'react';
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
import { ProductModal } from '../components/shop/ProductModal';
import { getCollection } from '@imexmercado/firebase';

interface HomePageProps {
  isSidebarOpen: boolean;
}

export function HomePage({ isSidebarOpen }: HomePageProps) {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getCollection('products');
        setAllProducts(data || []);
      } catch (err) {
        console.error('Error fetching home products:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filtered lists for sections
  const sections = useMemo(() => {
    return {
      flashSales: allProducts.filter(p => p.isFlashSale).slice(0, 8),
      trending: allProducts.filter(p => p.isTrending).slice(0, 16),
      selections: allProducts.filter(p => p.isSelection || p.featured).slice(0, 12),
      newArrivals: allProducts.filter(p => p.isNew).sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      ).slice(0, 12),
      promotions: allProducts.filter(p => p.oldPrice > p.price).slice(0, 12),
    };
  }, [allProducts]);

  const handleViewDetails = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Préparation de votre boutique...</p>
      </div>
    );
  }

  return (
    <>
      {/* ① HERO — Slider + Bannières latérales */}
      <HeroSlider isSidebarOpen={isSidebarOpen} />

      {/* ② TRUST BAR — Réassurance immédiate sous le hero */}
      <TrustBar />

      {/* ③ CATÉGORIES — Accès rapide avec icônes circulaires */}
      <CategoryGrid />

      {/* ─── 1. FLASH SALE (Resté avec Sidebar) ─── */}
      <div className="w-full px-4 md:px-4 lg:px-6 py-8 flex flex-col lg:flex-row gap-4 items-start">
        <HomeSidebar 
          latestProducts={sections.newArrivals} 
          popularProducts={sections.trending} 
        />
        <div className="flex-1 w-full min-w-0 flex flex-col gap-10">
          <FlashSaleSection 
            products={sections.flashSales} 
            onViewDetails={handleViewDetails} 
          />
          <TrendingItems 
            products={sections.trending} 
            onViewDetails={handleViewDetails} 
          />
        </div>
      </div>

      {/* ─── 2. BANNIÈRE JARDIN (Aligné) ─── */}
      <div className="px-4 md:px-4 lg:px-6">
        <BannerCTA
          bgColor="bg-gradient-to-r from-[#1a6b2e] to-[#2d9e47]"
          subtitle="Collection Printemps — Été 2026"
          title="Équipez votre jardin et vivez vos BBQ"
          ctaText="Découvrir l'univers Jardin →"
          imageSrc="https://placehold.co/1200x360/1a6b2e/ffffff?text=BBQ+%26+Jardin"
          imageAlt="BBQ et Jardin"
        />
      </div>

      {/* ─── 3. DERNIERS ARRIVAGES (Aligné) ─── */}
      <div className="px-4 md:px-4 lg:px-6 py-10">
        <ProductGridSection
          title="Derniers Arrivages"
          emoji="✨"
          products={sections.newArrivals}
          bgClass="bg-white"
          onViewDetails={handleViewDetails}
        />
      </div>

      {/* ─── 4. BLOCS PROMOS (Aligné) ─── */}
      <div className="px-4 md:px-4 lg:px-6 py-10 bg-gray-50">
        <PromotionalBlocks />
      </div>

      {/* ─── 5. SÉLECTION BOUTIQUE (Aligné) ─── */}
      <div className="px-4 md:px-4 lg:px-6 py-10">
        <TabbedProductSection 
          selections={sections.selections}
          newArrivals={sections.newArrivals}
          promotions={sections.promotions}
          onViewDetails={handleViewDetails}
        />
        <div className="mt-16">
          <ProductGridSection
            title="Sélection de la Boutique"
            emoji="⭐"
            products={sections.selections}
            bgClass="bg-white"
            onViewDetails={handleViewDetails}
          />
        </div>
      </div>

      {/* ─── 6. BANNIÈRE SMARTPHONES (Aligné) ─── */}
      <div className="px-4 md:px-4 lg:px-6">
        <BannerCTA
          bgColor="bg-gradient-to-r from-[#001a80] to-[#0044dd]"
          subtitle="Offre Limitée — Stocks Réduits"
          title="Jusqu'à -30% sur les smartphones et accessoires"
          ctaText="Explorer les offres Hi-Tech →"
          imageSrc="https://placehold.co/1200x360/0033cc/ffffff?text=Smartphones"
          imageAlt="Téléphones et Hi-Tech"
          reversed
        />
      </div>

      <div className="px-4 md:px-4 lg:px-6 py-10">
        <BrandCarousel />
        <TestimonialsSection />
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



