# CAHIER DES CHARGES — Plateforme E-Commerce
# `imexmercado.pt`
### IMEXSULTING - Comércio Geral Import & Export., Lda
**Version :** v2.0 — Avril 2026 | **Statut :** Confidentiel

---

## INFORMATIONS LÉGALES

| Champ | Valeur |
|---|---|
| Raison sociale | IMEXSULTING - Comércio Geral Import & Export., Lda |
| Date de création | 14 juin 2012 |
| Forme juridique | Société à responsabilité limitée (Lda) |
| Capital social | ~20 000 € |
| Activité | Commerce de gros non spécialisé — Import-export multiproduits |
| Siège | Rua dos Girassóis, Nº 1 e 1A — 2860-274 Alhos Vedros — Moita — Setúbal — PORTUGAL |
| Domaine | imexmercado.pt |

---

## TABLE DES MATIÈRES

1. [Présentation & vision du projet](#1-présentation--vision-du-projet)
2. [Référence UI/UX — Worten.pt](#2-référence-uiux--wortenpt)
3. [Architecture technique](#3-architecture-technique)
4. [Structure du monorepo](#4-structure-du-monorepo)
5. [Design System & Charte graphique](#5-design-system--charte-graphique)
6. [Application Client — imexmercado.pt](#6-application-client--imexmercadopt)
7. [Application Admin — admin.imexmercado.pt](#7-application-admin--adminimexmercadopt)
8. [Backend Firebase](#8-backend-firebase)
9. [Catalogue produits & catégories](#9-catalogue-produits--catégories)
10. [Internationalisation i18n](#10-internationalisation-i18n)
11. [Sécurité & conformité](#11-sécurité--conformité)
12. [Performance & SEO](#12-performance--seo)
13. [Déploiement & CI/CD](#13-déploiement--cicd)
14. [Planning & livrables](#14-planning--livrables)
15. [Budget prévisionnel](#15-budget-prévisionnel)

---

## 1. Présentation & vision du projet

### 1.1 Objet

IMEXSULTING lance **imexmercado.pt**, une plateforme e-commerce B2C positionnée sur l'import-export multi-catégories, ciblant 4 marchés européens (Portugal, France, Allemagne, Italie). Le site doit reprendre les codes UX/UI des grands e-commerces électroniques portugais, en particulier **Worten.pt**, référence locale en matière d'expérience utilisateur et de conversion.

### 1.2 Vision

- Lancement avec **300 produits** répartis sur **6 catégories** (50 références/catégorie)
- Interface disponible en **4 langues** : Portugais · Français · Allemand · Italien
- Back-office autonome pour l'équipe sans compétences techniques
- Scalabilité vers 1 000+ produits sans refonte
- Performances Core Web Vitals au niveau des leaders du marché

---

## 2. Référence UI/UX — Worten.pt

> **Worten.pt** est la référence de conception absolue pour ce projet. Chaque décision UI/UX doit s'en inspirer directement.

### 2.1 Éléments à reproduire fidèlement

#### Header (Priorité maximale)

```
┌─────────────────────────────────────────────────────────────────┐
│ [LOGO]  [🔍 Rechercher un produit...    ] [👤 Compte] [🛒 0]   │
├─────────────────────────────────────────────────────────────────┤
│ Téléphones & Hi-Tech | Maison | Meubles | Bricolage | BBQ | 🏊 │
└─────────────────────────────────────────────────────────────────┘
```

- Header **sticky** (reste visible au scroll)
- **Barre supérieure** : logo gauche, barre de recherche centrale large, icônes compte + panier à droite
- **Barre navigation secondaire** : liens catégories avec hover mega-menu déroulant
- Badge rouge avec compteur d'articles sur l'icône panier
- Sur mobile : hamburger menu + barre de recherche + icônes panier/compte

#### Hero Banner — Section principale homepage

- **Bannière hero full-width** avec slider automatique (autoplay 5s, dots de navigation)
- Images haute résolution couvrant toute la largeur (min 1920×600px desktop)
- CTA centré : bouton principal + texte accrocheur
- Minimum 3 slides avec offres différentes ou catégories en vedette
- Transition smooth (fade ou slide horizontal)

#### Bandeau promotionnel

- **Bandeau couleur** sous le header avec offre du moment (livraison gratuite, promo, etc.)
- Couleur contrastée (ex: rouge/orange sur fond blanc ou inversé)
- Texte centré, lien cliquable

#### Grilles de catégories — Style Worten

```
[📱 Téléphones]  [🏠 Maison]  [🛋️ Meubles]
[🔧 Bricolage]   [🔥 BBQ]    [🏊 Piscines]
```

- Grille **2×3** (desktop) / **2×3** (mobile scroll horizontal)
- Chaque catégorie : icône ou image + label + lien direct
- Effet hover avec légère élévation (box-shadow)

#### Cartes produits — Style Worten

```
┌─────────────────────┐
│ [BADGE PROMO -20%]  │
│                     │
│    [IMAGE PRODUIT]  │
│                     │
│ Nom du produit...   │
│ ~~120,00 €~~        │
│ **96,00 €**         │
│ [🛒 Ajouter panier] │
└─────────────────────┘
```

- Image produit carrée (1:1) centrée, fond blanc
- Badge promo en overlay haut-gauche (rouge)
- Badge "Nouveau" ou "Top vente" en overlay haut-droit
- Prix barré (ancien) + prix actuel en gras et couleur principale
- Bouton "Ajouter au panier" visible au hover (ou toujours visible sur mobile)
- Étoiles notation + nombre d'avis
- Nom tronqué sur 2 lignes maximum

#### Sections homepage

1. **Hero Slider** — Bannières promotionnelles pleine largeur
2. **Bandeau promo** — Livraison gratuite / offre du jour
3. **Catégories en vedette** — Grille iconique rapide accès
4. **Produits en promotion** — Carrousel horizontal avec timer countdown
5. **Nouveautés** — Grille 4 colonnes desktop, scroll horizontal mobile
6. **Bannière catégorie 1** — Full-width avec CTA (ex: "Découvrez nos Barbecues")
7. **Produits populaires** — Grille avec filtres rapides par catégorie (tabs)
8. **Bannière catégorie 2** — Second bloc promotionnel
9. **Avantages** — Icônes : Livraison | Retours | Paiement sécurisé | Support
10. **Newsletter** — Formulaire email avec incentive (-10% première commande)
11. **Footer complet**

### 2.2 Pages catégorie — Style Worten

```
Breadcrumb : Accueil > Téléphones & Hi-Tech

[FILTRES SIDEBAR]         [GRILLE PRODUITS]
┌─────────────┐           ┌──┐ ┌──┐ ┌──┐ ┌──┐
│ Prix        │           │  │ │  │ │  │ │  │
│ ▪ 0–50€     │           └──┘ └──┘ └──┘ └──┘
│ ▪ 50–200€   │           ┌──┐ ┌──┐ ┌──┐ ┌──┐
│ ▪ 200–500€  │           │  │ │  │ │  │ │  │
│             │           └──┘ └──┘ └──┘ └──┘
│ Disponible  │
│ ▪ En stock  │           [Afficher 24 résultats]
│             │
│ [Appliquer] │
└─────────────┘
```

- **Sidebar filtres** (desktop) / **Drawer filtres** (mobile, bouton "Filtrer")
- Filtres : fourchette de prix (slider), disponibilité, marque, notation
- **Tri** : Pertinence | Prix croissant | Prix décroissant | Nouveautés | Mieux notés
- Sélecteur nombre de résultats : 24 / 48 / 96
- Toggle vue grille / liste
- Breadcrumb en haut de page
- Total résultats affiché

### 2.3 Page produit — Style Worten

```
┌─────────────────────────────────────────────────────────┐
│  Breadcrumb > Catégorie > Produit                       │
├─────────────────────┬───────────────────────────────────┤
│  [Galerie images]   │  Nom du produit                   │
│  [Vignettes]        │  ⭐⭐⭐⭐⭐ (42 avis)              │
│                     │  SKU: IMX-001                     │
│                     │  ~~120,00 €~~  **96,00 €**        │
│                     │  Économisez 24,00 € (20%)         │
│                     │                                   │
│                     │  Quantité: [-] 1 [+]              │
│                     │  [🛒 AJOUTER AU PANIER]           │
│                     │  [♡ Ajouter aux favoris]          │
│                     │                                   │
│                     │  ✓ Livraison gratuite > 50€       │
│                     │  ✓ Retours 30 jours               │
│                     │  ✓ Paiement 100% sécurisé         │
├─────────────────────┴───────────────────────────────────┤
│  Onglets: [Description] [Caractéristiques] [Avis (42)] │
└─────────────────────────────────────────────────────────┘
│  Produits similaires — Carrousel                        │
```

- Galerie avec zoom au survol (desktop) et swipe (mobile)
- Vignettes cliquables en dessous
- Partage réseaux sociaux
- Bouton retour en haut (sticky sur mobile)

### 2.4 Footer — Style Worten

```
┌─────────────────────────────────────────────────────────┐
│  Logo + tagline                                         │
├──────────┬──────────────┬────────────┬──────────────────┤
│  Aide    │  Mon Compte  │  Catégories│  Légal           │
│  Contact │  Commandes   │  Téléphones│  CGV             │
│  FAQ     │  Favoris     │  Maison    │  Confidentialité │
│  Livraison│  Adresses   │  Meubles   │  Mentions légales│
├──────────┴──────────────┴────────────┴──────────────────┤
│  Modes de paiement: [VISA][MC][PayPal][MBWay][SEPA]    │
│  Certifications: [SSL][Trustpilot]                      │
├─────────────────────────────────────────────────────────┤
│  © 2026 IMEXSULTING Lda — imexmercado.pt               │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Architecture technique

### 3.1 Stack globale

| Couche | Technologie | Version |
|---|---|---|
| Runtime build | Node.js | 20 LTS |
| Framework UI | React | 18.x |
| Bundler | Vite | 5.x |
| Langage | TypeScript | 5.x |
| Style | Tailwind CSS | 3.x |
| Composants | shadcn/ui | latest |
| State management | Zustand | 4.x |
| Data fetching | TanStack Query (React Query) | 5.x |
| Formulaires | React Hook Form + Zod | latest |
| Routing | React Router | 6.x |
| i18n | react-i18next | latest |
| Animations | Framer Motion | latest |
| Icons | Lucide React | latest |
| Monorepo | Turborepo + pnpm workspaces | latest |
| Auth | Firebase Authentication | 10.x |
| Database | Cloud Firestore | 10.x |
| Storage | Firebase Storage | 10.x |
| Functions | Firebase Cloud Functions (Node 20) | 10.x |
| Paiement | Stripe Elements | latest |
| Email | Resend (ou SendGrid) | latest |
| Déploiement | Vercel | — |

### 3.2 Vue d'ensemble architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        MONOREPO GitHub                          │
│                                                                 │
│  ┌──────────────────────┐    ┌──────────────────────────────┐  │
│  │   apps/client        │    │   apps/admin                  │  │
│  │   imexmercado.pt     │    │   admin.imexmercado.pt        │  │
│  │   React + Vite       │    │   React + Vite                │  │
│  │   Vercel Project A   │    │   Vercel Project B            │  │
│  └──────────┬───────────┘    └──────────────┬───────────────┘  │
│             │                               │                   │
│  ┌──────────┴───────────────────────────────┴────────────────┐ │
│  │               packages/  (partagés)                        │ │
│  │   ui/  |  types/  |  firebase/  |  i18n/                  │ │
│  └─────────────────────────────┬──────────────────────────────┘ │
│                                │                                 │
└────────────────────────────────┼─────────────────────────────────┘
                                 │
                    ┌────────────▼───────────────┐
                    │        FIREBASE             │
                    │  Auth | Firestore | Storage  │
                    │  Functions | Hosting         │
                    └────────────────────────────┘
```

### 3.3 Séparation Client / Admin

Les deux applications sont **strictement indépendantes** :

- Dépendances npm séparées (`apps/client/package.json`, `apps/admin/package.json`)
- Variables d'environnement séparées (Vercel Projects distincts)
- Pipelines CI/CD séparés (GitHub Actions jobs distincts)
- Règles Firestore différenciées (rôles client vs admin)
- L'admin n'est jamais bundlé dans le client et vice-versa

---

## 4. Structure du monorepo

```
imexmercado/
├── apps/
│   ├── client/                     # App e-commerce public
│   │   ├── src/
│   │   │   ├── components/         # Composants UI spécifiques client
│   │   │   │   ├── layout/         # Header, Footer, Layout
│   │   │   │   ├── home/           # HeroSlider, CategoryGrid, ProductSection
│   │   │   │   ├── product/        # ProductCard, ProductGallery, ProductDetail
│   │   │   │   ├── cart/           # CartDrawer, CartItem, CartSummary
│   │   │   │   ├── checkout/       # CheckoutSteps, PaymentForm, AddressForm
│   │   │   │   └── common/         # SearchBar, LanguageSwitcher, Breadcrumb
│   │   │   ├── pages/              # Routes React Router
│   │   │   │   ├── Home.tsx
│   │   │   │   ├── Category.tsx
│   │   │   │   ├── Product.tsx
│   │   │   │   ├── Search.tsx
│   │   │   │   ├── Cart.tsx
│   │   │   │   ├── Checkout.tsx
│   │   │   │   ├── Account/
│   │   │   │   └── Auth/
│   │   │   ├── hooks/              # useCart, useAuth, useProducts, useSearch
│   │   │   ├── stores/             # Zustand stores (cart, auth, ui)
│   │   │   └── lib/                # Utils, constants, helpers
│   │   ├── public/
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   └── admin/                      # App back-office
│       ├── src/
│       │   ├── components/
│       │   │   ├── layout/         # AdminSidebar, AdminHeader, DashboardLayout
│       │   │   ├── products/       # ProductForm, ProductTable, ImageUploader
│       │   │   ├── orders/         # OrderTable, OrderDetail, StatusBadge
│       │   │   ├── dashboard/      # KPICard, SalesChart, AlertsPanel
│       │   │   └── common/         # DataTable, ConfirmModal, FileDropzone
│       │   ├── pages/
│       │   │   ├── Dashboard.tsx
│       │   │   ├── Products/
│       │   │   ├── Categories/
│       │   │   ├── Orders/
│       │   │   ├── Customers/
│       │   │   ├── Promotions/
│       │   │   └── Settings/
│       │   ├── hooks/
│       │   └── stores/
│       ├── vite.config.ts
│       └── package.json
│
├── packages/
│   ├── ui/                         # Design system partagé (boutons, inputs, modals)
│   │   ├── src/components/
│   │   └── package.json
│   ├── types/                      # Types TypeScript partagés
│   │   ├── src/
│   │   │   ├── product.ts          # Product, ProductVariant, Category
│   │   │   ├── order.ts            # Order, OrderItem, OrderStatus
│   │   │   ├── user.ts             # User, Address, Role
│   │   │   └── index.ts
│   │   └── package.json
│   ├── firebase/                   # SDK Firebase partagé + hooks
│   │   ├── src/
│   │   │   ├── config.ts           # initializeApp partagé
│   │   │   ├── firestore.ts        # Helpers CRUD Firestore
│   │   │   ├── storage.ts          # Helpers Firebase Storage
│   │   │   └── auth.ts             # Hooks useAuth
│   │   └── package.json
│   └── i18n/                       # Fichiers de traductions partagés
│       ├── locales/
│       │   ├── pt/                 # Portugais (marché principal)
│       │   ├── fr/                 # Français
│       │   ├── de/                 # Allemand
│       │   └── it/                 # Italien
│       └── package.json
│
├── functions/                      # Firebase Cloud Functions
│   ├── src/
│   │   ├── orders/                 # onOrderCreated, onStatusChange
│   │   ├── payments/               # stripeWebhook
│   │   ├── admin/                  # createAdminUser, generatePDF
│   │   └── scheduled/             # stockAlerts, cleanup
│   └── package.json
│
├── firestore.rules                 # Règles sécurité Firestore
├── storage.rules                   # Règles sécurité Storage
├── firebase.json
├── .firebaserc
├── turbo.json                      # Config Turborepo pipeline
├── pnpm-workspace.yaml
├── .github/
│   └── workflows/
│       ├── client.yml              # CI/CD app client
│       ├── admin.yml               # CI/CD app admin
│       └── functions.yml           # Deploy Firebase Functions
└── package.json
```

---

## 5. Design System & Charte graphique

### 5.1 Palette de couleurs (inspirée Worten — adaptée IMEX)

```css
/* Couleurs principales */
--color-primary:        #CC0000;   /* Rouge principal — CTA, badges promo, accents */
--color-primary-dark:   #990000;   /* Rouge foncé — hover, actif */
--color-primary-light:  #FF3333;   /* Rouge clair — highlights */

/* Couleurs neutres */
--color-bg:             #FFFFFF;   /* Fond blanc dominant */
--color-bg-subtle:      #F5F5F5;   /* Fond gris très léger — sections alternées */
--color-bg-card:        #FFFFFF;   /* Fond cartes produit */
--color-border:         #E5E5E5;   /* Bordures fines */

/* Textes */
--color-text-primary:   #1A1A1A;   /* Titres, textes forts */
--color-text-secondary: #666666;   /* Descriptions, sous-titres */
--color-text-muted:     #999999;   /* Textes secondaires, métadonnées */

/* Sémantiques */
--color-success:        #00A651;   /* En stock, confirmé */
--color-warning:        #FF6600;   /* Stock bas, attention */
--color-error:          #CC0000;   /* Erreurs, rupture */
--color-info:           #0066CC;   /* Informations, liens */

/* Prix */
--color-price:          #CC0000;   /* Prix actuel — rouge comme Worten */
--color-price-old:      #999999;   /* Prix barré */
--color-badge-promo:    #CC0000;   /* Badge promotion */
--color-badge-new:      #00A651;   /* Badge nouveauté */
```

### 5.2 Typographie

```css
/* Police principale */
font-family: 'Inter', 'Roboto', system-ui, -apple-system, sans-serif;

/* Échelle typographique */
--text-xs:    12px;   /* Labels, badges, métadonnées */
--text-sm:    14px;   /* Corps secondaire, descriptions courtes */
--text-base:  16px;   /* Corps principal */
--text-lg:    18px;   /* Sous-titres, prix */
--text-xl:    20px;   /* Titres de section */
--text-2xl:   24px;   /* Titres H2 */
--text-3xl:   30px;   /* Titres H1 page */
--text-4xl:   36px;   /* Titres hero bannière */

/* Poids */
--font-normal:   400;
--font-medium:   500;
--font-semibold: 600;
--font-bold:     700;
```

### 5.3 Espacements & grille

```css
/* Grille responsive */
--container-max: 1280px;     /* Largeur max contenu */
--container-px:  16px;       /* Padding horizontal mobile */
--container-px-md: 24px;     /* Padding horizontal tablet */
--container-px-lg: 32px;     /* Padding horizontal desktop */

/* Grille produits */
/* Mobile:  2 colonnes */
/* Tablet:  3 colonnes */
/* Desktop: 4 colonnes */
/* XL:      5 colonnes (page catégorie sans sidebar) */
```

### 5.4 Composants clés — Spécifications

#### ProductCard
```
Dimensions : largeur flexible, hauteur auto
Image : ratio 1:1, object-fit: contain, fond blanc, padding 16px
Coins arrondis : 8px
Ombre : 0 1px 3px rgba(0,0,0,0.1)
Hover : 0 4px 12px rgba(0,0,0,0.15) + translateY(-2px)
Transition : all 200ms ease
Badge overlay : border-radius 4px, padding 4px 8px, font-size 12px bold
```

#### Bouton CTA principal
```
Background : --color-primary
Text : blanc, 14px, bold
Padding : 12px 24px
Border-radius : 4px
Hover : --color-primary-dark
Transition : background 150ms
Icon optionnel : 🛒 gauche du texte
```

#### Header sticky
```
Height desktop : 60px top bar + 48px nav bar = 108px total
Height mobile : 56px (hamburger + logo + panier)
Background : blanc, border-bottom 1px #E5E5E5
Position : sticky top 0, z-index 1000
Box-shadow au scroll : 0 2px 8px rgba(0,0,0,0.1)
```

---

## 6. Application Client — imexmercado.pt

### 6.1 Routes & pages

| Route | Composant | Description |
|---|---|---|
| `/` | `Home` | Homepage complète style Worten |
| `/:lang` | `Home` | Homepage version localisée (fr/de/it) |
| `/c/:categorySlug` | `Category` | Page liste produits avec filtres |
| `/p/:productSlug` | `Product` | Fiche produit détaillée |
| `/recherche` | `Search` | Page résultats de recherche |
| `/panier` | `Cart` | Page panier |
| `/commande` | `Checkout` | Tunnel de commande multi-étapes |
| `/commande/confirmation/:id` | `Confirmation` | Page confirmation commande |
| `/compte` | `Account` | Dashboard compte client |
| `/compte/commandes` | `Orders` | Historique commandes |
| `/compte/commandes/:id` | `OrderDetail` | Détail commande |
| `/compte/adresses` | `Addresses` | Gestion adresses |
| `/compte/favoris` | `Favorites` | Liste de souhaits |
| `/connexion` | `Login` | Authentification |
| `/inscription` | `Register` | Création compte |
| `/mot-de-passe-oublie` | `ForgotPassword` | Récupération mot de passe |
| `/livraison` | `Shipping` | Informations livraison |
| `/retours` | `Returns` | Politique retours |
| `/cgv` | `CGV` | Conditions générales de vente |
| `/confidentialite` | `Privacy` | Politique de confidentialité |
| `/mentions-legales` | `Legal` | Mentions légales |

### 6.2 Composants Header détaillé

#### TopBar (bandeau promotionnel)
```tsx
// Composant TopBar
// - Fond couleur primaire (rouge) ou personnalisable depuis admin
// - Texte promotionnel centré (ex: "🚚 Livraison gratuite dès 50€ | -10% avec IMEX10")
// - Bouton fermeture (X) — masquage persisté en session
// - Lien cliquable vers page promo
```

#### MainHeader
```tsx
// Composant MainHeader  
// - Logo (SVG ou PNG — lien vers /)
// - SearchBar centrale (80% de la largeur, 42px de hauteur)
//   > Placeholder i18n par langue
//   > Suggestions live (debounce 300ms → Firestore ou Algolia)
//   > Overlay résultats avec thumbnail + nom + prix
//   > Touche Échap pour fermer
// - Zone droite : 
//   > Sélecteur langue (dropdown drapeau + code)
//   > Icône compte (dropdown si connecté : Mon compte / Commandes / Déconnexion)
//   > Icône panier avec badge compteur (rouge, max "99+")
```

#### NavBar (mega-menu)
```tsx
// Composant NavBar
// - 6 liens catégories
// - Hover déclenche MegaMenu après 200ms (éviter fermeture accidentelle)
// - MegaMenu : overlay blanc, 3 colonnes
//   > Colonne 1 : Sous-catégories avec icônes
//   > Colonne 2 : Marques ou filtres populaires
//   > Colonne 3 : Bannière promo de la catégorie + CTA
// - Fermeture au click extérieur ou Échap
// - Mobile : NavDrawer depuis hamburger (slide depuis gauche)
```

### 6.3 Homepage — Sections détaillées

#### Section 1 : HeroSlider
```
Composant : HeroSlider
Hauteur desktop : 500px
Hauteur mobile : 250px
Slides : 3 à 5 slides configurables depuis admin
Contenu par slide :
  - Image de fond full-width (WebP, lazy sauf slide 1)
  - Overlay texte optionnel (position gauche, droite ou centre)
  - Titre H1 (max 60 chars)
  - Sous-titre (max 120 chars)
  - CTA bouton (label + URL)
Contrôles :
  - Dots de navigation en bas
  - Flèches précédent/suivant (hover uniquement desktop)
  - Autoplay 5 secondes, pause au hover
  - Touch/swipe sur mobile
```

#### Section 2 : PromoBar
```
Composant : PromoBar
Fond : --color-primary
Texte : blanc, centré, 14px
Contenu : texte promo + lien optionnel
Configurable depuis admin (texte, couleur, lien, visibility)
```

#### Section 3 : CategoryGrid
```
Composant : CategoryGrid
Titre section : "Nos catégories" (i18n)
Layout : 6 cards en grille 3×2 desktop, 2×3 mobile
Chaque card :
  - Image/icône 80×80px
  - Nom catégorie (i18n)
  - Hover : fond légèrement coloré + scale 1.02
  - Lien vers /c/:slug
```

#### Section 4 : FlashSaleSection
```
Composant : FlashSaleSection
Titre : "Offres du jour" + Countdown timer (HH:MM:SS)
Layout : carrousel horizontal (scroll snap)
Desktop : 5 produits visibles, flèches nav
Mobile : scroll horizontal natif, 2 produits partiellement visibles
Cartes produit avec badge "-XX%"
```

#### Section 5 : ProductGridSection (réutilisable)
```
Props : title, products[], viewAllLink, columns (4 default)
Titre de section avec lien "Voir tout →"
Grille 4 colonnes desktop / 2 mobile
Maximum 8 produits affichés
```

#### Section 6 : BannerCTA
```
Composant : BannerCTA
Image full-width avec overlay de couleur
Titre + sous-titre + bouton CTA
Configurable depuis admin
2 instances sur la homepage
```

#### Section 7 : TrustBar
```
Composant : TrustBar
4 éléments en ligne (desktop) / grille 2×2 (mobile) :
  🚚 Livraison rapide — "2 à 5 jours ouvrés"
  ↩️ Retours gratuits — "30 jours pour changer d'avis"
  🔒 Paiement sécurisé — "SSL + 3D Secure"
  💬 Support client — "Lun-Ven 9h-18h"
```

### 6.4 Page Produit — Fonctionnalités détaillées

```
1. BREADCRUMB
   Accueil > Catégorie > Sous-catégorie > Nom produit

2. GALERIE IMAGES
   - Image principale : 500×500px (desktop), 100vw (mobile)
   - Zoom au survol (lens zoom) sur desktop
   - Swipe gauche/droite sur mobile
   - Vignettes : rangée horizontale en dessous (max 10)
   - Miniatures cliquables + scroll si > 5

3. INFORMATIONS PRODUIT (colonne droite desktop)
   - Nom produit : H1, 22px, bold
   - SKU : texte discret
   - Note : étoiles (⭐) + "(X avis)" lien ancre vers section avis
   - Prix :
     > Si promo : prix barré gris + prix rouge en gras (24px) + badge "-XX%"
     > Si normal : prix rouge en gras (24px)
     > TVA : "Prix TTC (TVA XX% incluse)" en 12px gris
   - Disponibilité :
     > ✅ En stock (vert)
     > ⚠️ Stock limité (orange, afficher si qty < seuil)
     > ❌ Rupture de stock (rouge) + bouton "M'alerter"
   - Sélecteur quantité : [-] [1] [+] (min 1, max stock disponible)
   - CTA : [🛒 AJOUTER AU PANIER] — pleine largeur, rouge, 48px hauteur
   - CTA secondaire : [♡ Ajouter aux favoris]
   - Share : icônes réseaux sociaux discrets
   - Badges confiance : Livraison | Retours | Paiement sécurisé

4. ONGLETS CONTENU
   - Description (rich text i18n depuis admin)
   - Caractéristiques (tableau clé/valeur i18n)
   - Avis clients (rating global + liste commentaires + formulaire ajout)

5. SECTION PRODUITS SIMILAIRES
   - Titre "Vous pourriez aussi aimer"
   - Carrousel 4 produits (même catégorie ou tags similaires)
```

### 6.5 Cart Drawer & Checkout

#### Cart Drawer (panier latéral)
```
- Slide depuis la droite (overlay semi-transparent)
- Liste des articles : thumbnail + nom + quantité + prix
- Modification quantité directement dans le drawer
- Suppression article (icône ✕)
- Sous-total HT + TVA + Total TTC
- Livraison estimée (gratuite si > 50€, sinon calcul)
- Bouton "Voir le panier" (page complète)
- Bouton "Commander maintenant" (checkout direct)
- Persistance : localStorage + sync Firestore si connecté
```

#### Tunnel checkout (4 étapes)
```
Étape 1 — Connexion/Identification
  - Continuer en tant qu'invité OU
  - Connexion compte existant OU
  - Créer un compte

Étape 2 — Livraison
  - Formulaire adresse (prénom, nom, adresse, CP, ville, pays)
  - Sélecteur transporteur avec tarifs et délais :
    > Correos de Portugal — Standard (3-5j) — X.XX€
    > DPD — Express (1-2j) — X.XX€
    > DHL — International (selon pays) — X.XX€
    > Retrait magasin (si applicable) — Gratuit

Étape 3 — Paiement
  - Stripe Elements (carte bancaire) — PCI-DSS compliant
  - MBWay (marché portugais)
  - PayPal
  - Code promo : champ + bouton "Appliquer"
  - Récapitulatif commande (sticky sur desktop)

Étape 4 — Confirmation
  - Message succès + numéro commande
  - Email automatique envoyé (confirmation)
  - Lien "Suivre ma commande"
  - Suggestions produits complémentaires
```

---

## 7. Application Admin — admin.imexmercado.pt

### 7.1 Authentification & accès

- URL dédiée : `admin.imexmercado.pt`
- Firebase Auth avec vérification custom claim `admin: true`
- Redirection automatique vers page 403 si claim absent
- Session persistante (Firebase Auth tokens)
- Audit log de toutes les actions admin (qui, quoi, quand)

### 7.2 Layout admin

```
┌──────────────────────────────────────────────────────────────┐
│ [LOGO ADMIN]              [Notifs 🔔]  [Admin User ▾]        │
├─────────────┬────────────────────────────────────────────────┤
│             │                                                 │
│  📊 Dashboard│              ZONE CONTENU PRINCIPALE          │
│             │                                                 │
│  📦 Produits│                                                 │
│  📁 Catégor.│                                                 │
│  🛒 Commandes│                                                │
│  👥 Clients │                                                 │
│  🏷️ Promos  │                                                 │
│  🖼️ Médias  │                                                 │
│  🌍 Traduc. │                                                 │
│  ⚙️ Paramètres│                                               │
│  👤 Admins  │                                                 │
│             │                                                 │
└─────────────┴────────────────────────────────────────────────┘
```

### 7.3 Module Dashboard

**KPIs en temps réel (Firestore listeners) :**

| KPI | Description | Période |
|---|---|---|
| Chiffre d'affaires | Somme commandes confirmées | Aujourd'hui / Semaine / Mois |
| Commandes | Nombre total | Même périodes |
| Panier moyen | CA / nb commandes | Même périodes |
| Clients actifs | Utilisateurs avec commande | Mois en cours |
| Produits en rupture | Stock = 0 | Temps réel |
| Stock faible | Stock < seuil alerte | Temps réel |

**Graphiques :**
- Ventes par jour (LineChart — 30 derniers jours)
- Top 5 produits vendus (BarChart)
- Répartition par catégorie (PieChart)
- Commandes par statut (BarChart groupé)

### 7.4 Module Produits

#### Liste produits
```
- Tableau avec colonnes : Image | SKU | Nom | Catégorie | Prix | Stock | Statut | Actions
- Recherche full-text en temps réel
- Filtres : catégorie, statut (publié/brouillon/archivé), stock
- Actions rapides : Éditer | Dupliquer | Archiver | Supprimer
- Sélection multiple + actions en masse
- Export CSV
- Bouton "+ Nouveau produit"
```

#### Formulaire produit (Create/Edit)
```
ONGLET 1 — Général
  - Noms par langue (PT/FR/DE/IT) — champs texte
  - Descriptions longues par langue — éditeur rich text (TipTap)
  - Descriptions courtes par langue — textarea
  - Catégorie principale (select)
  - Tags (multi-select créatable)
  - SKU (auto-généré ou manuel)
  - Code-barres EAN (optionnel)

ONGLET 2 — Prix & Stock
  - Prix HT de base
  - TVA : sélection taux par pays (Portugal 23% | France 20% | Allemagne 19% | Italie 22%)
  - Prix TTC calculé automatiquement (affiché en lecture seule)
  - Prix promotionnel (optionnel)
  - Dates validité promotion (date début / date fin)
  - Quantité en stock
  - Seuil d'alerte stock bas (défaut : 5)
  - Gestion stock activée/désactivée

ONGLET 3 — Images
  - Zone drag & drop multi-fichiers
  - Preview immédiate des images uploadées
  - Compression et conversion WebP automatique (Cloud Function)
  - Tri par drag & drop (image en position 1 = principale)
  - Maximum 10 images par produit
  - Taille max : 5MB par image
  - Bouton "Choisir depuis médiathèque"

ONGLET 4 — SEO
  - Slug URL par langue (auto-généré depuis le nom, modifiable)
  - Meta title par langue (max 60 chars + compteur)
  - Meta description par langue (max 160 chars + compteur)
  - Image OG (sélection depuis galerie)
  - Aperçu SERP Google simulé

ONGLET 5 — Statut
  - Statut : Brouillon | Publié | Archivé
  - Date de publication programmée (optionnel)
  - Produit mis en avant (homepage)
  - Disponibilité par marché (PT/FR/DE/IT)
```

### 7.5 Module Commandes

```
- Liste avec filtres : statut, date, pays, montant
- Statuts : Nouvelle | En préparation | Expédiée | Livrée | Annulée | Remboursée
- Détail commande :
  > Récapitulatif articles
  > Informations client + adresse
  > Historique des statuts (timeline)
  > Actions : Changer statut | Ajouter note | Générer bon livraison PDF | Rembourser
- Numéro de suivi transporteur
- Export commandes CSV (période personnalisable)
```

### 7.6 Module Gestion du contenu homepage

```
- Gestion des slides HeroSlider (CRUD, ordre, activation)
- Texte PromoBar (contenu, couleur, activation, période)
- Sélection produits "Flash Sale" + date/heure fin
- Sélection produits "Nouveautés" (jusqu'à 8)
- Sélection produits "Populaires" (jusqu'à 8)
- Configuration bannières CTA (image, titre, sous-titre, lien, CTA)
- Prévisualisation des changements avant publication
```

---

## 8. Backend Firebase

### 8.1 Structure Firestore

```
firestore/
├── products/                       # {productId}
│   ├── id: string
│   ├── sku: string (unique)
│   ├── name: { pt, fr, de, it }
│   ├── descriptionShort: { pt, fr, de, it }
│   ├── descriptionLong: { pt, fr, de, it }
│   ├── categoryId: string (ref → categories)
│   ├── tags: string[]
│   ├── price: number (HT base)
│   ├── taxRates: { pt: 0.23, fr: 0.20, de: 0.19, it: 0.22 }
│   ├── promoPrice: number | null
│   ├── promoPriceStart: Timestamp | null
│   ├── promoPriceEnd: Timestamp | null
│   ├── stock: number
│   ├── stockAlert: number
│   ├── manageStock: boolean
│   ├── images: string[] (URLs Firebase Storage)
│   ├── mainImageIndex: number (0 = première image)
│   ├── slug: { pt, fr, de, it }
│   ├── metaTitle: { pt, fr, de, it }
│   ├── metaDescription: { pt, fr, de, it }
│   ├── ogImage: string
│   ├── status: "draft" | "published" | "archived"
│   ├── featured: boolean
│   ├── availableMarkets: string[] (["pt","fr","de","it"])
│   ├── rating: number (0-5, calculé)
│   ├── reviewCount: number
│   ├── soldCount: number
│   ├── createdAt: Timestamp
│   ├── updatedAt: Timestamp
│   └── publishedAt: Timestamp | null
│
├── categories/                     # {categoryId}
│   ├── id: string
│   ├── name: { pt, fr, de, it }
│   ├── slug: { pt, fr, de, it }
│   ├── description: { pt, fr, de, it }
│   ├── image: string (URL)
│   ├── banner: string (URL)
│   ├── icon: string (emoji ou URL)
│   ├── order: number
│   ├── productCount: number (calculé)
│   └── isActive: boolean
│
├── orders/                         # {orderId}
│   ├── id: string
│   ├── orderNumber: string (ex: IMX-2026-0001)
│   ├── userId: string | null (null = invité)
│   ├── guestEmail: string | null
│   ├── items: OrderItem[]
│   ├── subtotal: number
│   ├── taxAmount: number
│   ├── shippingCost: number
│   ├── discountAmount: number
│   ├── total: number
│   ├── currency: "EUR"
│   ├── status: OrderStatus
│   ├── shippingAddress: Address
│   ├── billingAddress: Address
│   ├── shippingMethod: string
│   ├── trackingNumber: string | null
│   ├── paymentMethod: string
│   ├── stripePaymentIntentId: string
│   ├── couponCode: string | null
│   ├── notes: string | null
│   ├── market: "pt" | "fr" | "de" | "it"
│   ├── statusHistory: StatusEvent[]
│   ├── createdAt: Timestamp
│   └── updatedAt: Timestamp
│
├── users/                          # {userId}
│   ├── id: string
│   ├── email: string
│   ├── displayName: string
│   ├── phone: string | null
│   ├── preferredLang: "pt" | "fr" | "de" | "it"
│   ├── role: "customer" | "admin" | "superadmin"
│   ├── createdAt: Timestamp
│   ├── lastLoginAt: Timestamp
│   └── marketingConsent: boolean
│
├── coupons/                        # {couponCode}
│   ├── code: string
│   ├── type: "percentage" | "fixed"
│   ├── value: number
│   ├── minOrderAmount: number | null
│   ├── maxUses: number | null
│   ├── usedCount: number
│   ├── expiresAt: Timestamp | null
│   ├── eligibleCategories: string[] | null
│   └── isActive: boolean
│
├── reviews/                        # {reviewId}
│   ├── productId: string
│   ├── userId: string
│   ├── rating: number (1-5)
│   ├── title: string
│   ├── body: string
│   ├── isVerifiedPurchase: boolean
│   ├── isApproved: boolean
│   └── createdAt: Timestamp
│
└── settings/                       # {settingId}
    ├── homepage: HeroSlide[], PromoBar, sections config
    ├── shipping: ShippingZone[], carriers[]
    ├── payment: Stripe config, MBWay config, PayPal config
    └── email: templates, from address, SMTP config
```

### 8.2 Firebase Cloud Functions

| Fonction | Trigger | Description |
|---|---|---|
| `onOrderCreated` | Firestore create | Décrémente stock, email confirmation client |
| `onOrderStatusChanged` | Firestore update | Email client (expédié, livré), notif admin |
| `stripeWebhook` | HTTP POST | Traite les events Stripe (succès/échec paiement) |
| `createAdminUser` | HTTPS Callable | Attribue custom claim `admin: true` |
| `generateDeliveryPDF` | HTTPS Callable | Génère bon livraison PDF → Storage |
| `optimizeProductImage` | Storage onFinalize | Redimensionne + convertit en WebP |
| `updateProductRating` | Firestore create (review) | Recalcule la note moyenne du produit |
| `scheduledStockAlert` | Cron (daily 8h00) | Email admin liste produits stock < seuil |
| `generateSitemap` | Cron (daily 4h00) | Génère sitemap XML 4 langues → Storage |
| `cleanupOrphanMedia` | Cron (weekly) | Supprime images Storage non référencées |
| `sendCartReminder` | Cron (hourly) | Relance panier abandonné (>24h, opt-in) |

### 8.3 Règles de sécurité Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Produits : lecture publique, écriture admin
    match /products/{productId} {
      allow read: if resource.data.status == "published";
      allow write: if request.auth.token.admin == true;
    }

    // Catégories : lecture publique, écriture admin
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth.token.admin == true;
    }

    // Commandes : lecture/écriture owner, lecture admin
    match /orders/{orderId} {
      allow read: if request.auth.uid == resource.data.userId
                  || request.auth.token.admin == true;
      allow create: if request.auth != null
                    && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth.token.admin == true;
    }

    // Utilisateurs : lecture/écriture owner, lecture admin
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      allow read: if request.auth.token.admin == true;
    }

    // Avis : lecture publique approuvés, écriture auth
    match /reviews/{reviewId} {
      allow read: if resource.data.isApproved == true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.token.admin == true;
    }

    // Settings, coupons : admin uniquement
    match /settings/{doc} {
      allow read, write: if request.auth.token.admin == true;
    }
    match /coupons/{couponId} {
      allow read: if true; // validation côté client
      allow write: if request.auth.token.admin == true;
    }
  }
}
```

---

## 9. Catalogue produits & catégories

### 9.1 Les 6 catégories

| # | Catégorie | Slug PT | Produits | Exemples |
|---|---|---|---|---|
| 1 | 📱 Téléphones & Hi-Tech | `telefones-hitech` | 50 | Smartphones, tablettes, écouteurs, montres connectées, drones, accessoires |
| 2 | 🏠 Maison & Décoration | `casa-decoracao` | 50 | Textiles maison, objets déco, miroirs, cadres, bougies, rideaux |
| 3 | 🛋️ Meubles & Lampes | `moveis-candeeiros` | 50 | Canapés, tables, chaises, étagères, lampes de sol, appliques, plafonniers |
| 4 | 🔧 Bricolage | `bricolage` | 50 | Outils électriques, quincaillerie, visserie, peinture, équipements sécurité |
| 5 | 🔥 Barbecues & Planchas | `barbecues-planchas` | 50 | BBQ gaz/charbon/électrique, planchas inox, accessoires de cuisson |
| 6 | 🏊 Piscines & Spas | `piscinas-spas` | 50 | Piscines hors-sol, spas gonflables, robots nettoyeurs, traitement eau |

**Total : 300 produits au lancement**

### 9.2 Priorité d'import

1. Commencer par **10 produits par catégorie** pour le développement (60 produits total)
2. Compléter à **50 par catégorie** avant le lancement
3. Préparer la structure pour extension à **1 000+ produits** sans migration

---

## 10. Internationalisation i18n

### 10.1 Configuration

| Code | Langue | Marché | URL | Currency |
|---|---|---|---|---|
| `pt` | Portugais | Portugal (marché principal) | `imexmercado.pt/` | EUR |
| `fr` | Français | France | `imexmercado.pt/fr/` | EUR |
| `de` | Allemand | Allemagne / Autriche | `imexmercado.pt/de/` | EUR |
| `it` | Italien | Italie | `imexmercado.pt/it/` | EUR |

### 10.2 Namespaces i18next

```
locales/
├── pt/
│   ├── common.json       # Navigation, boutons, labels génériques
│   ├── home.json         # Textes homepage
│   ├── products.json     # Fiche produit, catalogue
│   ├── checkout.json     # Tunnel commande
│   ├── account.json      # Espace compte
│   └── legal.json        # CGV, confidentialité, mentions
├── fr/  (même structure)
├── de/  (même structure)
└── it/  (même structure)
```

### 10.3 Règles i18n

- Détection automatique langue navigateur (`i18next-browser-languageDetector`)
- Préférence persistée en cookie httpOnly + profil Firestore
- Fallback vers portugais si langue non supportée
- Balises `<link rel="alternate" hreflang="xx">` dans le `<head>` pour chaque page
- Slugs URL traduits par langue (ex: `/piscinas-spas` PT, `/piscines-spas` FR)
- Dates formatées selon la locale (`Intl.DateTimeFormat`)
- Nombres et prix selon la locale (`Intl.NumberFormat` — ex: `1.234,56 €` vs `1,234.56 €`)
- TVA calculée selon le pays de livraison (EU OSS règles)

---

## 11. Sécurité & conformité

### 11.1 Sécurité applicative

- **HTTPS** obligatoire sur tous les domaines (Vercel — Let's Encrypt automatique)
- **CSP** (Content Security Policy) stricte via headers Vercel
- **Tokens Firebase JWT** — expiration 1h, refresh transparent
- **Custom claims** Firebase pour distinction roles (customer / admin)
- **Rate limiting** sur toutes les Cloud Functions (max 100 req/min/IP)
- **Validation double** : Zod côté client + Firebase Security Rules côté serveur
- Pas de données carte bancaire stockées (Stripe gère — PCI-DSS compliant)
- Secrets dans Vercel Environment Variables et Firebase Config (jamais dans le code)
- Dépendances auditées régulièrement (`pnpm audit`)

### 11.2 Conformité RGPD

- Bannière consentement cookies au premier chargement (multi-langues)
- Catégories de cookies : Fonctionnel (obligatoire) | Analytics (opt-in) | Marketing (opt-in)
- Politique de confidentialité complète par langue
- Droit à l'effacement : suppression compte + données Firestore sur demande
- Droit à la portabilité : export données utilisateur (JSON)
- DPO (Data Protection Officer) désigné — coordonnées dans la politique

### 11.3 Conformité e-commerce européenne

- CGV conformes au droit portugais et à la directive 2011/83/UE
- Droit de rétractation 14 jours affiché clairement
- Informations pré-contractuelles obligatoires sur la page produit et checkout
- TVA intracommunautaire — OSS (One Stop Shop) si CA > 10 000€ EU
- Affichage prix TTC obligatoire (directive Omnibus)
- Avis clients vérifiés (indiquer si vérifiés ou non — obligation légale EU 2022)

### 11.4 Accessibilité

- Cible : **WCAG 2.1 niveau AA**
- Navigation clavier complète (focus visible, tabindex cohérent)
- Attributs ARIA sur tous les composants interactifs
- Contraste minimum 4.5:1 (texte normal), 3:1 (texte large)
- Textes alternatifs sur toutes les images produits
- Labels explicites sur tous les formulaires
- Messages d'erreur clairs et accessibles

---

## 12. Performance & SEO

### 12.1 Objectifs Core Web Vitals

| Métrique | Mobile | Desktop | Outil mesure |
|---|---|---|---|
| LCP (Largest Contentful Paint) | < 2,5s | < 1,5s | PageSpeed Insights |
| INP (Interaction to Next Paint) | < 200ms | < 100ms | CrUX |
| CLS (Cumulative Layout Shift) | < 0,1 | < 0,05 | Lighthouse |
| TTFB (Time To First Byte) | < 800ms | < 200ms | WebPageTest |
| Lighthouse Performance | > 85 | > 95 | Lighthouse CI |

### 12.2 Stratégies d'optimisation

**Images :**
- Format WebP obligatoire (conversion automatique Cloud Function)
- Tailles : 800×800 (standard), 1600×1600 (zoom), 200×200 (thumbnail)
- `loading="lazy"` sauf image principale produit et hero slide 1
- `fetchpriority="high"` sur les images above the fold

**JavaScript :**
- Code splitting par route (Vite — chunks automatiques)
- Lazy loading des composants non critiques (`React.lazy`)
- Tree-shaking agressif (Vite + TypeScript strict)
- Pas de librairies tierces lourdes non essentielles

**Data fetching :**
- React Query avec `staleTime` adapté par type de données
- Prefetch des données au hover sur les liens catégories
- Pagination Firestore (cursor-based) — max 24 produits/page
- Firebase Persistence pour cache offline

**Réseau :**
- Vercel CDN Edge Network (assets statiques en cache CDN mondial)
- `preconnect` vers Firebase, Stripe, CDN images
- Compression Brotli/gzip automatique (Vercel)

### 12.3 SEO technique

- **Sitemap XML** dynamique : `/sitemap.xml` — généré quotidiennement, 4 versions linguistiques
- **robots.txt** : exclusion `/compte`, `/panier`, `/commande`, `/admin`
- **Schémas JSON-LD** :
  - `Product` sur chaque fiche produit
  - `BreadcrumbList` sur catégories et produits
  - `Organization` sur la homepage
  - `WebSite` + `SearchAction` pour la recherche
- **Open Graph** + **Twitter Card** sur toutes les pages
- **Canonical URLs** par langue
- **hreflang** sur toutes les pages (4 langues + `x-default`)
- **URLs propres** : slugs i18n, sans paramètres, hiérarchiques

---

## 13. Déploiement & CI/CD

### 13.1 Environnements

| Environnement | Client | Admin | Firebase |
|---|---|---|---|
| Local | `localhost:5173` | `localhost:5174` | Emulators suite |
| Staging | `staging.imexmercado.pt` | `staging-admin.imexmercado.pt` | Firebase project staging |
| Production | `imexmercado.pt` | `admin.imexmercado.pt` | Firebase project prod |

### 13.2 Variables d'environnement

**App Client (Vercel Project A) :**
```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_STRIPE_PUBLISHABLE_KEY=
VITE_APP_URL=https://imexmercado.pt
```

**App Admin (Vercel Project B) :**
```env
VITE_FIREBASE_API_KEY=           # Même projet Firebase
VITE_FIREBASE_PROJECT_ID=
VITE_ADMIN_URL=https://admin.imexmercado.pt
```

**Firebase Functions :**
```env
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
FROM_EMAIL=noreply@imexmercado.pt
```

### 13.3 Pipeline CI/CD — GitHub Actions

```yaml
# Fichier .github/workflows/client.yml (simplifié)
name: Client CI/CD
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  quality:
    - Checkout + pnpm install
    - TypeScript strict check (tsc --noEmit)
    - ESLint (0 warnings tolérés en production)
    - Tests unitaires Vitest
    - Build Turborepo (cache entre jobs)

  deploy-preview:
    if: pull_request
    - Deploy Vercel Preview (URL unique par PR)
    - Commentaire PR avec lien preview

  deploy-staging:
    if: push develop
    - Deploy Vercel Staging

  deploy-production:
    if: push main
    - Deploy Vercel Production
    - Deploy Firebase Functions + Rules
    - Notification Slack résultat
```

### 13.4 Vercel — Configuration

**vercel.json (apps/client) :**
```json
{
  "framework": "vite",
  "buildCommand": "cd ../.. && pnpm turbo build --filter=client",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

---

## 14. Planning & livrables

### 14.1 Phases de développement

| Phase | Durée | Contenu | Livrable |
|---|---|---|---|
| **Phase 0** | S1 | Setup monorepo, Turborepo, pnpm, CI/CD, Firebase init, design tokens, packages partagés | Repo fonctionnel + pipeline vert |
| **Phase 1** | S2–S3 | Design System : composants UI de base (Button, Input, Card, Modal, Badge...) + documentation Storybook | Librairie composants |
| **Phase 2** | S3–S5 | App Admin — Catalogue : CRUD produits complet, upload images, catégories, traductions | Admin v1 — Gestion catalogue |
| **Phase 3** | S5–S8 | App Client — Catalogue : Homepage (toutes sections), page catégorie, page produit, recherche, i18n 4 langues | Client v1 — Vitrine produits |
| **Phase 4** | S8–S11 | E-commerce core : panier, checkout 4 étapes, paiement Stripe/MBWay/PayPal, espace compte, emails | Fonctionnalité achat complète |
| **Phase 5** | S11–S13 | App Admin — Avancé : dashboard KPIs, gestion commandes, clients, promotions, gestion homepage | Admin v2 — Back-office complet |
| **Phase 6** | S13–S15 | QA & Performance : tests E2E Playwright, audits Lighthouse, RGPD, accessibilité, corrections, recette client | Site validé |
| **Phase 7** | S16 | Lancement : mise en prod, import 300 produits, formation équipe, monitoring J+30 | 🚀 **GO LIVE** |

**Durée totale : 16 semaines (4 mois)**

### 14.2 Jalons clés

```
Semaine  1 : ✅ Repo + CI/CD opérationnel
Semaine  3 : ✅ Design System livré
Semaine  5 : ✅ Admin — Gestion catalogue fonctionnelle
Semaine  8 : ✅ Client — Vitrine publique fonctionnelle
Semaine 11 : ✅ Fonctionnalité achat complète (panier → confirmation)
Semaine 13 : ✅ Back-office complet
Semaine 15 : ✅ Recette client — Validation finale
Semaine 16 : 🚀 Mise en production imexmercado.pt
```

---

## 15. Budget prévisionnel

### 15.1 Infrastructure (récurrent)

| Service | Plan | Coût mensuel |
|---|---|---|
| Vercel Pro (2 projets) | Pro | ~40 €/mois |
| Firebase Blaze (pay-as-you-go) | Blaze | ~30–80 €/mois |
| Resend (emails transactionnels) | Pro | ~20 €/mois |
| Algolia Search (optionnel) | Starter | ~50 €/mois |
| **Total infrastructure** | | **~90–190 €/mois** |

### 15.2 Coûts one-shot

| Poste | Estimation |
|---|---|
| Nom de domaine `imexmercado.pt` | ~15 €/an |
| Traductions professionnelles FR/DE/IT | 800–1 500 € |
| Photographie produits (si nécessaire) | Sur devis |
| Audit sécurité / Pentest (recommandé) | 500–1 500 € |
| Formation équipe admin (2 jours) | Sur devis |

### 15.3 Commissions transactionnelles

| Moyen de paiement | Commission |
|---|---|
| Stripe (carte EU) | 1,4% + 0,25€ / transaction |
| Stripe (carte non-EU) | 2,9% + 0,25€ / transaction |
| PayPal | 3,49% + 0,35€ / transaction |
| MBWay (via Stripe) | Inclus dans Stripe |

---

## ANNEXES

### A. Liens de référence

- **Worten.pt** — Référence UI/UX principale : https://www.worten.pt/
- **Firebase Documentation** : https://firebase.google.com/docs
- **Vercel Documentation** : https://vercel.com/docs
- **React Documentation** : https://react.dev
- **Turborepo** : https://turbo.build/repo
- **shadcn/ui** : https://ui.shadcn.com
- **Stripe Elements** : https://stripe.com/docs/elements
- **react-i18next** : https://react.i18next.com

### B. Checklist lancement

- [ ] Domaine `imexmercado.pt` configuré sur Vercel + DNS
- [ ] Certificat SSL actif
- [ ] Firebase project production configuré
- [ ] Variables d'environnement production renseignées
- [ ] 300 produits importés et vérifiés
- [ ] Paiement Stripe testé en mode live
- [ ] Emails transactionnels testés (confirmation, expédition)
- [ ] Google Analytics / Search Console configurés
- [ ] Sitemap soumis à Google Search Console (4 langues)
- [ ] Bandeau RGPD + politique de confidentialité en ligne
- [ ] CGV en ligne (4 langues)
- [ ] Test de charge (simuler 100 utilisateurs simultanés)
- [ ] Audit Lighthouse > 85 mobile sur pages principales
- [ ] Test paiement complet (commande test → confirmation)
- [ ] Formation équipe admin effectuée
- [ ] Plan de backup Firestore activé
- [ ] Monitoring d'erreurs (Sentry ou Vercel Analytics) configuré

---

*Document confidentiel — IMEXSULTING Lda — imexmercado.pt — Avril 2026*
*Toute reproduction interdite sans autorisation écrite*
