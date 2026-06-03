import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://imexmercado.pt';
const PROJECT_ID = 'imexmercado';

const staticRoutes = [
  '',
  '/boutique',
  '/contact',
  '/a-propos',
  '/cgv',
  '/confidentialite',
  '/mentions-legales',
  '/cookies',
  '/livraison',
  '/retours',
  '/faq',
  '/suivi-commande'
];

function fetchCollection(collectionName) {
  return new Promise((resolve, reject) => {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collectionName}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.documents || []);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => reject(err));
  });
}

async function generate() {
  console.log('🏁 Starting Sitemap Generation...');
  const urls = [...staticRoutes];

  try {
    // 1. Fetch Categories
    const categories = await fetchCollection('categories');
    console.log(`📂 Fetched ${categories.length} categories from Firestore.`);
    categories.forEach(doc => {
      // Get category ID from path: projects/.../documents/categories/hitech -> hitech
      const nameParts = doc.name.split('/');
      const categoryId = nameParts[nameParts.length - 1];
      urls.push(`/category/${categoryId}`);
    });

    // 2. Fetch Products
    const products = await fetchCollection('products');
    console.log(`📦 Fetched ${products.length} products from Firestore.`);
    products.forEach(doc => {
      const nameParts = doc.name.split('/');
      const productId = nameParts[nameParts.length - 1];
      // Skip unpublished products
      const fields = doc.fields || {};
      const published = fields.published ? fields.published.booleanValue : true;
      if (published !== false) {
        urls.push(`/p/${productId}`);
      }
    });

  } catch (error) {
    console.error('⚠️ Warning: Failed to fetch dynamic data from Firestore, generating sitemap with static routes only.', error.message);
  }

  // 3. Build XML Content
  const date = new Date().toISOString().split('T')[0];
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  urls.forEach(route => {
    xml += `  <url>\n`;
    xml += `    <loc>${DOMAIN}${route}</loc>\n`;
    xml += `    <lastmod>${date}</lastmod>\n`;
    xml += `    <changefreq>${route === '' ? 'daily' : 'weekly'}</changefreq>\n`;
    xml += `    <priority>${route === '' ? '1.0' : '0.8'}</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>\n`;

  // 4. Write to public/sitemap.xml so it gets compiled into dist, and also write to dist if it exists
  const publicPath = path.join(__dirname, '../public/sitemap.xml');
  const distPath = path.join(__dirname, '../dist/sitemap.xml');

  // Make sure public directory exists
  const publicDir = path.dirname(publicPath);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  fs.writeFileSync(publicPath, xml, 'utf8');
  console.log(`✅ Sitemap written to ${publicPath}`);

  if (fs.existsSync(path.dirname(distPath))) {
    fs.writeFileSync(distPath, xml, 'utf8');
    console.log(`✅ Sitemap written to ${distPath}`);
  }
}

generate();
