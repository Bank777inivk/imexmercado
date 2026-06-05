import React, { useState, useEffect } from "react";
import { Cookie, Check, X } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

// Pages privées ou techniques → pas de bannière cookie
const PRIVATE_PATH_PATTERNS = [
  /\/(compte|conta)(\/|$)/,
  /\/(commande|finalizar-compra)(\/|$)/,
  /\/(connexion|entrar)(\/|$)/,
  /\/(inscription|registar)(\/|$)/,
  /\/(mot-de-passe-oublie|recuperar-senha)(\/|$)/,
];

function isPublicPage(pathname: string): boolean {
  return !PRIVATE_PATH_PATTERNS.some((re) => re.test(pathname));
}

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const { t } = useTranslation(["common"]);
  const location = useLocation();

  const onPublicPage = isPublicPage(location.pathname);

  useEffect(() => {
    const consent = localStorage.getItem("imex_cookie_consent");
    if (!consent && onPublicPage) {
      // Small delay so the page loads first
      const timer = setTimeout(() => setShowBanner(true), 800);
      return () => clearTimeout(timer);
    }
  }, [onPublicPage]);

  // Hide if we navigate to a private page
  useEffect(() => {
    if (!onPublicPage) setShowBanner(false);
  }, [location.pathname, onPublicPage]);

  const handleAcceptAll = () => {
    const consent = { necessary: true, analytics: true, marketing: true };
    localStorage.setItem("imex_cookie_consent", JSON.stringify(consent));
    window.dispatchEvent(new Event("imex_cookie_consent_changed"));
    setShowBanner(false);
  };

  const handleRefuseAll = () => {
    const consent = { necessary: true, analytics: false, marketing: false };
    localStorage.setItem("imex_cookie_consent", JSON.stringify(consent));
    window.dispatchEvent(new Event("imex_cookie_consent_changed"));
    setShowBanner(false);
  };

  const handleSaveCustom = () => {
    const consent = { necessary: true, analytics, marketing };
    localStorage.setItem("imex_cookie_consent", JSON.stringify(consent));
    window.dispatchEvent(new Event("imex_cookie_consent_changed"));
    setShowBanner(false);
  };

  // ─── Tiny floating button to reopen settings (RGPD) ───
  // Only shown on public pages once user has already chosen
  if (!showBanner) {
    if (!onPublicPage) return null;
    return (
      <button
        onClick={() => {
          const consent = localStorage.getItem("imex_cookie_consent");
          if (consent) {
            const parsed = JSON.parse(consent);
            setAnalytics(parsed.analytics || false);
            setMarketing(parsed.marketing || false);
          }
          setMinimized(false);
          setShowBanner(true);
        }}
        title={t("common:cookies.hover_title")}
        aria-label="Cookies"
        className="fixed bottom-20 left-3 z-40 md:bottom-4 md:left-4 bg-white hover:bg-gray-100 text-gray-700 w-9 h-9 rounded-full flex items-center justify-center shadow-lg border border-gray-200 hover:scale-110 active:scale-95 transition-all"
      >
        <Cookie size={18} weight="bold" className="text-primary" />
      </button>
    );
  }

  // ─────────────────────────────────────────────
  // MOBILE  → compact floating card (bottom-left corner)
  // DESKTOP → full-width bottom bar (existing behaviour)
  // ─────────────────────────────────────────────

  return (
    <>
      {/* ── DESKTOP banner ── */}
      <div className="hidden md:block fixed bottom-0 left-0 right-0 z-50 p-6 bg-[#1F222A]/95 backdrop-blur-md border-t border-[#2D3039] text-white shadow-2xl">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <Cookie size={24} className="text-primary animate-pulse" weight="fill" />
              <h3 className="font-bold text-lg tracking-tight text-white">
                {t("common:cookies.title")}
              </h3>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed max-w-4xl font-sans">
              {t("common:cookies.description")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white transition-colors"
            >
              {showDetails ? t("common:cookies.hide") : t("common:cookies.customize")}
            </button>
            <button
              onClick={handleRefuseAll}
              className="px-5 py-2.5 text-xs font-black uppercase tracking-wider bg-[#2D3039] hover:bg-[#3E424B] text-gray-200 rounded-xl transition-all"
            >
              {t("common:cookies.refuse_all")}
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-6 py-2.5 text-xs font-black uppercase tracking-wider bg-primary hover:bg-primary-dark text-white rounded-xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              {t("common:cookies.accept_all")}
            </button>
          </div>
        </div>

        {showDetails && (
          <div className="max-w-6xl mx-auto mt-6 pt-6 border-t border-[#2D3039] grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="p-4 bg-[#2D3039]/50 rounded-2xl space-y-2 border border-[#2D3039]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-white">{t("common:cookies.necessary")}</span>
                <span className="text-[10px] font-black text-green-500 uppercase">{t("common:cookies.always_active")}</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed font-sans">{t("common:cookies.necessary_desc")}</p>
            </div>
            <div className="p-4 bg-[#2D3039]/50 rounded-2xl space-y-3 border border-[#2D3039]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-white">{t("common:cookies.analytics")}</span>
                <button type="button" onClick={() => setAnalytics(!analytics)}
                  className={`w-10 h-5 rounded-full relative transition-all ${analytics ? "bg-primary" : "bg-gray-600"}`}>
                  <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${analytics ? "right-0.5" : "left-0.5"}`} />
                </button>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed font-sans">{t("common:cookies.analytics_desc")}</p>
            </div>
            <div className="p-4 bg-[#2D3039]/50 rounded-2xl space-y-3 border border-[#2D3039]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-white">{t("common:cookies.marketing")}</span>
                <button type="button" onClick={() => setMarketing(!marketing)}
                  className={`w-10 h-5 rounded-full relative transition-all ${marketing ? "bg-primary" : "bg-gray-600"}`}>
                  <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${marketing ? "right-0.5" : "left-0.5"}`} />
                </button>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed font-sans">{t("common:cookies.marketing_desc")}</p>
            </div>
            <div className="md:col-span-3 flex justify-end">
              <button onClick={handleSaveCustom}
                className="px-6 py-2.5 text-xs font-black uppercase tracking-wider bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-all flex items-center gap-2">
                <Check size={16} weight="bold" /> {t("common:cookies.save_choices")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── MOBILE compact floating card (bottom-left corner) ── */}
      <div className="md:hidden fixed bottom-[76px] left-3 z-50 w-[calc(100vw-24px)] max-w-[340px] animate-in slide-in-from-bottom-4 duration-300">
        <div className="bg-[#1F222A] border border-[#2D3039] rounded-2xl shadow-2xl overflow-hidden">

          {/* Header row */}
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <div className="flex items-center gap-2">
              <Cookie size={18} className="text-primary" weight="fill" />
              <span className="text-white font-black text-sm tracking-tight">
                {t("common:cookies.title")}
              </span>
            </div>
            {/* Close = refuse all */}
            <button
              onClick={handleRefuseAll}
              aria-label="Fermer"
              className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <X size={16} weight="bold" />
            </button>
          </div>

          {/* Description */}
          {!minimized && (
            <p className="px-4 pb-3 text-[11px] text-gray-400 leading-relaxed">
              {t("common:cookies.description")}
            </p>
          )}

          {/* Details toggles */}
          {showDetails && !minimized && (
            <div className="px-4 pb-3 space-y-2 border-t border-[#2D3039] pt-3">
              {/* Analytics */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">{t("common:cookies.analytics")}</span>
                <button type="button" onClick={() => setAnalytics(!analytics)}
                  className={`w-9 h-5 rounded-full relative transition-all ${analytics ? "bg-primary" : "bg-gray-600"}`}>
                  <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${analytics ? "right-0.5" : "left-0.5"}`} />
                </button>
              </div>
              {/* Marketing */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">{t("common:cookies.marketing")}</span>
                <button type="button" onClick={() => setMarketing(!marketing)}
                  className={`w-9 h-5 rounded-full relative transition-all ${marketing ? "bg-primary" : "bg-gray-600"}`}>
                  <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${marketing ? "right-0.5" : "left-0.5"}`} />
                </button>
              </div>
              <button onClick={handleSaveCustom}
                className="w-full mt-1 py-2 text-[11px] font-black uppercase tracking-wider bg-white text-gray-900 rounded-xl flex items-center justify-center gap-1.5 hover:bg-gray-100 transition-all">
                <Check size={13} weight="bold" /> {t("common:cookies.save_choices")}
              </button>
            </div>
          )}

          {/* Action buttons row */}
          {!minimized && (
            <div className="flex items-center gap-2 px-4 pb-4">
              <button
                onClick={() => { setShowDetails(!showDetails); }}
                className="flex-1 py-2 text-[11px] font-bold text-gray-400 hover:text-white border border-[#2D3039] rounded-xl transition-colors"
              >
                {showDetails ? t("common:cookies.hide") : t("common:cookies.customize")}
              </button>
              <button
                onClick={handleAcceptAll}
                className="flex-1 py-2 text-[11px] font-black text-white bg-primary rounded-xl hover:bg-primary-dark active:scale-95 transition-all"
              >
                {t("common:cookies.accept_all")}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
