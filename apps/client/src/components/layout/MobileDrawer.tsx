import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  X,
  CaretRight,
  Question,
  EnvelopeSimple,
  BookOpen,
  Package,
  Storefront,
  Tag,
  Star,
  User,
  House,
} from "@phosphor-icons/react";
import { useLocale } from "../../hooks/useLocale";
import { useTranslation } from "react-i18next";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const { localLink } = useLocale();
  const { t } = useTranslation();

  // Mobile main menu sections
  const menuCategories = [
    { 
      label: t("nav.home", "Accueil"), 
      path: "/",
      icon: <House size={22} className="text-[#0EA5E9]" />
    },
    { 
      label: t("nav.all_products", "Tous les produits"), 
      path: "/boutique",
      icon: <Storefront size={22} className="text-primary" />
    },
    {
      label: t("nav.promotions", "Promotions"),
      path: "/boutique?filter=promo",
      icon: <Tag size={22} className="text-amber-500" />,
      badge: "🔥"
    },
    {
      label: t("nav.new_arrivals", "Nouveautés"),
      path: "/boutique?filter=new",
      icon: <Star size={22} className="text-green-650" />
    },
  ];

  const infoLinks = [
    { label: t("nav.about"), path: "/a-propos", icon: <Question size={18} /> },
    {
      label: t("nav.tracking"),
      path: "/suivi-commande",
      icon: <Package size={18} />,
    },
    {
      label: t("nav.contact"),
      path: "/contact",
      icon: <EnvelopeSimple size={18} />,
    },
    { label: t("nav.faq"), path: "/faq", icon: <Question size={18} /> },
    {
      label: t("footer.legal_info"),
      path: "/mentions-legales",
      icon: <BookOpen size={18} />,
    },
    { label: t("footer.terms"), path: "/cgv", icon: <BookOpen size={18} /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm md:hidden"
          />

          {/* Drawer Menu */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white text-gray-800 z-[70] shadow-2xl flex flex-col md:hidden"
          >
            {/* Header Drawer */}
            <div className="bg-[#1A1A1A] p-5 flex items-center justify-between">
              <Link
                to={localLink("/")}
                onClick={onClose}
                className="font-black text-xl tracking-tighter text-white"
              >
                IMEX<span className="text-primary">MERCADO</span>
              </Link>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
                aria-label="Close menu"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pb-24 search-suggestions-scrollbar">
              {/* Boutique links */}
              <div className="p-5 pb-2">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 px-1">
                  {t("nav.shop")}
                </h3>
                <ul className="space-y-2">
                  {menuCategories.map((item, idx) => (
                    <li key={idx}>
                      <Link
                        to={localLink(item.path)}
                        onClick={onClose}
                        className="flex items-center gap-4 p-4 bg-white border border-black rounded-xl hover:bg-gray-50 transition-all duration-200 group active:scale-[0.98]"
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-gray-200 shadow-xs">
                          {item.icon}
                        </div>
                        <span className="text-sm font-black uppercase tracking-wide text-gray-900 flex-grow">
                          {item.label} {item.badge && <span className="ml-1">{item.badge}</span>}
                        </span>
                        <CaretRight
                          size={16}
                          className="text-gray-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all"
                          weight="bold"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Espace Membre / Mon Compte shortcut */}
              <div className="p-5 py-2 mt-2">
                <Link
                  to={localLink("/compte")}
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-primary to-orange-600 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-xs"
                >
                  <User size={18} weight="bold" />
                  {t("nav.member_space", "Espace Membre")}
                </Link>
              </div>

              {/* Informational Links */}
              <div className="p-5 pt-4 border-t border-gray-100 mt-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 px-1">
                  {t("nav.assistance_info", "Assistance & Info")}
                </h3>
                <ul className="grid grid-cols-1 gap-1">
                  {infoLinks.map((item, idx) => (
                    <li key={idx}>
                      <Link
                        to={localLink(item.path)}
                        onClick={onClose}
                        className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-all duration-150 text-gray-600 hover:text-primary group"
                      >
                        <div className="text-gray-400 group-hover:text-primary transition-colors">
                          {item.icon}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none mt-1">
                          {item.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-150 text-center">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                © 2026 ImexMercado.pt
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
