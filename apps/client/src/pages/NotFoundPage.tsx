import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { House, ShoppingBag, WarningOctagon } from "@phosphor-icons/react";

export function NotFoundPage() {
  return (
    <div className="bg-[#0C0E12] min-h-screen text-white flex flex-col justify-center items-center px-6 relative overflow-hidden font-sans">
      {/* Decorative Grid & Blur Backgrounds */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md w-full text-center relative z-10 space-y-8"
      >
        {/* Animated Premium Icon Container */}
        <div className="flex justify-center">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="inline-flex bg-gradient-to-br from-[#1E222B] to-[#12141C] border border-[#2A2E3D] text-[#FF5A36] w-20 h-20 rounded-2xl items-center justify-center shadow-2xl shadow-[#FF5A36]/10"
          >
            <WarningOctagon size={40} weight="duotone" />
          </motion.div>
        </div>

        {/* Error Code & Status label */}
        <div className="space-y-3">
          <h1 className="text-[110px] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-[#3A3F50] leading-none select-none">
            404
          </h1>
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#FF5A36] bg-[#FF5A36]/10 px-3 py-1 rounded-full inline-block">
            Page non trouvée
          </p>
        </div>

        {/* Description Text */}
        <p className="text-gray-400 text-[14px] leading-relaxed max-w-sm mx-auto font-medium px-4">
          La page demandée est indisponible momentanément. Nous vous invitons à
          poursuivre votre navigation vers l'accueil ou notre boutique
          officielle.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 px-4">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-white text-gray-950 text-[11px] font-black uppercase tracking-wider px-6 py-4 rounded-xl hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-white/5"
          >
            <House size={16} weight="bold" />
            Accueil
          </Link>
          <Link
            to="/boutique"
            className="flex items-center justify-center gap-2 bg-[#171921] border border-[#2B2F3D] text-white text-[11px] font-black uppercase tracking-wider px-6 py-4 rounded-xl hover:bg-[#1F232E] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <ShoppingBag size={16} weight="bold" />
            Boutique
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
