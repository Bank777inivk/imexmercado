import React, { useEffect, useState } from "react";
import {
  Monitor,
  Megaphone,
  Plus,
  Trash,
  ImageSquare,
  Check,
  ArrowClockwise,
  ListDashes,
  Fire,
  Storefront,
  Newspaper,
  Star,
  Layout,
  Truck,
  Lock,
  ChatCircle,
  SquaresFour,
  CaretDown,
  CaretUp,
  List,
  CreditCard,
  Palette,
} from "@phosphor-icons/react";
import { subscribeToDocument, setDocument } from "@imexmercado/firebase";
import { CloudinaryUploader } from "../components/CloudinaryUploader";
import { adjustColor } from "@imexmercado/ui/src/utils";

// ─── Section Tabs ──────────────────────────────────────────────────────────────
const TABS = [
  {
    id: "promobar",
    label: "Bandeau",
    icon: Megaphone,
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    id: "hero",
    label: "Hero Slider",
    icon: Layout,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    id: "mainbanners",
    label: "Bannières CTA",
    icon: Storefront,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    id: "minibanner",
    label: "Mini Banners",
    icon: Storefront,
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    id: "trustbar",
    label: "Confiance",
    icon: Truck,
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    id: "categories",
    label: "Catégories",
    icon: SquaresFour,
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    id: "blog",
    label: "Inspirations",
    icon: Newspaper,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
  },
  {
    id: "flashsale",
    label: "Offres Flash",
    icon: Fire,
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
  {
    id: "promo",
    label: "Blocs Promo",
    icon: Star,
    color: "text-teal-500",
    bg: "bg-teal-50",
  },
  {
    id: "newsletter",
    label: "Newsletter",
    icon: Newspaper,
    color: "text-gray-500",
    bg: "bg-gray-100",
  },
  {
    id: "sidebar",
    label: "Barre Latérale",
    icon: List,
    color: "text-cyan-500",
    bg: "bg-cyan-50",
  },
  {
    id: "carte",
    label: "Carte Paiement",
    icon: CreditCard,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
  },
  {
    id: "theme",
    label: "Thème Global",
    icon: Palette,
    color: "text-pink-500",
    bg: "bg-pink-50",
  },
  {
    id: "legal",
    label: "Pages Légales",
    icon: Lock,
    color: "text-red-600",
    bg: "bg-red-50",
  },
];

// ─── Default settings ──────────────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  promoBar: {
    text: "Offre spéciale de lancement ! -20% sur tout le site",
    color: "#CC0000",
    isActive: true,
  },
  heroSlides: [
    {
      id: "1",
      title: "HI-TECH",
      subtitle: "Le meilleur de la technologie",
      image: "https://placehold.co/800x450",
      videoUrl: "",
      ctaText: "VOIR PLUS",
      isActive: true,
    },
  ],
  mainBanners: [
    {
      id: "mb_jardin",
      bgColor: "bg-gradient-to-r from-[#1a6b2e] to-[#2d9e47]",
      subtitle: "Collection Printemps — Été 2026",
      title: "Équipez votre jardin et vivez vos BBQ",
      ctaText: "Découvrir l'univers Jardin →",
      imageSrc:
        "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800",
      imageAlt: "BBQ et Jardin",
      link: "/boutique?category=Barbecues+%26+Planchas",
      reversed: false,
    },
    {
      id: "mb_smartphones",
      bgColor: "bg-gradient-to-r from-[#001a80] to-[#0044dd]",
      subtitle: "Offre Limitée — Stocks Réduits",
      title: "Jusqu'à -30% sur les smartphones et accessoires",
      ctaText: "Explorer les offres Hi-Tech →",
      imageSrc:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800",
      imageAlt: "Téléphones et Hi-Tech",
      link: "/boutique?category=T%C3%A9l%C3%A9phones+%26+Hi-Tech",
      reversed: true,
    },
  ],
  miniBanners: [
    {
      id: "mb1",
      label: "PROMOTION JUSQU'AU 21 AVRIL",
      title: "Jusqu'à -15% sur l'outillage de Bricolage",
      subtitle: "Promo Bricolage",
      image: "",
      color: "#6B21A8",
      link: "/boutique?filter=promo",
      isActive: true,
    },
    {
      id: "mb2",
      label: "SÉLECTION MAISON",
      title: "Jusqu'à 55% de réduction directe",
      subtitle: "Promo Maison",
      image: "",
      color: "#111111",
      link: "/boutique?category=Maison",
      isActive: true,
    },
  ],
  flashSale: {
    isActive: true,
    title: "OFFRES DU JOUR",
    endHour: 23,
    endMinute: 59,
  },
  trustBar: [
    {
      id: "1",
      icon: "Truck",
      title: "Livraison Gratuite",
      subtitle: "Sur commande > €49.86",
    },
    {
      id: "2",
      icon: "ArrowClockwise",
      title: "Protection Commande",
      subtitle: "Informations sécurisées",
    },
    {
      id: "3",
      icon: "Lock",
      title: "Paiement Sécurisé",
      subtitle: "SSL + 3D Secure",
    },
    {
      id: "4",
      icon: "ChatCircle",
      title: "Retour 30 Jours",
      subtitle: "Remboursement garanti",
    },
  ],
  blogBanner: {
    title: "Conseils et inspirations",
    link: "/boutique",
    isActive: true,
  },
  homeCategories: [
    {
      id: "1",
      name: "Téléphones & Hi-Tech",
      short: "Tech",
      image:
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=200",
      link: "/boutique?category=T%C3%A9l%C3%A9phones+%26+Hi-Tech",
    },
    {
      id: "2",
      name: "Maison & Décoration",
      short: "Maison",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=200",
      link: "/boutique?category=Maison+%26+D%C3%A9coration",
    },
    {
      id: "3",
      name: "Meubles & Lampes",
      short: "Meubles",
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=200",
      link: "/boutique?category=Meubles+%26+Lampes",
    },
    {
      id: "4",
      name: "Bricolage",
      short: "Brico",
      image:
        "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=200",
      link: "/boutique?category=Bricolage",
    },
    {
      id: "5",
      name: "Barbecues & Planchas",
      short: "BBQ",
      image:
        "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&q=80&w=200",
      link: "/boutique?category=Barbecues+%26+Planchas",
    },
    {
      id: "6",
      name: "Piscines & Spas",
      short: "Piscines",
      image:
        "https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?auto=format&fit=crop&q=80&w=200",
      link: "/boutique?category=Piscines+%26+Spas",
    },
  ],
  promoBlocks: [
    {
      id: "pb1",
      title: "SÉLECTION HI-TECH",
      discount: "Jusqu'à 60 % de réduction",
      description: "sur une sélection de smartphones reconditionnés",
      color: "#00ADC6",
      image: "",
      link: "/boutique?category=T%C3%A9l%C3%A9phones+%26+Hi-Tech",
    },
    {
      id: "pb2",
      title: "AMÉNAGEMENT JARDIN",
      discount: "Jusqu'à 20 % de réduction",
      description: "sur notre gamme BBQ et salons d'extérieur",
      color: "#00A7C1",
      image: "",
      link: "/boutique?category=Barbecues+%26+Planchas",
    },
    {
      id: "pb3",
      title: "OFFRE BRICOLAGE",
      discount: "Jusqu'à 30 % de réduction",
      description: "sur l'outillage électroportatif professionnel",
      color: "#00B4CC",
      image: "",
      link: "/boutique?category=Bricolage",
    },
    {
      id: "pb4",
      title: "PROMO MOBILIER",
      discount: "10 % avec code MAISON10",
      description: "à l'achat de 2 meubles ou canapés",
      color: "#00B9D6",
      image: "",
      link: "/boutique?category=Meubles+%26+Lampes",
    },
  ],
  newsletter: {
    isActive: true,
    title: "Restez dans la Boucle",
    subtitle:
      "Offres exclusives, nouveautés et conseils directement dans votre boîte mail.",
    buttonText: "M'abonner",
  },
  sidebar: {
    categoryAds: [
      {
        image:
          "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=400",
        title: "Offre Hi-Tech",
        subtitle: "-20% sur tout",
      },
      {
        image:
          "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=400",
        title: "Vente Privée",
        subtitle: "Mobilier Design",
      },
      {
        image:
          "https://images.unsplash.com/photo-1620912189865-1e8a33da4c5e?auto=format&fit=crop&q=80&w=400",
        title: "Nouveautés",
        subtitle: "Barbecue Inox",
      },
    ],
    showAllLink: "/boutique",
    latestTitle: "Derniers Produits",
    popularTitle: "Populaires",
    verticalAds: [
      {
        image:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400&h=600",
        title: "Interior Design",
        subtitle: "Shop now",
        bgColor: "#00000033",
      },
      {
        image:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400&h=600",
        title: "Living Room",
        subtitle: "Collection 2026",
        bgColor: "#0000FF33",
      },
    ],
    engagementStats: [
      {
        value: "300+",
        label: "Références",
        subtext: "En stock réel",
        emoji: "📦",
      },
      { value: "50", label: "Produits", subtext: "Par catégorie", emoji: "🗂️" },
      {
        value: "24h",
        label: "Traitement",
        subtext: "Commande express",
        emoji: "⚡",
      },
      {
        value: "100%",
        label: "Vérifiés",
        subtext: "Contrôle strict",
        emoji: "✅",
      },
    ],
  },
  cardTheme: {
    baseColor: "#1a1c22",
    faceLight: "#2c303a",
    faceMid: "#22262f",
    faceDark: "#1e2028",
    textColor: "#D4AF37",
    accentColor: "#D4AF37",
  },
  globalTheme: {
    client: {
      primaryColor: "#F15A24",
      secondaryColor: "#1E3A5F",
      accentColor: "#F5A623",
      sidebarColor: "#0F1115",
      sidebarTextColor: "#9CA3AF",
      sidebarActiveColor: "#FFFFFF",
      cardBgColor: "#FFFFFF",
      cardTextColor: "#111827",
    },
    admin: {
      primaryColor: "#F15A24",
      sidebarColor: "#FFFFFF",
      sidebarTextColor: "#6B7280",
      sidebarActiveColor: "#FFFFFF",
      cardBgColor: "rgba(0,0,0,0.05)",
      cardTextColor: "#111827",
      accentColor: "#F5A623",
    },
  },
};

