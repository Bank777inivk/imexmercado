import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HeroSlider } from "../components/home/HeroSlider";
import { TrustBar } from "../components/home/TrustBar";
import { CategoryGrid } from "../components/home/CategoryGrid";
import { HomeSidebar } from "../components/home/HomeSidebar";
import { FlashSaleSection } from "../components/home/FlashSaleSection";
import { ProductGridSection } from "../components/home/ProductGridSection";
import { BannerCTA } from "../components/home/BannerCTA";
import { PromotionalBlocks } from "../components/home/PromotionalBlocks";
import { TrendingItems } from "../components/home/TrendingItems";
import { BrandCarousel } from "../components/home/BrandCarousel";
import { TestimonialsSection } from "../components/home/TestimonialsSection";
import { TabbedProductSection } from "../components/home/TabbedProductSection";
import { Newsletter } from "../components/home/Newsletter";
import { ProductModal } from "../components/shop/ProductModal";
import {
  subscribeToCollection,
  subscribeToDocument,
} from "@imexmercado/firebase";
import { useSEO } from "../hooks/useSEO";
import { useLocale } from "../hooks/useLocale";

interface HomePageProps {
  isSidebarOpen: boolean;
}

export function HomePage({ isSidebarOpen }: HomePageProps) {
  const { i18n } = useTranslation();
  const isPT = (i18n.language || "pt").startsWith("pt");
  const { localLink } = useLocale();
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [inventoryConfig, setInventoryConfig] = useState<any>({
    lowStockThreshold: 5,
    hideOutOfStock: false,
  });
  const [homepageSettings, setHomepageSettings] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = subscribeToDocument("settings", "inventory", (data) => {
      if (data) setInventoryConfig(data);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToDocument("settings", "homepage", (data) => {
      if (data) setHomepageSettings(data);
    });
    return () => unsubscribe();
  }, []);

  const productParam = searchParams.get("product");

  const manualSEO = useMemo(() => {
    if (isModalOpen && selectedProduct) {
      return {
        title: selectedProduct.metaTitle || selectedProduct.name,
        description:
          selectedProduct.metaDescription ||
          selectedProduct.description?.substring(0, 160) ||
          "",
        image: selectedProduct.image,
        type: "product",
      };
    }
    return undefined;
  }, [isModalOpen, selectedProduct]);

  useSEO("home", manualSEO);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToCollection("products", (data) => {
      setAllProducts(data || []);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Listen to product query param to open modal
  useEffect(() => {
    if (!productParam || allProducts.length === 0) return;
    const prod = allProducts.find((p) => p.id === productParam);
    if (prod) {
      setSelectedProduct(prod);
      setIsModalOpen(true);
    }
  }, [productParam, allProducts]);

  // Handle URL cleanup on close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("product");
    setSearchParams(newParams, { replace: true });
  };

  // Filtered lists for sections
  const sections = useMemo(() => {
    let list = allProducts;
    if (inventoryConfig?.hideOutOfStock) {
      list = list.filter((p) => p.stock > 0);
    }
    return {
      flashSales: list.filter((p) => p.isFlashSale).slice(0, 8),
      trending: list.filter((p) => p.isTrending).slice(0, 16),
      selections: list.filter((p) => p.isSelection || p.featured).slice(0, 12),
      newArrivals: list
        .filter((p) => p.isNew)
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime(),
        )
        .slice(0, 12),
      promotions: list.filter((p) => p.oldPrice > p.price).slice(0, 12),
    };
  }, [allProducts, inventoryConfig]);

  const handleViewDetails = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Préparation de votre boutique...
        </p>
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
          onViewDetails={handleViewDetails}
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
          bgColor={
            homepageSettings?.mainBanners?.[0]?.bgColor ||
            "bg-gradient-to-r from-[#1a6b2e] to-[#2d9e47]"
          }
          subtitle={
            isPT
              ? homepageSettings?.mainBanners?.[0]?.subtitlePT ||
                homepageSettings?.mainBanners?.[0]?.subtitle ||
                "Coleção Primavera — Verão 2026"
              : homepageSettings?.mainBanners?.[0]?.subtitle ||
                "Collection Printemps — Été 2026"
          }
          title={
            isPT
              ? homepageSettings?.mainBanners?.[0]?.titlePT ||
                homepageSettings?.mainBanners?.[0]?.title ||
                "Equipe o seu jardim e desfrute dos seus churrascos"
              : homepageSettings?.mainBanners?.[0]?.title ||
                "Équipez votre jardin et vivez vos BBQ"
          }
          ctaText={
            isPT
              ? homepageSettings?.mainBanners?.[0]?.ctaTextPT ||
                homepageSettings?.mainBanners?.[0]?.ctaText ||
                "Descobrir o universo Jardim →"
              : homepageSettings?.mainBanners?.[0]?.ctaText ||
                "Découvrir l'univers Jardin →"
          }
          imageSrc={
            homepageSettings?.mainBanners?.[0]?.imageSrc ||
            "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800"
          }
          imageAlt={
            homepageSettings?.mainBanners?.[0]?.imageAlt || "BBQ et Jardin"
          }
          link={localLink(
            isPT
              ? homepageSettings?.mainBanners?.[0]?.linkPT ||
                  homepageSettings?.mainBanners?.[0]?.link ||
                  "/loja?category=Grelhadores+%26+Planchas"
              : homepageSettings?.mainBanners?.[0]?.link ||
                  "/boutique?category=Barbecues+%26+Planchas",
          )}
          reversed={homepageSettings?.mainBanners?.[0]?.reversed || false}
        />
      </div>

      {/* ─── 3. DERNIERS ARRIVAGES (Aligné) ─── */}
      <div className="px-4 md:px-4 lg:px-6 py-10">
        <ProductGridSection
          title={isPT ? "Últimas Novidades" : "Derniers Arrivages"}
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
            title={isPT ? "Seleção da Loja" : "Sélection de la Boutique"}
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
          bgColor={
            homepageSettings?.mainBanners?.[1]?.bgColor ||
            "bg-gradient-to-r from-[#001a80] to-[#0044dd]"
          }
          subtitle={
            isPT
              ? homepageSettings?.mainBanners?.[1]?.subtitlePT ||
                homepageSettings?.mainBanners?.[1]?.subtitle ||
                "Oferta Limitada — Stocks Reduzidos"
              : homepageSettings?.mainBanners?.[1]?.subtitle ||
                "Offre Limitée — Stocks Réduits"
          }
          title={
            isPT
              ? homepageSettings?.mainBanners?.[1]?.titlePT ||
                homepageSettings?.mainBanners?.[1]?.title ||
                "Até -30% em smartphones e acessórios"
              : homepageSettings?.mainBanners?.[1]?.title ||
                "Jusqu'à -30% sur les smartphones et accessoires"
          }
          ctaText={
            isPT
              ? homepageSettings?.mainBanners?.[1]?.ctaTextPT ||
                homepageSettings?.mainBanners?.[1]?.ctaText ||
                "Explorar as ofertas Hi-Tech →"
              : homepageSettings?.mainBanners?.[1]?.ctaText ||
                "Explorer les offres Hi-Tech →"
          }
          imageSrc={
            homepageSettings?.mainBanners?.[1]?.imageSrc ||
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800"
          }
          imageAlt={
            homepageSettings?.mainBanners?.[1]?.imageAlt ||
            "Téléphones et Hi-Tech"
          }
          link={localLink(
            isPT
              ? homepageSettings?.mainBanners?.[1]?.linkPT ||
                  homepageSettings?.mainBanners?.[1]?.link ||
                  "/loja?category=Telem%C3%B3veis+e+Hi-Tech"
              : homepageSettings?.mainBanners?.[1]?.link ||
                  "/boutique?category=T%C3%A9l%C3%A9phones+%26+Hi-Tech",
          )}
          reversed={
            homepageSettings?.mainBanners?.[1]?.reversed !== undefined
              ? homepageSettings.mainBanners[1].reversed
              : true
          }
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
        onClose={handleCloseModal}
      />
    </>
  );
}
