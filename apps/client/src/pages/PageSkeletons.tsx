import React from 'react';

const PageSkeleton = ({ title }: { title: string }) => (
  <div className="container mx-auto px-4 py-20 text-center">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
    <p className="text-gray-500">Cette page est en cours de développement...</p>
  </div>
);

// Auth Pages
export const LoginPage = () => <PageSkeleton title="Connexion" />;
export const RegisterPage = () => <PageSkeleton title="Inscription" />;
export const ForgotPasswordPage = () => <PageSkeleton title="Mot de passe oublié" />;

// Shop Pages
export const ProductPage = () => <PageSkeleton title="Fiche Produit" />;
export const CartPage = () => <PageSkeleton title="Panier" />;
export const CheckoutPage = () => <PageSkeleton title="Tunnel de Commande" />;
export const ConfirmationPage = () => <PageSkeleton title="Confirmation de Commande" />;

// Account Pages
export const AccountDashboard = () => <PageSkeleton title="Mon Compte" />;
export const OrdersPage = () => <PageSkeleton title="Mes Commandes" />;
export const AddressesPage = () => <PageSkeleton title="Mes Adresses" />;
export const FavoritesPage = () => <PageSkeleton title="Mes Favoris" />;

// Informational Pages
export const ContactPage = () => <PageSkeleton title="Contactez-nous" />;
export const AboutPage = () => <PageSkeleton title="À Propos de Nous" />;

// Legal Pages
export const CGVPage = () => <PageSkeleton title="Conditions Générales de Vente" />;
export const PrivacyPage = () => <PageSkeleton title="Politique de Confidentialité" />;
export const LegalPage = () => <PageSkeleton title="Mentions Légales" />;
export const ShippingPage = () => <PageSkeleton title="Informations de Livraison" />;
export const ReturnsPage = () => <PageSkeleton title="Politique de Retours" />;