// ─── Reusable Toggle ───────────────────────────────────────────────────────────
function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`w-12 h-6 rounded-full relative transition-all flex-shrink-0 ${value ? "bg-green-500" : "bg-gray-200"}`}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${value ? "right-1" : "left-1"}`}
      />
    </button>
  );
}

// ─── Field ─────────────────────────────────────────────────────────────────────
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block ml-1">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      type="text"
      className={`w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/10 outline-none ${className}`}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

// ─── PTField : Champ PT avec bouton "Traduire" auto FR→PT ─────────────────────
function PTField({
  label,
  value,
  onChange,
  sourceText,
  multiline = false,
  rows = 2,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  sourceText: string;
  multiline?: boolean;
  rows?: number;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const translate = async () => {
    if (!sourceText?.trim()) return;
    setLoading(true);
    setError("");
    try {
      // Helper to split text into chunks of max length without cutting words or HTML tags where possible
      const splitIntoChunks = (text: string, maxLen = 800): string[] => {
        const lines = text.split("\n");
        const chunks: string[] = [];
        let currentChunk = "";

        for (const line of lines) {
          if ((currentChunk + "\n" + line).length > maxLen) {
            if (currentChunk) {
              chunks.push(currentChunk);
              currentChunk = line;
            } else {
              let temp = line;
              while (temp.length > maxLen) {
                let splitIdx = temp.lastIndexOf(" ", maxLen);
                if (splitIdx === -1) splitIdx = maxLen;
                chunks.push(temp.substring(0, splitIdx));
                temp = temp.substring(splitIdx).trim();
              }
              currentChunk = temp;
            }
          } else {
            if (currentChunk) {
              currentChunk += "\n" + line;
            } else {
              currentChunk = line;
            }
          }
        }
        if (currentChunk) {
          chunks.push(currentChunk);
        }
        return chunks;
      };

      const chunks = splitIntoChunks(sourceText, 800);
      const translatedChunks: string[] = [];

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        if (!chunk.trim()) {
          translatedChunks.push(chunk);
          continue;
        }

        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=fr|pt&de=info@imexmercado.pt`;
        const res = await fetch(url);
        const json = await res.json();

        if (json.responseStatus === 200 && json.responseData?.translatedText) {
          translatedChunks.push(json.responseData.translatedText);
        } else {
          throw new Error("Erreur API");
        }

        // Brief pause to respect API rate limits
        if (i < chunks.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 250));
        }
      }

      onChange(translatedChunks.join("\n"));
    } catch (err) {
      console.error("Translation error:", err);
      setError("Erreur traduction");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between ml-1">
        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">
          {label}
        </label>
        <button
          type="button"
          onClick={translate}
          disabled={loading || !sourceText?.trim()}
          title={
            sourceText
              ? `Traduire : "${sourceText.slice(0, 40)}..."`
              : "Aucun texte FR à traduire"
          }
          className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg transition-all
            ${
              loading
                ? "bg-blue-50 text-blue-400 cursor-wait"
                : error
                  ? "bg-red-50 text-red-400"
                  : !sourceText?.trim()
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                    : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:scale-105 active:scale-95"
            }`}
        >
          {loading ? (
            <>
              <svg
                className="w-2.5 h-2.5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Traduction...
            </>
          ) : error ? (
            <>⚠ {error}</>
          ) : (
            <>🌐 Traduire FR→PT</>
          )}
        </button>
      </div>
      {multiline ? (
        <textarea
          className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/10 outline-none resize-y"
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Input value={value} onChange={onChange} />
      )}
    </div>
  );
}

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-6">
      <h3 className="font-black text-gray-900 text-lg uppercase tracking-tight">
        {title}
      </h3>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
  );
}

function AdvancedSettings({
  children,
  title = "Textes & Métadonnées",
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mt-4 border-t border-gray-100 pt-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
      >
        {isOpen ? (
          <CaretUp size={14} weight="bold" />
        ) : (
          <CaretDown size={14} weight="bold" />
        )}
        {title}
      </button>
      {isOpen && (
        <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Section Components ────────────────────────────────────────────────────────

function PromoBarSection({ settings, setSettings }: any) {
  const pb = settings.promoBar;
  const set = (k: string, v: any) =>
    setSettings((s: any) => ({ ...s, promoBar: { ...s.promoBar, [k]: v } }));
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionTitle
          title="Bandeau Haut"
          subtitle="Configuration visuelle de l'accroche site."
        />
        <Toggle value={pb.isActive} onChange={(v) => set("isActive", v)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Atmosphère (Couleur)">
          <div className="flex items-center gap-3">
            <input
              type="color"
              className="w-12 h-12 rounded-xl border-none cursor-pointer p-0 overflow-hidden shadow-sm"
              value={pb.color}
              onChange={(e) => set("color", e.target.value)}
            />
            <Input
              value={pb.color}
              onChange={(v) => set("color", v)}
              placeholder="#CC0000"
              className="font-mono"
            />
          </div>
        </Field>

        <div className="flex items-end">
          {pb.isActive && (
            <div
              className="w-full rounded-xl py-3 px-4 text-center text-white text-[10px] font-black uppercase tracking-widest shadow-lg"
              style={{ backgroundColor: pb.color }}
            >
              {pb.text || "Aperçu du bandeau..."}
            </div>
          )}
        </div>
      </div>

      <AdvancedSettings>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Message d'annonce (FR)">
            <textarea
              className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/10 outline-none resize-none"
              rows={2}
              value={pb.text}
              onChange={(e) => set("text", e.target.value)}
            />
          </Field>
          <PTField
            label="Message d'annonce (PT)"
            value={pb.textPT || ""}
            onChange={(v) => set("textPT", v)}
            sourceText={pb.text}
            multiline
          />
        </div>
      </AdvancedSettings>
    </div>
  );
}

function HeroSliderSection({ settings, setSettings }: any) {
  const slides = settings.heroSlides || [];
  const addSlide = () =>
    setSettings((s: any) => ({
      ...s,
      heroSlides: [
        ...s.heroSlides,
        {
          id: Date.now().toString(),
          title: "NOUVEAU",
          subtitle: "Description",
          image: "",
          videoUrl: "",
          ctaText: "VOIR PLUS",
          link: "",
          isActive: true,
        },
      ],
    }));
  const removeSlide = (id: string) =>
    setSettings((s: any) => ({
      ...s,
      heroSlides: s.heroSlides.filter((x: any) => x.id !== id),
    }));
  const update = (id: string, k: string, v: any) =>
    setSettings((s: any) => ({
      ...s,
      heroSlides: s.heroSlides.map((x: any) =>
        x.id === id ? { ...x, [k]: v } : x,
      ),
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionTitle
          title="Hero Slider"
          subtitle="Gestion des grandes bannières visuelles et vidéos."
        />
        <button
          onClick={addSlide}
          className="flex items-center gap-2 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-2xl shadow-xl hover:scale-105 transition-all"
        >
          <Plus size={16} weight="bold" /> Nouveau Slide
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slides.map((slide: any, i: number) => (
          <div
            key={slide.id}
            className="bg-white rounded-3xl p-6 space-y-6 border border-gray-100 shadow-sm relative group/card"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                Banner #{i + 1}
              </span>
              <div className="flex items-center gap-3">
                <Toggle
                  value={slide.isActive}
                  onChange={(v) => update(slide.id, "isActive", v)}
                />
                <button
                  onClick={() => removeSlide(slide.id)}
                  className="p-2 text-gray-200 hover:text-red-500 transition-colors"
                >
                  <Trash size={18} weight="bold" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CloudinaryUploader
                label="Image de fond"
                value={slide.image}
                onChange={(url) => update(slide.id, "image", url)}
              />
              <CloudinaryUploader
                label="Vidéo (MP4)"
                resourceType="video"
                value={slide.videoUrl}
                onChange={(url) => update(slide.id, "videoUrl", url)}
              />
            </div>

            <AdvancedSettings title="Textes & Lien">
              <div className="space-y-4">
                <Field label="Lien de redirection">
                  <Input
                    value={slide.link || ""}
                    onChange={(v) => update(slide.id, "link", v)}
                    placeholder="Ex: /boutique?category=Téléphones & Hi-Tech"
                  />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Titre principal (FR)">
                    <Input
                      value={slide.title}
                      onChange={(v) => update(slide.id, "title", v)}
                    />
                  </Field>
                  <PTField
                    label="Titre principal (PT)"
                    value={slide.titlePT || ""}
                    onChange={(v) => update(slide.id, "titlePT", v)}
                    sourceText={slide.title}
                  />
                  <Field label="Sous-titre (FR)">
                    <Input
                      value={slide.subtitle}
                      onChange={(v) => update(slide.id, "subtitle", v)}
                    />
                  </Field>
                  <PTField
                    label="Sous-titre (PT)"
                    value={slide.subtitlePT || ""}
                    onChange={(v) => update(slide.id, "subtitlePT", v)}
                    sourceText={slide.subtitle}
                  />
                  <Field label="Texte bouton (FR)">
                    <Input
                      value={slide.ctaText}
                      onChange={(v) => update(slide.id, "ctaText", v)}
                    />
                  </Field>
                  <PTField
                    label="Texte bouton (PT)"
                    value={slide.ctaTextPT || ""}
                    onChange={(v) => update(slide.id, "ctaTextPT", v)}
                    sourceText={slide.ctaText}
                  />
                </div>
              </div>
            </AdvancedSettings>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniBannersSection({ settings, setSettings }: any) {
  const banners = settings.miniBanners || [];
  const update = (id: string, k: string, v: any) =>
    setSettings((s: any) => ({
      ...s,
      miniBanners: s.miniBanners.map((x: any) =>
        x.id === id ? { ...x, [k]: v } : x,
      ),
    }));

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Mini Banners"
        subtitle="Les deux blocs d'appoint à droite du slide principal."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b: any, i: number) => (
          <div
            key={b.id}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                Bloc #{i + 1}
              </span>
              <Toggle
                value={b.isActive}
                onChange={(v) => update(b.id, "isActive", v)}
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <CloudinaryUploader
                label="Visuel de fond"
                value={b.image}
                onChange={(url) => update(b.id, "image", url)}
              />

              <Field label="Couleur de secours">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    className="w-12 h-12 rounded-xl border-none cursor-pointer p-0 overflow-hidden shadow-sm"
                    value={b.color}
                    onChange={(e) => update(b.id, "color", e.target.value)}
                  />
                  <Input
                    value={b.color}
                    onChange={(v) => update(b.id, "color", v)}
                    placeholder="#6B21A8"
                    className="font-mono text-xs"
                  />
                </div>
              </Field>
            </div>

            <AdvancedSettings title="Textes & Lien">
              <div className="space-y-3">
                <Field label="Lien de redirection">
                  <Input
                    value={b.link}
                    onChange={(v) => update(b.id, "link", v)}
                  />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Étiquette (FR)">
                    <Input
                      value={b.label}
                      onChange={(v) => update(b.id, "label", v)}
                    />
                  </Field>
                  <PTField
                    label="Étiquette (PT)"
                    value={b.labelPT || ""}
                    onChange={(v) => update(b.id, "labelPT", v)}
                    sourceText={b.label}
                  />
                  <Field label="Titre Principal (FR)">
                    <Input
                      value={b.title}
                      onChange={(v) => update(b.id, "title", v)}
                    />
                  </Field>
                  <PTField
                    label="Titre Principal (PT)"
                    value={b.titlePT || ""}
                    onChange={(v) => update(b.id, "titlePT", v)}
                    sourceText={b.title}
                  />
                  <Field label="Sous-titre (FR)">
                    <Input
                      value={b.subtitle}
                      onChange={(v) => update(b.id, "subtitle", v)}
                    />
                  </Field>
                  <PTField
                    label="Sous-titre (PT)"
                    value={b.subtitlePT || ""}
                    onChange={(v) => update(b.id, "subtitlePT", v)}
                    sourceText={b.subtitle}
                  />
                </div>
              </div>
            </AdvancedSettings>
          </div>
        ))}
      </div>
    </div>
  );
}

function MainBannersSection({ settings, setSettings }: any) {
  const banners = settings.mainBanners || DEFAULT_SETTINGS.mainBanners;
  const update = (id: string, k: string, v: any) =>
    setSettings((s: any) => ({
      ...s,
      mainBanners: s.mainBanners.map((x: any) =>
        x.id === id ? { ...x, [k]: v } : x,
      ),
    }));

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Grandes Bannières CTA"
        subtitle="Les deux grandes bannières promotionnelles de la page d'accueil."
      />

      <div className="grid grid-cols-1 gap-8">
        {banners.map((b: any, i: number) => (
          <div
            key={b.id}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                Bannière {i + 1} —{" "}
                {b.id === "mb_jardin"
                  ? "Jardin & BBQ"
                  : "Smartphones & Hi-Tech"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CloudinaryUploader
                label="Image de la bannière"
                value={b.imageSrc}
                onChange={(url) => update(b.id, "imageSrc", url)}
              />

              <div className="space-y-4">
                <Field label="Couleur / Gradient de fond">
                  <Input
                    value={b.bgColor}
                    onChange={(v) => update(b.id, "bgColor", v)}
                    placeholder="bg-gradient-to-r from-[#1a6b2e] to-[#2d9e47]"
                    className="font-mono text-xs"
                  />
                </Field>
                <div className="text-[10px] text-gray-400 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                  💡 Vous pouvez utiliser des classes Tailwind comme{" "}
                  <code className="font-mono text-gray-600 bg-gray-200/50 px-1 rounded">
                    bg-gradient-to-r from-[#1a6b2e] to-[#2d9e47]
                  </code>{" "}
                  pour définir le fond de la bannière.
                </div>
              </div>
            </div>

            <AdvancedSettings title="Textes, Liens & Alignement">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Sous-titre (FR)">
                  <Input
                    value={b.subtitle}
                    onChange={(v) => update(b.id, "subtitle", v)}
                  />
                </Field>
                <PTField
                  label="Sous-titre (PT)"
                  value={b.subtitlePT || ""}
                  onChange={(v) => update(b.id, "subtitlePT", v)}
                  sourceText={b.subtitle}
                />
                <Field label="Titre Principal (FR)">
                  <Input
                    value={b.title}
                    onChange={(v) => update(b.id, "title", v)}
                  />
                </Field>
                <PTField
                  label="Titre Principal (PT)"
                  value={b.titlePT || ""}
                  onChange={(v) => update(b.id, "titlePT", v)}
                  sourceText={b.title}
                />
                <Field label="Texte du Bouton (FR)">
                  <Input
                    value={b.ctaText}
                    onChange={(v) => update(b.id, "ctaText", v)}
                  />
                </Field>
                <PTField
                  label="Texte du Bouton (PT)"
                  value={b.ctaTextPT || ""}
                  onChange={(v) => update(b.id, "ctaTextPT", v)}
                  sourceText={b.ctaText}
                />
                <Field label="Lien de redirection (URL)">
                  <Input
                    value={b.link}
                    onChange={(v) => update(b.id, "link", v)}
                  />
                </Field>
                <Field label="Alt de l'image">
                  <Input
                    value={b.imageAlt}
                    onChange={(v) => update(b.id, "imageAlt", v)}
                  />
                </Field>
                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id={`rev-${b.id}`}
                    checked={b.reversed || false}
                    onChange={(e) => update(b.id, "reversed", e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label
                    htmlFor={`rev-${b.id}`}
                    className="text-[10px] font-black uppercase tracking-widest text-gray-600 cursor-pointer select-none"
                  >
                    Inverser la position de l'image (Image à gauche)
                  </label>
                </div>
              </div>
            </AdvancedSettings>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlashSaleSection({ settings, setSettings }: any) {
  const fs = settings.flashSale || DEFAULT_SETTINGS.flashSale;
  const set = (k: string, v: any) =>
    setSettings((s: any) => ({ ...s, flashSale: { ...s.flashSale, [k]: v } }));
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionTitle
          title="Ventes Flash"
          subtitle="Réglages du compte à rebours et de la section d'urgence."
        />
        <Toggle value={fs.isActive} onChange={(v) => set("isActive", v)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-orange-50/50 p-6 rounded-[2.5rem] border border-orange-100">
        <Field label="Heure de fin (0-23)">
          <input
            type="number"
            min={0}
            max={23}
            className="w-full bg-white border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-orange-200 outline-none shadow-sm"
            value={fs.endHour}
            onChange={(e) => set("endHour", parseInt(e.target.value))}
          />
        </Field>
        <Field label="Minute de fin (0-59)">
          <input
            type="number"
            min={0}
            max={59}
            className="w-full bg-white border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-orange-200 outline-none shadow-sm"
            value={fs.endMinute}
            onChange={(e) => set("endMinute", parseInt(e.target.value))}
          />
        </Field>
      </div>

      <AdvancedSettings title="Textes & Flag">
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Titre section (FR)">
              <Input value={fs.title} onChange={(v) => set("title", v)} />
            </Field>
            <PTField
              label="Titre section (PT)"
              value={fs.titlePT || ""}
              onChange={(v) => set("titlePT", v)}
              sourceText={fs.title}
            />
          </div>
          <div className="bg-orange-100/50 rounded-xl p-4 text-[10px] text-orange-800 font-bold uppercase tracking-widest leading-relaxed">
            💡 Les produits affichés sont ceux marqués "Offre du Jour" dans leur
            fiche.
          </div>
        </div>
      </AdvancedSettings>
    </div>
  );
}

function PromoBlocksSection({ settings, setSettings }: any) {
  const blocks = settings.promoBlocks || DEFAULT_SETTINGS.promoBlocks;
  const update = (id: string, k: string, v: any) =>
    setSettings((s: any) => ({
      ...s,
      promoBlocks: s.promoBlocks.map((x: any) =>
        x.id === id ? { ...x, [k]: v } : x,
      ),
    }));
  return (
    <div className="space-y-6">
      <SectionTitle
        title="Blocs Promotionnels"
        subtitle="Les 4 grandes cartes visuelles avec images de fond."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blocks.map((b: any, i: number) => (
          <div
            key={b.id}
            className="bg-white border border-gray-100 rounded-3xl p-6 space-y-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: b.color }}
              />
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                Carte #{i + 1}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <CloudinaryUploader
                label="Image du bloc"
                value={b.image}
                onChange={(url) => update(b.id, "image", url)}
              />
              <Field label="Couleur de fond">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    className="w-12 h-12 rounded-xl border-none cursor-pointer p-0 overflow-hidden shadow-sm"
                    value={b.color}
                    onChange={(e) => update(b.id, "color", e.target.value)}
                  />
                  <Input
                    value={b.color}
                    onChange={(v) => update(b.id, "color", v)}
                    className="font-mono text-xs"
                  />
                </div>
              </Field>
            </div>

            <AdvancedSettings title="Textes & Lien">
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Titre Principal (FR)">
                    <Input
                      value={b.title}
                      onChange={(v) => update(b.id, "title", v)}
                    />
                  </Field>
                  <PTField
                    label="Titre Principal (PT)"
                    value={b.titlePT || ""}
                    onChange={(v) => update(b.id, "titlePT", v)}
                    sourceText={b.title}
                  />
                  <Field label="Accroche (FR)">
                    <Input
                      value={b.discount}
                      onChange={(v) => update(b.id, "discount", v)}
                    />
                  </Field>
                  <PTField
                    label="Accroche (PT)"
                    value={b.discountPT || ""}
                    onChange={(v) => update(b.id, "discountPT", v)}
                    sourceText={b.discount}
                  />
                  <Field label="Description (FR)">
                    <Input
                      value={b.description}
                      onChange={(v) => update(b.id, "description", v)}
                    />
                  </Field>
                  <PTField
                    label="Description (PT)"
                    value={b.descriptionPT || ""}
                    onChange={(v) => update(b.id, "descriptionPT", v)}
                    sourceText={b.description}
                  />
                </div>
                <Field label="Lien">
                  <Input
                    value={b.link}
                    onChange={(v) => update(b.id, "link", v)}
                  />
                </Field>
              </div>
            </AdvancedSettings>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsletterSection({ settings, setSettings }: any) {
  const nl = settings.newsletter || DEFAULT_SETTINGS.newsletter;
  const set = (k: string, v: any) =>
    setSettings((s: any) => ({
      ...s,
      newsletter: { ...s.newsletter, [k]: v },
    }));
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionTitle
          title="Newsletter"
          subtitle="Réglages de l'appel à l'inscription mail."
        />
        <Toggle value={nl.isActive} onChange={(v) => set("isActive", v)} />
      </div>

      <div className="bg-gray-900 rounded-[2.5rem] p-8 text-center border-t-4 border-primary shadow-2xl">
        <p className="text-white font-black text-xl uppercase tracking-tighter">
          {nl.title}
        </p>
        <p className="text-gray-400 text-xs mt-2 max-w-md mx-auto">
          {nl.subtitle}
        </p>
        <div className="flex gap-2 max-w-sm mx-auto mt-6">
          <div className="flex-1 bg-white/5 rounded-xl py-3 px-4 text-gray-600 text-[10px] font-bold uppercase tracking-widest text-left">
            votre@email.com
          </div>
          <div className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl">
            {nl.buttonText}
          </div>
        </div>
      </div>

      <AdvancedSettings>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Titre principal (FR)">
            <Input value={nl.title} onChange={(v) => set("title", v)} />
          </Field>
          <PTField
            label="Titre principal (PT)"
            value={nl.titlePT || ""}
            onChange={(v) => set("titlePT", v)}
            sourceText={nl.title}
          />
          <Field label="Sous-titre (FR)">
            <textarea
              className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/10 outline-none resize-none"
              rows={2}
              value={nl.subtitle}
              onChange={(e) => set("subtitle", e.target.value)}
            />
          </Field>
          <PTField
            label="Sous-titre (PT)"
            value={nl.subtitlePT || ""}
            onChange={(v) => set("subtitlePT", v)}
            sourceText={nl.subtitle}
            multiline
          />
          <Field label="Libellé bouton (FR)">
            <Input
              value={nl.buttonText}
              onChange={(v) => set("buttonText", v)}
            />
          </Field>
          <PTField
            label="Libellé bouton (PT)"
            value={nl.buttonTextPT || ""}
            onChange={(v) => set("buttonTextPT", v)}
            sourceText={nl.buttonText}
          />
          <Field label="Placeholder e-mail (FR)">
            <Input
              value={nl.placeholder || ""}
              onChange={(v) => set("placeholder", v)}
            />
          </Field>
          <PTField
            label="Placeholder e-mail (PT)"
            value={nl.placeholderPT || ""}
            onChange={(v) => set("placeholderPT", v)}
            sourceText={nl.placeholder || ""}
          />
        </div>
      </AdvancedSettings>
    </div>
  );
}

function TrustBarSection({ settings, setSettings }: any) {
  const items = settings.trustBar || [];
  const update = (id: string, k: string, v: any) =>
    setSettings((s: any) => ({
      ...s,
      trustBar: s.trustBar.map((x: any) =>
        x.id === id ? { ...x, [k]: v } : x,
      ),
    }));
  const icons = [
    "Truck",
    "ArrowClockwise",
    "Lock",
    "ChatCircle",
    "Phone",
    "House",
    "Star",
  ];

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Réassurance"
        subtitle="Les 4 badges techniques sous le header."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item: any, i: number) => (
          <div
            key={item.id}
            className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                Badge #{i + 1}
              </span>
            </div>
            <Field label="Icône Technique">
              <select
                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/10 outline-none appearance-none cursor-pointer"
                value={item.icon}
                onChange={(e) => update(item.id, "icon", e.target.value)}
              >
                {icons.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </Field>

            <AdvancedSettings title="Libellés du badge">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Titre (FR)">
                  <Input
                    value={item.title}
                    onChange={(v) => update(item.id, "title", v)}
                  />
                </Field>
                <PTField
                  label="Titre (PT)"
                  value={item.titlePT || ""}
                  onChange={(v) => update(item.id, "titlePT", v)}
                  sourceText={item.title}
                />
                <Field label="Sous-titre (FR)">
                  <Input
                    value={item.subtitle}
                    onChange={(v) => update(item.id, "subtitle", v)}
                  />
                </Field>
                <PTField
                  label="Sous-titre (PT)"
                  value={item.subtitlePT || ""}
                  onChange={(v) => update(item.id, "subtitlePT", v)}
                  sourceText={item.subtitle}
                />
              </div>
            </AdvancedSettings>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlogBannerSection({ settings, setSettings }: any) {
  const bb = settings.blogBanner || DEFAULT_SETTINGS.blogBanner;
  const set = (k: string, v: any) =>
    setSettings((s: any) => ({
      ...s,
      blogBanner: { ...s.blogBanner, [k]: v },
    }));
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionTitle
          title="Bandeau Inspirations"
          subtitle="Barre d'inspiration au dessus des catégories."
        />
        <Toggle value={bb.isActive} onChange={(v) => set("isActive", v)} />
      </div>

      <div className="bg-gray-100 rounded-[2.5rem] p-6 flex justify-between items-center shadow-inner">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm">
            <Newspaper size={20} weight="bold" className="text-primary" />
          </div>
          <span className="text-xs font-black uppercase text-gray-900 tracking-tighter">
            {bb.title}
          </span>
        </div>
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
          <span className="text-primary font-black">{">"}</span>
        </div>
      </div>

      <AdvancedSettings title="Textes & URL">
        <div className="space-y-3">
          <Field label="Titre du bandeau (FR)">
            <Input value={bb.title} onChange={(v) => set("title", v)} />
          </Field>
          <PTField
            label="Titre du bandeau (PT)"
            value={bb.titlePT || ""}
            onChange={(v) => set("titlePT", v)}
            sourceText={bb.title || ""}
          />
          <Field label="Lien (URL)">
            <Input value={bb.link} onChange={(v) => set("link", v)} />
          </Field>
        </div>
      </AdvancedSettings>
    </div>
  );
}

function HomeCategoriesSection({ settings, setSettings }: any) {
  const cats = settings.homeCategories || [];
  const update = (id: string, k: string, v: any) =>
    setSettings((s: any) => ({
      ...s,
      homeCategories: s.homeCategories.map((x: any) =>
        x.id === id ? { ...x, [k]: v } : x,
      ),
    }));

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Catégories Bulles"
        subtitle="Les 6 cercles de catégories sur la page d'accueil."
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {cats.map((cat: any, i: number) => (
          <div
            key={cat.id}
            className="bg-white border border-gray-100 rounded-[2rem] p-4 flex flex-col items-center gap-4 shadow-sm group"
          >
            <div className="w-20">
              <CloudinaryUploader
                value={cat.image}
                onChange={(url) => update(cat.id, "image", url)}
                label=""
              />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black uppercase text-gray-900 truncate w-full">
                {cat.short}
              </p>
            </div>

            <AdvancedSettings title="Lien & Nom">
              <div className="space-y-3">
                <Field label="Libellé (FR)">
                  <Input
                    value={cat.short}
                    onChange={(v) => update(cat.id, "short", v)}
                  />
                </Field>
                <PTField
                  label="Libellé (PT)"
                  value={cat.shortPT || ""}
                  onChange={(v) => update(cat.id, "shortPT", v)}
                  sourceText={cat.short || ""}
                />
                <Field label="Lien">
                  <Input
                    value={cat.link}
                    onChange={(v) => update(cat.id, "link", v)}
                  />
                </Field>
              </div>
            </AdvancedSettings>
          </div>
        ))}
      </div>
    </div>
  );
}

function SidebarSection({ settings, setSettings }: any) {
  // ...existing sidebar section code...
  const side = settings.sidebar || DEFAULT_SETTINGS.sidebar;
  const set = (path: string, v: any) => {
    const keys = path.split(".");
    setSettings((s: any) => {
      let next = { ...s, sidebar: { ...s.sidebar } };
      let curr = next.sidebar;
      for (let i = 0; i < keys.length - 1; i++) {
        curr[keys[i]] = { ...curr[keys[i]] };
        curr = curr[keys[i]];
      }
      curr[keys[keys.length - 1]] = v;
      return next;
    });
  };

  const updateItem = (listKey: string, index: number, k: string, v: any) => {
    const newList = [...side[listKey]];
    newList[index] = { ...newList[index], [k]: v };
    set(listKey, newList);
  };

  return (
    <div className="space-y-10">
      {/* ── Category Sidebar Ads ── */}
      <div className="space-y-6">
        <SectionTitle
          title="Sidebar Catégories"
          subtitle="Publicités horizontales en bas du menu catégories."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {side.categoryAds.map((ad: any, i: number) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-3xl p-5 space-y-4 shadow-sm"
            >
              <CloudinaryUploader
                value={ad.image || ad.img}
                onChange={(v) => updateItem("categoryAds", i, "image", v)}
                label={`Ad #${i + 1}`}
              />
              <AdvancedSettings title="Textes de l'Ad">
                <div className="space-y-3">
                  <Field label="Titre (FR)">
                    <Input
                      value={ad.title}
                      onChange={(v) => updateItem("categoryAds", i, "title", v)}
                    />
                  </Field>
                  <PTField
                    label="Titre (PT)"
                    value={ad.titlePT || ""}
                    onChange={(v) => updateItem("categoryAds", i, "titlePT", v)}
                    sourceText={ad.title}
                  />
                  <Field label="Sous-titre (FR)">
                    <Input
                      value={ad.subtitle}
                      onChange={(v) =>
                        updateItem("categoryAds", i, "subtitle", v)
                      }
                    />
                  </Field>
                  <PTField
                    label="Sous-titre (PT)"
                    value={ad.subtitlePT || ""}
                    onChange={(v) =>
                      updateItem("categoryAds", i, "subtitlePT", v)
                    }
                    sourceText={ad.subtitle}
                  />
                </div>
              </AdvancedSettings>
            </div>
          ))}
        </div>
        <Field label="Lien 'Voir tout le catalogue'">
          <Input
            value={side.showAllLink}
            onChange={(v) => set("showAllLink", v)}
          />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <Field label="Titre 'Derniers Produits' (FR)">
              <Input
                value={side.latestTitle}
                onChange={(v) => set("latestTitle", v)}
              />
            </Field>
            <PTField
              label="Titre 'Derniers Produits' (PT)"
              value={side.latestTitlePT || ""}
              onChange={(v) => set("latestTitlePT", v)}
              sourceText={side.latestTitle}
            />
          </div>
          <div>
            <Field label="Titre 'Populaires' (FR)">
              <Input
                value={side.popularTitle}
                onChange={(v) => set("popularTitle", v)}
              />
            </Field>
            <PTField
              label="Titre 'Populaires' (PT)"
              value={side.popularTitlePT || ""}
              onChange={(v) => set("popularTitlePT", v)}
              sourceText={side.popularTitle}
            />
          </div>
        </div>
      </div>

      {/* ── Home Sidebar Ads (Vertical) ── */}
      <div className="space-y-6 pt-6 border-t border-gray-100">
        <SectionTitle
          title="Sidebar Principale (Bas)"
          subtitle="Grands visuels verticaux à gauche des produits."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {side.verticalAds.map((ad: any, i: number) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-[2.5rem] p-6 space-y-4 shadow-sm"
            >
              <CloudinaryUploader
                value={ad.image}
                onChange={(v) => updateItem("verticalAds", i, "image", v)}
                label={`Vertical Ad #${i + 1}`}
              />
              <div className="flex items-center gap-3">
                <Field label="Couleur d'ambiance (overlay)">
                  <input
                    type="color"
                    className="w-10 h-10 rounded-lg border-none cursor-pointer p-0"
                    value={ad.bgColor.substring(0, 7)}
                    onChange={(e) =>
                      updateItem(
                        "verticalAds",
                        i,
                        "bgColor",
                        e.target.value + "33",
                      )
                    }
                  />
                </Field>
              </div>
              <AdvancedSettings title="Textes & CTA">
                <div className="space-y-3">
                  <Field label="Titre principal (FR)">
                    <Input
                      value={ad.title}
                      onChange={(v) => updateItem("verticalAds", i, "title", v)}
                    />
                  </Field>
                  <PTField
                    label="Titre principal (PT)"
                    value={ad.titlePT || ""}
                    onChange={(v) => updateItem("verticalAds", i, "titlePT", v)}
                    sourceText={ad.title}
                  />
                  <Field label="Sous-titre / Lien (FR)">
                    <Input
                      value={ad.subtitle}
                      onChange={(v) =>
                        updateItem("verticalAds", i, "subtitle", v)
                      }
                    />
                  </Field>
                  <PTField
                    label="Sous-titre / Lien (PT)"
                    value={ad.subtitlePT || ""}
                    onChange={(v) =>
                      updateItem("verticalAds", i, "subtitlePT", v)
                    }
                    sourceText={ad.subtitle}
                  />
                </div>
              </AdvancedSettings>
            </div>
          ))}
        </div>
      </div>

      {/* ── Engagement Stats ── */}
      <div className="space-y-6 pt-6 border-t border-gray-100">
        <SectionTitle
          title="Badges d'Engagement"
          subtitle="Les 4 statistiques de réassurance dans la sidebar."
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {side.engagementStats.map((stat: any, i: number) => (
            <div
              key={i}
              className="bg-gray-50 border border-gray-100 rounded-[2rem] p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{stat.emoji}</span>
                <Input
                  value={stat.emoji}
                  onChange={(v) => updateItem("engagementStats", i, "emoji", v)}
                  className="w-12 py-1 px-1 text-center bg-white"
                />
              </div>
              <div className="space-y-3">
                <div>
                  <Field label="Valeur (FR)">
                    <Input
                      value={stat.value}
                      onChange={(v) =>
                        updateItem("engagementStats", i, "value", v)
                      }
                      className="font-black"
                    />
                  </Field>
                  <PTField
                    label="Valeur (PT)"
                    value={stat.valuePT || ""}
                    onChange={(v) =>
                      updateItem("engagementStats", i, "valuePT", v)
                    }
                    sourceText={stat.value}
                  />
                </div>
                <div>
                  <Field label="Libellé (FR)">
                    <Input
                      value={stat.label}
                      onChange={(v) =>
                        updateItem("engagementStats", i, "label", v)
                      }
                    />
                  </Field>
                  <PTField
                    label="Libellé (PT)"
                    value={stat.labelPT || ""}
                    onChange={(v) =>
                      updateItem("engagementStats", i, "labelPT", v)
                    }
                    sourceText={stat.label}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Card Theme Section ────────────────────────────────────────────────────────
function CardThemeSection({ settings, setSettings }: any) {
  const ct = settings.cardTheme || DEFAULT_SETTINGS.cardTheme;
  const set = (k: string, v: string) =>
    setSettings((s: any) => ({ ...s, cardTheme: { ...s.cardTheme, [k]: v } }));

  const colorFields = [
    {
      key: "baseColor",
      label: "Fond de base",
      desc: "La couleur principale du fond de la carte",
    },
    {
      key: "faceLight",
      label: "Facette Claire",
      desc: "Les polygones les plus éclairés (effets 3D)",
    },
    {
      key: "faceMid",
      label: "Facette Moyenne",
      desc: "Tons intermédiaires des polygones",
    },
    {
      key: "faceDark",
      label: "Facette Sombre",
      desc: "Zones en ombre des polygones",
    },
    {
      key: "textColor",
      label: "Couleur du Texte",
      desc: "Numéros, noms et champs de saisie",
    },
    {
      key: "accentColor",
      label: "Couleur des Accents",
      desc: "Séparateurs, icônes, bordures, badges",
    },
  ];

  const presets = [
    {
      name: "Or & Noir",
      baseColor: "#1a1c22",
      faceLight: "#2c303a",
      faceMid: "#22262f",
      faceDark: "#1e2028",
      textColor: "#D4AF37",
      accentColor: "#D4AF37",
    },
    {
      name: "Argent & Nuit",
      baseColor: "#0d1117",
      faceLight: "#21262d",
      faceMid: "#161b22",
      faceDark: "#0d1117",
      textColor: "#E0E0E0",
      accentColor: "#A0A0A0",
    },
    {
      name: "Marine & Or",
      baseColor: "#0a1628",
      faceLight: "#1a2d4a",
      faceMid: "#112238",
      faceDark: "#081020",
      textColor: "#D4AF37",
      accentColor: "#D4AF37",
    },
    {
      name: "Bordeaux & Argent",
      baseColor: "#1a0810",
      faceLight: "#3a1020",
      faceMid: "#2a0c18",
      faceDark: "#150608",
      textColor: "#E8E8E8",
      accentColor: "#C0A0A0",
    },
    {
      name: "Forêt & Or",
      baseColor: "#0d1a0d",
      faceLight: "#1e3a1e",
      faceMid: "#162816",
      faceDark: "#0a120a",
      textColor: "#D4AF37",
      accentColor: "#8BC34A",
    },
    {
      name: "Violet & Or",
      baseColor: "#12091a",
      faceLight: "#261540",
      faceMid: "#1a0d2e",
      faceDark: "#0e0618",
      textColor: "#D4AF37",
      accentColor: "#9C27B0",
    },
  ];

  return (
    <div className="space-y-8">
      <SectionTitle
        title="Apparence Carte Paiement"
        subtitle="Personnalisez les couleurs de la carte bancaire affichée lors du paiement."
      />

      {/* Live Mini Preview */}
      <div className="bg-gray-900 rounded-[2rem] p-8 flex flex-col items-center gap-4">
        <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">
          Aperçu en temps réel
        </p>
        {/* Miniature card using dynamic colors */}
        <div
          className="relative rounded-2xl overflow-hidden shadow-2xl"
          style={{
            width: 160,
            height: 254,
            background: ct.baseColor,
            border: `1px solid ${ct.accentColor}33`,
          }}
        >
          {/* Mini polygons simulation */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 160 254"
            preserveAspectRatio="xMidYMid slice"
          >
            <polygon points="0,0 70,0 32,48" fill={ct.faceMid} />
            <polygon points="70,0 160,0 128,37" fill={ct.faceLight} />
            <polygon points="32,48 86,43 59,86" fill={ct.faceDark} />
            <polygon points="86,43 128,37 107,86" fill={ct.faceLight} />
            <polygon points="59,86 107,86 83,128" fill={ct.faceMid} />
            <polygon points="0,120 32,100 16,160" fill={ct.faceDark} />
            <polygon points="83,128 140,110 120,180" fill={ct.faceMid} />
            <polygon points="16,160 80,200 40,254" fill={ct.faceMid} />
            <polygon
              points="80,200 120,180 160,220 160,254"
              fill={ct.faceLight}
            />
            <polygon points="40,254 160,254 110,210" fill={ct.faceDark} />
            <rect width="160" height="254" fill="url(#miniVig)" />
            <defs>
              <radialGradient id="miniVig" cx="50%" cy="50%" r="70%">
                <stop offset="60%" stopColor="transparent" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.5)" />
              </radialGradient>
            </defs>
          </svg>
          {/* Mini card content */}
          <div className="relative z-10 p-5 h-full flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div
                className="w-6 h-4 rounded-[2px]"
                style={{
                  background: "linear-gradient(135deg,#d8d8d8,#a0a0a0,#e8e8e8)",
                }}
              />
            </div>
            <div className="flex flex-col gap-1.5 mt-auto">
              <div
                className="h-1.5 w-20 rounded-full"
                style={{ background: ct.accentColor + "60" }}
              />
              <div
                className="h-2.5 w-28 rounded-full"
                style={{ background: ct.textColor + "99" }}
              />
              <div className="flex gap-2 mt-2">
                <div
                  className="h-1.5 w-10 rounded-full"
                  style={{ background: ct.accentColor + "50" }}
                />
                <div
                  className="h-1.5 w-8 rounded-full"
                  style={{ background: ct.accentColor + "50" }}
                />
              </div>
              <div className="mt-3 flex justify-between">
                <div
                  className="h-1 w-8 rounded-full"
                  style={{ background: ct.accentColor + "30" }}
                />
                <div
                  className="h-1 w-6 rounded-full"
                  style={{ background: ct.accentColor + "30" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Presets */}
      <div className="space-y-3">
        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">
          Thèmes prédéfinis
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {presets.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() =>
                setSettings((s: any) => ({ ...s, cardTheme: { ...preset } }))
              }
              className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 hover:border-gray-300 transition-all hover:shadow-md bg-white group"
            >
              <div className="flex gap-1 flex-shrink-0">
                <div
                  className="w-5 h-8 rounded-l-[6px]"
                  style={{ background: preset.baseColor }}
                />
                <div
                  className="w-5 h-8 rounded-r-[6px]"
                  style={{ background: preset.accentColor }}
                />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-700 group-hover:text-gray-900 text-left leading-tight">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Color Pickers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {colorFields.map(({ key, label, desc }) => (
          <div
            key={key}
            className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-3"
          >
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-800">
                {label}
              </p>
              <p className="text-[9px] text-gray-400 mt-0.5">{desc}</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                className="w-12 h-12 rounded-xl border-none cursor-pointer p-0 overflow-hidden shadow-sm flex-shrink-0"
                value={(ct as any)[key]}
                onChange={(e) => set(key, e.target.value)}
              />
              <Input
                value={(ct as any)[key]}
                onChange={(v) => set(key, v)}
                placeholder="#000000"
                className="font-mono text-xs"
              />
            </div>
            <div
              className="h-6 rounded-xl"
              style={{ background: (ct as any)[key] }}
            />
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 flex items-start gap-3">
        <CreditCard
          size={20}
          weight="duotone"
          className="text-yellow-600 flex-shrink-0 mt-0.5"
        />
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-yellow-800 mb-1">
            Synchronisation temps réel
          </p>
          <p className="text-[10px] text-yellow-700 leading-relaxed">
            Les changements sont appliqués immédiatement sur le site client dès
            que vous enregistrez, sans rechargement de page.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Global Theme Section ─────────────────────────────────────────────────────
function ThemeSection({ settings, setSettings }: any) {
  const theme = settings.globalTheme || DEFAULT_SETTINGS.globalTheme;
  const setClient = (k: string, v: string) =>
    setSettings((s: any) => ({
      ...s,
      globalTheme: {
        ...s.globalTheme,
        client: { ...s.globalTheme.client, [k]: v },
      },
    }));
  const setAdmin = (k: string, v: string) =>
    setSettings((s: any) => ({
      ...s,
      globalTheme: {
        ...s.globalTheme,
        admin: { ...s.globalTheme.admin, [k]: v },
      },
    }));

  const clientFields = [
    {
      key: "primaryColor",
      label: "Couleur Principale",
      desc: "Boutons et accents boutique",
    },
    {
      key: "secondaryColor",
      label: "Couleur Secondaire",
      desc: "Header et Footer boutique",
    },
    {
      key: "accentColor",
      label: "Couleur d'Accent",
      desc: "Badges et promos boutique",
    },
    {
      key: "sidebarColor",
      label: "Sidebar Dashboard",
      desc: "Fond du menu dashboard client",
    },
    {
      key: "sidebarTextColor",
      label: "Texte Sidebar",
      desc: "Menus inactifs dashboard",
    },
    {
      key: "sidebarActiveColor",
      label: "Texte Actif",
      desc: "Menu sélectionné dashboard",
    },
    {
      key: "cardBgColor",
      label: "Cartes Dashboard",
      desc: "Fond des blocs statistiques",
    },
    {
      key: "cardTextColor",
      label: "Texte Cartes",
      desc: "Titres et valeurs des blocs",
    },
  ];

  const adminFields = [
    {
      key: "primaryColor",
      label: "Couleur Principale",
      desc: "Boutons et accents admin",
    },
    {
      key: "sidebarColor",
      label: "Sidebar Admin",
      desc: "Fond du menu latéral",
    },
    {
      key: "sidebarTextColor",
      label: "Texte Sidebar",
      desc: "Couleur des menus inactifs",
    },
    {
      key: "sidebarActiveColor",
      label: "Texte Actif Sidebar",
      desc: "Couleur du menu sélectionné",
    },
    {
      key: "cardBgColor",
      label: "Carte Profil",
      desc: "Fond de l'encadré utilisateur",
    },
    {
      key: "cardTextColor",
      label: "Texte Carte Profil",
      desc: "Nom et rôle utilisateur",
    },
    {
      key: "accentColor",
      label: "Couleur d'Accent",
      desc: "Badges et alertes admin",
    },
  ];

  return (
    <div className="space-y-12">
      <SectionTitle
        title="Personnalisation Localisée"
        subtitle="Définissez des identités visuelles distinctes pour vos deux plateformes."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* CLIENT THEME */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-blue-50 pb-4">
            <div className="p-2 bg-blue-50 text-blue-500 rounded-xl">
              <Monitor size={20} weight="fill" />
            </div>
            <h4 className="font-black text-sm uppercase tracking-widest text-gray-900">
              Thème Boutique (Client)
            </h4>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {clientFields.map(({ key, label, desc }) => (
              <div
                key={key}
                className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 flex items-center justify-between gap-4"
              >
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-700">
                    {label}
                  </p>
                  <p className="text-[8px] text-gray-400 uppercase font-bold">
                    {desc}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    className="w-10 h-10 rounded-xl border-none cursor-pointer p-0 overflow-hidden shadow-sm"
                    value={theme.client[key]}
                    onChange={(e) => setClient(key, e.target.value)}
                  />
                  <input
                    type="text"
                    className="w-20 bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-[10px] font-mono"
                    value={theme.client[key]}
                    onChange={(e) => setClient(key, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ADMIN THEME */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-orange-50 pb-4">
            <div className="p-2 bg-orange-50 text-orange-500 rounded-xl">
              <Layout size={20} weight="fill" />
            </div>
            <h4 className="font-black text-sm uppercase tracking-widest text-gray-900">
              Thème Administration
            </h4>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {adminFields.map(({ key, label, desc }) => (
              <div
                key={key}
                className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 flex items-center justify-between gap-4"
              >
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-700">
                    {label}
                  </p>
                  <p className="text-[8px] text-gray-400 uppercase font-bold">
                    {desc}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    className="w-10 h-10 rounded-xl border-none cursor-pointer p-0 overflow-hidden shadow-sm"
                    value={theme.admin[key]}
                    onChange={(e) => setAdmin(key, e.target.value)}
                  />
                  <input
                    type="text"
                    className="w-20 bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-[10px] font-mono"
                    value={theme.admin[key]}
                    onChange={(e) => setAdmin(key, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Configuration des Langues */}
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-6">
        <SectionTitle
          title="Configuration des Langues (Bilingue Client)"
          subtitle="Activez ou désactivez la langue française optionnelle pour la boutique client."
        />
        <div className="bg-gray-50 rounded-2xl p-6 flex items-center justify-between gap-4 border border-gray-100">
          <div>
            <h5 className="text-xs font-black uppercase text-gray-800 tracking-wider">
              Langue Française (FR)
            </h5>
            <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">
              Si désactivée, seuls les contenus en Portugais (PT) seront
              accessibles sur le site client.
            </p>
          </div>
          <Toggle
            value={settings.isFrenchEnabled !== false}
            onChange={(val) =>
              setSettings((s: any) => ({ ...s, isFrenchEnabled: val }))
            }
          />
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
        <SectionTitle
          title="Aperçu des Boutons"
          subtitle="Comparaison directe entre Client et Admin."
        />
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-3">
            <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest text-center">
              Style Boutique
            </p>
            <button
              className="w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg"
              style={{ backgroundColor: theme.client.primaryColor }}
            >
              Bouton Client
            </button>
          </div>
          <div className="space-y-3">
            <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest text-center">
              Style Admin
            </p>
            <button
              className="w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg"
              style={{ backgroundColor: theme.admin.primaryColor }}
            >
              Bouton Admin
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-center pt-8 border-t border-gray-50">
        <button
          onClick={() => {
            if (
              confirm(
                "Voulez-vous vraiment réinitialiser toutes les couleurs par défaut ?",
              )
            ) {
              setSettings((s: any) => ({
                ...s,
                globalTheme: DEFAULT_SETTINGS.globalTheme,
              }));
            }
          }}
          className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-gray-200 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 hover:text-red-500 hover:border-red-100 transition-all shadow-sm"
        >
          <ArrowClockwise size={18} weight="bold" />
          Réinitialiser aux réglages d'usine
        </button>
      </div>
    </div>
  );
}

const DEFAULT_LEGAL_TEMPLATES: Record<
  string,
  { title: string; content: string }
> = {
  cgv: {
    title: "Conditions Générales de Vente",
    content: `<p>Les présentes Conditions Générales de Vente (CGV) régissent l'ensemble des relations commerciales entre IMEXSULTING Lda ("le Vendeur") et tout visiteur ou client ("l'Acheteur") effectuant un achat via le site web imexmercado.pt.</p>
<section>
  <h2>Article 1 - Champ d'application</h2>
  <p>Ces CGV annulent et remplacent toutes les conditions antérieures. Elles s'appliquent à toutes les commandes de produits conclues via ImexMercado. L'Acheteur déclare avoir pris connaissance et accepté les présentes CGV avant de passer sa commande.</p>
</section>
<section>
  <h2>Article 2 - Prix</h2>
  <p>Les prix de nos produits sont indiqués en euros (€) Toutes Taxes Comprises (TTC) tenant compte de la TVA applicable au jour de la commande. Les frais de traitement et d'expédition ne sont pas inclus dans le prix initial et sont facturés en supplément avant validation finale.</p>
  <p>Pour les livraisons en Union Européenne, la TVA appliquée est celle en vigueur dans le pays de résidence de l'Acheteur (régime OSS).</p>
</section>
<section>
  <h2>Article 3 - Validation de commande</h2>
  <p>Toute commande passée sur le site constitue la formation d'un contrat conclu à distance. IMEXSULTING Lda se réserve le droit de ne pas enregistrer un paiement ou de ne pas confirmer une commande pour quelque raison que ce soit, notamment en cas de problème d'approvisionnement, ou de suspicion de fraude.</p>
</section>
<section>
  <h2>Article 4 - Droit de Rétractation</h2>
  <p>Conformément aux dispositions légales en vigueur au sein de l'Union Européenne, l'Acheteur dispose d'un délai de 14 jours francs à compter de la réception de ses produits pour exercer son droit de rétractation sans avoir à justifier de motifs ni à payer de pénalités (hors frais de retour qui restent à sa charge).</p>
</section>
<section>
  <h2>Article 5 - Litiges et Droit applicable</h2>
  <p>En cas de litige, une solution amiable sera recherchée en priorité. À défaut, les tribunaux portugais (siège du Vendeur) seront seuls compétents, sauf disposition contraire d'ordre public européen protectrice du consommateur.</p>
  <p>Vous pouvez également utiliser la plateforme de Règlement en Ligne des Litiges (RLL) fournie par la Commission Européenne : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer">ec.europa.eu/consumers/odr</a>.</p>
</section>`,
  },
  mentions: {
    title: "Mentions Légales",
    content: `<section>
  <h2>1. Éditeur du site</h2>
  <p>Le site Internet <strong>imexmercado.pt</strong> est édité par la société <strong>IMEXSULTING - Comércio Geral Import & Export., Lda</strong>.</p>
  <ul>
    <li><strong>Forme juridique :</strong> Société à Responsabilité Limitée (Lda)</li>
    <li><strong>Capital social :</strong> 20 000,00 €</li>
    <li><strong>Siège social :</strong> Rua dos Girassóis, Nº 1 e 1A — 2860-274 Alhos Vedros — PORTUGAL</li>
    <li><strong>NIF (Numéro d'Identification Fiscale) :</strong> PT 510 236 789</li>
    <li><strong>Courriel :</strong> contact@imexmercado.pt</li>
    <li><strong>Directeur de la publication :</strong> Service Juridique Imexsulting</li>
  </ul>
</section>
<section>
  <h2>2. Hébergement</h2>
  <p>L'hébergement de ce site est assuré par la société <strong>Vercel Inc.</strong></p>
  <ul>
    <li><strong>Adresse :</strong> 340 S Lemon Ave #1150, Walnut, CA 91789, États-Unis.</li>
    <li><strong>Infrastructure et bases de données :</strong> Hébergées en Union Européenne via les services de Google Cloud Platform (Francfort, Allemagne) via Firebase.</li>
  </ul>
</section>
<section>
  <h2>3. Propriété intellectuelle</h2>
  <p>La structure générale du site imexmercado.pt, ainsi que les textes, graphiques, images, sons et vidéos la composant, sont la propriété de l'éditeur ou de ses partenaires. Toute représentation et/ou reproduction et/ou exploitation partielle ou totale de ce site, par quelque procédé que ce soit, sans l'autorisation préalable et par écrit de la société IMEXSULTING Lda est strictement interdite et serait susceptible de constituer une contrefaçon.</p>
</section>`,
  },
  confidentialite: {
    title: "Politique de Confidentialité",
    content: `<p>Chez ImexMercado, nous accordons une importance primordiale à la confidentialité et à la sécurité de vos données personnelles. La présente politique détaille notre commitment en matière de protection des données, conformément au Règlement Général sur la Protection des Données (RGPD).</p>
<section>
  <h2>1. Données collectées</h2>
  <p>We collect and process the following data:</p>
  <ul>
    <li><strong>Données d'identification :</strong> Nom, prénom, adresse e-mail, numéro de téléphone.</li>
    <li><strong>Données de transaction :</strong> Adresses de facturation et de livraison, historique des commandes, détails des achats. <em>(Note : les données de paiement par carte bancaire ne sont jamais stockées sur nos serveurs ; elles sont sécurisées par Stripe).</em></li>
    <li><strong>Données de navigation :</strong> Adresses IP, type de navigateur, pages visitées (voir Politique des Cookies).</li>
  </ul>
</section>
<section>
  <h2>2. Finalités du traitement</h2>
  <p>Vos données sont strictement utilisées pour :</p>
  <ul>
    <li>La gestion de vos commandes, expéditions et du service client financier.</li>
    <li>La création et la gestion de votre "Espace Membre IMEX".</li>
    <li>Le respect de nos obligations légales et comptables (édition de factures).</li>
    <li>L'envoi de communications marketing (uniquement si vous y avez explicitement consenti).</li>
  </ul>
</section>
<section>
  <h2>3. Durée de conservation</h2>
  <p>Les données personnelles sont conservées pendant une durée qui n’excède pas la durée nécessaire aux finalités pour lesquelles elles ont été collectées :</p>
  <ul>
    <li>Données clients : 3 ans après le dernier achat.</li>
    <li>Pièces comptables (factures) : 10 ans, conformément au droit commercial portugais.</li>
  </ul>
</section>
<section>
  <h2>4. Vos Droits (RGPD)</h2>
  <p>Conformément à la directive européenne, vous disposez des droits suivants concernant vos données : droit d'accès, droit de rectification, droit à l'effacement (droit à l'oubli), droit à la portabilité, droit de limitation et droit d'opposition.</p>
  <p>Pour exercer ces droits, veuillez contacter le Délégué à la Protection des Données (DPO) à l'adresse <strong>contact@imexmercado.pt</strong>.</p>
</section>`,
  },
  retours: {
    title: "Politique de Retours",
    content: `<p>Achetez en toute sérénité. Si un produit ne vous convient pas, vous disposez d'un délai légal européen de 14 jours calendaires après la réception de votre commande pour changer d'avis.</p>
<section>
  <h2>Conditions nécessaires pour un retour valide :</h2>
  <ul>
    <li>Le produit doit être neuf, n'ayant jamais été porté, lavé ou utilisé intensément.</li>
    <li>Le produit doit être renvoyé dans son emballage d'origine intact, avec toutes les étiquettes et notices d'accompagnement.</li>
  </ul>
</section>
<section>
  <h2>La démarche étape par étape</h2>
  <ol>
    <li>Connectez-vous à votre Espace Membre dans la section "Mes Commandes" et sélectionnez "Retourner un article".</li>
    <li>Imprimez l'étiquette de retour générée.</li>
    <li>Emballez soigneusement le produit et collez l'étiquette sur le carton.</li>
    <li>Déposez le colis dans le point relais ou bureau de poste (CTT/DPD) le plus proche.</li>
  </ol>
</section>
<section>
  <h2>Remboursement & Frais</h2>
  <p>Une fois votre colis de retour reçu et inspecté dans notre entrepôt, vous serez notifié par e-mail. Si l'article respecte les conditions, le remboursement intégral de l'article sera émis sous 3 à 5 jours ouvrés via le mode de paiement original (Stripe / Carte / PayPal).</p>
  <p>À noter : Sauf erreur de notre part (produit défectueux ou erreur de picking), les frais d'expédition du retour restent à la charge du client.</p>
</section>`,
  },
  livraison: {
    title: "Livraison & Expéditions",
    content: `<p>Nous savons que recevoir votre commande rapidement et en parfait état est votre priorité. Depuis notre centre logistique situé à Alhos Vedros (Portugal), nous orchestrons des livraisons rapides à travers toute l'Europe.</p>
<section>
  <h2>Standard Europe</h2>
  <p>Livraison en 3 à 5 jours ouvrés via CTT ou DPD. Tarifs : 4,99 € / Gratuit pour toute commande supérieure à 150 €. Numéro de suivi inclus, remise contre signature.</p>
</section>
<section>
  <h2>Premium Express</h2>
  <p>Livraison sous 24h à 48h maximum via DHL Express. Tarifs : 14,99 €. Traitement prioritaire de la commande et possibilité de programmer l'heure de livraison.</p>
</section>
<section>
  <h2>Délais de traitement</h2>
  <p>Toute commande passée avant 13h00 (Heure de Lisbonne, GMT) est préparée et expédiée le jour même. Les commandes passées le week-end ou lors d'un jour férié sont expédiées le jour ouvré suivant.</p>
</section>`,
  },
  cookies: {
    title: "Politique des Cookies",
    content: `<p>Lors de votre consultation du site imexmercado.pt, des informations relatives à la navigation de votre terminal sont susceptibles d'être enregistrées dans des fichiers "Cookies" installés sur votre terminal.</p>
<section>
  <h2>1. Qu'est-ce qu'un cookie ?</h2>
  <p>Un cookie est un petit fichier texte déposé sur votre ordinateur, tablette ou smartphone par les serveurs du site visité. Il contient plusieurs données qui permettent d'améliorer votre expérience de navigation.</p>
</section>
<section>
  <h2>2. Les cookies que nous utilisons</h2>
  <p><strong>Cookies Strictement Nécessaires :</strong> Ces cookies sont indispensables au bon fonctionnement du site (maintien de la connexion, sauvegarde du panier en cours, sécurité Firebase). Ils ne nécessitent pas votre consentement préalable et ne peuvent pas être désactivés.</p>
  <p><strong>Cookies Analytiques :</strong> Ils nous permettent de connaître l'utilisation et les performances de notre site, d'établir des statistiques, des volumes de fréquentation pour en améliorer l'intérêt et l'ergonomie (ex: Google Analytics).</p>
  <p><strong>Cookies Marketing & Personnalisation :</strong> Ces cookies collectent des informations sur vos habitudes de navigation afin de vous proposer des publicités ou offres adaptées à vos centres d'intérêt, sur notre site ou en dehors.</p>
</section>
<section>
  <h2>3. Gestion de vos préférences</h2>
  <p>Vous pouvez à tout moment modifier vos choix concernant les cookies en cliquant sur l'icône de gestion des consentements en bas à gauche de votre écran. Vous pouvez également configurer votre logiciel de navigation de manière à ce que les cookies soient totalement rejetés par défaut.</p>
</section>`,
  },
};

// ─── Main CMSView ──────────────────────────────────────────────────────────────
export function CMSView() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("promobar");
  const [settings, setSettings] = useState<any>(DEFAULT_SETTINGS);

  // Preview colors in real-time while editing (before save)
  useEffect(() => {
    if (settings?.globalTheme?.admin) {
      const {
        primaryColor,
        sidebarColor,
        sidebarTextColor,
        sidebarActiveColor,
        cardBgColor,
        cardTextColor,
        accentColor,
      } = settings.globalTheme.admin;
      const root = document.documentElement;

      root.style.setProperty("--color-primary", primaryColor);
      root.style.setProperty(
        "--color-primary-dark",
        adjustColor(primaryColor, -20),
      );
      root.style.setProperty(
        "--color-primary-light",
        adjustColor(primaryColor, 30),
      );

      root.style.setProperty("--color-accent", accentColor);
      root.style.setProperty(
        "--color-accent-dark",
        adjustColor(accentColor, -20),
      );

      root.style.setProperty("--admin-sidebar-bg", sidebarColor);
      root.style.setProperty(
        "--admin-sidebar-text",
        sidebarTextColor || "#6B7280",
      );
      root.style.setProperty(
        "--admin-sidebar-active-text",
        sidebarActiveColor || "#FFFFFF",
      );
      root.style.setProperty(
        "--admin-card-bg",
        cardBgColor || "rgba(128,128,128,0.08)",
      );
      root.style.setProperty("--admin-card-text", cardTextColor || "#111827");
    }

    if (settings?.globalTheme?.client) {
      const {
        sidebarColor,
        sidebarTextColor,
        sidebarActiveColor,
        cardBgColor,
        cardTextColor,
      } = settings.globalTheme.client;
      const root = document.documentElement;

      root.style.setProperty("--client-sidebar-bg", sidebarColor);
      root.style.setProperty(
        "--client-sidebar-text",
        sidebarTextColor || "#9CA3AF",
      );
      root.style.setProperty(
        "--client-sidebar-active-text",
        sidebarActiveColor || "#FFFFFF",
      );
      root.style.setProperty("--client-card-bg", cardBgColor || "#FFFFFF");
      root.style.setProperty("--client-card-text", cardTextColor || "#111827");
    }
  }, [settings?.globalTheme?.admin, settings?.globalTheme?.client]);

  const [legalPages, setLegalPages] = useState<any>({
    cgv: {
      title: "Conditions Générales de Vente",
      lastUpdated: "01 Juin 2026",
      content: DEFAULT_LEGAL_TEMPLATES.cgv.content,
    },
    mentions: {
      title: "Mentions Légales",
      lastUpdated: "01 Juin 2026",
      content: DEFAULT_LEGAL_TEMPLATES.mentions.content,
    },
    confidentialite: {
      title: "Politique de Confidentialité",
      lastUpdated: "01 Juin 2026",
      content: DEFAULT_LEGAL_TEMPLATES.confidentialite.content,
    },
    retours: {
      title: "Politique de Retours",
      lastUpdated: "01 Juin 2026",
      content: DEFAULT_LEGAL_TEMPLATES.retours.content,
    },
    livraison: {
      title: "Livraison & Expéditions",
      lastUpdated: "01 Juin 2026",
      content: DEFAULT_LEGAL_TEMPLATES.livraison.content,
    },
    cookies: {
      title: "Politique des Cookies",
      lastUpdated: "01 Juin 2026",
      content: DEFAULT_LEGAL_TEMPLATES.cookies.content,
    },
  });

  useEffect(() => {
    setLoading(true);
    const unsubHome = subscribeToDocument("settings", "homepage", (data) => {
      if (data) {
        setSettings({ ...DEFAULT_SETTINGS, ...data });
      }
    });

    const unsubLegal = subscribeToDocument(
      "settings",
      "legal_pages",
      (data) => {
        if (data) {
          setLegalPages((prev: any) => ({ ...prev, ...data }));
        }
        setLoading(false);
      },
    );

    return () => {
      unsubHome();
      unsubLegal();
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDocument("settings", "homepage", settings);
      await setDocument("settings", "legal_pages", legalPages);
      alert("✅ Modifications enregistrées avec succès !");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
          Chargement du CMS...
        </p>
      </div>
    );

  const currentTab = TABS.find((t) => t.id === activeTab)!;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 md:pb-10 text-left">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Gestion du Contenu
          </h2>
          <p className="text-sm font-medium text-gray-400 mt-1">
            Pilotez chaque section de votre page d'accueil en temps réel.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-6 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50"
        >
          {saving ? (
            <ArrowClockwise size={18} className="animate-spin" />
          ) : (
            <Check size={18} weight="bold" />
          )}
          Enregistrer les modifications
        </button>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-2 flex flex-wrap gap-1.5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                isActive
                  ? `${tab.bg} ${tab.color} shadow-sm`
                  : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <Icon size={16} weight={isActive ? "fill" : "bold"} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Section Panel ── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
        {/* Section header badge */}
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl ${currentTab.bg} mb-6`}
        >
          {React.createElement(currentTab.icon, {
            size: 14,
            weight: "fill",
            className: currentTab.color,
          })}
          <span
            className={`text-[9px] font-black uppercase tracking-widest ${currentTab.color}`}
          >
            {currentTab.label}
          </span>
        </div>

        {activeTab === "promobar" && (
          <PromoBarSection settings={settings} setSettings={setSettings} />
        )}
        {activeTab === "hero" && (
          <HeroSliderSection settings={settings} setSettings={setSettings} />
        )}
        {activeTab === "mainbanners" && (
          <MainBannersSection settings={settings} setSettings={setSettings} />
        )}
        {activeTab === "minibanner" && (
          <MiniBannersSection settings={settings} setSettings={setSettings} />
        )}
        {activeTab === "trustbar" && (
          <TrustBarSection settings={settings} setSettings={setSettings} />
        )}
        {activeTab === "categories" && (
          <HomeCategoriesSection
            settings={settings}
            setSettings={setSettings}
          />
        )}
        {activeTab === "blog" && (
          <BlogBannerSection settings={settings} setSettings={setSettings} />
        )}
        {activeTab === "flashsale" && (
          <FlashSaleSection settings={settings} setSettings={setSettings} />
        )}
        {activeTab === "promo" && (
          <PromoBlocksSection settings={settings} setSettings={setSettings} />
        )}
        {activeTab === "newsletter" && (
          <NewsletterSection settings={settings} setSettings={setSettings} />
        )}
        {activeTab === "sidebar" && (
          <SidebarSection settings={settings} setSettings={setSettings} />
        )}
        {activeTab === "carte" && (
          <CardThemeSection settings={settings} setSettings={setSettings} />
        )}
        {activeTab === "theme" && (
          <ThemeSection settings={settings} setSettings={setSettings} />
        )}
        {activeTab === "legal" && (
          <LegalPagesSection
            legalPages={legalPages}
            setLegalPages={setLegalPages}
          />
        )}
      </div>

      {/* ── Info card ── */}
      <div className="bg-gray-900 rounded-3xl p-6 flex items-start gap-4 text-white">
        <Monitor
          size={28}
          weight="duotone"
          className="text-primary flex-shrink-0 mt-0.5"
        />
        <div>
          <p className="font-black text-sm uppercase tracking-widest mb-1">
            Aperçu en temps réel activé
          </p>
          <p className="text-gray-400 text-xs leading-relaxed">
            Les modifications sont synchronisées en direct. Dès que vous
            enregistrez, tous les clients connectés verront les changements
            instantanément sans rafraîchir.
          </p>
        </div>
      </div>

      {/* Mobile sticky save */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-gray-100 flex md:hidden z-50">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest py-4 rounded-[1.5rem] shadow-xl shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? (
            <ArrowClockwise size={18} className="animate-spin" />
          ) : (
            <Check size={18} weight="bold" />
          )}
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}

function LegalPagesSection({ legalPages, setLegalPages }: any) {
  const [selectedPage, setSelectedPage] = useState("cgv");

  const page = legalPages[selectedPage] || {
    title: "",
    lastUpdated: "",
    content: "",
  };

  const updatePage = (k: string, v: string) => {
    setLegalPages((prev: any) => ({
      ...prev,
      [selectedPage]: {
        ...prev[selectedPage],
        [k]: v,
      },
    }));
  };

  const pagesOptions = [
    { value: "cgv", label: "Conditions Générales de Vente (CGV)" },
    { value: "mentions", label: "Mentions Légales" },
    { value: "confidentialite", label: "Politique de Confidentialité" },
    { value: "retours", label: "Politique de Retours" },
    { value: "livraison", label: "Livraison & Expéditions" },
    { value: "cookies", label: "Politique des Cookies" },
  ];

  const loadDefaultTemplate = () => {
    if (
      confirm(
        "Voulez-vous charger le modèle par défaut pour cette page ? Cela écrasera les modifications en cours.",
      )
    ) {
      const template = DEFAULT_LEGAL_TEMPLATES[selectedPage];
      if (template) {
        setLegalPages((prev: any) => ({
          ...prev,
          [selectedPage]: {
            ...prev[selectedPage],
            title: template.title,
            lastUpdated: new Date().toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }),
            content: template.content,
          },
        }));
      }
    }
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Pages Légales"
        subtitle="Éditeur de texte pour vos mentions, CGV, confidentialité et cookies."
      />

      <div className="p-6 bg-gray-50 rounded-3xl space-y-6 border border-gray-100 shadow-sm text-left">
        <div className="flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-1 w-full">
            <Field label="Choisir la page à éditer">
              <select
                className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/10 outline-none cursor-pointer"
                value={selectedPage}
                onChange={(e) => setSelectedPage(e.target.value)}
              >
                {pagesOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <button
            type="button"
            onClick={loadDefaultTemplate}
            className="w-full sm:w-auto px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all h-[46px]"
          >
            Charger modèle par défaut
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
          <div>
            <Field label="Titre de la page (FR)">
              <Input
                value={page.title || ""}
                onChange={(v) => updatePage("title", v)}
                placeholder="ex: Mentions Légales"
              />
            </Field>
          </div>
          <div>
            <PTField
              label="Titre de la page (PT)"
              value={page.titlePT || ""}
              onChange={(v) => updatePage("titlePT", v)}
              sourceText={page.title || ""}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Field label="Dernière mise à jour (Date FR)">
              <Input
                value={page.lastUpdated || ""}
                onChange={(v) => updatePage("lastUpdated", v)}
                placeholder="ex: 05 Juin 2026"
              />
            </Field>
          </div>
          <div>
            <PTField
              label="Dernière mise à jour (Date PT)"
              value={page.lastUpdatedPT || ""}
              onChange={(v) => updatePage("lastUpdatedPT", v)}
              sourceText={page.lastUpdated || ""}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Field label="Contenu HTML (FR)">
              <textarea
                className="w-full bg-white border border-gray-200 rounded-2xl py-3 px-4 text-xs font-medium focus:ring-2 focus:ring-primary/10 outline-none font-mono resize-y"
                rows={15}
                value={page.content || ""}
                onChange={(e) => updatePage("content", e.target.value)}
                placeholder="Contenu en Français..."
              />
            </Field>
          </div>
          <div>
            <PTField
              label="Contenu HTML (PT)"
              value={page.contentPT || ""}
              onChange={(v) => updatePage("contentPT", v)}
              sourceText={page.content || ""}
              multiline={true}
              rows={15}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
