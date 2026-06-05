import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  X,
  ShoppingCart,
  Heart,
  ArrowRight,
  Truck,
  ShieldCheck,
  ArrowsCounterClockwise,
  Star,
  Minus,
  Plus,
  Package,
} from "@phosphor-icons/react";
import { useCart } from "../../context/CartContext";
import {
  subscribeToCollection,
  subscribeToCollectionWithFilter,
  setDocument,
} from "@imexmercado/firebase";
import { getOptimizedImageUrl } from "@imexmercado/ui";
import { useTranslation } from "react-i18next";

interface ProductModalProps {
  product: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const { addItem } = useCart();
  const { i18n } = useTranslation();
  const currentLang = i18n.language || "pt";
  const isFR = currentLang.startsWith("fr");
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [isFullViewOpen, setIsFullViewOpen] = useState(false);

  // Tabs and review states
  const [activeTab, setActiveTab] = useState<
    "description" | "specs" | "reviews"
  >("description");
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerCity, setReviewerCity] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Sync internal state with prop
  useEffect(() => {
    if (product) {
      setCurrentProduct(product);
      setSelectedImage(product.image || "");
      setQty(1);
      setIsDescriptionExpanded(false);
    }
  }, [product]);

  // Fetch reviews for the current product
  useEffect(() => {
    const activeProductId = currentProduct?.id || product?.id;
    if (!activeProductId || !isOpen) return;
    const unsubscribe = subscribeToCollectionWithFilter(
      "reviews",
      "productId",
      activeProductId,
      (data) => {
        const sorted = [...data].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        setReviews(sorted);
      },
    );
    return () => unsubscribe();
  }, [currentProduct?.id, product?.id, isOpen]);

  // Fetch all products for recommendations
  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = subscribeToCollection("products", (data) => {
      setAllProducts(data);
    });
    return () => unsubscribe();
  }, [isOpen]);

  const p = currentProduct || product;

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape key to close
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullViewOpen) setIsFullViewOpen(false);
        else onClose();
      }
    },
    [onClose, isFullViewOpen],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleAddToCart = () => {
    if (!p) return;
    setIsAdding(true);
    for (let i = 0; i < qty; i++) addItem(p);
    setTimeout(() => setIsAdding(false), 1200);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomPos({ x, y });
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewText.trim()) {
      alert(
        isFR
          ? "Veuillez remplir tous les champs obligatoires."
          : "Por favor, preencha todos os campos obrigatórios.",
      );
      return;
    }
    setSubmittingReview(true);
    try {
      const reviewId = `rev-user-${Date.now()}`;
      const reviewData = {
        id: reviewId,
        productId: p.id,
        productName: displayName,
        name: reviewerName,
        city: reviewerCity.trim() || "Portugal",
        text: reviewText,
        rating: Number(reviewRating),
        date: new Date().toISOString(),
        approved: true,
        createdAt: new Date().toISOString(),
      };
      await setDocument("reviews", reviewId, reviewData);
      setReviewerName("");
      setReviewerCity("");
      setReviewText("");
      setReviewRating(5);
      alert(isFR ? "Merci pour votre avis !" : "Obrigado pela sua avaliação!");
    } catch (err) {
      console.error(err);
      alert(
        isFR
          ? "Erreur lors de la soumission de l'avis."
          : "Erro ao enviar a avaliação.",
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!isOpen || !p) return null;

  // All images (main + gallery)
  const allImages = [p.image, ...(p.images || [])].filter(Boolean);
  const inStock = (p.stock ?? 1) > 0;
  const displayName = isFR ? p.nameFR || p.name : p.name;
  const productSlug = p.id || displayName?.toLowerCase().replace(/\s+/g, "-");
  const discountPct =
    p.price && p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : null;

  const tags: string[] = p.tags || [];

  // Compute similar products
  const similarProducts = allProducts
    .filter((item) => item.id !== p.id && item.category === p.category)
    .slice(0, 4);

  const reviewsCount = reviews.length;
  const averageRating =
    reviewsCount > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviewsCount).toFixed(
          1,
        )
      : p.rating || "5.0";

  const formatProductDescription = (text: string) => {
    if (!text) return "";
    return text
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
      .replace(/\n\n/g, '<div class="h-4"></div>')
      .replace(/\n/g, "<br/>");
  };

  const extractSpecsFromText = (text: string) => {
    if (!text) return [];
    const extracted: { key: string; value: string }[] = [];
    // Regex pour capturer "Clé : Valeur" ou "**Clé** : Valeur"
    const regex =
      /(?:\n|^)(?:\*\*)?([^*:\n\r]{2,35})(?:\*\*)?\s*[:]\s*([^\n\r]+)/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      const key = match[1].trim();
      let value = match[2].trim();
      // On ignore les titres trop longs, les mots génériques ou les tags
      const isKeyword = [
        "Palavras-chave",
        "Keywords",
        "Mots-clés",
        "Description",
        "Garantie",
        "Identificação",
      ].some((k) => key.toLowerCase().includes(k.toLowerCase()));

      if (key.length > 2 && value.length > 0 && key.length < 40 && !isKeyword) {
        // Nettoyage des pipes pour un meilleur rendu
        value = value.replace(/\|\s*/g, "\n");
        extracted.push({ key, value });
      }
    }
    return extracted;
  };

  // Merge native specs with auto-extracted ones
  const currentDescription = isFR
    ? p.descriptionFR || p.description
    : p.description;
  const nativeSpecs =
    (isFR
      ? p.specsFR && p.specsFR.length > 0
        ? p.specsFR
        : p.specs
      : p.specs) || [];
  const extractedSpecs = extractSpecsFromText(currentDescription);
  const specs: { key: string; value: string }[] = [...nativeSpecs];

  extractedSpecs.forEach((ext) => {
    if (!specs.find((s) => s.key.toLowerCase() === ext.key.toLowerCase())) {
      specs.push(ext);
    }
  });

  return (
    <>
      <style>{`
        @keyframes starBlink {
          0%, 80%, 100% { opacity: 1; transform: scale(1); }
          85% { opacity: 0.2; transform: scale(0.9); }
          90% { opacity: 1; transform: scale(1.3); }
          95% { opacity: 0.2; transform: scale(0.9); }
        }
        .star-blink-animation {
          animation: starBlink 10s infinite ease-in-out;
          display: inline-block;
        }
        @keyframes slideFromTopLeft {
          from {
            transform: translate3d(-100%, -100%, 0) scale(0.8);
            opacity: 0;
          }
          to {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 1;
          }
        }
        @media (max-w: 767px) {
          .animate-mobile-top-left {
            animation: slideFromTopLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            transform-origin: top left;
          }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      {/* ── Backdrop ── */}
      <div
        className="fixed top-[130px] md:top-0 inset-x-0 bottom-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Modal Panel ── */}
      <div
        className="fixed top-[130px] md:top-0 md:inset-0 inset-x-0 bottom-0 flex flex-col justify-start md:items-center md:justify-center z-[110] p-0 md:p-6"
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="relative bg-white w-full md:max-w-[92vw] rounded-t-[32px] md:rounded-none overflow-hidden shadow-2xl h-auto max-h-[calc(100vh-130px)] md:max-h-[96vh] flex flex-col animate-mobile-top-left md:animate-in md:zoom-in-95 duration-300">
          {/* Mobile Sticky Header */}
          <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white z-20 flex-shrink-0">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 truncate max-w-[75%]">
              {p.brand} - {displayName}
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-all"
              aria-label={isFR ? "Fermer" : "Fechar"}
            >
              <X size={16} weight="bold" />
            </button>
          </div>

          {/* Close button (Desktop Only) */}
          <button
            onClick={onClose}
            className="hidden md:flex absolute top-3 right-3 z-20 w-10 h-10 items-center justify-center bg-gray-100/80 backdrop-blur-sm hover:bg-gray-200 text-gray-700 rounded-full transition-all"
            aria-label={isFR ? "Fermer" : "Fechar"}
          >
            <X size={20} weight="bold" />
          </button>

          {/* ── Scrollable Content ── */}
          <div className="overflow-y-auto md:overflow-hidden flex-1 overscroll-contain">
            <div
              key={p.id}
              className="flex flex-col md:grid md:grid-cols-2 md:h-[88vh] animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out"
            >
              {/* ── Gallery Column ── */}
              <div className="bg-gray-50 flex flex-col gap-4 p-4 md:p-8 order-1 md:order-1 md:h-full md:overflow-y-auto custom-scrollbar">
                {/* Main image */}
                <div
                  className="aspect-square md:aspect-auto md:h-[320px] rounded-none md:rounded-2xl overflow-hidden bg-white flex items-center justify-center relative cursor-zoom-in group/main border-b md:border-2 border-gray-100 md:border-amber-500"
                  onMouseEnter={() => setIsZooming(true)}
                  onMouseLeave={() => setIsZooming(false)}
                  onMouseMove={handleMouseMove}
                  onClick={() => setIsFullViewOpen(true)}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover/main:bg-black/5 transition-colors z-10 flex items-center justify-center opacity-0 group-hover/main:opacity-100">
                    <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-xl transform translate-y-4 group-hover/main:translate-y-0 transition-all duration-300">
                      <ArrowRight
                        size={20}
                        className="text-gray-900 -rotate-45"
                      />
                    </div>
                  </div>
                  <img
                    src={selectedImage || p.image}
                    alt={displayName}
                    className="w-full h-full object-contain p-6 transition-transform duration-300 ease-out"
                    style={{
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      transform: isZooming ? "scale(2.5)" : "scale(1)",
                    }}
                  />
                  {discountPct && discountPct > 0 && (
                    <span className="absolute top-4 right-4 bg-red-500 text-white text-[11px] font-black px-3 py-1.5 rounded-full shadow-lg">
                      -{discountPct}%
                    </span>
                  )}
                </div>
                {/* Thumbnails */}
                {allImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {allImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(img)}
                        className={`w-14 h-14 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                          selectedImage === img
                            ? "border-amber-500 shadow-md"
                            : "border-amber-500/20 hover:border-amber-500/60"
                        }`}
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Section: Similar Products (Desktop only - Compact layout) */}
                {similarProducts.length > 0 && (
                  <div className="hidden md:block animate-in fade-in duration-300 mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-900 mb-2">
                      {isFR ? "Vous aimerez aussi" : "Também poderá gostar"}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {similarProducts.map((item, idx) => {
                        const bgColors = [
                          "bg-slate-200",
                          "bg-zinc-200",
                          "bg-stone-200",
                          "bg-gray-200",
                        ];
                        const bgClass = bgColors[idx % bgColors.length];
                        return (
                          <button
                            key={item.id || item.name}
                            onClick={() => {
                              setCurrentProduct(item);
                              setSelectedImage(item.image || "");
                              setQty(1);
                              setIsDescriptionExpanded(false);
                              document
                                .querySelector(".overflow-y-auto")
                                ?.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className={`flex items-center gap-2 p-1.5 rounded-xl ${bgClass} border border-amber-500/30 hover:border-amber-500/70 hover:shadow-sm transition-all group text-left`}
                          >
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-gray-50 group-hover:scale-105 transition-transform duration-300">
                              <img
                                src={getOptimizedImageUrl(item.image, 200)}
                                alt=""
                                className="w-full h-full object-contain p-0.5"
                              />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <p className="text-[8px] font-black text-gray-900 truncate leading-tight uppercase group-hover:text-primary transition-colors">
                                {item.name}
                              </p>
                              <p className="text-[9px] font-black text-primary mt-0.5">
                                {item.price?.toFixed(2)}€
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* ── Info Column ── */}
              <div className="p-5 md:pt-4 md:pb-4 md:px-6 flex flex-col gap-2 text-left order-2 md:order-2 md:h-full md:overflow-hidden">
                {/* Brand + name */}
                <div>
                  {p.brand && (
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg mb-1 inline-block">
                      {p.brand}
                    </span>
                  )}
                  <h2 className="text-base md:text-lg font-black text-gray-900 leading-tight mt-1">
                    {displayName}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex text-primary">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={11}
                          weight={
                            i < Math.floor(Number(averageRating))
                              ? "fill"
                              : "regular"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-[9px] text-gray-400 font-bold">
                      {averageRating} ({reviewsCount}{" "}
                      {isFR ? "avis" : "avaliações"})
                    </span>
                  </div>
                </div>

                {/* Price, Stock and Actions Block (Desktop Only) */}
                <div className="hidden md:grid md:grid-cols-[auto,1fr] gap-3 items-center bg-gray-50 rounded-xl p-2.5 border-2 border-amber-500">
                  {/* Price info (Left) */}
                  <div className="flex flex-col justify-center min-w-[140px]">
                    {p.oldPrice && (
                      <p className="text-[10px] text-gray-400 line-through font-bold leading-none mb-0.5">
                        {p.oldPrice}€
                      </p>
                    )}
                    <p className="text-xl font-black text-primary leading-none">
                      {p.price?.toFixed(2) ?? "—"}€
                    </p>
                    <p className="text-[8px] text-gray-400 font-bold mt-0.5 uppercase tracking-widest leading-none">
                      {isFR ? "TTC inclus" : "IVA incluído"}
                    </p>

                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${inStock ? "bg-green-500 animate-pulse" : "bg-red-400"}`}
                      />
                      <span
                        className={`text-[8px] font-black uppercase tracking-widest ${inStock ? "text-green-600" : "text-red-500"}`}
                      >
                        {inStock
                          ? isFR
                            ? `${p.stock} dispo`
                            : `${p.stock} em stock`
                          : isFR
                            ? "Rupture"
                            : "Esgotado"}
                      </span>
                    </div>
                  </div>

                  {/* Actions (Right) */}
                  {inStock && (
                    <div className="flex gap-2 w-full justify-end">
                      <div className="flex items-center border border-gray-200 rounded-xl bg-white p-0.5 h-10">
                        <button
                          onClick={() => setQty(Math.max(1, qty - 1))}
                          className="p-1.5 text-gray-400 hover:text-primary"
                        >
                          <Minus size={12} weight="bold" />
                        </button>
                        <span className="w-5 text-center font-black text-gray-900 text-xs">
                          {qty}
                        </span>
                        <button
                          onClick={() => setQty(Math.min(p.stock, qty + 1))}
                          className="p-1.5 text-gray-400 hover:text-primary"
                        >
                          <Plus size={12} weight="bold" />
                        </button>
                      </div>

                      <button
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        className="flex-1 max-w-[200px] bg-primary text-white font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-70 h-10"
                      >
                        {isAdding ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            {isFR ? "Ajouté !" : "Adicionado!"}
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={15} weight="bold" />
                            {isFR ? "Ajouter" : "Adicionar"}
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* ── Content Sections (Tabbed Flow) ── */}
                <div className="mt-2 border-t border-gray-100 flex-1 flex flex-col min-h-0">
                  {/* Tabs Header */}
                  <div className="flex border-b border-gray-200 bg-gray-50/30 rounded-lg p-0.5 gap-1">
                    <button
                      onClick={() => setActiveTab("description")}
                      className={`flex-1 py-2.5 text-center text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${
                        activeTab === "description"
                          ? "text-amber-600 bg-slate-200 shadow-sm font-black"
                          : "text-gray-400 bg-slate-100/60 hover:bg-slate-200/50"
                      }`}
                    >
                      {isFR ? "Description" : "Descrição"}
                    </button>
                    <button
                      onClick={() => setActiveTab("specs")}
                      className={`flex-1 py-2.5 text-center text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${
                        activeTab === "specs"
                          ? "text-amber-600 bg-zinc-200 shadow-sm font-black"
                          : "text-gray-400 bg-zinc-100/60 hover:bg-zinc-200/50"
                      }`}
                    >
                      {isFR ? "Specs" : "Características"}
                    </button>
                    <button
                      onClick={() => setActiveTab("reviews")}
                      className={`flex-1 py-2.5 text-center text-[10px] font-black uppercase tracking-widest rounded-md transition-all flex items-center justify-center gap-1 ${
                        activeTab === "reviews"
                          ? "text-amber-600 bg-stone-200 shadow-sm font-black"
                          : "text-gray-400 bg-stone-100/60 hover:bg-stone-200/50"
                      }`}
                    >
                      <span>
                        {isFR ? "Avis" : "Avaliações"} ({reviewsCount})
                      </span>
                      {reviewsCount > 0 && (
                        <Star
                          weight="fill"
                          className="text-amber-500 star-blink-animation shrink-0"
                          size={12}
                        />
                      )}
                    </button>
                  </div>

                  {/* Tabs Content */}
                  <div className="py-4 flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
                    {/* DESCRIPTION */}
                    {activeTab === "description" && (
                      <div className="animate-in fade-in duration-300 space-y-4 text-left">
                        <div className="relative">
                          <div
                            className={`text-xs text-gray-600 font-medium leading-relaxed transition-all duration-300 overflow-hidden ${
                              !isDescriptionExpanded
                                ? "max-h-[140px]"
                                : "max-h-none"
                            }`}
                            dangerouslySetInnerHTML={{
                              __html:
                                formatProductDescription(currentDescription),
                            }}
                          />
                          {!isDescriptionExpanded &&
                            currentDescription &&
                            currentDescription.length > 250 && (
                              <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                            )}
                        </div>
                        {currentDescription &&
                          currentDescription.length > 250 && (
                            <button
                              onClick={() =>
                                setIsDescriptionExpanded(!isDescriptionExpanded)
                              }
                              className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline mt-1 focus:outline-none block"
                            >
                              {isDescriptionExpanded
                                ? isFR
                                  ? "Voir moins"
                                  : "Ver menos"
                                : isFR
                                  ? "Voir plus"
                                  : "Ver mais"}
                            </button>
                          )}
                      </div>
                    )}

                    {/* SPECS */}
                    {activeTab === "specs" && (
                      <div className="animate-in fade-in duration-300">
                        {specs.length > 0 ? (
                          <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
                            {specs.map((spec, i) => (
                              <div
                                key={i}
                                className="grid grid-cols-[90px,1fr] gap-3 p-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors items-start"
                              >
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest pt-0.5">
                                  {spec.key}
                                </span>
                                <span className="text-[10px] font-bold text-gray-900 leading-normal whitespace-pre-line">
                                  {spec.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest text-center py-6">
                            {isFR
                              ? "Aucune caractéristique disponible."
                              : "Nenhuma característica disponível."}
                          </p>
                        )}
                      </div>
                    )}

                    {/* REVIEWS */}
                    {activeTab === "reviews" && (
                      <div className="animate-in fade-in duration-300 flex flex-col gap-4 h-full min-h-0">
                        {/* Rating summary */}
                        <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between border border-gray-100 text-[11px] flex-shrink-0">
                          <div>
                            <div className="flex text-primary mb-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={12}
                                  weight={
                                    i < Math.floor(Number(averageRating))
                                      ? "fill"
                                      : "regular"
                                  }
                                />
                              ))}
                            </div>
                            <p className="text-[9px] font-black text-gray-900 uppercase tracking-widest">
                              {isFR ? "Note globale" : "Avaliação global"} :{" "}
                              {averageRating}/5
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-primary">
                              {reviewsCount} {isFR ? "avis" : "avaliações"}
                            </p>
                          </div>
                        </div>

                        {/* List of reviews */}
                        <div className="space-y-3 overflow-y-auto pr-1 flex-1 min-h-0">
                          {reviews.length > 0 ? (
                            reviews.map((rev) => (
                              <div
                                key={rev.id}
                                className="p-3 bg-white rounded-xl border border-green-600/30 hover:border-green-600/60 transition-colors text-[11px] leading-relaxed shadow-sm"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <div>
                                    <span className="font-black text-gray-900 uppercase text-[9px]">
                                      {rev.name}
                                    </span>
                                    <span className="text-[8px] text-gray-400 font-bold ml-1.5">
                                      ({rev.city})
                                    </span>
                                  </div>
                                  <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        size={9}
                                        weight={
                                          i < rev.rating ? "fill" : "regular"
                                        }
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-gray-600 font-medium text-[10px]">
                                  {rev.text}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest text-center py-8">
                              {isFR
                                ? "Aucun avis pour le moment."
                                : "Nenhuma avaliação de momento."}
                            </p>
                          )}
                        </div>

                        {/* Button to open Sub-modal */}
                        <button
                          onClick={() => setIsReviewModalOpen(true)}
                          className="w-full bg-primary text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-xl hover:bg-primary-dark transition-all shadow-md flex items-center justify-center gap-2 flex-shrink-0"
                        >
                          {isFR ? "Donner un avis" : "Deixar uma avaliação"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section: Similar Products (Mobile only here) */}
                {similarProducts.length > 0 && (
                  <div className="md:hidden animate-in fade-in slide-in-from-bottom-2 duration-300 mt-8 pt-8 border-t border-gray-100">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900 mb-5 flex items-center justify-between">
                      <span>
                        {isFR ? "Vous aimerez aussi" : "Também poderá gostar"}
                      </span>
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {similarProducts.map((item) => (
                        <button
                          key={item.id || item.name}
                          onClick={() => {
                            setCurrentProduct(item);
                            setSelectedImage(item.image || "");
                            setQty(1);
                            setIsDescriptionExpanded(false);
                            document
                              .querySelector(".overflow-y-auto")
                              ?.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="flex items-center gap-2 p-2 rounded-2xl bg-gray-50 border border-gray-100 active:scale-95 transition-all text-left"
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-gray-50">
                            <img
                              src={getOptimizedImageUrl(item.image, 200)}
                              alt=""
                              className="w-full h-full object-contain p-1"
                            />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <p className="text-[8px] font-black text-gray-900 truncate leading-tight uppercase">
                              {item.name}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom Fixed Trust Strip */}
                <div className="grid grid-cols-2 gap-2 border-t border-gray-100 pt-2 mt-2 bg-white text-[9px] flex-shrink-0">
                  <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border border-green-600/30 hover:border-green-600 transition-colors">
                    <Truck size={14} className="text-primary" />
                    <div>
                      <p className="font-black text-gray-900 uppercase leading-none">
                        {isFR ? "Livraison Gratuite" : "Envio Gratuito"}
                      </p>
                      <p className="text-[8px] text-gray-500 font-medium leading-none mt-0.5">
                        {isFR ? "Expédition 24/48h" : "Envio em 24/48h"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border border-green-600/30 hover:border-green-600 transition-colors">
                    <ShieldCheck size={14} className="text-primary" />
                    <div>
                      <p className="font-black text-gray-900 uppercase leading-none">
                        {isFR ? "Garantie & Sécurité" : "Garantia & Segurança"}
                      </p>
                      <p className="text-[8px] text-gray-500 font-medium leading-none mt-0.5">
                        {isFR ? "100% sécurisé" : "100% seguro"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Bottom Action Bar */}
        <div className="md:hidden flex items-center justify-between gap-3 bg-white border-t border-gray-150 p-3.5 z-20 flex-shrink-0 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
          <div className="flex flex-col text-left">
            <span className="text-[8px] font-black uppercase tracking-wider text-gray-400">
              {isFR ? "Prix total" : "Preço total"}
            </span>
            <span className="text-lg font-black text-primary">
              {(p.price * (inStock ? qty : 1)).toFixed(2)}€
            </span>
          </div>
          {inStock ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-0.5 h-10">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="p-2 text-gray-400 hover:text-primary"
                >
                  <Minus size={12} weight="bold" />
                </button>
                <span className="w-5 text-center font-black text-gray-900 text-xs">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(Math.min(p.stock, qty + 1))}
                  className="p-2 text-gray-400 hover:text-primary"
                >
                  <Plus size={12} weight="bold" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="bg-primary text-white font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-70 h-10 px-5"
              >
                {isAdding ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isFR ? "Ajout..." : "A adicionar..."}
                  </>
                ) : (
                  <>
                    <ShoppingCart size={15} weight="bold" />
                    {isFR ? "Ajouter" : "Adicionar"}
                  </>
                )}
              </button>
            </div>
          ) : (
            <span className="bg-red-100 text-red-650 font-black text-xs uppercase tracking-widest px-4 py-2.5 rounded-xl">
              {isFR ? "Rupture" : "Esgotado"}
            </span>
          )}
        </div>
      </div>

      {/* ── Image Full View (Lightbox) ── */}
      {isFullViewOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300 p-4 md:p-12"
          onClick={() => setIsFullViewOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setIsFullViewOpen(false)}
            className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/10 backdrop-blur-md"
            aria-label={
              isFR
                ? "Fermer la vue plein écran"
                : "Fechar visualização em ecrã inteiro"
            }
          >
            <X size={24} weight="bold" />
          </button>

          <div
            className="relative w-full h-full flex items-center justify-center animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage || p.image}
              alt={displayName}
              className="max-w-full max-h-full object-contain drop-shadow-2xl"
            />
            {p.brand && (
              <div className="absolute bottom-0 left-0 right-0 p-8 text-center bg-gradient-to-t from-black/50 to-transparent pointer-events-none">
                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">
                  {p.brand}
                </p>
                <h3 className="text-white font-black text-xl uppercase tracking-tight">
                  {displayName}
                </h3>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Sub-modal: Submit Review ── */}
      {isReviewModalOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 z-[210] backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setIsReviewModalOpen(false)}
          />
          {/* Modal container */}
          <div className="fixed inset-0 flex items-center justify-center z-[220] p-4 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 text-left">
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-all"
                aria-label="Fermer"
              >
                <X size={16} weight="bold" />
              </button>
              <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-1">
                {isFR
                  ? "Laisser un avis client"
                  : "Deixar uma avaliação de cliente"}
              </h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">
                {isFR
                  ? "Partagez votre expérience d'achat"
                  : "Partilhe a sua experiência de compra"}
              </p>

              <form
                onSubmit={async (e) => {
                  await handleAddReview(e);
                  setIsReviewModalOpen(false);
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">
                      {isFR ? "Nom *" : "Nome *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder={isFR ? "Votre nom" : "O seu nome"}
                      className="w-full bg-gray-50 border-0 rounded-xl py-2.5 px-3.5 text-xs font-medium outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">
                      {isFR ? "Ville" : "Cidade"}
                    </label>
                    <input
                      type="text"
                      value={reviewerCity}
                      onChange={(e) => setReviewerCity(e.target.value)}
                      placeholder={isFR ? "Ex: Paris" : "Ex: Lisboa"}
                      className="w-full bg-gray-50 border-0 rounded-xl py-2.5 px-3.5 text-xs font-medium outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 block">
                    {isFR ? "Note globale *" : "Avaliação global *"}
                  </label>
                  <div className="flex gap-1.5 mt-1">
                    {[1, 2, 3, 4, 5].map((stars) => (
                      <button
                        key={stars}
                        type="button"
                        onClick={() => setReviewRating(stars)}
                        className="text-yellow-400 focus:outline-none hover:scale-110 transition-transform"
                      >
                        <Star
                          size={22}
                          weight={stars <= reviewRating ? "fill" : "regular"}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">
                    {isFR ? "Commentaire *" : "Comentário *"}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder={
                      isFR
                        ? "Qu'avez-vous pensé de ce produit ?"
                        : "O que achou deste produto?"
                    }
                    className="w-full bg-gray-50 border-0 rounded-xl py-2.5 px-3.5 text-xs font-medium outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full bg-primary text-white text-[10px] font-black uppercase tracking-widest py-3.5 rounded-xl hover:bg-primary-dark transition-all disabled:opacity-55 shadow-lg shadow-primary/15"
                >
                  {submittingReview
                    ? isFR
                      ? "Envoi..."
                      : "A enviar..."
                    : isFR
                      ? "Envoyer l'avis"
                      : "Enviar avaliação"}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}
