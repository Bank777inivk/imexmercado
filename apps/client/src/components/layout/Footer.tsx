import React from "react";
import { InstagramLogo, FacebookLogo, LinkedinLogo } from "@imexmercado/ui";
import { Link } from "react-router-dom";
import { useLocale } from "../../hooks/useLocale";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { localLink } = useLocale();
  const { t } = useTranslation();

  const footerLinks = [
    {
      title: t("footer.help"),
      links: [
        { label: t("nav.contact"), path: "/contact" },
        { label: t("nav.faq"), path: "/faq" },
        { label: t("nav.tracking"), path: "/suivi-commande" },
        { label: t("footer.shipping"), path: "/livraison" },
        { label: t("footer.returns"), path: "/retours" },
      ],
    },
    {
      title: t("footer.categories"),
      links: [
        {
          label: t("categories.hitech", "Téléphones & Hi-Tech"),
          path: "/category/hitech",
        },
        { label: t("categories.maison", "Maison"), path: "/category/maison" },
        {
          label: t("categories.meubles", "Meubles & Déco"),
          path: "/category/meubles",
        },
        {
          label: t("categories.bricolage", "Bricolage"),
          path: "/category/bricolage",
        },
        {
          label: t("categories.jardin", "BBQ & Jardin"),
          path: "/category/jardin",
        },
        {
          label: t("categories.loisirs", "Piscines & Loisirs"),
          path: "/category/loisirs",
        },
      ],
    },
    {
      title: t("footer.legal"),
      links: [
        { label: t("footer.terms"), path: "/cgv" },
        { label: t("footer.privacy"), path: "/confidentialite" },
        { label: t("footer.legal_info"), path: "/mentions-legales" },
        { label: t("footer.cookies"), path: "/cookies" },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* 
        The extra `pb-28 md:pb-12` pushes content up so it is not 
        hidden behind the MobileBottomNav on small screens!
      */}
      <div className="w-full px-2 md:px-4 lg:px-6 pt-12 pb-28 md:pb-12">
        {/* Always 3 Columns */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8 mb-12">
          {footerLinks.map((section) => (
            <div key={section.title} className="pb-0">
              <h4 className="text-white font-black text-[9px] sm:text-[11px] md:text-sm mb-2 md:mb-4 uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-2 md:space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={localLink(link.path)}
                      className="text-[9px] sm:text-[11px] md:text-sm font-medium hover:text-white transition-colors block leading-tight"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment icons */}
        <div className="border-t border-gray-800 pt-8 mb-8 flex flex-col items-center md:items-start text-center md:text-left">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
            {t("footer.payment_methods")}
          </p>
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
            {/* Visa */}
            <div className="bg-white px-2 py-1.5 rounded-md flex items-center justify-center h-8 w-12 shadow-sm border border-white/10 hover:scale-105 transition-transform">
              <img
                src="https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons@master/logo/visa.svg"
                alt="Visa"
                className="h-4 object-contain select-none"
              />
            </div>
            {/* Mastercard */}
            <div className="bg-white px-2 py-1.5 rounded-md flex items-center justify-center h-8 w-12 shadow-sm border border-white/10 hover:scale-105 transition-transform">
              <img
                src="https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons@master/logo/mastercard.svg"
                alt="Mastercard"
                className="h-5 object-contain select-none"
              />
            </div>
            {/* PayPal */}
            <div className="bg-white px-2 py-1.5 rounded-md flex items-center justify-center h-8 w-12 shadow-sm border border-white/10 hover:scale-105 transition-transform">
              <img
                src="https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons@master/logo/paypal.svg"
                alt="PayPal"
                className="h-4 object-contain select-none"
              />
            </div>
            {/* MBWay */}
            <div className="bg-white p-0.5 rounded-md flex items-center justify-center h-8 w-12 shadow-sm border border-white/10 hover:scale-105 transition-transform overflow-hidden">
              <svg
                viewBox="0 0 60 40"
                className="h-full w-full object-cover select-none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="60" height="40" rx="3" fill="#E30613" />
                <text
                  x="6"
                  y="26"
                  fill="white"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  fontWeight="900"
                  fontSize="20"
                  letterSpacing="-1.5"
                >
                  mb
                </text>
                <text
                  x="31"
                  y="26"
                  fill="#00A2E8"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  fontWeight="900"
                  fontSize="20"
                  fontStyle="italic"
                  letterSpacing="-1.5"
                >
                  way
                </text>
              </svg>
            </div>
            {/* SEPA */}
            <div className="bg-white p-0.5 rounded-md flex items-center justify-center h-8 w-12 shadow-sm border border-white/10 hover:scale-105 transition-transform overflow-hidden">
              <svg
                viewBox="0 0 60 40"
                className="h-full w-full object-cover select-none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="60" height="40" rx="3" fill="#0A2540" />
                <path
                  d="M8 20C8 14 11 10 15 10C18 10 20.5 12 21.5 15H17.5C17 14 16.2 13.3 15 13.3C13 13.3 11.5 15.5 11.5 20C11.5 24.5 13 26.7 15 26.7C16.2 26.7 17 26 17.5 25H21.5C20.5 28 18 30 15 30C11 30 8 26 8 20Z"
                  fill="#00D4B2"
                />
                <text
                  x="23"
                  y="23"
                  fill="white"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  fontWeight="900"
                  fontSize="10"
                  letterSpacing="0.5"
                >
                  SEPA
                </text>
              </svg>
            </div>
            {/* Stripe */}
            <div className="bg-white px-2 py-1.5 rounded-md flex items-center justify-center h-8 w-12 shadow-sm border border-white/10 hover:scale-105 transition-transform">
              <svg
                viewBox="0 0 60 25"
                className="h-5 w-auto object-contain select-none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M51.9 8.2c-1-.2-1.9.3-1.9 1.1 0 .6.4 1 1.7 1.3 1.9.4 3.7.8 3.7 3.3 0 2.5-2.1 3.9-4.7 3.9-1.3 0-2.6-.3-3.6-.8v-3.1c1 .5 2.2.8 3.4.8.9 0 1.7-.3 1.7-1 0-.7-.5-1-1.8-1.3-1.8-.4-3.6-.8-3.6-3.2 0-2.4 2-3.8 4.4-3.8 1.2 0 2.3.3 3.1.6v3.1c-.8-.4-1.8-.6-2.9-.6zM37.5 5.5v3.4h3.6v2.9h-3.6v5.8c0 .8.5 1.1 1.2 1.1.8 0 1.4-.2 1.9-.4v2.8c-.8.3-2 .5-3.3.5-2.3 0-3.5-1.3-3.5-3.6V11.8h-2.1V8.9h2.1V5.5h3.7zm7.5 3.4c1.1 0 2 .4 2.4.7v3.2c-.6-.4-1.4-.7-2.3-.7-1.7 0-2.6 1.2-2.6 3v2.8h-3.7V8.9h3.4v1.8c.6-1.1 1.7-1.8 2.8-1.8zM24.7 8.9h3.7v8.9h-3.7V8.9zm0-3.9h3.7v2.9h-3.7V5zm7.3 14c-.6.3-1.6.4-2.5.4-2.5 0-3.9-1.5-3.9-4.8V5.5h3.7v8.9c0 .9.5 1.2 1.2 1.2.7 0 1.2-.2 1.5-.4V20.2zM15.4 3c2.4 0 4.6.6 6 1.4v3.1c-1.3-.7-3.2-1.3-5.5-1.3-3 0-4.8 1.4-4.8 3.5 0 4.8 6.7 4.1 6.7 8.3 0 2.5-2.1 4.1-5.6 4.1-2.4 0-4.8-.7-6.2-1.5v-3.3c1.5.9 3.8 1.6 5.8 1.6 3.1 0 5-1.3 5-3.4 0-5.1-6.8-4.2-6.8-8.4C10 5.1 12.3 3 15.4 3z"
                  fill="#635BFF"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col items-center md:flex-row md:justify-between gap-6 text-center md:text-left">
          <div>
            <Link
              to={localLink("/")}
              className="text-2xl font-black text-white tracking-tighter mb-2 block hover:opacity-80 transition-opacity"
            >
              IMEX<span className="text-primary">MERCADO</span>
            </Link>
            <p className="text-[10px] font-bold text-gray-500 tracking-wider">
              © 2026 IMEXSULTING Lda — imexmercado.pt — {t("footer.rights")}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-gray-500 hover:text-white transition-colors p-2 bg-gray-800 rounded-full"
            >
              <FacebookLogo size={20} weight="fill" />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-white transition-colors p-2 bg-gray-800 rounded-full"
            >
              <InstagramLogo size={20} weight="fill" />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-white transition-colors p-2 bg-gray-800 rounded-full"
            >
              <LinkedinLogo size={20} weight="fill" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
