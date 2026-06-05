import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  CaretDown,
  ChatTeardropText,
  Package,
  ArrowUUpLeft,
  Question,
  Globe,
} from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { useSEO } from "../hooks/useSEO";

function AccordionItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-100 rounded-2xl mb-4 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button
        className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-bold text-gray-900 pr-4 text-sm leading-snug">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-primary flex-shrink-0"
        >
          <CaretDown size={16} weight="bold" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-5 pt-0 text-gray-500 leading-relaxed text-[13px] border-t border-gray-50 mt-2">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQPage() {
  useSEO("faq");
  const { t } = useTranslation(["faq"]);

  const faqData = [
    {
      category: t("faq:categories.orders"),
      icon: <Package size={24} weight="duotone" className="text-primary" />,
      questions: [
        { q: t("faq:questions.q1"), a: t("faq:questions.a1") },
        { q: t("faq:questions.q2"), a: t("faq:questions.a2") },
        { q: t("faq:questions.q3"), a: t("faq:questions.a3") },
      ],
    },
    {
      category: t("faq:categories.shipping"),
      icon: <Globe size={24} weight="duotone" className="text-blue-500" />,
      questions: [
        { q: t("faq:questions.q4"), a: t("faq:questions.a4") },
        { q: t("faq:questions.q5"), a: t("faq:questions.a5") },
        { q: t("faq:questions.q6"), a: t("faq:questions.a6") },
      ],
    },
    {
      category: t("faq:categories.returns"),
      icon: (
        <ArrowUUpLeft size={24} weight="duotone" className="text-green-500" />
      ),
      questions: [
        { q: t("faq:questions.q7"), a: t("faq:questions.a7") },
        { q: t("faq:questions.q8"), a: t("faq:questions.a8") },
        { q: t("faq:questions.q9"), a: t("faq:questions.a9") },
      ],
    },
  ];

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  return (
    <div className="bg-bg min-h-screen font-sans selection:bg-primary/10 pb-24">
      {/* ─── Breadcrumbs ─── */}
      <div className="bg-white border-b border-gray-50">
        <div className="container mx-auto px-4 py-4 md:py-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">
          <Link to="/" className="hover:text-primary transition-colors">
            {t("faq:breadcrumb_home")}
          </Link>
          <span className="text-gray-200">/</span>
          <span className="text-gray-900">{t("faq:breadcrumb_current")}</span>
        </div>
      </div>

      {/* ─── Header Section ─── */}
      <header className="container mx-auto px-4 pt-6 mb-8 md:pt-12 md:mb-16">
        <motion.div
          {...fadeIn}
          className="bg-white rounded-3xl border-2 border-gray-200 shadow-xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Column: Text Content */}
            <div className="p-6 md:p-16 flex flex-col justify-center relative overflow-hidden border-b lg:border-b-0 lg:border-r border-gray-100">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -mr-16 -mt-16 pointer-events-none opacity-50" />
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 text-primary shadow-inner">
                <Question size={32} weight="duotone" />
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-6 relative z-10">
                {t("faq:title_prefix")} <br />
                <span className="text-primary italic-none">
                  {t("faq:title_accent")}
                </span>
              </h1>
              <p className="text-base text-gray-500 max-w-xl leading-relaxed font-medium relative z-10">
                {t("faq:description")}
              </p>
            </div>

            {/* Right Column: Tracking Link */}
            <div className="bg-gray-50/50 p-6 md:p-16 flex flex-col justify-center items-center text-center">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-sm w-full">
                <h3 className="font-bold text-gray-900 mb-2">
                  {t("faq:quick_tracking.title")}
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  {t("faq:quick_tracking.desc")}
                </p>
                <Link
                  to="/suivi-commande"
                  className="block w-full bg-gray-900 text-white font-black uppercase tracking-widest py-3 text-xs rounded hover:bg-primary transition-all text-center"
                >
                  {t("faq:quick_tracking.cta")}
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      {/* ─── FAQ & CTA Unified Card ─── */}
      <section className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl border-2 border-gray-200 shadow-xl overflow-hidden"
        >
          {/* FAQ 3-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
            {faqData.map((category, idx) => (
              <div key={idx} className="p-6 md:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    {category.icon}
                  </div>
                  <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight leading-tight">
                    {category.category}
                  </h2>
                </div>
                <div className="space-y-4">
                  {category.questions.map((q, qIdx) => (
                    <AccordionItem key={qIdx} question={q.q} answer={q.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Footer */}
          <div className="bg-gray-900 p-8 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-4">
                  {t("faq:cta_bottom.title_prefix")}{" "}
                  <span className="text-primary">
                    {t("faq:cta_bottom.title_accent")}
                  </span>
                </h3>
                <p className="text-gray-400 font-medium">
                  {t("faq:cta_bottom.desc")}
                </p>
              </div>
              <Link
                to="/contact"
                className="flex-shrink-0 inline-flex items-center gap-3 bg-primary text-white font-black uppercase tracking-widest px-8 py-4 rounded-none hover:bg-white hover:text-gray-900 transition-colors group"
              >
                <ChatTeardropText size={20} weight="fill" />
                <span>{t("faq:cta_bottom.cta")}</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
