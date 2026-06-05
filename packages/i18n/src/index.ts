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

i18n.use(initReactI18next).init({
  resources,
  lng: "pt",
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

export default i18n;
