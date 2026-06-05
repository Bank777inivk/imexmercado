import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { EuropePresenceMap } from "../components/about/EuropePresenceMap";
import { useSEO } from "../hooks/useSEO";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "@phosphor-icons/react";

export function AboutPage() {
  useSEO("about");
  const { t } = useTranslation(["about"]);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-primary/10">
      {/* ─── Breadcrumbs ─── */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-4 md:py-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">
          <Link to="/" className="hover:text-primary transition-colors">
            {t("about:breadcrumb_home")}
          </Link>
          <span className="text-gray-200">/</span>
          <span className="text-gray-900">{t("about:breadcrumb_current")}</span>
        </div>
      </div>

      {/* ─── Header Section ─── */}
      <header className="container mx-auto px-4 pt-6 pb-12 md:pt-12 md:pb-24 border-b border-gray-50">
        <motion.div
          {...fadeIn}
          className="bg-white rounded-3xl border-2 border-gray-200 shadow-xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Column: Text Content */}
            <div className="p-6 md:p-16 flex flex-col justify-center relative overflow-hidden border-b lg:border-b-0 lg:border-r border-gray-100">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -mr-16 -mt-16 pointer-events-none opacity-50" />

              <h1 className="text-2xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-8 relative z-10">
                {t("about:title_prefix")} <br />
                <span className="text-primary italic-none">
                  {t("about:title_accent")}
                </span>
              </h1>
              <p className="text-base text-gray-500 max-w-2xl leading-relaxed font-medium relative z-10">
                {t("about:description")}
              </p>
            </div>

            {/* Right Column: Europe Map */}
            <div className="h-[250px] md:h-[400px] lg:h-auto overflow-hidden">
              <EuropePresenceMap />
            </div>
          </div>
        </motion.div>
      </header>

      {/* ─── Story Section ─── */}
      <section className="py-12 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Block 1: Genesis */}
          <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-center mb-20 md:mb-40">
            <motion.div
              className="w-full md:w-5/12 order-2 md:order-1"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6">
                {t("about:origins.subtitle")}
              </h2>
              <h3 className="text-3xl font-black text-gray-900 uppercase mb-8 leading-tight">
                {t("about:origins.title")}
              </h3>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>{t("about:origins.p1")}</p>
                <p>{t("about:origins.p2")}</p>
              </div>
            </motion.div>

            <motion.div
              className="w-full md:w-7/12 order-1 md:order-2 relative"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img
                src="https://placehold.co/1200x800/f3f4f6/1f2937?text=The+Beginning+2012"
                alt="Heritage"
                className="w-full h-auto rounded-none grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl"
              />
              <div className="absolute -bottom-8 -left-8 bg-primary text-white p-8 hidden lg:block">
                <p className="text-4xl font-black italic-none leading-none">
                  12+
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-2">
                  {t("about:origins.experience_years")}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Block 2: Expansion */}
          <div className="flex flex-col md:flex-row-reverse gap-12 md:gap-24 items-center mb-20 md:mb-40">
            <motion.div
              className="w-full md:w-5/12"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6">
                {t("about:growth.subtitle")}
              </h2>
              <h3 className="text-3xl font-black text-gray-900 uppercase mb-8 leading-tight">
                {t("about:growth.title")}
              </h3>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>{t("about:growth.p1")}</p>
                <p>{t("about:growth.p2")}</p>
              </div>
            </motion.div>

            <motion.div
              className="w-full md:w-7/12 md:-ml-20 relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img
                src="https://placehold.co/1000x1200/f3f4f6/1f2937?text=European+Operations"
                alt="Logistics"
                className="w-full h-[300px] md:h-[600px] object-cover shadow-2xl"
              />
              <div className="absolute top-12 -right-12 bg-white border border-gray-100 p-12 hidden lg:block shadow-xl">
                <p className="text-gray-900 font-black text-sm uppercase leading-tight">
                  Portugal
                  <br />
                  France
                  <br />
                  Allemagne
                  <br />
                  Italie
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Expertise / Process ─── */}
      <section className="py-12 md:py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
            <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
              <h4 className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-6">
                {t("about:expertise.step1_num")}
              </h4>
              <p className="text-xl font-bold mb-4 uppercase">
                {t("about:expertise.step1_title")}
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                {t("about:expertise.step1_desc")}
              </p>
            </motion.div>
            <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
              <h4 className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-6">
                {t("about:expertise.step2_num")}
              </h4>
              <p className="text-xl font-bold mb-4 uppercase">
                {t("about:expertise.step2_title")}
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                {t("about:expertise.step2_desc")}
              </p>
            </motion.div>
            <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
              <h4 className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-6">
                {t("about:expertise.step3_num")}
              </h4>
              <p className="text-xl font-bold mb-4 uppercase">
                {t("about:expertise.step3_title")}
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                {t("about:expertise.step3_desc")}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── ImexMercado Shift ─── */}
      <section className="py-12 md:py-24 bg-gray-50/50">
        <div className="container mx-auto px-4">
          <motion.div
            {...fadeIn}
            className="bg-white rounded-3xl border-2 border-gray-200 shadow-xl overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Column: Text Content */}
              <div className="p-6 md:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-gray-100">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter mb-8 leading-tight">
                  {t("about:tomorrow.title_main")} <br />
                  <span className="text-primary">
                    {t("about:tomorrow.title_sub")}
                  </span>
                </h2>
                <div className="text-gray-500 text-lg leading-relaxed space-y-6 mb-10">
                  <p>{t("about:tomorrow.p1")}</p>
                  <p>{t("about:tomorrow.p2")}</p>
                </div>

                <Link
                  to="/boutique"
                  className="inline-flex items-center justify-center gap-4 bg-gray-900 text-white font-black uppercase tracking-widest px-8 py-4 text-sm rounded-none hover:bg-primary transition-all group w-fit"
                >
                  <span>{t("about:tomorrow.cta")}</span>
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-2 transition-transform"
                  />
                </Link>
              </div>

              {/* Right Column: Statistics Grid */}
              <div className="bg-gray-50/30 p-6 md:p-16 flex flex-col justify-center">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: t("about:stats.foundation"), val: "2012" },
                    { label: t("about:stats.countries"), val: "4" },
                    { label: t("about:stats.articles"), val: "500+" },
                    { label: t("about:stats.clients"), val: "10K+" },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="bg-white p-4 sm:p-6 md:p-8 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow group"
                    >
                      <p className="text-3xl font-black text-gray-900 group-hover:text-primary transition-colors">
                        {stat.val}
                      </p>
                      <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-400 mt-2">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
