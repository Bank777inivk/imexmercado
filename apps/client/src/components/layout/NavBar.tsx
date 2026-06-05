import React from "react";
import { Link } from "react-router-dom";
import { List } from "@imexmercado/ui";
import { useLocale } from "../../hooks/useLocale";
import { useTranslation } from "react-i18next";

export function NavBar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const { localLink } = useLocale();
  const { t } = useTranslation();

  const navItems = [
    { label: t("nav.home"), path: "/" },
    { label: t("nav.shop"), path: "/boutique" },
    { label: t("nav.promotions"), path: "/boutique?filter=promo" },
    { label: t("nav.about"), path: "/a-propos" },
    { label: t("nav.faq"), path: "/faq" },
    { label: t("nav.tracking"), path: "/suivi-commande" },
    { label: t("nav.contact"), path: "/contact" },
  ];

  return (
    <nav className="bg-[#222222] text-white hidden md:block border-t border-white/5">
      <div className="w-full px-2 md:px-4 lg:px-6 h-12 flex items-center">
        {/* ALL DEPARTMENTS button — orange, fixed width, same as logo column */}
        <button
          onClick={onToggleSidebar}
          className="flex items-center gap-2 font-bold bg-primary hover:bg-primary-dark px-4 h-12 transition-colors whitespace-nowrap w-[250px] flex-shrink-0 text-sm uppercase"
        >
          <List size={20} weight="bold" />
          <span>{t("nav.departments")}</span>
        </button>

        {/* Nav links */}
        <ul className="flex items-center h-full ml-4">
          {navItems.map((item, idx) => (
            <li key={idx} className="h-full">
              <Link
                to={localLink(item.path)}
                className="flex items-center h-full px-4 text-sm font-semibold text-gray-300
                  hover:text-white hover:bg-white/10 transition-all duration-150 whitespace-nowrap
                  border-b-2 border-transparent hover:border-primary"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right — Hotline */}
        <div className="ml-auto hidden xl:flex items-center gap-2 text-xs text-gray-400">
          <span>📞</span>
          <span className="font-semibold text-white">
            Hotline : +351 000 000 000
          </span>
        </div>
      </div>
    </nav>
  );
}
