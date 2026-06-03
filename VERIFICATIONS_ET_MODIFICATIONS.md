# Plan de Travail : Vérifications et Modifications — imexmercado.pt

Ce document sert de fil conducteur pour le suivi, l'implémentation et la validation des modifications requises sur le site (Client et Dashboard Admin).

---

## 📁 1. CATALOGUE PRODUITS & CATÉGORIES
- [x] **Volume de produits** : Intégrer ou valider la présence de 300 produits (environ 50 par catégorie).
- [x] **6 catégories principales** dans la structure :
  - Telephones et Hitech
  - Maison & décoration
  - Meubles, lampes
  - Bricolage
  - Barbecues et Planchas
  - Piscines et Spas

---

## 📱 2. RESPONSIVE & UI
- [ ] **Affichage mobile** : Corriger et valider le rendu responsive sur toutes les pages (client et admin).
- [ ] **Dimensions des bannières** :
  - Indiquer explicitement les dimensions requises dans le dashboard admin.
  - Dimensions requises : `1920×600px` (desktop) / `768×400px` (mobile).
- [ ] **Gestion des bannières (Admin)** :
  - Ajouter l'interface d'administration avec prévisualisation des bannières.
  - Ajouter un guide indiquant clairement les dimensions d'image requises.

---

## 📝 3. DESCRIPTIONS & FICHES PRODUITS
- [x] **Descriptions produits** : Réécrire et formater toutes les descriptions (mise en gras, bullet points, mise en avant des avantages clients, incitation à l'achat, génération via le seed).
- [x] **Avis clients** :
  - [x] Ajouter au moins 20 avis clients sous chaque produit.
  - [x] Rendre ces avis gérables/modifiables directement depuis le dashboard admin.
- [x] **Notification d'achat (Social Proof)** :
  - [x] Activer la notification dynamique : *"Um cliente acabou de comprar de [cidade] há X minutos"* (Un client vient d'acheter à [ville] il y a X minutes).
- [x] **Suggestions de produits** :
  - [x] Afficher des suggestions de produits similaires ou complémentaires sur la fiche produit (modal).
  - [x] Afficher des suggestions complémentaires lors de l'ajout au panier.

---

## 🔍 4. RECHERCHE
- [ ] **Barre de recherche** :
  - Implémenter l'autocomplétion.
  - Ajouter les suggestions automatiques de mots-clés et de noms de produits lors de la saisie.

---

## 💳 5. PAIEMENTS
- [ ] **Méthodes de paiement à intégrer** :
  - [ ] Virement bancaire SEPA (option par défaut)
  - [ ] MB WAY (prioritaire pour le Portugal)
  - [ ] Multibanco (références de paiement pour le Portugal)
  - [ ] Stripe (Visa / Mastercard)
  - [ ] PayPal
- [ ] **Dashboard Intégration** : Créer l'interface de configuration simple dans l'admin (saisie des clés API, activation/désactivation par mode de paiement).

---

## 📣 6. MARKETING & PUBLICITÉ
- [ ] **Pixels & Tracking** :
  - [ ] Intégration Meta Pixel (Facebook / Instagram Ads)
  - [ ] Intégration Google Analytics GA4
  - [ ] Intégration Google Tag Manager (GTM)
- [ ] **Dashboard Scripts** : Permettre l'ajout d'autres pixels ou scripts tiers directement depuis l'administration sans toucher au code.

---

## 📧 7. AUTOMATISATIONS & MESSAGES
- [ ] **Emails automatiques** :
  - [ ] Email de panier abandonné
  - [ ] Email de paiement annulé
  - [ ] Email de confirmation de commande
  - [ ] Email d'expédition de commande avec lien de suivi colis
- [ ] **Gestion des templates** : Permettre la visualisation et la personnalisation des templates d'emails depuis le dashboard admin.

---

## ⚖️ 8. PAGES LÉGALES (UE & RGPD)
- [ ] **Pages légales éditables** depuis le dashboard admin :
  - [ ] Mentions légales
  - [ ] Politique de confidentialité (conforme RGPD)
  - [ ] Politique de remboursement et retours (minimum 14 jours légaux UE)
  - [ ] Conditions Générales de Vente (CGV)
  - [ ] Politique de livraison (délais et zones de livraison)

---

## 🍪 9. COOKIES (RGPD)
- [ ] **Bannière de consentement** : Implémenter une bannière cookies conforme RGPD.
- [ ] **Bloquer les cookies non essentiels** avant le consentement explicite de l'utilisateur.
- [ ] **Politique de cookies** éditable depuis l'admin.
- [ ] **Catégorisation des cookies** (Nécessaires, Analytiques, Marketing).

---

## 🔒 10. SÉCURITÉ
- [ ] **HTTPS** : Forcer la redirection HTTPS sur l'ensemble du site.
- [ ] **Endpoints API** : Sécuriser tous les endpoints.
- [ ] **Rôles & Permissions** : Gérer les accès dans le dashboard admin.
- [ ] **Protections** : Sécuriser contre les attaques XSS, injections SQL et failles CSRF.
- [ ] **Sécurité Admin** : Politique de mots de passe forts pour les comptes administrateurs.
- [ ] **Conformité RGPD** : Permettre le droit à l'oubli et l'export des données client sur demande.

---

## 🌐 11. LANGUES
- [ ] **Bilingue** : Configurer uniquement le Portugais et le Français.
  - **Portugais (PT)** : Langue par défaut de la plateforme.
  - **Français (FR)** : Langue optionnelle, activable ou désactivable depuis le dashboard admin.

---

## 📌 12. POINTS SUPPLÉMENTAIRES & CONFIGURATIONS
- [ ] **SEO** : Rendre les balises meta title & description éditables pour chaque produit et chaque page.
- [ ] **Sitemap & Search Console** : Génération automatique du `sitemap.xml` et préparation pour Google Search Console.
- [ ] **Open Graph & Favicon** : Optimiser le rendu lors du partage sur les réseaux sociaux (WhatsApp, Facebook, etc.) et intégrer le favicon.
- [ ] **Gestion des stocks** :
  - Alerte de stock bas.
  - Masquage automatique des produits en rupture de stock.
- [ ] **Page 404** personnalisée et soignée.
- [ ] **Performances** : Compression automatique des images et implémentation du lazy loading.
- [ ] **Zones de livraison** : Configuration des zones européennes et de leurs tarifs respectifs.
- [ ] **Informations fiscales** : Affichage obligatoire du numéro de TVA européen (NIF Portugal) dans les CGV et sur les factures émises.
