import { getDocs, collection, deleteDoc } from "firebase/firestore";
import { db } from "./config";
import { setDocument } from "./firestore";

// Legacy export for compatibility during transition
export const products: any[] = [];

const CATEGORIES = [
  'Téléphones & Hi-Tech',
  'Maison & Décoration',
  'Meubles & Lampes',
  'Bricolage',
  'Barbecues & Planchas',
  'Piscines & Spas',
];

const BRANDS: Record<string, string[]> = {
  'Téléphones & Hi-Tech': ['Apple', 'Samsung', 'Sony', 'Bose', 'JBL', 'Xiaomi', 'Google'],
  'Maison & Décoration': ['Roborock', 'Philips', 'HomeDecor', 'ArtGallery', 'CozyHome', 'Dyson'],
  'Meubles & Lampes': ['Nordic', 'Oakwood', 'ComfortPro', 'RetroDesign', 'Lumina', 'IKEA'],
  'Bricolage': ['Bosch', 'Makita', 'Magnusson', 'WorkLight', 'StableTool', 'Dewalt'],
  'Barbecues & Planchas': ['Weber', 'Forge Adour', 'Kover', 'GrillMaster', 'SmokeKing', 'Napoleon'],
  'Piscines & Spas': ['Bestway', 'Intex', 'Zodiac', 'Gre', 'EcoPool', 'PoolStar'],
};

const PRODUCT_BASES: Record<string, string[]> = {
  'Téléphones & Hi-Tech': ['Smartphone', 'Tablette', 'Casque Sans Fil', 'Enceinte Portable', 'Montre Connectée', 'Laptop Pro', 'Écouteurs ANC'],
  'Maison & Décoration': ['Aspirateur Robot', 'Miroir Design', 'Vase en Céramique', 'Tableau Moderne', 'Lampe de Table', 'Set de Coussins', 'Tapis Salon'],
  'Meubles & Lampes': ['Canapé 3 Places', 'Table à Manger', 'Chaise Ergonomique', 'Buffet Vintage', 'Suspension Design', 'Lit King Size', 'Étagère Bois'],
  'Bricolage': ['Perceuse 18V', 'Coffret Outillage', 'Scie Circulaire', 'Projecteur LED', 'Établi Pliant', 'Meuleuse Angle', 'Niveau Laser'],
  'Barbecues & Planchas': ['Barbecue Charbon', 'Plancha Gaz', 'Housse BBQ', 'Ustensiles Inox', 'Fumoir Vertical', 'Grille de Rechange', 'Pierre à Pizza'],
  'Piscines & Spas': ['Piscine Tubulaire', 'Spa Gonflable', 'Robot Nettoyeur', 'Pompe Filtration', 'Chauffage Solaire', 'Échelle Inox', 'Bâche Été'],
};

export const generateMockProducts = (totalCount: number) => {
  const generated: any[] = [];
  const itemsPerCategory = Math.ceil(totalCount / CATEGORIES.length);

  CATEGORIES.forEach((cat) => {
    const catSlug = cat.substring(0, 3).toLowerCase().replace(/[^a-z]/g, '');
    for (let i = 1; i <= itemsPerCategory; i++) {
      if (generated.length >= totalCount) break;

      const brand = BRANDS[cat][Math.floor(Math.random() * BRANDS[cat].length)];
      const baseName = PRODUCT_BASES[cat][Math.floor(Math.random() * PRODUCT_BASES[cat].length)];
      
      // Fixed ID to ensure overwriting instead of duplicating
      const id = `prod-${catSlug}-${i}`;
      
      const price = Math.floor(Math.random() * 500) + 20;
      const hasPromo = Math.random() > 0.6;
      const oldPrice = hasPromo ? Math.floor(price * (1 + Math.random() * 0.4)) : null;
      const badge = oldPrice ? `-${Math.round((1 - price / oldPrice) * 100)}%` : null;
      
      generated.push({
        id,
        name: `${baseName} ${brand} Model-${i}`,
        category: cat,
        brand: brand,
        price: price,
        oldPrice: oldPrice,
        badge,
        isFlashSale: Math.random() > 0.85,
        isTrending: Math.random() > 0.8,
        isSelection: Math.random() > 0.8,
        isNew: Math.random() > 0.8,
        featured: Math.random() > 0.9,
        rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1),
        reviewCount: Math.floor(Math.random() * 150),
        stock: Math.floor(Math.random() * 50) + 1,
        description: `Découvrez notre ${baseName} de la marque ${brand}. Qualité premium garantie pour votre confort et vos besoins quotidiens.`,
        image: `https://placehold.co/600x600/f5f5f5/333?text=${baseName.replace(/\s+/g, '+')}+${brand}`,
        images: [],
        tags: [cat.split(' ')[0].toLowerCase(), brand.toLowerCase()],
        specs: [
          { key: 'Marque', value: brand },
          { key: 'Garantie', value: '2 ans' },
          { key: 'État', value: 'Neuf' },
        ],
        published: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  });

  return generated;
};

const TESTIMONIALS_COUNT = 100;

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
  { text: "Apoio ao cliente fantástico para me ajudar a escolher candeeiros.", category: "Meubles & Lampes" },
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
      id: `tst-pt-${i}`, // Deterministic ID
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
  console.log("🧹 DÉBUT DU NETTOYAGE : Analyse de la base...");
  
  const productsDocs = await getDocs(collection(db, "products"));
  const testimonialsDocs = await getDocs(collection(db, "testimonials"));
  
  const allDocs = [...productsDocs.docs, ...testimonialsDocs.docs];
  console.log(`🗑️ ${allDocs.length} documents à supprimer au total...`);

  const chunkSize = 20;
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  for (let i = 0; i < allDocs.length; i += chunkSize) {
    const chunk = allDocs.slice(i, i + chunkSize);
    try {
      // Parallel delete within the chunk
      await Promise.all(chunk.map(docSnap => deleteDoc(docSnap.ref)));
      console.log(`♻️ Nettoyage : ${i + chunk.length}/${allDocs.length} supprimés`);
      
      if (i + chunkSize < allDocs.length) {
        await delay(100); // Tiny pause to let the connection breathe
      }
    } catch (err) {
      console.error(`❌ Erreur lors de la suppression du chunk à l'index ${i}:`, err);
      throw err; // Propagate to show alert
    }
  }

  console.log("✨ BASE DE DONNÉES ENTIÈREMENT NETTOYÉE !");
};

export const seedProducts = async () => {
  // NEW: Clear everything first!
  await clearDatabase();
  
  const allProducts = generateMockProducts(350);
  console.log(`🚀 DEBUT DU PEUPLEMENT : ${allProducts.length} produits prévus (IDs FIXES).`);
  
  const chunkSize = 10;
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  for (let i = 0; i < allProducts.length; i += chunkSize) {
    const chunk = allProducts.slice(i, i + chunkSize);
    try {
      await Promise.all(chunk.map(p => setDocument("products", p.id, p)));
      console.log(`✅ Chunk ${Math.floor(i / chunkSize) + 1} expédié (${i + chunk.length}/${allProducts.length})`);
      
      if (i + chunkSize < allProducts.length) {
        await delay(100); 
      }
    } catch (err) {
      console.error(`❌ Erreur chunk index ${i}:`, err);
    }
  }
  
  await seedTestimonials();
  console.log("🔥 BOMBARDEMENT COMPLET RÉUSSI ! La base est maintenant propre et à jour.");
};
