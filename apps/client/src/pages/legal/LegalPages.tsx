import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, ShieldCheck, Cookie, BookOpen, Truck, ArrowUUpLeft, Check } from '@phosphor-icons/react';

interface LegalLayoutProps {
  title: string;
  icon: React.ReactNode;
  lastUpdated: string;
  children: React.ReactNode;
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export function LegalLayout({ title, icon, lastUpdated, children }: LegalLayoutProps) {
  return (
    <div className="bg-bg min-h-screen py-8 md:py-16 selection:bg-primary/10">
      <div className="container mx-auto px-4">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black mb-6 md:mb-10 pl-2">
          <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">{title}</span>
        </div>

        <motion.div 
          {...fadeIn}
          className="bg-white rounded-3xl border-2 border-gray-200 shadow-xl overflow-hidden"
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
                Dernière mise à jour : {lastUpdated}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-16">
            <div className="legal-content space-y-8 md:space-y-12 text-gray-600 text-sm md:text-base leading-relaxed font-medium">
              {children}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   COMPONENTS
────────────────────────────────────────────────────────────────────────── */

export const LegalInfoPage = () => (
  <LegalLayout 
    title="Mentions Légales" 
    lastUpdated="12 Janvier 2024"
    icon={<BookOpen size={36} weight="duotone" />}
  >
    <section>
      <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4 border-l-4 border-primary pl-4">1. Éditeur du site</h2>
      <p>Le site Internet <strong>imexmercado.pt</strong> est édité par la société <strong>IMEXSULTING - Comércio Geral Import & Export., Lda</strong>.</p>
      <ul className="mt-4 space-y-2 pl-4 list-none">
        <li><strong>Forme juridique :</strong> Société à Responsabilité Limitée (Lda)</li>
        <li><strong>Capital social :</strong> 20 000,00 €</li>
        <li><strong>Siège social :</strong> Rua dos Girassóis, Nº 1 e 1A — 2860-274 Alhos Vedros — PORTUGAL</li>
        <li><strong>NIF (Numéro d'Identification Fiscale) :</strong> PT 510 236 789</li>
        <li><strong>Courriel :</strong> contact@imexmercado.pt</li>
        <li><strong>Directeur de la publication :</strong> Service Juridique Imexsulting</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4 border-l-4 border-primary pl-4">2. Hébergement</h2>
      <p>L'hébergement de ce site est assuré par la société <strong>Vercel Inc.</strong></p>
      <ul className="mt-4 space-y-2 pl-4 list-none">
        <li><strong>Adresse :</strong> 340 S Lemon Ave #1150, Walnut, CA 91789, États-Unis.</li>
        <li><strong>Infrastructure et bases de données :</strong> Hébergées en Union Européenne via les services de Google Cloud Platform (Francfort, Allemagne) via Firebase.</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4 border-l-4 border-primary pl-4">3. Propriété intellectuelle</h2>
      <p>La structure générale du site imexmercado.pt, ainsi que les textes, graphiques, images, sons et vidéos la composant, sont la propriété de l'éditeur ou de ses partenaires. Toute représentation et/ou reproduction et/ou exploitation partielle ou totale de ce site, par quelque procédé que ce soit, sans l'autorisation préalable et par écrit de la société IMEXSULTING Lda est strictement interdite et serait susceptible de constituer une contrefaçon.</p>
    </section>
  </LegalLayout>
);

export const PrivacyPage = () => (
  <LegalLayout 
    title="Politique de Confidentialité" 
    lastUpdated="03 Mars 2024"
    icon={<ShieldCheck size={36} weight="duotone" />}
  >
    <p>Chez ImexMercado, nous accordons une importance primordiale à la confidentialité et à la sécurité de vos données personnelles. La présente politique détaille notre engagement en matière de protection des données, conformément au Règlement Général sur la Protection des Données (RGPD).</p>

    <section>
      <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4 border-l-4 border-primary pl-4">1. Données collectées</h2>
      <p>Nous collectons et traitons les données suivantes :</p>
      <ul className="list-disc pl-8 mt-4 space-y-2 marker:text-primary">
        <li><strong>Données d'identification :</strong> Nom, prénom, adresse e-mail, numéro de téléphone.</li>
        <li><strong>Données de transaction :</strong> Adresses de facturation et de livraison, historique des commandes, détails des achats. <em>(Note : les données de paiement par carte bancaire ne sont jamais stockées sur nos serveurs ; elles sont sécurisées par Stripe).</em></li>
        <li><strong>Données de navigation :</strong> Adresses IP, type de navigateur, pages visitées (voir Politique des Cookies).</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4 border-l-4 border-primary pl-4">2. Finalités du traitement</h2>
      <p>Vos données sont strictement utilisées pour :</p>
      <ul className="list-disc pl-8 mt-4 space-y-2 marker:text-primary">
        <li>La gestion de vos commandes, expéditions et du service client financier.</li>
        <li>La création et la gestion de votre "Espace Membre IMEX".</li>
        <li>Le respect de nos obligations légales et comptables (édition de factures).</li>
        <li>L'envoi de communications marketing (uniquement si vous y avez explicitement consenti).</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4 border-l-4 border-primary pl-4">3. Durée de conservation</h2>
      <p>Les données personnelles sont conservées pendant une durée qui n’excède pas la durée nécessaire aux finalités pour lesquelles elles ont été collectées :</p>
      <ul className="list-disc pl-8 mt-4 space-y-2 marker:text-primary">
        <li>Données clients : 3 ans après le dernier achat.</li>
        <li>Pièces comptables (factures) : 10 ans, conformément au droit commercial portugais.</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4 border-l-4 border-primary pl-4">4. Vos Droits (RGPD)</h2>
      <p>Conformément à la directive européenne, vous disposez des droits suivants concernant vos données : droit d'accès, droit de rectification, droit à l'effacement (droit à l'oubli), droit à la portabilité, droit de limitation et droit d'opposition.</p>
      <p className="mt-4">
        Pour exercer ces droits, veuillez contacter le Délégué à la Protection des Données (DPO) à l'adresse <strong>contact@imexmercado.pt</strong>.
      </p>
    </section>
  </LegalLayout>
);

export const CookiesPage = () => (
  <LegalLayout 
    title="Politique des Cookies" 
    lastUpdated="15 Février 2024"
    icon={<Cookie size={36} weight="duotone" />}
  >
    <p>Lors de votre consultation du site imexmercado.pt, des informations relatives à la navigation de votre terminal sont susceptibles d'être enregistrées dans des fichiers "Cookies" installés sur votre terminal.</p>

    <section>
      <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4 border-l-4 border-primary pl-4">1. Qu'est-ce qu'un cookie ?</h2>
      <p>Un cookie est un petit fichier texte déposé sur votre ordinateur, tablette ou smartphone par les serveurs du site visité. Il contient plusieurs données qui permettent d'améliorer votre expérience de navigation.</p>
    </section>

    <section>
      <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4 border-l-4 border-primary pl-4">2. Les cookies que nous utilisons</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6 md:mt-8">
        <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm">Cookies Strictement Nécessaires</h3>
          </div>
          <p className="text-xs">Ces cookies sont indispensables au bon fonctionnement du site (maintien de la connexion, sauvegarde du panier en cours, sécurité Firebase). Ils ne nécessitent pas votre consentement préalable et ne peuvent pas être désactivés.</p>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm">Cookies Analytiques</h3>
          </div>
          <p className="text-xs">Ils nous permettent de connaître l'utilisation et les performances de notre site, d'établir des statistiques, des volumes de fréquentation pour en améliorer l'intérêt et l'ergonomie (ex: Google Analytics).</p>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-gray-100 shadow-sm md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm">Cookies Marketing & Personnalisation</h3>
          </div>
          <p className="text-xs">Ces cookies collectent des informations sur vos habitudes de navigation afin de vous proposer des publicités ou offres adaptées à vos centres d'intérêt, sur notre site ou en dehors.</p>
        </div>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4 border-l-4 border-primary pl-4 mt-12">3. Gestion de vos préférences</h2>
      <p>Vous pouvez à tout moment modifier vos choix concernant les cookies en cliquant sur l'icône de gestion des consentements en bas à gauche de votre écran. Vous pouvez également configurer votre logiciel de navigation de manière à ce que les cookies soient totalement rejetés par défaut.</p>
    </section>
  </LegalLayout>
);

export const CGVPage = () => (
  <LegalLayout 
    title="Conditions Générales de Vente" 
    lastUpdated="01 Janvier 2024"
    icon={<FileText size={36} weight="duotone" />}
  >
    <p>Les présentes Conditions Générales de Vente (CGV) régissent l'ensemble des relations commerciales entre IMEXSULTING Lda ("le Vendeur") et tout visiteur ou client ("l'Acheteur") effectuant un achat via le site web imexmercado.pt.</p>

    <section>
      <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4 border-l-4 border-primary pl-4 mt-12">Article 1 - Champ d'application</h2>
      <p>Ces CGV annulent et remplacent toutes les conditions antérieures. Elles s'appliquent à toutes les commandes de produits conclues via ImexMercado. L'Acheteur déclare avoir pris connaissance et accepté les présentes CGV avant de passer sa commande.</p>
    </section>

    <section>
      <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4 border-l-4 border-primary pl-4 mt-8">Article 2 - Prix</h2>
      <p>Les prix de nos produits sont indiqués en euros (€) Toutes Taxes Comprises (TTC) tenant compte de la TVA applicable au jour de la commande. Les frais de traitement et d'expédition ne sont pas inclus dans le prix initial et sont facturés en supplément avant validation finale.</p>
      <p className="mt-4">Pour les livraisons en Union Européenne, la TVA appliquée est celle en vigueur dans le pays de résidence de l'Acheteur (régime OSS).</p>
    </section>

    <section>
      <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4 border-l-4 border-primary pl-4 mt-8">Article 3 - Validation de commande</h2>
      <p>Toute commande passée sur le site constitue la formation d'un contrat conclu à distance. IMEXSULTING Lda se réserve le droit de ne pas enregistrer un paiement ou de ne pas confirmer une commande pour quelque raison que ce soit, notamment en cas de problème d'approvisionnement, ou de suspicion de fraude.</p>
    </section>

    <section>
      <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4 border-l-4 border-primary pl-4 mt-8">Article 4 - Droit de Rétractation</h2>
      <p>Conformément aux dispositions légales en vigueur au sein de l'Union Européenne, l'Acheteur dispose d'un délai de <strong>14 jours francs</strong> à compter de la réception de ses produits pour exercer son droit de rétractation sans avoir à justifier de motifs ni à payer de pénalités (hors frais de retour qui restent à sa charge).</p>
    </section>

    <section>
      <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4 border-l-4 border-primary pl-4 mt-8">Article 5 - Litiges et Droit applicable</h2>
      <p>En cas de litige, une solution amiable sera recherchée en priorité. À défaut, les tribunaux portugais (siège du Vendeur) seront seuls compétents, sauf disposition contraire d'ordre public européen protectrice du consommateur.</p>
      <p className="mt-4">Vous pouvez également utiliser la plateforme de Règlement en Ligne des Litiges (RLL) fournie par la Commission Européenne : <a href="https://ec.europa.eu/consumers/odr" className="text-primary hover:underline" target="_blank" rel="noreferrer">ec.europa.eu/consumers/odr</a>.</p>
    </section>
  </LegalLayout>
);

export const ShippingInfoPage = () => (
  <LegalLayout 
    title="Livraison & Expéditions" 
    lastUpdated="18 Février 2024"
    icon={<Truck size={36} weight="duotone" />}
  >
    <p>Nous savons que recevoir votre commande rapidement et en parfait état est votre priorité. Depuis notre centre logistique situé à Alhos Vedros (Portugal), nous orchestrons des livraisons rapides à travers toute l'Europe.</p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-8 md:mt-12 mb-8 md:mb-12">
      <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100 relative">
        <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl rounded-tr-xl">Le plus popualire</div>
        <h3 className="font-black text-gray-900 uppercase tracking-widest text-lg mb-2">Standard Europe</h3>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Via CTT ou DPD</p>
        <div className="text-3xl font-black text-gray-900 mb-6">4,99 € <span className="text-xs font-medium text-gray-500 normal-case">/ ou Gratuit {'>'} 150€</span></div>
        <ul className="space-y-3 text-sm">
          <li className="flex items-center gap-2"><Check size={16} className="text-green-500" weight="bold"/> Livraison en 3 à 5 jours ouvrés</li>
          <li className="flex items-center gap-2"><Check size={16} className="text-green-500" weight="bold"/> Numéro de suivi inclus</li>
          <li className="flex items-center gap-2"><Check size={16} className="text-green-500" weight="bold"/> Remise contre signature</li>
        </ul>
      </div>

      <div className="bg-gray-900 text-white rounded-2xl p-6 md:p-8 border border-gray-800 shadow-xl relative shadow-gray-900/10">
        <h3 className="font-black uppercase tracking-widest text-lg mb-2">Premium Express</h3>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Via DHL Express</p>
        <div className="text-3xl font-black mb-6">14,99 €</div>
        <ul className="space-y-3 text-sm text-gray-300">
          <li className="flex items-center gap-2"><Check size={16} className="text-primary" weight="bold"/> Livraison sous 24h à 48h MAX</li>
          <li className="flex items-center gap-2"><Check size={16} className="text-primary" weight="bold"/> Traitement prioritaire de la commande</li>
          <li className="flex items-center gap-2"><Check size={16} className="text-primary" weight="bold"/> Programmez l'heure de livraison</li>
        </ul>
      </div>
    </div>

    <section>
      <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4 border-l-4 border-primary pl-4">Délais de traitement</h2>
      <p>Toute commande passée avant 13h00 (Heure de Lisbonne, GMT) est préparée et expédiée le jour même. Les commandes passées le week-end ou lors d'un jour férié sont expédiées le jour ouvré suivant.</p>
    </section>
  </LegalLayout>
);

export const ReturnsInfoPage = () => (
  <LegalLayout 
    title="Politique de Retours" 
    lastUpdated="10 Décembre 2023"
    icon={<ArrowUUpLeft size={36} weight="duotone" />}
  >
    <p>Achetez en toute sérénité. Si un produit ne vous convient pas, vous disposez d'un délai légal européen de <strong>14 jours calendaires</strong> après la réception de votre commande pour changer d'avis.</p>

    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 mt-6 md:mt-10 mb-8 md:mb-12">
      <h3 className="font-black text-primary uppercase tracking-widest text-sm mb-4">Conditions nécessaires pour un retour valide :</h3>
      <ul className="space-y-3">
        <li className="flex items-start gap-4">
           <div className="bg-white rounded-full p-1 mt-0.5 shadow-sm text-primary"><Check size={12} weight="bold"/></div>
           <span>Le produit doit être <strong>neuf</strong>, n'ayant jamais été porté, lavé ou utilisé intensément.</span>
        </li>
        <li className="flex items-start gap-4">
           <div className="bg-white rounded-full p-1 mt-0.5 shadow-sm text-primary"><Check size={12} weight="bold"/></div>
           <span>Le produit doit être renvoyé dans son <strong>emballage d'origine intact</strong>, avec toutes les étiquettes et notices d'accompagnement.</span>
        </li>
      </ul>
    </div>

    <section className="mb-12">
      <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4 border-l-4 border-primary pl-4">La démarche étape par étape</h2>
      <ol className="list-decimal pl-6 space-y-4 marker:font-black marker:text-gray-400">
        <li>Connectez-vous à votre Espace Membre dans la section <strong>"Mes Commandes"</strong> et sélectionnez "Retourner un article".</li>
        <li>Imprimez l'étiquette de retour générée.</li>
        <li>Emballez soigneusement le produit et collez l'étiquette sur le carton.</li>
        <li>Déposez le colis dans le point relais ou bureau de poste (CTT/DPD) le plus proche.</li>
      </ol>
    </section>

    <section>
      <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4 border-l-4 border-primary pl-4">Remboursement & Frais</h2>
      <p>Une fois votre colis de retour reçu et inspecté dans notre entrepôt, vous serez notifié par e-mail. Si l'article respecte les conditions, <strong>le remboursement intégral de l'article sera émis sous 3 à 5 jours ouvrés</strong> via le mode de paiement original (Stripe / Carte / PayPal).</p>
      <p className="mt-4 text-xs font-bold uppercase tracking-widest text-gray-400">À noter : Sauf erreur de notre part (produit défectueux ou erreur de picking), les frais d'expédition du retour restent à la charge du client.</p>
    </section>
  </LegalLayout>
);
