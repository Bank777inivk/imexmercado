/**
 * 🇵🇹 Script de remplissage automatique des champs PT dans Firestore
 * ─────────────────────────────────────────────────────────────────────
 * Se connecte avec les identifiants admin et remplit tous les champs PT.
 *
 * Usage : node scripts/fill-pt-translations.mjs
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import * as readline from 'readline';

// ─── Configuration Firebase ───────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: 'AIzaSyA5ZsTP7paJsxbb4r5wrHZC7YQqpY_e6YE',
  authDomain: 'imexmercado.firebaseapp.com',
  projectId: 'imexmercado',
  storageBucket: 'imexmercado.firebasestorage.app',
  messagingSenderId: '506532299687',
  appId: '1:506532299687:web:a9012d065689e8c8562c82',
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);
const auth = getAuth(app);

// ─── Traductions FR → PT ──────────────────────────────────────────────────────
const FR_TO_PT = {
  // PromoBar
  'Offre spéciale de lancement ! -20% sur tout le site':
    'Oferta especial de lançamento! -20% em todo o site',
  'OFFRE SPÉCIALE DE LANCEMENT ! -20% SUR TOUT LE SITE':
    'OFERTA ESPECIAL DE LANÇAMENTO! -20% EM TODO O SITE',

  // Hero Slider
  'HI-TECH': 'HI-TECH',
  'Le meilleur de la technologie': 'O melhor da tecnologia',
  'VOIR PLUS': 'VER MAIS',
  'OFFRE DE LANCEMENT': 'OFERTA DE LANÇAMENTO',
  "Jusqu'à 20% de réduction sur Téléphones & Hi-Tech":
    'Até 20% de desconto em Telemóveis & Hi-Tech',
  'VOIR LES PRODUITS': 'VER OS PRODUTOS',
  'COSY & DESIGN': 'ACOLHEDOR & DESIGN',
  'Transformez votre intérieur avec notre sélection Maison':
    'Transforme o seu interior com a nossa seleção Casa',
  'DÉCOUVRIR LA COLLECTION': 'DESCOBRIR A COLEÇÃO',
  'SAISON BBQ': 'ÉPOCA DE GRELHADOS',
  'Préparez vos soirées avec GrillMaster & Weber':
    'Prepare as suas noites com GrillMaster & Weber',
  'VOIR LES OFFRES': 'VER AS OFERTAS',

  // MainBanners
  'Collection Printemps — Été 2026': 'Coleção Primavera — Verão 2026',
  'Équipez votre jardin et vivez vos BBQ':
    'Equipe o seu jardim e viva os seus churrascos',
  "Découvrir l'univers Jardin →": 'Descobrir o universo Jardim →',
  'Offre Limitée — Stocks Réduits': 'Oferta Limitada — Stocks Reduzidos',
  "Jusqu'à -30% sur les smartphones et accessoires":
    'Até -30% nos smartphones e acessórios',
  'Explorer les offres Hi-Tech →': 'Explorar as ofertas Hi-Tech →',

  // MiniBanners
  "PROMOTION JUSQU'AU 21 AVRIL": 'PROMOÇÃO ATÉ 21 DE ABRIL',
  "Jusqu'à -15% sur l'outillage de Bricolage":
    'Até -15% em ferramentas de Bricolagem',
  'Promo Bricolage': 'Promo Bricolagem',
  'SÉLECTION MAISON': 'SELEÇÃO CASA',
  "Jusqu'à 55% de réduction directe": 'Até 55% de desconto direto',
  'Promo Maison': 'Promo Casa',

  // FlashSale
  'OFFRES DU JOUR': 'OFERTAS DO DIA',
  'Ventes Flash': 'Ofertas Flash',

  // TrustBar
  'Livraison Gratuite': 'Envio Gratuito',
  'Sur commande > €49.86': 'Para compras superiores a €49,86',
  'Protection Commande': 'Proteção de Encomenda',
  'Informations sécurisées': 'Informações seguras',
  'Paiement Sécurisé': 'Pagamento Seguro',
  'SSL + 3D Secure': 'SSL + 3D Secure',
  'Retour 30 Jours': 'Devolução em 30 Dias',
  'Remboursement garanti': 'Reembolso garantido',
  'Service Client': 'Apoio ao Cliente',
  'Réponse en moins de 24h': 'Resposta em menos de 24h',
  'Garantie 3 ans': 'Garantia de 3 anos',
  'Sur tous nos produits': 'Em todos os nossos produtos',
  'Protection Commande': 'Proteção de Encomenda',
  'Informations sécurisées': 'Informações seguras',

  // BlogBanner
  'Conseils et inspirations': 'Conselhos e inspirações',
  'NOS CONSEILS ET INSPIRATIONS': 'OS NOSSOS CONSELHOS E INSPIRAÇÕES',
  'Actualités, conseils et inspiration': 'Novidades, conselhos e inspiração',

  // PromoBlocks
  'SÉLECTION HI-TECH': 'SELEÇÃO HI-TECH',
  "Jusqu'à 60 % de réduction": 'Até 60% de desconto',
  'sur une sélection de smartphones reconditionnés':
    'numa seleção de smartphones recondicionados',
  'AMÉNAGEMENT JARDIN': 'JARDIM & CHURRASCO',
  "Jusqu'à 20 % de réduction": 'Até 20% de desconto',
  "sur notre gamme BBQ et salons d'extérieur":
    'na nossa gama de churrascos e jardins',
  'OFFRE BRICOLAGE': 'OFERTA BRICOLAGEM',
  "Jusqu'à 30 % de réduction": 'Até 30% de desconto',
  "sur l'outillage électroportatif professionnel":
    'em ferramentas elétricas profissionais',
  'PROMO MOBILIER': 'PROMO MOBILIÁRIO',
  '10 % avec code MAISON10': '10% com código CASA10',
  "à l'achat de 2 meubles ou canapés": 'na compra de 2 móveis ou sofás',

  // Newsletter
  'Restez dans la Boucle': 'Fique a Par de Tudo',
  'Offres exclusives, nouveautés et conseils directement dans votre boîte mail.':
    'Ofertas exclusivas, novidades e dicas diretamente no seu e-mail.',
  "M'abonner": 'Subscrever',
  'Abonnez-vous à notre Newsletter': 'Subscreva a nossa Newsletter',
  'Recevez les dernières offres, nouveautés et coupons de réduction directement dans votre boîte mail.':
    'Receba as últimas ofertas, novidades e cupões de desconto diretamente no seu e-mail.',
  "S'abonner": 'Subscrever',
  'Votre adresse e-mail': 'O seu endereço de e-mail',
};

function translate(text) {
  if (!text) return text;
  return FR_TO_PT[text] || text;
}

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

// ─── Logique principale ───────────────────────────────────────────────────────
async function fillPTTranslations() {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║   🇵🇹  Script de traduction PT — Firestore       ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  // Connexion avec les identifiants admin
  const email    = await ask('📧 Email admin : ');
  const password = await ask('🔑 Mot de passe : ');

  console.log('\n⏳ Connexion à Firebase...');
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Connecté !\n');
  } catch (err) {
    console.error('❌ Connexion échouée :', err.message);
    process.exit(1);
  }

  const ref  = doc(db, 'settings', 'homepage');
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    console.error('❌ Document settings/homepage introuvable !');
    process.exit(1);
  }

  const data = snap.data();
  let changes = 0;

  // ── 1. PromoBar ─────────────────────────────────────────────────
  if (data.promoBar && !data.promoBar.textPT) {
    data.promoBar.textPT = translate(data.promoBar.text);
    console.log(`✅ [PromoBar]    textPT = "${data.promoBar.textPT}"`);
    changes++;
  }

  // ── 2. Hero Slides ──────────────────────────────────────────────
  if (Array.isArray(data.heroSlides)) {
    data.heroSlides = data.heroSlides.map(slide => {
      const u = { ...slide };
      let c = false;
      if (!slide.titlePT)   { u.titlePT   = translate(slide.title);   c = true; }
      if (!slide.subtitlePT){ u.subtitlePT = translate(slide.subtitle); c = true; }
      if (!slide.ctaTextPT) { u.ctaTextPT  = translate(slide.ctaText);  c = true; }
      if (c) {
        console.log(`✅ [HeroSlide ${slide.id}]  titlePT="${u.titlePT}" | ctaTextPT="${u.ctaTextPT}"`);
        changes++;
      }
      return u;
    });
  }

  // ── 3. Main Banners ─────────────────────────────────────────────
  if (Array.isArray(data.mainBanners)) {
    data.mainBanners = data.mainBanners.map(b => {
      const u = { ...b };
      let c = false;
      if (!b.titlePT)   { u.titlePT   = translate(b.title);   c = true; }
      if (!b.subtitlePT){ u.subtitlePT = translate(b.subtitle); c = true; }
      if (!b.ctaTextPT) { u.ctaTextPT  = translate(b.ctaText);  c = true; }
      if (c) {
        console.log(`✅ [MainBanner ${b.id}]  titlePT="${u.titlePT}" | ctaTextPT="${u.ctaTextPT}"`);
        changes++;
      }
      return u;
    });
  }

  // ── 4. Mini Banners ─────────────────────────────────────────────
  if (Array.isArray(data.miniBanners)) {
    data.miniBanners = data.miniBanners.map(b => {
      const u = { ...b };
      let c = false;
      if (!b.labelPT)   { u.labelPT    = translate(b.label);    c = true; }
      if (!b.titlePT)   { u.titlePT    = translate(b.title);    c = true; }
      if (!b.subtitlePT){ u.subtitlePT = translate(b.subtitle); c = true; }
      if (c) {
        console.log(`✅ [MiniBanner ${b.id}]  labelPT="${u.labelPT}" | titlePT="${u.titlePT}"`);
        changes++;
      }
      return u;
    });
  }

  // ── 5. Flash Sale ───────────────────────────────────────────────
  if (data.flashSale && !data.flashSale.titlePT) {
    data.flashSale.titlePT = translate(data.flashSale.title);
    console.log(`✅ [FlashSale]   titlePT = "${data.flashSale.titlePT}"`);
    changes++;
  }

  // ── 6. Trust Bar ────────────────────────────────────────────────
  if (Array.isArray(data.trustBar)) {
    data.trustBar = data.trustBar.map(item => {
      const u = { ...item };
      let c = false;
      if (!item.titlePT)   { u.titlePT    = translate(item.title);    c = true; }
      if (!item.subtitlePT){ u.subtitlePT  = translate(item.subtitle); c = true; }
      if (c) {
        console.log(`✅ [TrustBar ${item.id}]  titlePT="${u.titlePT}" | subtitlePT="${u.subtitlePT}"`);
        changes++;
      }
      return u;
    });
  }

  // ── 7. Blog Banner ──────────────────────────────────────────────
  if (data.blogBanner && !data.blogBanner.titlePT) {
    data.blogBanner.titlePT = translate(data.blogBanner.title);
    console.log(`✅ [BlogBanner]  titlePT = "${data.blogBanner.titlePT}"`);
    changes++;
  }

  // ── 8. Promo Blocks ─────────────────────────────────────────────
  if (Array.isArray(data.promoBlocks)) {
    data.promoBlocks = data.promoBlocks.map(b => {
      const u = { ...b };
      let c = false;
      if (!b.titlePT)      { u.titlePT       = translate(b.title);       c = true; }
      if (!b.discountPT)   { u.discountPT     = translate(b.discount);    c = true; }
      if (!b.descriptionPT){ u.descriptionPT  = translate(b.description); c = true; }
      if (c) {
        console.log(`✅ [PromoBlock ${b.id}]  titlePT="${u.titlePT}" | discountPT="${u.discountPT}"`);
        changes++;
      }
      return u;
    });
  }

  // ── 9. Newsletter ───────────────────────────────────────────────
  if (data.newsletter) {
    let c = false;
    if (!data.newsletter.titlePT)       { data.newsletter.titlePT       = translate(data.newsletter.title);       c = true; }
    if (!data.newsletter.subtitlePT)    { data.newsletter.subtitlePT    = translate(data.newsletter.subtitle);    c = true; }
    if (!data.newsletter.buttonTextPT)  { data.newsletter.buttonTextPT  = translate(data.newsletter.buttonText);  c = true; }
    if (!data.newsletter.placeholder)   { data.newsletter.placeholder   = 'Votre adresse e-mail';                c = true; }
    if (!data.newsletter.placeholderPT) { data.newsletter.placeholderPT = 'O seu endereço de e-mail';            c = true; }
    if (c) {
      console.log(`✅ [Newsletter]  titlePT="${data.newsletter.titlePT}" | buttonTextPT="${data.newsletter.buttonTextPT}"`);
      changes++;
    }
  }

  // ── Résultat ─────────────────────────────────────────────────────
  if (changes === 0) {
    console.log('\nℹ️  Tous les champs PT sont déjà remplis. Rien à faire.\n');
    process.exit(0);
  }

  console.log(`\n💾 Sauvegarde de ${changes} section(s) dans Firestore...`);
  await setDoc(ref, data, { merge: true });

  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log(`║  🎉 Terminé ! ${String(changes).padEnd(2)} section(s) mises à jour en PT  ║`);
  console.log('╚══════════════════════════════════════════════════╝\n');
  process.exit(0);
}

fillPTTranslations().catch(err => {
  console.error('\n❌ Erreur :', err.message);
  process.exit(1);
});
