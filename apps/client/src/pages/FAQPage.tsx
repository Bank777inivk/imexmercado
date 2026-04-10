import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CaretDown, ChatTeardropText, Package, ArrowUUpLeft, Question } from '@phosphor-icons/react';

const faqData = [
  {
    category: "Commandes & Suivi",
    icon: <Package size={24} weight="duotone" className="text-primary" />,
    questions: [
      {
        q: "Comment puis-je suivre ma commande ?",
        a: "Une fois votre commande expédiée, vous recevrez un e-mail avec un lien de suivi. Vous pouvez également consulter l'état de votre commande sur notre page de Suivi de commande en utilisant votre numéro de commande et votre adresse e-mail."
      },
      {
        q: "Puis-je modifier ou annuler ma commande ?",
        a: "Les commandes sont traitées rapidement pour assurer des délais de livraison optimaux. Si vous avez fait une erreur, contactez notre service client dans l'heure suivant votre commande. Au-delà, l'expédition ne pourra généralement plus être interrompue."
      },
      {
        q: "Pourquoi n'ai-je pas reçu de confirmation de commande ?",
        a: "Vérifiez d'abord votre dossier Courrier indésirable (Spam). Si vous ne trouvez rien, il y a peut-être eu une erreur typographique dans votre adresse e-mail. Contactez-nous et nous vous renverrons la confirmation."
      }
    ]
  },
  {
    category: "Livraison",
    icon: <Globe size={24} weight="duotone" className="text-blue-500" />,
    questions: [
      {
        q: "Quels sont les délais de livraison ?",
        a: "Les délais varient selon le pays de destination. Pour le Portugal, comptez généralement 2 à 3 jours ouvrés. Pour le reste de l'Europe (France, Allemagne, Italie), les délais standard sont de 4 à 7 jours ouvrés."
      },
      {
        q: "Quels transporteurs utilisez-vous ?",
        a: "Nous travaillons avec un réseau de transporteurs fiables pour garantir la sécurité de vos colis. Selon votre localisation, votre commande peut être livrée par CTT, DHL, DPD ou d'autres partenaires reconnus."
      },
      {
        q: "Proposez-vous la livraison express ?",
        a: "Oui, la livraison express via DHL (24h-48h) est disponible lors du passage en caisse pour la plupart des destinations européennes, moyennant des frais supplémentaires."
      }
    ]
  },
  {
    category: "Retours & Remboursements",
    icon: <ArrowUUpLeft size={24} weight="duotone" className="text-green-500" />,
    questions: [
      {
        q: "Quelle est votre politique de retour ?",
        a: "Vous disposez de 14 jours calendaires après la réception de votre colis pour changer d'avis et nous retourner un produit. L'article doit être dans son emballage d'origine, non utilisé et en parfait état de revente."
      },
      {
        q: "Les frais de retour sont-ils à ma charge ?",
        a: "Les frais de retour sont à la charge du client, sauf en cas d'erreur de notre part ou de produit défectueux à la réception."
      },
      {
        q: "Quand serai-je remboursé ?",
        a: "Une fois votre retour reçu et inspecté par nos équipes à Alhos Vedros, le remboursement sera effectué sous 3 à 5 jours ouvrés sur le moyen de paiement utilisé lors de la commande."
      }
    ]
  }
];

// Reusing the Globe icon here since it's not imported at the top level
import { Globe } from '@phosphor-icons/react';

function AccordionItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-100 rounded-2xl mb-4 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button 
        className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-bold text-gray-900 pr-4 text-sm leading-snug">{question}</span>
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
            animate={{ height: 'auto', opacity: 1 }}
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
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="bg-bg min-h-screen font-sans selection:bg-primary/10 pb-24">
      {/* ─── Breadcrumbs ─── */}
      <div className="bg-white border-b border-gray-50">
        <div className="container mx-auto px-4 py-4 md:py-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">
          <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
          <span className="text-gray-200">/</span>
          <span className="text-gray-900">Centre d'aide (FAQ)</span>
        </div>
      </div>

      {/* ─── Header Section (Premium Card) ─── */}
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
                Comment pouvons-nous <br />
                <span className="text-primary italic-none">vous aider ?</span>
              </h1>
              <p className="text-base text-gray-500 max-w-xl leading-relaxed font-medium relative z-10">
                Retrouvez ici les réponses aux questions les plus fréquentes. Notre centre d'aide est conçu pour vous offrir une assistance rapide et transparente.
              </p>
            </div>
            
            {/* Right Column: Decorative Callout or Search */}
            <div className="bg-gray-50/50 p-6 md:p-16 flex flex-col justify-center items-center text-center">
               <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-sm w-full">
                 <h3 className="font-bold text-gray-900 mb-2">Suivi rapide</h3>
                 <p className="text-sm text-gray-500 mb-6">Accédez directement au statut de votre commande avec votre numéro IMX.</p>
                 <Link 
                   to="/suivi-commande" 
                   className="block w-full bg-gray-900 text-white font-black uppercase tracking-widest py-3 text-xs rounded hover:bg-primary transition-all text-center"
                 >
                   Suivre mon colis
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

          {/* CTA Footer (Spans full width) */}
          <div className="bg-gray-900 p-8 md:p-16 relative overflow-hidden">
             {/* Abstract Decoration */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
               <div>
                  <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-4">
                    Vous ne trouvez pas <span className="text-primary">votre réponse ?</span>
                  </h3>
                  <p className="text-gray-400 font-medium">
                    Notre équipe d'experts à Alhos Vedros est à votre disposition pour vous accompagner dans vos démarches.
                  </p>
               </div>
               <Link 
                  to="/contact" 
                  className="flex-shrink-0 inline-flex items-center gap-3 bg-primary text-white font-black uppercase tracking-widest px-8 py-4 rounded-none hover:bg-white hover:text-gray-900 transition-colors group"
               >
                  <ChatTeardropText size={20} weight="fill" />
                  <span>Nous Contacter</span>
               </Link>
             </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
