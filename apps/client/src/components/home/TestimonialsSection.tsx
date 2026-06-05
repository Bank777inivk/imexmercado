import React from "react";
import { useTranslation } from "react-i18next";

const testimonials = [
  {
    name: "Maria S.",
    countryFR: "🇵🇹 Portugal",
    countryPT: "🇵🇹 Portugal",
    rating: 5,
    textFR:
      "Livraison très rapide, produits conformes à la description. Je recommande sans hésiter imexmercado pour ses prix imbattables.",
    textPT:
      "Entrega muito rápida, produtos em conformidade com a descrição. Recomendo sem hesitar a imexmercado pelos seus preços imbatíveis.",
    dateFR: "Mars 2026",
    datePT: "Março 2026",
  },
  {
    name: "Jean-Pierre M.",
    countryFR: "🇫🇷 France",
    countryPT: "🇫🇷 França",
    rating: 5,
    textFR:
      "Site très bien conçu, navigation intuitive. J'ai commandé un canapé et il est arrivé parfaitement emballé en 4 jours.",
    textPT:
      "Site muito bem concebido, navegação intuitiva. Encomendei um sofá e chegou perfeitamente embalado em 4 dias.",
    dateFR: "Avril 2026",
    datePT: "Abril 2026",
  },
  {
    name: "Klaus W.",
    countryFR: "🇩🇪 Allemagne",
    countryPT: "🇩🇪 Alemanha",
    rating: 4,
    textFR:
      "Très bonne expérience d'achat. Les produits sont de bonne qualité et le support client est réactif. Je reviendrai !",
    textPT:
      "Excelente experiência de compra. Os produtos são de boa qualidade e o apoio ao cliente é muito reativo. Voltarei!",
    dateFR: "Avril 2026",
    datePT: "Abril 2026",
  },
  {
    name: "Sofia R.",
    countryFR: "🇮🇹 Italie",
    countryPT: "🇮🇹 Itália",
    rating: 5,
    textFR:
      "Excellente plateforme pour l'import-export. Les prix sont compétitifs et la qualité au rendez-vous. Très satisfaite !",
    textPT:
      "Excelente plataforma para importação e exportação. Os preços são competitivos e a qualidade está garantida. Muito satisfeita!",
    dateFR: "Mars 2026",
    datePT: "Março 2026",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={i <= count ? "text-yellow-400" : "text-gray-300"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || "pt";
  const isFR = currentLang.startsWith("fr");

  return (
    <section className="bg-bg-subtle py-12 border-b border-gray-100">
      <div className="w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary mb-2">
            {isFR
              ? "💬 Ce que nos clients disent"
              : "💬 O que dizem os nossos clientes"}
          </h2>
          {isFR ? (
            <p className="text-text-secondary text-sm">
              Plus de <strong>1 000 avis vérifiés</strong> de clients satisfaits
              à travers l'Europe
            </p>
          ) : (
            <p className="text-text-secondary text-sm">
              Mais de <strong>1 000 avaliações verificadas</strong> de clientes
              satisfeitos em toda a Europa
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg p-5 shadow-worten hover:shadow-worten-hover transition-shadow flex flex-col"
            >
              <Stars count={t.rating} />
              <p className="text-sm text-text-secondary italic mt-3 flex-1">
                "{isFR ? t.textFR : t.textPT}"
              </p>
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm text-text-primary">
                    {t.name}
                  </p>
                  <p className="text-xs text-text-muted">
                    {isFR ? t.countryFR : t.countryPT}
                  </p>
                </div>
                <span className="text-xs text-text-muted">
                  {isFR ? t.dateFR : t.datePT}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
