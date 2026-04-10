import { setDocument } from "./firestore";

export const products = [
  { id: 'p1', name: 'Smartphone XR Pro 128Go — Double SIM 5G', category: 'Téléphones & Hi-Tech', brand: 'Samsung', price: 349, oldPrice: 499, badge: '-30%', color: 'Noir', size: '6.7"', rating: 4.8, image: 'https://placehold.co/200x200/f5f5f5/999?text=Phone', isNew: false },
  { id: 'p2', name: 'Tablette 10 pouces 64Go Wi-Fi Android 14', category: 'Téléphones & Hi-Tech', brand: 'Apple', price: 189, oldPrice: 249, badge: '-24%', color: 'Gris', size: '10.2"', rating: 4.5, image: 'https://placehold.co/200x200/f5f5f5/999?text=Tablet', isNew: false },
  { id: 'p3', name: 'Canapé 3 places tissu gris anthracite — Livraison incluse', category: 'Meubles & Lampes', brand: 'IKEA', price: 429, oldPrice: 599, badge: '-28%', color: 'Gris', size: '3 places', rating: 4.2, image: 'https://placehold.co/200x200/f5f5f5/999?text=Canap%C3%A9', isNew: false },
  { id: 'p4', name: 'Table basse bois massif et acier 120cm', category: 'Meubles & Lampes', brand: 'IKEA', price: 159, color: 'Bois', size: '120cm', isNew: true, rating: 4.7, image: 'https://placehold.co/200x200/f5f5f5/999?text=Table' },
  { id: 'p5', name: 'Perceuse visseuse sans fil 18V — 2 batteries', category: 'Bricolage', brand: 'Bosch', price: 89, oldPrice: 129, badge: '-31%', color: 'Vert', size: '18V', rating: 4.9, image: 'https://placehold.co/200x200/f5f5f5/999?text=Perceuse', isNew: false },
  { id: 'p6', name: 'BBQ charbon de bois — Grille XL acier inox', category: 'Barbecues & Planchas', brand: 'Weber', price: 119, oldPrice: 169, badge: '-30%', color: 'Noir', size: 'XL', rating: 4.6, image: 'https://placehold.co/200x200/f5f5f5/999?text=BBQ', isNew: false },
  { id: 'p7', name: 'Piscine hors-sol ronde 4.6m — Pompe incluse', category: 'Piscines & Spas', brand: 'Intex', price: 299, oldPrice: 399, badge: '-25%', color: 'Bleu', size: '4.6m', rating: 4.4, image: 'https://placehold.co/200x200/f5f5f5/999?text=Piscine', isNew: false },
  { id: 'p8', name: 'Lampe de salon design LED dimmable — Blanc mat', category: 'Meubles & Lampes', brand: 'Philips', price: 69, color: 'Blanc', size: '40cm', isNew: true, rating: 4.3, image: 'https://placehold.co/200x200/f5f5f5/999?text=Lampe' },
  { id: 'p9', name: 'Robot aspirateur intelligent — Cartographie auto', category: 'Maison & Décoration', brand: 'Roborock', price: 199, oldPrice: 279, badge: '-29%', color: 'Blanc', size: 'Standard', rating: 4.7, image: 'https://placehold.co/200x200/f5f5f5/999?text=Robot', isNew: false },
  { id: 'p10', name: 'Chaise de bureau ergonomique réglable', category: 'Meubles & Lampes', brand: 'Herman Miller', price: 139, color: 'Noir', size: 'Adjustable', isNew: true, rating: 4.8, image: 'https://placehold.co/200x200/f5f5f5/999?text=Chaise' },
  { id: 'p11', name: 'Tondeuse à gazon électrique 1800W — 40L', category: 'Barbecues & Planchas', brand: 'Bosch', price: 99, oldPrice: 139, badge: '-29%', color: 'Vert', size: '40L', rating: 4.5, image: 'https://placehold.co/200x200/f5f5f5/999?text=Tondeuse', isNew: false },
  { id: 'p12', name: 'Casque audio Bluetooth ANC 40h autonomie', category: 'Téléphones & Hi-Tech', brand: 'Sony', price: 79, oldPrice: 119, badge: '-34%', color: 'Noir', size: 'Over-ear', rating: 4.9, image: 'https://placehold.co/200x200/f5f5f5/999?text=Casque', isNew: false },
  { id: 'p13', name: 'iPhone 15 Pro Max — 256Go Titane Naturel', category: 'Téléphones & Hi-Tech', brand: 'Apple', price: 1199, color: 'Titane', size: '6.7"', isNew: true, rating: 5.0, image: 'https://placehold.co/200x200/f5f5f5/999?text=iPhone+15' },
  { id: 'p14', name: 'Spa gonflable 4 places — Jets massants', category: 'Piscines & Spas', brand: 'Intex', price: 449, oldPrice: 599, badge: '-25%', color: 'Bleu', size: '4 places', rating: 4.7, image: 'https://placehold.co/200x200/f5f5f5/999?text=Spa', isNew: false },
];

export const seedProducts = async () => {
  console.log("Starting seeding products...");
  for (const product of products) {
    await setDocument("products", product.id, product);
    console.log(`Seeded: ${product.name}`);
  }
  console.log("Seeding complete!");
};
