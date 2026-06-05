import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Portuguese Locales
import ptCommon from "../locales/pt/common.json";
import ptHome from "../locales/pt/home.json";
import ptShop from "../locales/pt/shop.json";
import ptCheckout from "../locales/pt/checkout.json";
import ptAccount from "../locales/pt/account.json";
import ptAbout from "../locales/pt/about.json";
import ptFaq from "../locales/pt/faq.json";
import ptTracking from "../locales/pt/tracking.json";
import ptContact from "../locales/pt/contact.json";
import ptAuth from "../locales/pt/auth.json";
import ptWishlist from "../locales/pt/wishlist.json";
import ptCart from "../locales/pt/cart.json";

// French Locales
import frCommon from "../locales/fr/common.json";
import frHome from "../locales/fr/home.json";
import frShop from "../locales/fr/shop.json";
import frCheckout from "../locales/fr/checkout.json";
import frAccount from "../locales/fr/account.json";
import frAbout from "../locales/fr/about.json";
import frFaq from "../locales/fr/faq.json";
import frTracking from "../locales/fr/tracking.json";
import frContact from "../locales/fr/contact.json";
import frAuth from "../locales/fr/auth.json";
import frWishlist from "../locales/fr/wishlist.json";
import frCart from "../locales/fr/cart.json";

const SUPPORTED_LANGS = ["pt", "fr"] as const;
type SupportedLang = (typeof SUPPORTED_LANGS)[number];

/**
 * Determine the initial language to use:
 * 1. Language embedded in the current URL path (/pt/... or /fr/...)
 * 2. Language saved in localStorage
 * 3. Browser navigator language (first match)
 * 4. Default: "pt"
 */
function detectInitialLanguage(): SupportedLang {
  // 1. Try to read from the URL path first (most authoritative)
  try {
    const pathLang = window.location.pathname.split("/")[1] as SupportedLang;
    if (SUPPORTED_LANGS.includes(pathLang)) {
      return pathLang;
    }
  } catch (_) { /* ignore */ }

  // 2. Try localStorage
  try {
    const saved = localStorage.getItem("imex_lang") as SupportedLang | null;
    if (saved && SUPPORTED_LANGS.includes(saved)) {
      return saved;
    }
  } catch (_) { /* ignore (private mode) */ }

  // 3. Try browser language
  try {
    const navLang = (navigator.language || "").toLowerCase();
    if (navLang.startsWith("fr")) return "fr";
    if (navLang.startsWith("pt")) return "pt";
  } catch (_) { /* ignore */ }

  // 4. Default
  return "pt";
}

const resources = {
  pt: {
    common: ptCommon,
    home: ptHome,
    shop: ptShop,
    checkout: ptCheckout,
    account: ptAccount,
    about: ptAbout,
    faq: ptFaq,
    tracking: ptTracking,
    contact: ptContact,
    auth: ptAuth,
    wishlist: ptWishlist,
    cart: ptCart,
  },
  fr: {
    common: frCommon,
    home: frHome,
    shop: frShop,
    checkout: frCheckout,
    account: frAccount,
    about: frAbout,
    faq: frFaq,
    tracking: frTracking,
    contact: frContact,
    auth: frAuth,
    wishlist: frWishlist,
    cart: frCart,
  },
};

const initialLang = detectInitialLanguage();

i18n.use(initReactI18next).init({
  resources,
  lng: initialLang,
  fallbackLng: "pt",
  ns: [
    "common",
    "home",
    "shop",
    "checkout",
    "account",
    "about",
    "faq",
    "tracking",
    "contact",
    "auth",
    "wishlist",
    "cart",
  ],
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
});

// Persist language to localStorage whenever it changes
i18n.on("languageChanged", (lng: string) => {
  try {
    if (SUPPORTED_LANGS.includes(lng as SupportedLang)) {
      localStorage.setItem("imex_lang", lng);
    }
  } catch (_) { /* ignore private mode */ }
});

export default i18n;
