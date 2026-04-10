import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, Globe, Lightbulb, Users, CheckCircle, ArrowRight, MapPin } from '@phosphor-icons/react';
import { EuropePresenceMap } from '../components/about/EuropePresenceMap';

export function AboutPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-primary/10">
      {/* ─── Breadcrumbs (Minimalist) ─── */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-4 md:py-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">
          <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
          <span className="text-gray-200">/</span>
          <span className="text-gray-900">Notre Maison</span>
        </div>
      </div>

      {/* ─── Header Section (Two Column Layout) ─── */}
      <header className="container mx-auto px-4 pt-6 pb-12 md:pt-12 md:pb-24 border-b border-gray-50">
        <motion.div 
          {...fadeIn}
          className="bg-white rounded-3xl border-2 border-gray-200 shadow-xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Column: Text Content */}
            <div className="p-6 md:p-16 flex flex-col justify-center relative overflow-hidden border-b lg:border-b-0 lg:border-r border-gray-100">
              {/* Subtle decorative background element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -mr-16 -mt-16 pointer-events-none opacity-50" />
              
              <h1 className="text-2xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-8 relative z-10">
                IMEXSULTING <br />
                <span className="text-primary italic-none">L'EXPERT IMPORT</span>
              </h1>
              <p className="text-base text-gray-500 max-w-2xl leading-relaxed font-medium relative z-10">
                Depuis 2012, nous bâtissons des ponts commerciaux invisibles mais robustes entre les marchés mondiaux et les foyers européens.
              </p>
            </div>
            
            {/* Right Column: Europe Map */}
            <div className="h-[250px] md:h-[400px] lg:h-auto overflow-hidden">
              <EuropePresenceMap />
            </div>
          </div>
        </motion.div>
      </header>

      {/* ─── Story Section (Pêle-Mêle Layout) ─── */}
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
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6">L’Origine | 2012</h2>
              <h3 className="text-3xl font-black text-gray-900 uppercase mb-8 leading-tight">
                Une vision née à Alhos Vedros
              </h3>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  Le 14 juin 2012, <strong className="text-gray-900 font-extrabold">IMEXSULTING - Comércio Geral Import & Export., Lda</strong> voyait le jour avec une ambition claire : normaliser l'excellence. Ce qui n'était au départ qu'une structure de négoce spécialisée au Portugal est rapidement devenu un pilier de l'import-export en Europe.
                </p>
                <p>
                  Installés stratégiquement à Alhos Vedros, nous avons passé la première décennie à perfectionner nos chaînes logistiques, à sélectionner des partenaires de confiance et à comprendre les besoins profonds d'un marché en constante mutation.
                </p>
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
                <p className="text-4xl font-black italic-none leading-none">12+</p>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-2">Années d’Expertise</p>
              </div>
            </motion.div>
          </div>

          {/* Block 2: Expansion (Asymmetric Offset) */}
          <div className="flex flex-col md:flex-row-reverse gap-12 md:gap-24 items-center mb-20 md:mb-40">
            <motion.div 
              className="w-full md:w-5/12"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6">Croissance | Europe</h2>
              <h3 className="text-3xl font-black text-gray-900 uppercase mb-8 leading-tight">
                Une empreinte sans frontières
              </h3>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  Grâce à une maîtrise pointue du <strong className="text-gray-900">Portugal</strong>, de la <strong className="text-gray-900">France</strong>, de l'<strong className="text-gray-900">Allemagne</strong> et de l'<strong className="text-gray-900">Italie</strong>, IMEXSULTING a su s'imposer comme un trait d'union entre les continents. Notre expertise ne s'arrête pas au transport de marchandises.
                </p>
                <p>
                  Nous analysons les marchés, nous certifions la conformité européenne de chaque référence et nous garantissons une qualité sans compromis. Ce sérieux nous a permis de livrer des milliers de professionnels avant de décider d'ouvrir nos services au plus grand nombre.
                </p>
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
                <p className="text-gray-900 font-black text-sm uppercase leading-tight">Portugal<br/>France<br/>Allemagne<br/>Italie</p>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ─── Expertise / Process (Dark Minimalist) ─── */}
      <section className="py-12 md:py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
            <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
              <h4 className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-6">01 / SÉLECTION</h4>
              <p className="text-xl font-bold mb-4 uppercase">Rigueur Absolue</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Nous ne nous contentons pas d'importer. Nous auditons les usines, testons les matériaux et rejetons 80% des produits qui ne répondent pas à nos critères de durabilité.
              </p>
            </motion.div>
            <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
              <h4 className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-6">02 / QUALITÉ</h4>
              <p className="text-xl font-bold mb-4 uppercase">Contrôle natif</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Chaque article passant par nos entrepôts d'Alhos Vedros subit une inspection finale. Votre satisfaction repose sur cette étape de vérification humaine et technique.
              </p>
            </motion.div>
            <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
              <h4 className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-6">03 / LIVRAISON</h4>
              <p className="text-xl font-bold mb-4 uppercase">Fiabilité Directe</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                En éliminant les intermédiaires inutiles, nous réduisons non seulement les coûts, mais aussi l'empreinte carbone et les risques de dommages durant le transit.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── ImexMercado Shift (The "Full" feeling) ─── */}
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
                  Demain se construit <br /> avec <span className="text-primary">ImexMercado</span>
                </h2>
                <div className="text-gray-500 text-lg leading-relaxed space-y-6 mb-10">
                  <p>
                    Pourquoi garder notre expertise pour les seuls professionnels ? C'est la question qui a donné naissance à <strong className="text-primary tracking-tight font-black underline decoration-primary/20 underline-offset-4">imexmercado.pt</strong>. Dans un monde saturé de produits jetables et d'intermédiaires, nous avons choisi la transparence.
                  </p>
                  <p>
                    Aujourd'hui, chaque particulier peut accéder au catalogue rigoureux d'IMEXSULTING avec les mêmes garanties de prix, de service et de qualité que les plus gros acteurs du négoce mondial.
                  </p>
                </div>
                
                <Link 
                  to="/boutique" 
                  className="inline-flex items-center justify-center gap-4 bg-gray-900 text-white font-black uppercase tracking-widest px-8 py-4 text-sm rounded-none hover:bg-primary transition-all group w-fit"
                >
                  <span>Explorer la Collection</span>
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>

              {/* Right Column: Statistics Grid */}
              <div className="bg-gray-50/30 p-6 md:p-16 flex flex-col justify-center">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Fondation", val: "2012" },
                    { label: "Pays", val: "4" },
                    { label: "Articles", val: "500+" },
                    { label: "Clients", val: "10K+" }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-4 sm:p-6 md:p-8 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                      <p className="text-3xl font-black text-gray-900 group-hover:text-primary transition-colors">{stat.val}</p>
                      <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-400 mt-2">{stat.label}</p>
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
