import { useParams } from "react-router-dom";

const pathTranslations: Record<string, Record<string, string>> = {
  pt: {
    "/boutique": "/loja",
    "/a-propos": "/sobre-nos",
    "/contact": "/contacto",
    "/suivi-commande": "/seguir-encomenda",
    "/compte": "/conta",
    "/compte/commandes": "/conta/encomendas",
    "/compte/parametres": "/conta/configuracoes",
    "/compte/favoris": "/conta/favoritos",
    "/compte/aide": "/conta/ajuda",
    "/compte/suivi": "/conta/seguir",
    "/favoris": "/favoritos",
    "/commande": "/finalizar-compra",
    "/connexion": "/entrar",
    "/inscription": "/registar",
    "/mot-de-passe-oublie": "/recuperar-senha",
    "/mentions-legales": "/informacao-legal",
    "/confidentialite": "/privacidade",
    "/livraison": "/envios",
    "/retours": "/devolucoes",
  },
  fr: {
    "/loja": "/boutique",
    "/sobre-nos": "/a-propos",
    "/contacto": "/contact",
    "/seguir-encomenda": "/suivi-commande",
    "/conta": "/compte",
    "/conta/encomendas": "/compte/commandes",
    "/conta/configuracoes": "/compte/parametres",
    "/conta/favoritos": "/compte/favoris",
    "/conta/ajuda": "/compte/aide",
    "/conta/seguir": "/compte/suivi",
    "/favoritos": "/favoris",
    "/finalizar-compra": "/commande",
    "/entrar": "/connexion",
    "/registar": "/inscription",
    "/recuperar-senha": "/mot-de-passe-oublie",
    "/informacao-legal": "/mentions-legales",
    "/privacidade": "/confidentialite",
    "/envios": "/livraison",
    "/devolucoes": "/retours",
  },
};

export function useLocale() {
  const { lang } = useParams();
  const currentLang = lang || "pt";

  const localLink = (path: string) => {
    if (!path) return `/${currentLang}`;
    if (path.startsWith("http") || path.startsWith("#")) return path;

    // Separate path from query string/hash
    const [pathPart, queryPart] = path.split("?");
    const [cleanPath, hashPart] = pathPart.split("#");

    let resolvedPath = cleanPath;
    if (!resolvedPath.startsWith("/")) {
      resolvedPath = `/${resolvedPath}`;
    }

    // Strip language prefix if present to find matching key
    let baseRoute = resolvedPath;
    if (baseRoute.startsWith("/pt/") || baseRoute === "/pt") {
      baseRoute = baseRoute.substring(3);
    } else if (baseRoute.startsWith("/fr/") || baseRoute === "/fr") {
      baseRoute = baseRoute.substring(3);
    }
    if (!baseRoute.startsWith("/")) {
      baseRoute = `/${baseRoute}`;
    }

    // Map baseRoute based on currentLang
    const translations = pathTranslations[currentLang] || {};
    let targetRoute = baseRoute;

    if (translations[baseRoute]) {
      targetRoute = translations[baseRoute];
    } else {
      // Check if it's currently in the other language's value and map it
      const otherLang = currentLang === "pt" ? "fr" : "pt";
      const otherTranslations = pathTranslations[otherLang] || {};
      const entry = Object.entries(otherTranslations).find(
        ([k, v]) => v === baseRoute || k === baseRoute,
      );
      if (entry) {
        const canonicalKey = entry[0];
        targetRoute = translations[canonicalKey] || canonicalKey;
      }
    }

    // Construct final URL
    let finalUrl = `/${currentLang}${targetRoute === "/" ? "" : targetRoute}`;
    if (queryPart) finalUrl += `?${queryPart}`;
    if (hashPart) finalUrl += `#${hashPart}`;
    return finalUrl;
  };

  return { lang: currentLang, localLink };
}
