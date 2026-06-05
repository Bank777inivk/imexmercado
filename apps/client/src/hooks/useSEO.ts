import { useEffect, useState } from "react";
import { subscribeToDocument } from "@imexmercado/firebase";

interface SEOMetadata {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

// Global SEO Cache to fallback to
let globalSeoSettings: any = null;
const listeners = new Set<(settings: any) => void>();

// Setup subscriber once
if (typeof window !== "undefined") {
  subscribeToDocument("settings", "seo", (data) => {
    globalSeoSettings = data || {};
    listeners.forEach((l) => l(globalSeoSettings));
  });
}

export function useSEO(
  pageKey?:
    | "home"
    | "shop"
    | "contact"
    | "about"
    | "faq"
    | "tracking"
    | "checkout",
  manualMetadata?: SEOMetadata,
) {
  const [seoConfig, setSeoConfig] = useState<any>(globalSeoSettings);

  useEffect(() => {
    if (!pageKey) return;

    if (globalSeoSettings) {
      setSeoConfig(globalSeoSettings);
    }

    const handler = (settings: any) => {
      setSeoConfig(settings);
    };
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, [pageKey]);

  useEffect(() => {
    let title = "";
    let description = "";
    let image = manualMetadata?.image || "https://imexmercado.pt/og-image.png"; // default image fallback
    const url = manualMetadata?.url || window.location.href;
    const type = manualMetadata?.type || "website";

    if (manualMetadata?.title) {
      title = manualMetadata.title;
    } else if (pageKey && seoConfig?.[pageKey]?.title) {
      title = seoConfig[pageKey].title;
    } else {
      // Hardcoded fallback titles
      const titles = {
        home: "ImexMercado | Équipement & Import Export",
        shop: "Boutique en ligne | ImexMercado",
        contact: "Contactez-nous | ImexMercado",
        about: "À Propos | ImexMercado",
        faq: "FAQ & Aide | ImexMercado",
        tracking: "Suivi de Commande | ImexMercado",
        checkout: "Passer la Commande | ImexMercado",
      };
      title = pageKey ? (titles as any)[pageKey] : "ImexMercado";
    }

    if (manualMetadata?.description) {
      description = manualMetadata.description;
    } else if (pageKey && seoConfig?.[pageKey]?.description) {
      description = seoConfig[pageKey].description;
    } else {
      // Hardcoded fallback descriptions
      const descriptions = {
        home: "Découvrez notre large gamme de barbecues, piscines, produits hi-tech et décoration livrés partout en Europe.",
        shop: "Achetez vos barbecues, décorations, outillages et articles de piscine aux meilleurs prix.",
        contact:
          "Besoin d'aide ? Contactez notre service commercial ou technique par email.",
        about:
          "En savoir plus sur IMEXSULTING Lda et nos centres de logistique en Europe.",
        faq: "Retrouvez toutes les réponses concernant les livraisons, retours et garanties.",
        tracking: "Suivez le statut de votre commande en temps réel.",
        checkout: "Finalisez vos achats en toute sécurité.",
      };
      description = pageKey ? (descriptions as any)[pageKey] : "";
    }

    // Apply updates
    document.title = title;

    // Helper to update/create meta tag
    const setMeta = (
      nameOrProperty: string,
      content: string,
      isProperty = false,
    ) => {
      if (!content) return;
      const selector = isProperty
        ? `meta[property="${nameOrProperty}"]`
        : `meta[name="${nameOrProperty}"]`;
      let meta = document.querySelector(selector);
      if (!meta) {
        meta = document.createElement("meta");
        if (isProperty) {
          meta.setAttribute("property", nameOrProperty);
        } else {
          meta.setAttribute("name", nameOrProperty);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    setMeta("description", description);

    // Open Graph
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:image", image, true);
    setMeta("og:url", url, true);
    setMeta("og:type", type, true);

    // Twitter Cards
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", image);
  }, [pageKey, seoConfig, manualMetadata]);
}
