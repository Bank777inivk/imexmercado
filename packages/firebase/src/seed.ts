import { getDocs, collection, deleteDoc, query, where } from "firebase/firestore";
import { db } from "./config";
import { setDocument } from "./firestore";

// Helper function to build a structured product
const makeProduct = (
  id: string,
  name: string,
  category: string,
  brand: string,
  price: number,
  oldPrice: number | null,
  badge: string | null,
  image: string,
  stock: number,
  description: string,
  specs: {key: string, value: string}[]
) => {
  return {
    id,
    name,
    category,
    brand,
    price,
    oldPrice,
    badge,
    isFlashSale: Math.random() > 0.7,
    isTrending: Math.random() > 0.5,
    isSelection: true,
    isNew: Math.random() > 0.6,
    featured: true,
    rating: (Math.random() * (5 - 4.2) + 4.2).toFixed(1),
    reviewCount: Math.floor(Math.random() * 250) + 12,
    stock,
    description,
    image,
    images: [],
    tags: [category.split(' ')[0].toLowerCase(), brand.toLowerCase(), "premium"],
    specs,
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const CONCRETE_PRODUCTS = [
  // 1. Téléphones & Hi-Tech
  makeProduct(
    "tech-iphone-15-pro-max",
    "Apple iPhone 15 Pro Max - 256Go Titane",
    "Téléphones & Hi-Tech",
    "Apple",
    1479.00, 1599.00, "-7%",
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800",
    15,
    "Le nouveau bijou d'Apple forgé en titane. Équipé de la puce A17 Pro pour des performances gaming inouïes et un système photo révolutionnaire.",
    [{key:"Écran", value:"Super Retina XDR 6.7\""}, {key:"Puce", value:"A17 Pro"}, {key:"Caméra", value:"48 Mpx - Zoom optique 5x"}]
  ),
  makeProduct(
    "tech-samsung-s24-ultra",
    "Samsung Galaxy S24 Ultra - IA Intégrée",
    "Téléphones & Hi-Tech",
    "Samsung",
    1349.99, 1469.00, "-8%",
    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=800",
    25,
    "Repoussez les limites de la créativité avec la Galaxy AI intégrée et son stylet S-Pen ultra-précis.",
    [{key:"Écran", value:"Dynamic AMOLED 2X 6.8\""}, {key:"Caméra", value:"200 Mpx"}, {key:"Batterie", value:"5000 mAh"}]
  ),
  makeProduct(
    "tech-sony-wh1000xm5",
    "Casque SONY WH-1000XM5 Réduction Bruit Actif",
    "Téléphones & Hi-Tech",
    "Sony",
    349.00, 419.00, "PROMO",
    "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800",
    42,
    "La référence absolue en matière de réduction de bruit. Profitez de votre musique de manière isolée avec 30h d'autonomie.",
    [{key:"Type", value:"Circum-auriculaire"}, {key:"Autonomie", value:"30 heures"}, {key:"Poids", value:"250g"}]
  ),
  makeProduct(
    "tech-macbook-pro-m3",
    "MacBook Pro 14\" - Puce M3 Pro",
    "Téléphones & Hi-Tech",
    "Apple",
    2249.00, null, "Nouveau",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
    8,
    "La machine de rêve pour les créatifs. Des performances graphiques à couper le souffle avec la nouvelle puce M3.",
    [{key:"Processeur", value:"M3 Pro 11 coeurs"}, {key:"RAM", value:"18 Go unifiée"}, {key:"Stockage", value:"512 Go SSD"}]
  ),

  // 2. Maison & Décoration
  makeProduct(
    "deco-roborock-s8",
    "Aspirateur Robot Roborock S8 Pro Ultra",
    "Maison & Décoration",
    "Roborock",
    1199.00, 1499.00, "-20%",
    "https://images.unsplash.com/photo-1589923158776-cb4485d99fd6?auto=format&fit=crop&q=80&w=800",
    12,
    "L'automatisation totale de l'entretien de vos sols. Il nettoie, lave, se vide et nettoie ses propres serpillières !",
    [{key:"Puissance", value:"6000 Pa"}, {key:"Navigation", value:"LiDAR + IA 3D"}, {key:"Station", value:"Autovidage Eau/Poussière"}]
  ),
  makeProduct(
    "deco-dyson-purifier",
    "Purificateur Dyson Purifier Cool Gen1",
    "Maison & Décoration",
    "Dyson",
    499.00, 549.00, "-9%",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
    35,
    "Capture 99,95% des poussières fines. Respirez un air purifié dans votre foyer grâce à la technologie légendaire Dyson.",
    [{key:"Filtre", value:"HEPA H13"}, {key:"Fonction", value:"Ventilation + Purification"}, {key:"Idéal pour", value:"Allergies"}]
  ),
  makeProduct(
    "deco-miroir-scandi",
    "Miroir Mural Rond Design Scandinave",
    "Maison & Décoration",
    "HomeDecor",
    129.90, null, null,
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    50,
    "Un miroir épuré avec un cadre fin en chêne massif naturel. Agrandit visuellement votre pièce tout en apportant une touche de chaleur.",
    [{key:"Diamètre", value:"80 cm"}, {key:"Matériau", value:"Chêne massif & Verre"}, {key:"Poids", value:"5.2 kg"}]
  ),
  makeProduct(
    "deco-vase-ceramique",
    "Vase Artisanal en Céramique Noire",
    "Maison & Décoration",
    "ArtGallery",
    45.00, null, "TOP",
    "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=800",
    80,
    "Façonné à la main, ce vase minimaliste apporte une touche d'élégance brute à votre mobilier contemporain.",
    [{key:"Finition", value:"Mat Texturé"}, {key:"Hauteur", value:"35 cm"}, {key:"Origine", value:"Fabriqué au Portugal"}]
  ),

  // 3. Meubles & Lampes
  makeProduct(
    "furn-sofa-oslo",
    "Canapé 3 Places Gris Oslo Velours",
    "Meubles & Lampes",
    "Nordic",
    649.00, 799.00, "-18%",
    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800",
    6,
    "Un confort irrésistible associé à des lignes épurées. Ce canapé en velours déperlant est la pièce maîtresse idéale pour un salon chaleureux.",
    [{key:"Revêtement", value:"Velours côtelé"}, {key:"Assise", value:"Mousse HR 35kg/m3"}, {key:"Places", value:"3"}]
  ),
  makeProduct(
    "furn-table-chêne",
    "Table à Manger Chêne Massif Industriel",
    "Meubles & Lampes",
    "Oakwood",
    499.00, null, null,
    "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=800",
    14,
    "Mélange parfait de bois naturel et de pieds en métal noir. Conçue pour accueillir chaleureusement vos grands dîners en famille.",
    [{key:"Dimensions", value:"200 x 90 cm"}, {key:"Capacité", value:"8 à 10 personnes"}, {key:"Matière", value:"Chêne massif et Acier"}]
  ),
  makeProduct(
    "furn-lampe-suspension",
    "Suspension Lumineuse LED Halo",
    "Meubles & Lampes",
    "Lumina",
    189.90, 229.00, "PROMO",
    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800",
    22,
    "Une suspension aérienne en forme d'anneau LED qui plonge votre salle à manger dans une ambiance lumineuse tamisée et moderne.",
    [{key:"Technologie", value:"LED Intégrée"}, {key:"Couleur", value:"Laiton Mat"}, {key:"Puissance", value:"45W (équivalent 200W)"}]
  ),
  makeProduct(
    "furn-chaise-ergo",
    "Chaise de Bureau Ergonomique Ultra Pro",
    "Meubles & Lampes",
    "ComfortPro",
    259.00, null, null,
    "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=800",
    45,
    "Prenez soin de votre dos. Soutien lombaire ajustable, accoudoirs 4D et tissu respirant pour de longues journées de productivité sans douleurs.",
    [{key:"Soutien", value:"Lombaire Réglable"}, {key:"Dossier", value:"Mesh Respirant"}, {key:"Charge Max", value:"130 kg"}]
  ),

  // 4. Bricolage
  makeProduct(
    "diy-bosch-perceuse",
    "Perceuse Visseuse Bosch Professional 18V",
    "Bricolage",
    "Bosch",
    199.90, 249.00, "-20%",
    "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800",
    30,
    "Puissance et endurance légendaires. Vendue avec 2 batteries au lithium et sa mallette de rangement antichoc. Prête pour tous vos chantiers.",
    [{key:"Tension", value:"18 Volts"}, {key:"Batteries", value:"Incluses (x2) 4Ah"}, {key:"Moteur", value:"Brushless (Sans Charbon)"}]
  ),
  makeProduct(
    "diy-scie-makita",
    "Scie Circulaire Makita 1200W",
    "Bricolage",
    "Makita",
    145.00, null, null,
    "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80&w=800",
    20,
    "Des coupes droites et propres à chaque fois. Extrêmement maniable pour toutes vos découpes de précision sur le bois de charpente.",
    [{key:"Puissance", value:"1200 Watts"}, {key:"Lame", value:"190 mm"}, {key:"Poids", value:"4.0 kg"}]
  ),
  makeProduct(
    "diy-coffret-outils",
    "Coffret Outillage Pro 108 Pièces",
    "Bricolage",
    "Magnusson",
    89.00, 119.00, "-25%",
    "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&q=80&w=800",
    65,
    "Le kit indispensable contenant cliquets, douilles, clés plates et embouts en acier forgé Chrome Vanadium Ultra-Résistant.",
    [{key:"Matériau", value:"Chrome Vanadium"}, {key:"Pièces", value:"108"}, {key:"Garantie", value:"À Vie"}]
  ),

  // 5. Barbecues & Planchas
  makeProduct(
    "bbq-weber-master",
    "Barbecue Charbon Weber Master-Touch GBS",
    "Barbecues & Planchas",
    "Weber",
    329.00, null, "TOP",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800",
    40,
    "L'icône des barbecues. Grille de cuisson Gourmet BBQ System pour varier les plaisirs : saisissez, rôtissez et fumez comme un chef.",
    [{key:"Énergie", value:"Charbon"}, {key:"Diamètre Grille", value:"57 cm"}, {key:"Thermomètre", value:"Intégré au couvercle"}]
  ),
  makeProduct(
    "bbq-plancha-gas",
    "Plancha Gaz Forge Adour Modern 60",
    "Barbecues & Planchas",
    "Forge Adour",
    549.90, 629.00, "-12%",
    "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&q=80&w=800",
    18,
    "L'excellence de la cuisson à la plancha avec sa plaque en fonte émaillée très résistante et facile à nettoyer. Deux brûleurs puissants indépendants.",
    [{key:"Plaque", value:"Fonte Émaillée"}, {key:"Brûleurs", value:"2 x 3.5 kW"}, {key:"Personnes", value:"8 à 10 convives"}]
  ),
  makeProduct(
    "bbq-ustensiles",
    "Mallette 16 Ustensiles Inox BBQ",
    "Barbecues & Planchas",
    "SmokeKing",
    59.00, 75.00, "PROMO",
    "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&q=80&w=800",
    120,
    "Tout le nécessaire pour maitriser vos grillades, présenté dans sa mallette en aluminium robuste. Idéal en cadeau !",
    [{key:"Matière", value:"Acier Inoxydable massif"}, {key:"Entretien", value:"Compatible Lave-Vaisselle"}, {key:"Étui", value:"Aluminium"}]
  ),

  // 6. Piscines & Spas
  makeProduct(
    "pool-spa-intex",
    "Spa Gonflable Intex PureSpa Bulles 4 Places",
    "Piscines & Spas",
    "Intex",
    429.00, 499.00, "-14%",
    "https://images.unsplash.com/photo-1560662105-57f8ad6ae2d1?auto=format&fit=crop&q=80&w=800",
    25,
    "Installez votre espace détente en 20 minutes seulement ! 120 diffuseurs à bulles et chauffage rapide jusqu'à 40°C pour vous détendre.",
    [{key:"Capacité", value:"4 Adultes"}, {key:"Diffusoirs", value:"120 Bulles Massantes"}, {key:"Couverture", value:"Thermique incluse"}]
  ),
  makeProduct(
    "pool-piscine-tube",
    "Piscine Tubulaire Rectangulaire Power Steel",
    "Piscines & Spas",
    "Bestway",
    589.00, null, null,
    "https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?auto=format&fit=crop&q=80&w=800",
    10,
    "Assez grande pour toute la famille. Structure en acier anticorrosion et liner ultra résistant en Tritech. Échelle de sécurité et filtre inclus.",
    [{key:"Dimensions", value:"4.12 x 2.01 x 1.22 m"}, {key:"Volume d'eau", value:"8124 Litres"}, {key:"Montage", value:"30 minutes sans outils"}]
  ),
  makeProduct(
    "pool-robot-zodiac",
    "Robot Nettoyeur Automatique Zodiac MX8",
    "Piscines & Spas",
    "Zodiac",
    399.00, 459.00, "-13%",
    "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?auto=format&fit=crop&q=80&w=800",
    35,
    "Oubliez la corvée du nettoyage d'été. Sa navigation X-Drive redoutable grimpe aux parois de votre bassin sans effort.",
    [{key:"Type", value:"Hydraulique Aspirant"}, {key:"Parois", value:"Grimpe sur tous les revêtements"}, {key:"Débit requis", value:"Minimum 8m3/h"}]
  )
];

const TESTIMONIALS_COUNT = 90;

const ptFirstNames = ['João', 'Maria', 'António', 'Ana', 'Manuel', 'Isabel', 'José', 'Catarina', 'Rui', 'Beatriz', 'Pedro', 'Sofia', 'Ricardo', 'Mariana', 'Nuno', 'Inês', 'Miguel', 'Leonor', 'Tiago', 'Diana'];
const ptLastNames = ['Santos', 'Silva', 'Ferreira', 'Pereira', 'Oliveira', 'Costa', 'Rodrigues', 'Martins', 'Lopes', 'Gomes'];
const ptCities = ['Lisboa', 'Porto', 'Vila Nova de Gaia', 'Amadora', 'Braga', 'Funchal', 'Coimbra', 'Setúbal', 'Agualva-Cacém', 'Queluz'];

const ptFeedbackTemplates = [
  { text: "Excelente compra! A qualidade é top para a minha sala.", category: "Maison & Décoration" },
  { text: "Entrega ultra rápida, o smartphone é impecável. Obrigado!", category: "Téléphones & Hi-Tech" },
  { text: "O churrasco funciona às mil maravilhas, venha o verão.", category: "Barbecues & Planchas" },
  { text: "Ferramenta robusta e eficaz para as minhas obras.", category: "Bricolage" },
  { text: "A mesa é magnífica, a madeira é de ótima qualidade.", category: "Meubles & Lampes" },
  { text: "Piscina instalada em 2h, os miúdos estão radiantes!", category: "Piscines & Spas" },
  { text: "Excelente relação qualidade/preço neste pack hi-tech.", category: "Téléphones & Hi-Tech" },
  { text: "Apoio ao cliente fantástico para me ajudar.", category: "Meubles & Lampes" },
  { text: "Finalmente uma placa que aquece uniformemente. Top!", category: "Barbecues & Planchas" },
  { text: "Decoração requintada, muda tudo no meu quarto.", category: "Maison & Décoration" },
];

export const seedTestimonials = async () => {
  const generated: any[] = [];
  
  for (let i = 0; i < TESTIMONIALS_COUNT; i++) {
    const fName = ptFirstNames[Math.floor(Math.random() * ptFirstNames.length)];
    const lName = ptLastNames[Math.floor(Math.random() * ptLastNames.length)];
    const city = ptCities[Math.floor(Math.random() * ptCities.length)];
    const template = ptFeedbackTemplates[Math.floor(Math.random() * ptFeedbackTemplates.length)];
    
    generated.push({
      id: `tst-pt-${i}`, 
      name: `${fName} ${lName}`,
      location: city,
      text: template.text,
      category: template.category,
      rating: 5,
      image: `https://i.pravatar.cc/150?u=pt-${i}`,
      createdAt: new Date().toISOString(),
    });
  }

  console.log(`📝 SEEDING TESTIMONIALS: ${generated.length} avis portugais en cours...`);
  
  const chunkSize = 10;
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  for (let i = 0; i < generated.length; i += chunkSize) {
    const chunk = generated.slice(i, i + chunkSize);
    try {
      await Promise.all(chunk.map(t => setDocument("testimonials", t.id, t)));
      console.log(`✅ Avis ${i + chunk.length}/${generated.length} envoyés`);
      if (i + chunkSize < generated.length) await delay(100);
    } catch (err) {
      console.error(`❌ Erreur avis index ${i}:`, err);
    }
  }

  console.log("✅ TESTIMONIALS PORTUGAL OK !");
};

export const clearDatabase = async () => {
  console.log("🧹 DÉBUT DU NETTOYAGE : Analyse de la base produits uniquement...");
  
  const productsDocs = await getDocs(collection(db, "products"));
  
  const allDocs = [...productsDocs.docs];
  console.log(`🗑️ ${allDocs.length} produits à supprimer au total...`);

  const chunkSize = 20;
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  for (let i = 0; i < allDocs.length; i += chunkSize) {
    const chunk = allDocs.slice(i, i + chunkSize);
    try {
      await Promise.all(chunk.map(docSnap => deleteDoc(docSnap.ref)));
      console.log(`♻️ Nettoyage : ${i + chunk.length}/${allDocs.length} supprimés`);
      if (i + chunkSize < allDocs.length) {
        await delay(100); 
      }
    } catch (err) {
      console.error(`❌ Erreur lors de la suppression du chunk à l'index ${i}:`, err);
      throw err; 
    }
  }

  console.log("✨ BASE DE DONNÉES ENTIÈREMENT NETTOYÉE !");
};

// ─── CATEGORIES SEEDING ───────────────────────────────────────────────────────

const DEFAULT_CATEGORIES = [
  { id: 'cat-tech', name: 'Téléphones & Hi-Tech', short: 'Tech', order: 1, isActive: true, hasSubmenu: true },
  { id: 'cat-maison', name: 'Maison & Décoration', short: 'Maison', order: 2, isActive: true, hasSubmenu: true },
  { id: 'cat-meubles', name: 'Meubles & Lampes', short: 'Meubles', order: 3, isActive: true, hasSubmenu: true },
  { id: 'cat-brico', name: 'Bricolage', short: 'Brico', order: 4, isActive: true, hasSubmenu: false },
  { id: 'cat-bbq', name: 'Barbecues & Planchas', short: 'BBQ', order: 5, isActive: true, hasSubmenu: false },
  { id: 'cat-piscines', name: 'Piscines & Spas', short: 'Piscines', order: 6, isActive: true, hasSubmenu: false },
];

export const seedCategories = async () => {
  console.log("🌱 SEEDING CATEGORIES...");
  
  // Clear existing categories
  const snapshot = await getDocs(collection(db, "categories"));
  await Promise.all(snapshot.docs.map(doc => deleteDoc(doc.ref)));
  
  // Seed defaults
  await Promise.all(DEFAULT_CATEGORIES.map(cat => 
    setDocument("categories", cat.id, {
      ...cat,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  ));
  
  console.log("✅ CATEGORIES SEEDED !");
};

export const seedProducts = async () => {
  await clearDatabase();
  
  console.log(`🚀 DEBUT DU PEUPLEMENT : ${CONCRETE_PRODUCTS.length} PRODUITS PREMIUM.`);
  
  const chunkSize = 5;
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  for (let i = 0; i < CONCRETE_PRODUCTS.length; i += chunkSize) {
    const chunk = CONCRETE_PRODUCTS.slice(i, i + chunkSize);
    try {
      await Promise.all(chunk.map(p => setDocument("products", p.id, p)));
      console.log(`✅ Chunk Premium envoyé (${i + chunk.length}/${CONCRETE_PRODUCTS.length})`);
      
      if (i + chunkSize < CONCRETE_PRODUCTS.length) {
        await delay(200); 
      }
    } catch (err) {
      console.error(`❌ Erreur chunk premium index ${i}:`, err);
    }
  }
  
  console.log("🔥 BOMBARDEMENT DES PRODUITS RÉUSSI ! La Démo V2 est en vie ! (Les avis ont été conservés intacts)");
};
