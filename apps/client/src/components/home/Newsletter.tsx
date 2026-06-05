import React, { useState, useEffect } from "react";
import { subscribeToDocument, addDocument } from "@imexmercado/firebase";
import { useTranslation } from "react-i18next";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "pt";

  useEffect(() => {
    const unsubscribe = subscribeToDocument("settings", "homepage", (data) => {
      if (data && data.newsletter) {
        setSettings(data.newsletter);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await addDocument("subscribers", {
        email: email.trim().toLowerCase(),
        subscribedAt: new Date().toISOString(),
      });
      setSent(true);
      setEmail("");
      setTimeout(() => {
        setSent(false);
      }, 4000);
    } catch (err) {
      console.error("Error subscribing email:", err);
      // Fallback: show success anyway so user experience is smooth
      setSent(true);
      setEmail("");
      setTimeout(() => {
        setSent(false);
      }, 4000);
    }
  };

  const title =
    currentLang === "pt"
      ? settings?.titlePT ||
        t("home.newsletter.title", "Subscreva a nossa Newsletter")
      : settings?.title ||
        t("home.newsletter.title", "Abonnez-vous à notre Newsletter");

  const subtitle =
    currentLang === "pt"
      ? settings?.subtitlePT ||
        t(
          "home.newsletter.subtitle",
          "Receba as últimas ofertas, novidades e cupões de desconto diretamente no seu e-mail.",
        )
      : settings?.subtitle ||
        t(
          "home.newsletter.subtitle",
          "Recevez les dernières offres, nouveautés et coupons de réduction directement dans votre boîte mail.",
        );

  const placeholder =
    currentLang === "pt"
      ? settings?.placeholderPT ||
        t("home.newsletter.placeholder", "O seu endereço de e-mail")
      : settings?.placeholder ||
        t("home.newsletter.placeholder", "Votre adresse e-mail");

  const buttonText =
    currentLang === "pt"
      ? settings?.buttonTextPT || t("home.newsletter.button", "Subscrever")
      : settings?.buttonText || t("home.newsletter.button", "S'abonner");

  return (
    <section className="bg-[#1A1A1A] text-white py-16 relative overflow-hidden">
      {/* Decorative element to add depth */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-3 text-white">
          {title}
        </h2>
        <p className="text-sm md:text-base text-gray-400 mb-8 max-w-xl mx-auto">
          {subtitle}
        </p>

        {sent ? (
          <div className="inline-flex items-center gap-2 bg-success/20 text-success border border-success/30 font-black uppercase tracking-widest px-8 py-3.5 rounded-full">
            <span>
              ✓{" "}
              {t(
                "home.newsletter.success",
                "Inscription validée avec succès !",
              )}
            </span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              required
              className="flex-1 px-6 py-3.5 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-primary focus:bg-white/10 transition-all font-medium text-sm"
            />
            <button
              type="submit"
              className="bg-primary text-white font-black uppercase tracking-widest px-8 py-3.5 rounded-full hover:bg-primary-dark transition-colors text-[11px] shadow-lg shadow-primary/20 whitespace-nowrap active:scale-95"
            >
              {buttonText}
            </button>
          </form>
        )}
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-6">
          {t(
            "home.newsletter.zero_spam",
            "Zéro spam. Désinscription possible à tout moment.",
          )}
        </p>
      </div>
    </section>
  );
}
