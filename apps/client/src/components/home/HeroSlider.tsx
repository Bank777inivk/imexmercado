import React, { useState, useEffect, useMemo } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { CategorySidebar } from "./CategorySidebar";
import { subscribeToDocument } from "@imexmercado/firebase";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useLocale } from "../../hooks/useLocale";

// Default fallback slides if Nothing is in Firestore
const fallbackSlides = [
  {
    id: "1",
    videoUrl:
      "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1200",
    title: "OFFRE DE LANCEMENT",
    subtitle: "Jusqu'à 20% de réduction sur Téléphones & Hi-Tech",
    ctaText: "VOIR LES PRODUITS",
    link: "/boutique?category=Téléphones & Hi-Tech",
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200",
    title: "COSY & DESIGN",
    subtitle: "Transformez votre intérieur avec notre sélection Maison",
    ctaText: "DÉCOUVRIR LA COLLECTION",
    link: "/boutique?category=Maison & Décoration",
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1555505011-1537c5ef4426?auto=format&fit=crop&q=80&w=1200",
    title: "SAISON BBQ",
    subtitle: "Préparez vos soirées avec GrillMaster & Weber",
    ctaText: "VOIR LES OFFRES",
    link: "/boutique?category=Barbecues & Planchas",
  },
];

export function HeroSlider({
  isSidebarOpen = true,
}: {
  isSidebarOpen?: boolean;
}) {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<any[]>(fallbackSlides);
  const [miniBanners, setMiniBanners] = useState<any[]>([
    {
      id: "mb1",
      label: "PROMOTION JUSQU'AU 21 AVRIL",
      title: "Jusqu'à -15% sur l'outillage de Bricolage",
      subtitle: "Promo Bricolage",
      image: "",
      color: "#5d3b8e",
      link: "/boutique?category=Bricolage",
      isActive: true,
    },
    {
      id: "mb2",
      label: "SÉLECTION MAISON",
      title: "Jusqu'à 55% de réduction directe",
      subtitle: "Promo Maison",
      image: "",
      color: "#111111",
      link: "/boutique?category=Maison & Décoration",
      isActive: true,
    },
  ]);
  const { t, i18n } = useTranslation();
  const { localLink } = useLocale();

  const isPT = useMemo(() => {
    return (i18n.language || "pt").startsWith("pt");
  }, [i18n.language]);

  useEffect(() => {
    const unsubscribe = subscribeToDocument("settings", "homepage", (data) => {
      if (data) {
        if (data.heroSlides && data.heroSlides.length > 0) {
          setSlides(data.heroSlides.filter((s: any) => s.isActive !== false));
        }
        if (data.miniBanners && data.miniBanners.length > 0) {
          setMiniBanners(
            data.miniBanners.filter((b: any) => b.isActive !== false),
          );
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  const nextSlide = () =>
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  const prevSlide = () =>
    setCurrent(current === 0 ? slides.length - 1 : current - 1);

  const localizedSlides = useMemo(() => {
    return slides.map((s) => {
      const title = isPT ? s.titlePT || s.title : s.title || s.titlePT;
      const subtitle = isPT
        ? s.subtitlePT || s.subtitle
        : s.subtitle || s.subtitlePT;
      const ctaText = isPT
        ? s.ctaTextPT || s.ctaText
        : s.ctaText || s.ctaTextPT;
      return { ...s, title, subtitle, ctaText };
    });
  }, [slides, isPT]);

  const localizedMiniBanners = useMemo(() => {
    return miniBanners.map((b) => {
      const label = isPT ? b.labelPT || b.label : b.label || b.labelPT;
      const title = isPT ? b.titlePT || b.title : b.title || b.titlePT;
      const subtitle = isPT
        ? b.subtitlePT || b.subtitle
        : b.subtitle || b.subtitlePT;
      return { ...b, label, title, subtitle };
    });
  }, [miniBanners, isPT]);

  return (
    <div className="bg-bg-subtle pt-4 md:pt-6 pb-4">
      {/* Mobile-first wrapper, no padding on mobile to let slider stretch full width */}
      <div className="w-full px-2 md:px-4 lg:px-6">
        {/* Main Grid: Sidebar (L) | Slider (M) | Banners (R) - Added lg:pt-4 for spacing */}
        <div className="flex flex-col lg:flex-row lg:items-stretch lg:min-h-[400px] gap-0">
          {/* 1. Category Sidebar — fixed 250px on desktop */}
          <div className="hidden lg:block h-auto flex-shrink-0">
            <CategorySidebar isOpen={isSidebarOpen} />
          </div>

          {/* 2. Right Side Content Segment (Slider + Banners) */}
          <div
            className={`flex-1 flex flex-col md:flex-row gap-0 ${isSidebarOpen ? "lg:pl-2" : ""} h-auto lg:min-h-[400px]`}
          >
            {/* Main Slider (Center) */}
            <div className="relative flex-[2] h-[320px] sm:h-[380px] lg:h-auto overflow-hidden group bg-black">
              <div
                className="flex transition-transform duration-500 ease-out h-full"
                style={{ transform: `translateX(-${current * 100}%)` }}
              >
                {localizedSlides.map((slide) => (
                  <div key={slide.id} className="min-w-full h-full relative">
                    {slide.videoUrl ? (
                      <video
                        src={slide.videoUrl}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                      />
                    ) : (
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
                    <div className="absolute inset-0 flex flex-col justify-center items-start p-7 md:p-14 text-white max-w-sm md:max-w-lg">
                      <p className="text-[10px] md:text-sm font-black uppercase tracking-[0.2em] text-primary mb-2.5">
                        {slide.title}
                      </p>
                      <h2 className="text-white text-2xl md:text-3xl lg:text-5xl font-black leading-tight mb-5 md:mb-8 drop-shadow-md">
                        {slide.subtitle}
                      </h2>
                      <Link
                        to={localLink(slide.link || "/boutique")}
                        className="bg-white text-gray-900 font-black uppercase py-3 px-6 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all text-[10px] md:text-xs tracking-wider inline-block text-center"
                      >
                        {slide.ctaText}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-transparent text-white hover:bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <CaretLeft size={32} weight="bold" />
              </button>
              <button
                onClick={nextSlide}
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-transparent text-white hover:bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <CaretRight size={32} weight="bold" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/25 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/10">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${current === idx ? "w-6 bg-white" : "w-1.5 bg-white/40"}`}
                  />
                ))}
              </div>
            </div>

            {/* Dynamic Mini Banners (Right) */}
            <div className="hidden md:flex flex-1 flex-col gap-2 h-auto lg:h-auto">
              {localizedMiniBanners.slice(0, 2).map((b: any, i: number) => (
                <Link
                  key={b.id}
                  to={localLink(b.link || "/boutique")}
                  className={`relative w-full flex-1 overflow-hidden group cursor-pointer block ${i === 0 ? "rounded-tr-md" : "rounded-br-md"}`}
                  style={{ backgroundColor: b.color || "#333" }}
                >
                  {b.image && (
                    <img
                      src={b.image}
                      alt={b.label}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 p-5 flex flex-col justify-center text-white">
                    <p className="text-[9px] font-bold uppercase tracking-wider mb-2 opacity-80">
                      {b.label}
                    </p>
                    <h3 className="text-lg md:text-xl font-black leading-tight mb-2">
                      {b.title}
                    </h3>
                    <p className="text-2xl font-black opacity-20 mt-auto">
                      {b.subtitle}
                    </p>
                    <div className="absolute bottom-5 right-5">
                      <span className="text-xl font-bold group-hover:translate-x-1 inline-block transition-transform">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
