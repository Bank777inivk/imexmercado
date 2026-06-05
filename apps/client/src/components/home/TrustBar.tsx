import React, { useState, useEffect, useMemo } from "react";
import {
  Truck,
  ArrowClockwise,
  Lock,
  ChatCircle,
  Phone,
  House,
  Star,
} from "@imexmercado/ui";
import { subscribeToDocument } from "@imexmercado/firebase";
import { useTranslation } from "react-i18next";

const ICON_MAP: Record<string, any> = {
  Truck,
  ArrowClockwise,
  Lock,
  ChatCircle,
  Phone,
  House,
  Star,
};

const DEFAULT_ITEMS = [
  {
    icon: "Truck",
    title: "Livraison Gratuite",
    subtitle: "Sur commande > €49.86",
  },
  {
    icon: "ArrowClockwise",
    title: "Protection Commande",
    subtitle: "Informations sécurisées",
  },
  { icon: "Lock", title: "Paiement Sécurisé", subtitle: "SSL + 3D Secure" },
  {
    icon: "ChatCircle",
    title: "Retour 30 Jours",
    subtitle: "Remboursement garanti",
  },
];

const TRUST_KEYS: Record<string, { title: string; subtitle: string }> = {
  Truck: { title: "home.trust.delivery", subtitle: "home.trust.delivery_sub" },
  ArrowClockwise: {
    title: "home.trust.protection",
    subtitle: "home.trust.protection_sub",
  },
  Lock: { title: "home.trust.security", subtitle: "home.trust.security_sub" },
  ChatCircle: {
    title: "home.trust.returns",
    subtitle: "home.trust.returns_sub",
  },
};

export function TrustBar() {
  const [dbItems, setDbItems] = useState(DEFAULT_ITEMS);
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "pt";

  useEffect(() => {
    const unsubscribe = subscribeToDocument("settings", "homepage", (data) => {
      if (data && data.trustBar) {
        setDbItems(data.trustBar);
      }
    });
    return () => unsubscribe();
  }, []);

  const items = useMemo(() => {
    return dbItems.map((item) => {
      const keys = TRUST_KEYS[item.icon];

      const title =
        currentLang === "pt"
          ? (item as any).titlePT ||
            (keys ? t(keys.title, item.title) : item.title)
          : item.title || (keys ? t(keys.title) : "");

      const subtitle =
        currentLang === "pt"
          ? (item as any).subtitlePT ||
            (keys ? t(keys.subtitle, item.subtitle) : item.subtitle)
          : item.subtitle || (keys ? t(keys.subtitle) : "");

      return { ...item, title, subtitle };
    });
  }, [dbItems, currentLang, t]);

  return (
    <div className="bg-white border-b border-gray-200 py-3 w-full px-4 md:px-8 lg:px-12">
      <div className="w-full grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200">
        {items.map((item, idx) => {
          const Icon = ICON_MAP[item.icon] || Star;
          return (
            <div key={idx} className="flex items-center gap-3 px-4 py-2">
              <Icon
                size={28}
                className="text-primary flex-shrink-0"
                weight="regular"
              />
              <div>
                <p className="text-xs font-bold text-gray-800">
                  {item.title || (item as any).text}
                </p>
                <p className="text-[11px] text-gray-500">
                  {item.subtitle || (item as any).subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
