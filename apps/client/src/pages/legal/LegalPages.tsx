import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  ShieldCheck,
  Cookie,
  BookOpen,
  Truck,
  ArrowUUpLeft,
} from "@phosphor-icons/react";
import { subscribeToDocument } from "@imexmercado/firebase";
import { useTranslation } from "react-i18next";

interface LegalLayoutProps {
  title: string;
  icon: React.ReactNode;
  lastUpdated: string;
  children: React.ReactNode;
  loading?: boolean;
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export function LegalLayout({
  title,
  icon,
  lastUpdated,
  children,
  loading,
}: LegalLayoutProps) {
  const { i18n } = useTranslation();
  const isFR = (i18n.language || "pt").startsWith("fr");

  return (
    <div className="bg-bg min-h-screen py-8 md:py-16 selection:bg-primary/10">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black mb-6 md:mb-10 pl-2">
          <Link to="/" className="hover:text-primary transition-colors">
            {isFR ? "Accueil" : "Início"}
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">{title}</span>
        </div>

        <motion.div
          {...fadeIn}
          className="bg-white rounded-3xl border-2 border-gray-200 shadow-xl overflow-hidden text-left"
        >
          {/* Header */}
          <div className="bg-gray-50/50 p-6 md:p-16 border-b border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 relative overflow-hidden text-center md:text-left">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-bl-full shadow-sm -mr-10 -mt-10 pointer-events-none opacity-50" />

            <div className="bg-white border-2 border-gray-100 w-20 h-20 rounded-2xl flex items-center justify-center text-primary shadow-sm shrink-0 relative z-10">
              {icon}
            </div>
            <div className="relative z-10">
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-2 md:mb-4">
                {title}
              </h1>
              <div className="inline-block bg-gray-200 text-gray-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md">
                {isFR ? "Dernière mise à jour" : "Última atualização"} :{" "}
                {lastUpdated}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-16">
            {loading ? (
              <div className="space-y-4 animate-pulse py-12">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : (
              <div className="legal-content space-y-8 md:space-y-12 text-gray-600 text-sm md:text-base leading-relaxed font-medium">
                {children}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Custom hook to subscribe to legal page from Firestore
function useLegalPage(key: string, defaultTitle: string, defaultDate: string) {
  const { i18n } = useTranslation();
  const isFR = (i18n.language || "pt").startsWith("fr");

  const [data, setData] = useState({
    title: defaultTitle,
    lastUpdated: defaultDate,
    content: "",
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = subscribeToDocument(
      "settings",
      "legal_pages",
      (dbData: any) => {
        if (dbData && dbData[key]) {
          const pageData = dbData[key];
          setData({
            title: (isFR ? pageData.title : pageData.titlePT) || defaultTitle,
            lastUpdated:
              (isFR ? pageData.lastUpdated : pageData.lastUpdatedPT) ||
              defaultDate,
            content: (isFR ? pageData.content : pageData.contentPT) || "",
            loading: false,
          });
        } else {
          setData((prev) => ({
            ...prev,
            loading: false,
          }));
        }
      },
    );
    return () => unsubscribe();
  }, [key, defaultTitle, defaultDate, isFR]);

  return data;
}

/* ──────────────────────────────────────────────────────────────────────────
   COMPONENTS
────────────────────────────────────────────────────────────────────────── */

export const LegalInfoPage = () => {
  const { i18n } = useTranslation();
  const isFR = (i18n.language || "pt").startsWith("fr");

  const { title, lastUpdated, content, loading } = useLegalPage(
    "mentions",
    isFR ? "Mentions Légales" : "Informação Legal",
    isFR ? "12 Janvier 2024" : "12 de Janeiro de 2024",
  );

  return (
    <LegalLayout
      title={title}
      lastUpdated={lastUpdated}
      loading={loading}
      icon={<BookOpen size={36} weight="duotone" />}
    >
      <div
        dangerouslySetInnerHTML={{
          __html:
            content ||
            (isFR
              ? "<p>Aucun contenu disponible.</p>"
              : "<p>Sem conteúdo disponível.</p>"),
        }}
        className="space-y-6"
      />
    </LegalLayout>
  );
};

export const PrivacyPage = () => {
  const { i18n } = useTranslation();
  const isFR = (i18n.language || "pt").startsWith("fr");

  const { title, lastUpdated, content, loading } = useLegalPage(
    "confidentialite",
    isFR ? "Politique de Confidentialité" : "Política de Privacidade",
    isFR ? "03 Mars 2024" : "03 de Março de 2024",
  );

  return (
    <LegalLayout
      title={title}
      lastUpdated={lastUpdated}
      loading={loading}
      icon={<ShieldCheck size={36} weight="duotone" />}
    >
      <div
        dangerouslySetInnerHTML={{
          __html:
            content ||
            (isFR
              ? "<p>Aucun contenu disponible.</p>"
              : "<p>Sem conteúdo disponível.</p>"),
        }}
        className="space-y-6"
      />
    </LegalLayout>
  );
};

export const CookiesPage = () => {
  const { i18n } = useTranslation();
  const isFR = (i18n.language || "pt").startsWith("fr");

  const { title, lastUpdated, content, loading } = useLegalPage(
    "cookies",
    isFR ? "Politique des Cookies" : "Política de Cookies",
    isFR ? "15 Février 2024" : "15 de Fevereiro de 2024",
  );

  return (
    <LegalLayout
      title={title}
      lastUpdated={lastUpdated}
      loading={loading}
      icon={<Cookie size={36} weight="duotone" />}
    >
      <div
        dangerouslySetInnerHTML={{
          __html:
            content ||
            (isFR
              ? "<p>Aucun contenu disponible.</p>"
              : "<p>Sem conteúdo disponível.</p>"),
        }}
        className="space-y-6"
      />
    </LegalLayout>
  );
};

export const CGVPage = () => {
  const { i18n } = useTranslation();
  const isFR = (i18n.language || "pt").startsWith("fr");

  const { title, lastUpdated, content, loading } = useLegalPage(
    "cgv",
    isFR ? "Conditions Générales de Vente" : "Termos e Condições de Venda",
    isFR ? "01 Janvier 2024" : "01 de Janeiro de 2024",
  );

  return (
    <LegalLayout
      title={title}
      lastUpdated={lastUpdated}
      loading={loading}
      icon={<FileText size={36} weight="duotone" />}
    >
      <div
        dangerouslySetInnerHTML={{
          __html:
            content ||
            (isFR
              ? "<p>Aucun contenu disponible.</p>"
              : "<p>Sem conteúdo disponível.</p>"),
        }}
        className="space-y-6"
      />
    </LegalLayout>
  );
};

export const ShippingInfoPage = () => {
  const { i18n } = useTranslation();
  const isFR = (i18n.language || "pt").startsWith("fr");

  const { title, lastUpdated, content, loading } = useLegalPage(
    "livraison",
    isFR ? "Livraison & Expéditions" : "Envio e Entregas",
    isFR ? "18 Février 2024" : "18 de Fevereiro de 2024",
  );

  return (
    <LegalLayout
      title={title}
      lastUpdated={lastUpdated}
      loading={loading}
      icon={<Truck size={36} weight="duotone" />}
    >
      <div
        dangerouslySetInnerHTML={{
          __html:
            content ||
            (isFR
              ? "<p>Aucun contenu disponible.</p>"
              : "<p>Sem conteúdo disponível.</p>"),
        }}
        className="space-y-6"
      />
    </LegalLayout>
  );
};

export const ReturnsInfoPage = () => {
  const { i18n } = useTranslation();
  const isFR = (i18n.language || "pt").startsWith("fr");

  const { title, lastUpdated, content, loading } = useLegalPage(
    "retours",
    isFR ? "Politique de Retours" : "Política de Devoluções",
    isFR ? "10 Décembre 2023" : "10 de Dezembro de 2023",
  );

  return (
    <LegalLayout
      title={title}
      lastUpdated={lastUpdated}
      loading={loading}
      icon={<ArrowUUpLeft size={36} weight="duotone" />}
    >
      <div
        dangerouslySetInnerHTML={{
          __html:
            content ||
            (isFR
              ? "<p>Aucun contenu disponible.</p>"
              : "<p>Sem conteúdo disponível.</p>"),
        }}
        className="space-y-6"
      />
    </LegalLayout>
  );
};
