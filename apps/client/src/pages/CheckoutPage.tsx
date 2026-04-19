import React, { useState, useEffect } from 'react';
import { auth, setDocument, useAuth } from '@imexmercado/firebase';
console.log("CheckoutPage.tsx Module Loaded - setDocument exists:", !!setDocument);
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Truck, CreditCard, CheckCircle, 
  ArrowRight, ShieldCheck, CaretRight, House,
  Bank, Globe, LockKey, SealCheck, NavigationArrow, Check, Info, Gift, PencilSimple, ShoppingCart, CaretDown, CaretUp,
  Eye, EyeSlash, MapPin, Trash
} from '@phosphor-icons/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { usePayment } from '../context/PaymentContext';
import { useCart } from '../context/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { StripePaymentForm } from '../components/shop/StripePaymentForm';
import { useStripe, useElements, CardNumberElement } from '@stripe/react-stripe-js';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { CreditCard as SquareCreditCard, PaymentForm } from 'react-square-web-payments-sdk';

function StripePaymentInner({ isProcessing, setIsProcessing, nextStep, totalPrice }: any) {
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const handleSumbit = async () => {
      if (!stripe || !elements || isProcessing) return;

      setIsProcessing(true);
      try {
        const response = await fetch('/api/create-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: totalPrice,
            currency: 'EUR',
            gateway: 'stripe',
            orderId: `ORD-STR-${Date.now()}`
          }),
        });
        
        const { clientSecret } = await response.json();

        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardNumberElement)!,
          },
        });

        if (result.error) {
          alert(result.error.message);
        } else if (result.paymentIntent.status === 'succeeded') {
          nextStep();
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    };

    document.addEventListener('STRIPE_SUBMIT', handleSumbit);
    return () => document.removeEventListener('STRIPE_SUBMIT', handleSumbit);
  }, [stripe, elements, isProcessing, totalPrice]);

  return <StripePaymentForm />;
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGateway, setSelectedGateway] = useState<string | null>(null);
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { config, isLoading: isPaymentLoading, activeGateways } = usePayment();
  const { items, totalItems, totalPrice, setDrawerOpen } = useCart();
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(false);
  console.log("CheckoutPage Render - isLoginMode status:", isLoginMode);
  const [isManualEditing, setIsManualEditing] = useState(false);
  const [showManualAddress, setShowManualAddress] = useState(false);
  const [isAddressSaved, setIsAddressSaved] = useState(false);
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const { user, profile, loading: authLoading } = useAuth();

  // Smart Auto-Scroll to Active Step
  useEffect(() => {
    const activeStepNode = document.getElementById(`step-content-${currentStep}`);
    if (activeStepNode) {
      activeStepNode.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentStep]);

  // Security: Redirect to store if cart becomes empty during checkout (except on success)
  useEffect(() => {
    if (totalItems === 0 && currentStep !== 4 && !authLoading) {
      navigate('/boutique');
    }
  }, [totalItems, currentStep, navigate, authLoading]);

  useEffect(() => {
    if (config?.stripe?.enabled && config?.stripe?.publishableKey) {
      setStripePromise(loadStripe(config.stripe.publishableKey));
    }
  }, [config]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'France' // Defaulting to typically expected country
  });

  useEffect(() => {
    if (profile && !authLoading) {
      setFormData(prev => ({
        ...prev,
        firstName: prev.firstName || profile.firstName || '',
        lastName: prev.lastName || profile.lastName || '',
        email: prev.email || profile.email || user?.email || '',
        phone: prev.phone || profile.phone || '',
        address: prev.address || profile.address || '',
        city: prev.city || profile.city || '',
        zipCode: prev.zipCode || profile.zipCode || '',
        country: prev.country || profile.country || 'France'
      }));
      
      // Auto-sélectionner l'adresse par défaut si aucune n'est sélectionnée
      if (!selectedAddressId) {
        if (profile.addresses?.length > 0) {
          const defaultAddr = profile.addresses.find((a: any) => a.isDefault) || profile.addresses[0];
          setSelectedAddressId(defaultAddr.id);
        } else if (profile.address) {
          setSelectedAddressId('root-default');
        }
      }
    } else if (user && !authLoading) {
      setFormData(prev => ({ ...prev, email: prev.email || user.email || '' }));
    }
  }, [profile, user, authLoading, selectedAddressId]);

  const handleDeleteAddress = async (addressId: string) => {
    if (!user || !profile?.addresses) return;
    if (window.confirm('Voulez-vous vraiment supprimer cette adresse ?')) {
      try {
        const updatedAddresses = profile.addresses.filter((a: any) => a.id !== addressId);
        await setDocument('users', user.uid, {
          ...profile,
          addresses: updatedAddresses
        });
        // Si nous supprimons l'adresse actuellement sélectionnée (basée sur le contenu et non l'ID car l'ID n'est pas tjs ds formData)
        if (formData.address === profile.addresses.find((a: any) => a.id === addressId)?.address) {
          setShowManualAddress(true);
        }
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, formData.email, loginPassword);
      // useAuth will automatically update and pre-fill the form
    } catch (err: any) {
      setAuthError('Email ou mot de passe incorrect.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreatePayment = async (gateway: string, additionalData: any = {}) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalPrice,
          currency: 'EUR',
          gateway,
          orderId: `ORD-${Date.now()}`,
          customer: formData,
          items: items,
          ...additionalData
        }),
      });

      const data = await response.json();
      
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else if (data.payment) {
        nextStep();
      }
      
      return data;
    } catch (error) {
      console.error('Payment Error:', error);
      alert('Une erreur est survenue lors du paiement.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (currentStep === 4) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-white">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="bg-success text-white w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-2xl relative z-10 border-8 border-green-50">
            <CheckCircle size={48} weight="bold" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4 text-center">
          Commande <span className="text-success">Confirmée</span>
        </h1>
        <p className="text-gray-500 mb-8 font-medium max-w-sm text-center">
          Merci pour votre achat {formData.firstName}. Vous allez recevoir un email de confirmation d'ici quelques minutes.
        </p>
        <div className="flex gap-4">
          <Link to="/" className="px-8 py-4 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-colors">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  // Écran de chargement plein écran supprimé au profit des Skeletons par section

  return (
    <div className="relative lg:min-h-screen bg-white">

      {/* Background Split for Desktop */}
      <div className="hidden lg:block absolute top-0 right-0 bottom-0 w-[45%] bg-[#F5F5F5] border-l border-gray-200 z-0" />
      
      <div className="relative z-10 w-full max-w-[1600px] lg:px-8 mx-auto flex flex-col-reverse lg:flex-row">
        
        {/* ─── LEFT COLUMN: CHECKOUT FLOW ─── */}
        <div className="w-full lg:w-[55%] bg-white pb-32 lg:pb-32 pt-1 lg:pt-12 px-4 sm:px-6 lg:pt-12 lg:pr-12 xl:pr-16 lg:min-h-screen">
          <div className="w-full ml-auto">
        
        {/* DASHBOARD CARD FOR MOBILE (Summary + Stepper) — FULL WIDTH EDITION */}
        <div className="lg:hidden -mt-1 mb-6 bg-white border-b border-gray-100 shadow-sm overflow-hidden relative z-50">
          {/* 1. Summary Header (Repris du bloc Sticky) */}
            <div 
              onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
              className="bg-gray-50/50 px-4 py-4 flex items-center justify-between cursor-pointer border-b border-gray-100 transition-colors active:bg-gray-100"
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-gray-900 tracking-[0.2em]">Détails commande</span>
                <motion.div animate={{ rotate: isSummaryExpanded ? 180 : 0 }}>
                  <CaretDown size={10} weight="bold" className="text-primary" />
                </motion.div>
              </div>
              <span className="text-base font-black text-gray-900 tracking-tighter">{totalPrice.toFixed(2)}€</span>
            </div>

          {/* 2. Stepper Navigation integrated in card */}
          <div className="px-4 py-3 bg-white">
            <nav className="flex items-center justify-between">
              <button 
                onClick={() => setDrawerOpen(true)}
                className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 transition-colors" 
                title="Consulter mon panier"
              >
                Panier
              </button>
              <div className="flex items-center gap-1 text-gray-200">
                <CaretRight size={8} weight="bold" />
              </div>
              <div className="flex-1 flex items-center justify-between px-2">
                {[
                  { id: 1, label: 'Infos' },
                  { id: 2, label: 'Livraison' },
                  { id: 3, label: 'Paiement' }
                ].map((step, idx) => {
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;
                  return (
                    <React.Fragment key={step.id}>
                      <button 
                        onClick={() => isCompleted && setCurrentStep(step.id)}
                        disabled={!isCompleted}
                        className={`text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] transition-all relative py-1 ${
                          isActive ? 'text-gray-900' : 
                          isCompleted ? 'text-success' : 'text-gray-300'
                        }`}
                      >
                        {step.label}
                        {isActive && (
                          <motion.div layoutId="active-nav-dot" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary" />
                        )}
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>

        {/* DESKTOP ONLY STEPPER (Original version hidden on mobile) */}
        <div className="hidden lg:block mb-12">
          <nav className="flex items-center gap-3 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]">
            <button 
              onClick={() => setDrawerOpen(true)}
              className="text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-2"
              title="Consulter mon panier"
            >
              Panier
              <CaretRight size={8} weight="bold" className="text-gray-300" />
            </button>
            {[
              { id: 1, label: 'Infos' },
              { id: 2, label: 'Livraison' },
              { id: 3, label: 'Paiement' }
            ].map((step, idx) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <React.Fragment key={step.id}>
                  <button 
                    onClick={() => isCompleted && setCurrentStep(step.id)}
                    disabled={!isCompleted}
                    className={`transition-all duration-300 ${
                      isActive ? 'text-gray-900 border-b-2 border-gray-900 pb-0.5' : 
                      isCompleted ? 'text-success hover:text-gray-900' : 
                      'text-gray-300 cursor-default'
                    }`}
                  >
                    {step.label}
                  </button>
                  {idx < 2 && (
                    <CaretRight size={8} weight="bold" className="text-gray-200" />
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        </div>
        
        {/* EXPRESS CHECKOUT REMOVED FOR CLASSIC CHRONOLOGICAL FLOW */}

        {/* ACCORDION 1: Contact */}
        <div className={`mb-2 lg:mb-6 transition-all duration-300 ${currentStep > 1 ? 'opacity-80' : 'opacity-100'}`}>
          <div id="step-content-1" className="flex items-center justify-between mb-2 lg:mb-4 h-8 scroll-mt-24">
            <h2 className="font-black text-lg uppercase tracking-tight text-gray-900 border-b-2 border-primary pb-1">
              Vos Coordonnées
            </h2>
            {!authLoading && !user && currentStep === 1 && (
              <button 
                onClick={() => {
                  setIsLoginMode(!isLoginMode);
                  setAuthError(null);
                }}
                className="text-[10px] font-black text-primary uppercase hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 border border-primary/20"
              >
                {isLoginMode ? <ArrowRight size={14} weight="bold" /> : <User size={14} weight="bold" />}
                {isLoginMode ? "Créer un compte" : "Déjà client ?"}
              </button>
            )}
          </div>
          
          {currentStep === 1 ? (
            <AnimatePresence mode="wait">
              <motion.div 
                key={isLoginMode ? 'login' : 'signup'}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-2 lg:space-y-4 pt-1 pb-1 w-full">
                  {authError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-[10px] font-bold uppercase tracking-tight border border-red-100 flex items-center gap-2">
                       <div className="w-1 h-1 bg-red-600 rounded-full" />
                       {authError}
                    </div>
                  )}

                  {authLoading ? (
                    /* ─── SKELETON CHARGEMENT ─── */
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 animate-pulse space-y-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                        <div className="space-y-2 flex-1">
                          <div className="h-3 bg-gray-200 rounded w-1/4" />
                          <div className="h-4 bg-gray-200 rounded w-1/2" />
                        </div>
                      </div>
                      <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-100 rounded w-1/3" />
                          <div className="h-4 bg-gray-200 rounded w-3/4" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-100 rounded w-1/3" />
                          <div className="h-4 bg-gray-200 rounded w-3/4" />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <div className="h-3 bg-gray-100 rounded w-1/4" />
                          <div className="h-4 bg-gray-200 rounded w-1/3" />
                        </div>
                      </div>
                      <div className="h-12 bg-gray-200 rounded-xl w-full" />
                    </div>
                  ) : user ? (
                    /* ─── SMART IDENTIFIED VIEW ─── */
                    <div className="space-y-6 pt-2 pb-2">
                      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-primary">
                              <User size={20} weight="bold" />
                            </div>
                            <div>
                               <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">Client Identifié</p>
                               <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">
                                 {profile?.firstName ? `Ravi de vous revoir, ${profile.firstName} !` : "Bienvenue !"}
                               </h3>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 border-t border-gray-100 pt-4">
                            <div>
                              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Coordonnées</p>
                              <p className="text-xs font-bold text-gray-900 uppercase">
                                {profile?.firstName} {profile?.lastName}
                              </p>
                            </div>
                            <div>
                              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Email</p>
                              <p className="text-xs font-bold text-gray-900">{user.email}</p>
                            </div>
                            {profile?.phone && (
                              <div className="sm:col-span-2">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Téléphone</p>
                                <p className="text-xs font-bold text-gray-900">{profile.phone}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-6 flex items-center justify-end">
                            <button 
                              onClick={() => auth.signOut()}
                              className="text-[10px] font-black uppercase text-gray-400 hover:text-red-500 transition-colors"
                            >
                              Se déconnecter
                            </button>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => setCurrentStep(2)}
                        disabled={!formData.firstName || !formData.email}
                        className="w-full lg:flex hidden bg-gray-900 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:bg-black transition-all mt-4 text-xs disabled:opacity-50 flex items-center justify-center gap-3"
                      >
                        Continuer vers la livraison <ArrowRight size={16} weight="bold" />
                      </button>
                    </div>
                  ) : isLoginMode ? (
                    /* ─── LOGIN FORM ─── */
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-white border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 px-4 py-3.5 rounded-xl outline-none text-sm font-medium transition-all" placeholder="votre@email.com" required />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">Mot de passe</label>
                        <div className="relative">
                          <input 
                            type={showPassword ? "text" : "password"} 
                            value={loginPassword} 
                            onChange={(e) => setLoginPassword(e.target.value)} 
                            className="w-full bg-white border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 px-4 py-3.5 rounded-xl outline-none text-sm font-medium transition-all pr-12" 
                            placeholder="••••••••" 
                            required 
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                          >
                            {showPassword ? <EyeSlash size={16} weight="bold" /> : <Eye size={16} weight="bold" />}
                          </button>
                        </div>
                      </div>
                      <button 
                        type="submit"
                        disabled={isProcessing || !formData.email || !loginPassword}
                        className="w-full bg-gray-900 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:bg-black transition-all mt-2 text-xs disabled:opacity-50 flex items-center justify-center gap-3"
                      >
                        {isProcessing ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Se connecter"}
                      </button>
                    </form>
                  ) : (
                    /* ─── SIGNUP/GUEST FORM ─── */
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">Prénom</label>
                          <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-white border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 px-4 py-3.5 rounded-xl outline-none text-base sm:text-sm font-medium transition-all" placeholder="Votre prénom" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">Nom</label>
                          <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-white border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 px-4 py-3.5 rounded-xl outline-none text-base sm:text-sm font-medium transition-all" placeholder="Votre nom" />
                        </div>
                      </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">Email</label>
                          <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-white border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 px-4 py-3.5 rounded-xl outline-none text-base sm:text-sm font-medium transition-all" placeholder="votre@email.com" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">Téléphone</label>
                          <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-white border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 px-4 py-3.5 rounded-xl outline-none text-base sm:text-sm font-medium transition-all" placeholder="+33 6 12 34 56 78" />
                        </div>

                      <div className="pt-2 space-y-3">
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <div className="relative mt-0.5">
                            <input type="checkbox" className="peer sr-only" defaultChecked />
                            <div className="w-4 h-4 border-2 border-gray-200 rounded peer-checked:bg-gray-900 peer-checked:border-gray-900 transition-all" />
                            <Check size={10} weight="bold" className="absolute top-0.5 left-0.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                          </div>
                          <span className="text-[11px] font-medium text-gray-500 leading-tight group-hover:text-gray-900 transition-colors">
                            S'abonner à la newsletter d'IMEXSULTING pour recevoir des offres exclusives et des conseils personnalisés.
                          </span>
                        </label>
                      </div>

                      <button 
                        onClick={() => setCurrentStep(2)}
                        disabled={!formData.firstName || !formData.email}
                        className="w-full lg:block hidden bg-gray-900 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:bg-black transition-all mt-4 text-xs disabled:opacity-50"
                      >
                        Continuer vers la livraison
                      </button>

                      <div className="flex justify-center mt-4">
                        <Link to="/boutique" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-2">
                          <Bank size={14} weight="bold" />
                          Retour à la Boutique
                        </Link>
                      </div>

                      <p className="text-[9px] text-gray-400 font-medium text-center px-4 mt-6 leading-relaxed uppercase tracking-tighter">
                        En continuant, vous acceptez nos <Link to="/cgv" className="underline hover:text-gray-900">Conditions Générales de Vente</Link> et notre <Link to="/confidentialite" className="underline hover:text-gray-900">Politique de Confidentialité</Link>.
                      </p>
                    </>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="p-3 bg-gray-50/80 border border-gray-100 rounded-xl flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-100 transition-all cursor-pointer group" onClick={() => setCurrentStep(1)}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex-shrink-0 w-6 h-6 bg-white rounded-lg flex items-center justify-center text-success border border-gray-100 shadow-sm">
                  <Check size={12} weight="bold" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-2 min-w-0 overflow-hidden">
                  <span className="whitespace-nowrap">Envoyé à :</span>
                  <span className="text-gray-900 truncate lowercase">{user?.email || formData.email}</span>
                </div>
              </div>
              <button className="flex-shrink-0 text-primary group-hover:underline flex items-center gap-1 ml-2">
                <PencilSimple size={12} weight="bold" /> <span className="hidden xs:inline">Modifier</span>
              </button>
            </div>
          )}
        </div>

        {/* SECTION 2: Shipping */}
        {currentStep >= 2 && (
          <div className="mb-1 lg:mb-6 transition-all duration-300">
            {currentStep === 2 && (
              <div id="step-content-2" className="flex items-center justify-between mb-1 lg:mb-4 scroll-mt-24">
                <h2 className="font-black text-lg uppercase tracking-tight text-gray-900">
                  Où devons-nous vous livrer ?
                </h2>
              </div>
            )}
            
            {currentStep === 2 ? (
              <AnimatePresence>
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
                  <div className="space-y-1 lg:space-y-5 pt-1 pb-0 w-full">
                    
                    {/* SMART MULTI-ADDRESS SELECTION */}
                    {user && (
                      <div className="mb-8 space-y-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#00A859] ml-1">Adresses Enregistrées</label>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                          {authLoading ? (
                            <>
                              {[1, 2].map(i => (
                                <div key={i} className="bg-white border border-gray-100 p-5 rounded-2xl animate-pulse space-y-4">
                                  <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-gray-100 rounded-xl" />
                                    <div className="space-y-2 flex-grow">
                                      <div className="h-4 bg-gray-100 rounded w-1/3" />
                                      <div className="h-3 bg-gray-50 rounded w-1/2" />
                                      <div className="h-3 bg-gray-50 rounded w-2/3" />
                                    </div>
                                    <div className="w-5 h-5 bg-gray-100 rounded-full" />
                                  </div>
                                </div>
                              ))}
                            </>
                          ) : (() => {
                            let savedAddresses = [...(profile?.addresses || [])];
                            
                            // Si une adresse "racine" existe et n'est pas déjà dans le tableau (évite les doublons)
                            if (profile?.address) {
                              const rootAddressId = 'root-default';
                              const hasRootAlready = savedAddresses.some(a => a.id === rootAddressId || a.address === profile.address);
                              
                              if (!hasRootAlready) {
                                savedAddresses.unshift({
                                  id: rootAddressId,
                                  firstName: profile.firstName,
                                  lastName: profile.lastName,
                                  address: profile.address,
                                  city: profile.city,
                                  zipCode: profile.zipCode,
                                  country: profile.country,
                                  phone: profile.phone,
                                  isDefault: true
                                });
                              }
                            }

                            if (savedAddresses.length === 0) {
                              return (
                                <div className="text-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-100">
                                  <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100/50">
                                    <MapPin size={24} weight="duotone" className="text-gray-300" />
                                  </div>
                                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-relaxed">
                                    Aucune adresse enregistrée.<br />
                                    <span className="text-primary/60">Ajoutez-en une ci-dessous pour gagner du temps.</span>
                                  </p>
                                </div>
                              );
                            }

                            return savedAddresses.map((addr: any) => (
                              <div 
                                key={addr.id}
                                onClick={() => {
                                  setSelectedAddressId(addr.id);
                                  setFormData(prev => ({
                                    ...prev,
                                    firstName: addr.firstName,
                                    lastName: addr.lastName,
                                    address: addr.address,
                                    city: addr.city,
                                    zipCode: addr.zipCode,
                                    country: addr.country,
                                    phone: addr.phone
                                  }));
                                  setShowManualAddress(false); // Sélection exclusive : on ferme le formulaire manuel
                                }}
                                className={`bg-white border-2 p-5 rounded-2xl relative cursor-pointer hover:shadow-md transition-all group overflow-hidden ${
                                  selectedAddressId === addr.id ? 'border-[#00A859]' : 'border-gray-100 hover:border-primary/30'
                                }`}
                              >
                                {addr.isDefault && (
                                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#00A859]/5 rounded-bl-full transition-transform group-hover:scale-110" />
                                )}
                                <div className="flex items-start justify-between relative z-10">
                                  <div className="flex gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                      selectedAddressId === addr.id ? 'bg-[#00A859]/10 text-[#00A859]' : 'bg-gray-50 text-gray-400'
                                    }`}>
                                      <MapPin size={22} weight="bold" />
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-sm font-black text-gray-900 uppercase">{addr.firstName} {addr.lastName}</h4>
                                        {addr.isDefault && <span className="bg-[#00A859]/10 text-[#00A859] text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Principale</span>}
                                      </div>
                                      <p className="text-xs text-gray-500 font-medium leading-relaxed">
                                        {addr.address}<br />
                                        {addr.zipCode} {addr.city}, {addr.country}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end gap-2">
                                    {selectedAddressId === addr.id ? (
                                      <div className="bg-[#00A859] text-white p-1.5 rounded-full shadow-sm">
                                        <Check size={14} weight="bold" />
                                      </div>
                                    ) : (
                                      <div className="w-5 h-5 border-2 border-gray-100 rounded-full" />
                                    )}
                                    {!addr.isDefault && (
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteAddress(addr.id);
                                        }}
                                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                        title="Supprimer"
                                      >
                                        <Trash size={18} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ));
                          })()}
                        </div>
                        
                        {!showManualAddress && (
                          <div className="mt-4 text-center">
                            <button 
                              onClick={() => {
                                // On vide l'adresse actuelle pour désélectionner la liste et marquer l'exclusivité
                                setFormData(prev => ({
                                  ...prev,
                                  address: '',
                                  city: '',
                                  zipCode: ''
                                }));
                                setShowManualAddress(true);
                              }}
                              className="text-[10px] font-black uppercase text-gray-400 hover:text-primary transition-colors border-b border-gray-200 hover:border-primary"
                            >
                              + Utiliser une nouvelle adresse
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {(showManualAddress || !user || (profile && !profile.address && (!profile.addresses || profile.addresses.length === 0))) && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        {(profile?.address || (profile?.addresses && profile.addresses.length > 0)) && (
                          <div className="flex items-center justify-between mb-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-900 ml-1">Nouvelle Adresse</label>
                            <button onClick={() => setShowManualAddress(false)} className="text-[9px] font-bold text-gray-400 uppercase hover:text-red-500">Annuler</button>
                          </div>
                        )}
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">Pays / Région</label>
                          <select name="country" value={formData.country} onChange={handleInputChange} className="w-full bg-white border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 px-4 py-3.5 rounded-xl outline-none text-sm font-medium transition-all appearance-none">
                            <option value="France">France métropolitaine</option>
                            <option value="Suisse">Suisse</option>
                            <option value="Portugal">Portugal</option>
                            <option value="Belgique">Belgique</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Adresse complète</label>
                          <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-white border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 px-4 py-3.5 rounded-xl outline-none text-sm font-medium transition-all" placeholder="Numéro, rue, appartement..." />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">Code Postal</label>
                            <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} className="w-full bg-white border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 px-4 py-3.5 rounded-xl outline-none text-base sm:text-sm font-medium transition-all" placeholder="75001" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">Ville</label>
                            <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-white border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 px-4 py-3.5 rounded-xl outline-none text-base sm:text-sm font-medium transition-all" placeholder="Paris" />
                          </div>
                        </div>

                        {user && (
                          <div className="pt-2">
                            <label className="flex items-center gap-3 cursor-pointer group">
                              <div className="relative">
                                <input 
                                  type="checkbox" 
                                  className="peer sr-only" 
                                  checked={saveAddressToProfile}
                                  onChange={(e) => setSaveAddressToProfile(e.target.checked)}
                                />
                                <div className="w-5 h-5 border-2 border-gray-200 rounded-lg group-hover:border-primary peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                                  <Check size={12} weight="bold" className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                </div>
                              </div>
                              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight group-hover:text-gray-900 transition-colors">
                                Enregistrer cette adresse pour mes futurs achats
                              </span>
                            </label>
                          </div>
                        )}

                        <button 
                          onClick={async () => {
                            if (user) {
                              const baseProfile = profile || {
                                firstName: formData.firstName,
                                lastName: formData.lastName,
                                email: user.email,
                                phone: formData.phone,
                                addresses: [],
                                createdAt: new Date().toISOString()
                              };

                              let currentAddresses = [...(baseProfile.addresses || [])];
                              // Migration on save if old structure exists
                              if (currentAddresses.length === 0 && baseProfile.address) {
                                currentAddresses = [{
                                  id: 'root-default',
                                  firstName: baseProfile.firstName,
                                  lastName: baseProfile.lastName,
                                  address: baseProfile.address,
                                  city: baseProfile.city,
                                  zipCode: baseProfile.zipCode,
                                  country: baseProfile.country,
                                  phone: baseProfile.phone,
                                  isDefault: true
                                }];
                              }

                              // VÉRIFICATION DE DOUBLON
                              const normalizedNew = `${formData.address}${formData.city}${formData.zipCode}`.toLowerCase().replace(/\s/g, '');
                              const duplicate = currentAddresses.find(a => 
                                `${a.address}${a.city}${a.zipCode}`.toLowerCase().replace(/\s/g, '') === normalizedNew
                              );

                              if (duplicate) {
                                // C'est un doublon ! On le sélectionne simplement
                                setSelectedAddressId(duplicate.id);
                                setIsAddressSaved(true); // Pour l'animation de succès
                                setTimeout(() => {
                                  setIsAddressSaved(false);
                                  setShowManualAddress(false);
                                  setFormData(prev => ({
                                    ...prev,
                                    address: '',
                                    city: '',
                                    zipCode: ''
                                  }));
                                }, 1000);
                                return;
                              }

                              if (saveAddressToProfile) {
                                try {
                                  const newId = `addr-${Date.now()}`;
                                  const newAddress = {
                                    id: newId,
                                    firstName: formData.firstName,
                                    lastName: formData.lastName,
                                    address: formData.address,
                                    city: formData.city,
                                    zipCode: formData.zipCode,
                                    country: formData.country,
                                    phone: formData.phone,
                                    isDefault: currentAddresses.length === 0
                                  };

                                  await setDocument('users', user.uid, {
                                    ...baseProfile,
                                    addresses: [...currentAddresses, newAddress],
                                    updatedAt: new Date().toISOString()
                                  });
                                  
                                  setSelectedAddressId(newId);
                                  setIsAddressSaved(true);
                                  setTimeout(() => {
                                    setIsAddressSaved(false);
                                    setShowManualAddress(false);
                                    setFormData(prev => ({
                                      ...prev,
                                      address: '',
                                      city: '',
                                      zipCode: ''
                                    }));
                                  }, 1500);
                                } catch (err) {
                                  setSelectedAddressId('manual-session');
                                  setIsAddressSaved(true);
                                  setTimeout(() => {
                                    setIsAddressSaved(false);
                                    if (user) setShowManualAddress(false);
                                  }, 1500);
                                }
                              } else {
                                // Cas où l'utilisateur ne veut pas sauvegarder dans le profil 
                                // mais utilise l'adresse pour cette commande
                                setSelectedAddressId('manual-session');
                                setIsAddressSaved(true);
                                setTimeout(() => {
                                  setIsAddressSaved(false);
                                  setShowManualAddress(false);
                                }, 1500);
                              }
                            } else {
                              setSelectedAddressId('manual-session');
                              setIsAddressSaved(true);
                              setTimeout(() => {
                                setIsAddressSaved(false);
                                // For guests, we keep the manual address form visible
                              }, 1500);
                            }
                          }}
                          disabled={!formData.address || !formData.city}
                          className={`w-full font-black uppercase tracking-widest py-4 rounded-xl shadow-lg transition-all mt-4 text-xs disabled:opacity-50 flex items-center justify-center gap-2 ${
                            isAddressSaved ? 'bg-success text-white' : 'bg-gray-900 text-white hover:bg-black'
                          }`}
                        >
                          {isAddressSaved ? (
                            <>
                              <Check size={16} weight="bold" />
                              Adresse Enregistrée
                            </>
                          ) : (
                            'Valider cette adresse'
                          )}
                        </button>
                      </motion.div>
                    )}

                    {/* Mode de Livraison */}
                    <div className="mt-2 pt-6 border-t border-gray-100">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-900 ml-1 mb-4 block">Mode d'expédition</label>
                      <label className="flex items-center justify-between p-4 border-2 border-gray-900 rounded-xl bg-gray-50 cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="w-5 h-5 rounded-full border-[5px] border-gray-900 bg-white" />
                          <div>
                            <p className="font-bold text-gray-900 text-sm">Livraison Standard (Suivie)</p>
                            <p className="text-xs text-gray-500 font-medium tracking-tight">Livré dans 3 à 5 jours ouvrés</p>
                          </div>
                        </div>
                        <span className="font-black uppercase tracking-widest text-success border border-success/20 bg-success/10 px-2.5 py-1 rounded text-[10px]">Gratuit</span>
                      </label>
                    </div>

                    <button 
                      onClick={() => setCurrentStep(3)}
                      disabled={!selectedAddressId && (!showManualAddress || !formData.address || !formData.city)}
                      className="w-full lg:block hidden bg-gray-900 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:bg-black transition-all text-xs disabled:opacity-50"
                    >
                      {!selectedAddressId && showManualAddress && formData.address ? "Valider & Continuer" : 
                       !selectedAddressId ? "Sélectionnez une adresse" : "Continuer vers le paiement"}
                    </button>

                    <div className="lg:flex hidden justify-center mt-4">
                      <Link to="/boutique" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-2">
                        <Bank size={14} weight="bold" />
                        Retour à la Boutique
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : currentStep > 2 ? (
              <div className="p-3 bg-gray-50/80 border border-gray-100 rounded-xl flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-100 transition-all cursor-pointer group" onClick={() => setCurrentStep(2)}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex-shrink-0 w-6 h-6 bg-white rounded-lg flex items-center justify-center text-success border border-gray-100 shadow-sm">
                    <Check size={12} weight="bold" />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-2 min-w-0">
                    <span className="whitespace-nowrap">Livré à :</span>
                    <span className="text-gray-900 font-black truncate">
                      {(() => {
                        if (selectedAddressId) {
                          if (selectedAddressId === 'manual-session') {
                            return formData.address ? `${formData.address}, ${formData.city}` : "Adresse saisie";
                          }
                          const savedAddresses = [
                            ...(profile?.addresses || []),
                            ...(profile?.address ? [{ id: 'root-default', address: profile.address, city: profile.city }] : [])
                          ];
                          const selected = savedAddresses.find(a => a.id === selectedAddressId);
                          return selected ? `${selected.address}, ${selected.city}` : "Adresse sélectionnée";
                        }
                        return formData.address ? `${formData.address}, ${formData.city}` : "Adresse non définie";
                      })()}
                    </span>
                  </div>
                </div>
                <button className="flex-shrink-0 text-primary group-hover:underline flex items-center gap-1 ml-2">
                  <PencilSimple size={12} weight="bold" /> <span className="hidden xs:inline">Modifier</span>
                </button>
              </div>
            ) : null}
          </div>
        )}

        {/* SECTION 3: Payment */}
        {currentStep >= 3 && (
          <div id="step-content-3" className="transition-all duration-300 scroll-mt-24 mb-1">
            <div className="flex items-center mb-1 lg:mb-6">
              <h2 className="font-black text-lg uppercase tracking-tight text-gray-900 border-b-2 border-primary pb-1">
                Comment préférez-vous régler ?
              </h2>
            </div>
          
          {currentStep === 3 && (
            <AnimatePresence>
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
                <div className="pt-2 pb-0 lg:pt-4 lg:pb-6 w-full">

                  {/* Payment Gateway Accordion — formulaire inline */}
                  <div className="space-y-3 mb-8">

                    {/* STRIPE */}
                    {activeGateways.includes('stripe') && (
                      <div className={`border-2 rounded-2xl overflow-hidden transition-all ${selectedGateway === 'stripe' ? 'border-gray-900' : 'border-gray-100'}`}>
                        <button onClick={() => setSelectedGateway(selectedGateway === 'stripe' ? null : 'stripe')} className={`w-full flex items-center justify-between p-4 transition-all ${selectedGateway === 'stripe' ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}`}>
                          <div className="flex items-center gap-3">
                            <CreditCard size={24} className={selectedGateway === 'stripe' ? 'text-gray-900' : 'text-gray-400'} weight={selectedGateway === 'stripe' ? 'fill' : 'regular'} />
                            <span className={`text-sm font-bold ${selectedGateway === 'stripe' ? 'text-gray-900' : 'text-gray-500'}`}>Carte Bancaire</span>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedGateway === 'stripe' ? 'border-gray-900' : 'border-gray-300'}`}>
                            {selectedGateway === 'stripe' && <div className="w-2.5 h-2.5 bg-gray-900 rounded-full" />}
                          </div>
                        </button>
                        {selectedGateway === 'stripe' && (
                          <div className="border-t border-gray-100 bg-[#F8F9FA] p-6">
                            {stripePromise ? (
                              <Elements stripe={stripePromise}>
                                <StripePaymentInner isProcessing={isProcessing} setIsProcessing={setIsProcessing} nextStep={nextStep} totalPrice={totalPrice} />
                              </Elements>
                            ) : (
                              <div className="p-8 text-center"><div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto"></div></div>
                            )}
                            <button
                              onClick={() => document.dispatchEvent(new CustomEvent('STRIPE_SUBMIT'))}
                              disabled={isProcessing}
                              className="w-full lg:flex hidden bg-gray-900 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg hover:bg-black transition-all mt-6 text-xs disabled:opacity-50 items-center justify-center gap-3"
                            >
                              {isProcessing ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><LockKey size={16} weight="bold" /> Payer {totalPrice.toFixed(2)}€</>}
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* PAYPAL */}
                    {activeGateways.includes('paypal') && (
                      <div className={`border-2 rounded-2xl overflow-hidden transition-all ${selectedGateway === 'paypal' ? 'border-gray-900' : 'border-gray-100'}`}>
                        <button onClick={() => setSelectedGateway(selectedGateway === 'paypal' ? null : 'paypal')} className={`w-full flex items-center justify-between p-4 transition-all ${selectedGateway === 'paypal' ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}`}>
                          <div className="flex items-center gap-3">
                            <svg className="h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M19.16 7.42C19.12 7.37 18.06 6.32 15.65 6.32H8.38C8.01 6.32 7.69 6.57 7.63 6.93L5.27 21.84C5.23 22.09 5.42 22.32 5.67 22.32H9.28C9.58 22.32 9.83 22.1 9.88 21.8L10.33 18.91C10.38 18.55 10.7 18.3 11.07 18.3H12.92C15.86 18.3 18.17 16.63 18.77 12.82C18.89 12.06 18.9 11.3 18.8 10.59C18.72 10.01 18.55 9.46 18.3 8.97C18.01 8.35 17.65 7.85 17.58 7.75C17.5 7.66 17.5 7.53 17.58 7.44C17.65 7.35 17.78 7.29 17.89 7.32C18.33 7.43 18.77 7.45 19.16 7.42Z" fill="#113984"/>
                              <path d="M19.16 7.42C19.12 7.37 18.06 6.32 15.65 6.32H8.38C8.01 6.32 7.69 6.57 7.63 6.93L5.27 21.84C5.23 22.09 5.42 22.32 5.67 22.32H9.28C9.58 22.32 9.83 22.1 9.88 21.8L10.33 18.91C10.38 18.55 10.7 18.3 11.07 18.3H12.92C15.86 18.3 18.17 16.63 18.77 12.82C18.89 12.06 18.9 11.3 18.8 10.59C18.72 10.01 18.55 9.46 18.3 8.97C19.16 10.66 19.34 13.06 18.04 15.4C17.7 16.03 17.26 16.59 16.73 17.07L17.15 14.41C17.2 14.05 16.89 13.8 16.52 13.8H14.67C11.73 13.8 9.42 15.47 8.82 19.28L8.6 20.67L9.88 12.57C9.93 12.21 10.25 11.96 10.62 11.96H12.47C15.41 11.96 17.72 10.29 18.32 6.48C18.34 6.33 18.35 6.18 18.36 6.03C18.81 6.39 19.19 6.87 19.16 7.42Z" fill="#179BD7"/>
                            </svg>
                            <span className={`text-sm font-bold ${selectedGateway === 'paypal' ? 'text-gray-900' : 'text-gray-500'}`}>PayPal</span>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedGateway === 'paypal' ? 'border-gray-900' : 'border-gray-300'}`}>
                            {selectedGateway === 'paypal' && <div className="w-2.5 h-2.5 bg-gray-900 rounded-full" />}
                          </div>
                        </button>
                        {selectedGateway === 'paypal' && (
                          <div className="border-t border-gray-100 bg-[#F8F9FA] p-6 text-center" style={{ isolation: 'isolate' }}>
                            <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-4">Finaliser votre commande</p>
                            <div style={{ position: 'relative', zIndex: 1 }}>
                              <PayPalScriptProvider options={{ clientId: config?.paypal?.clientId || '', currency: "EUR" }}>
                                <PayPalButtons
                                  style={{ layout: "vertical", shape: "rect", label: "pay", height: 45 }}
                                  createOrder={(data, actions) => actions.order.create({ intent: "CAPTURE", purchase_units: [{ amount: { currency_code: "EUR", value: totalPrice.toFixed(2) } }]})}
                                  onApprove={(data, actions) => { nextStep(); return Promise.resolve(); }}
                                />
                              </PayPalScriptProvider>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* MOLLIE */}
                    {activeGateways.includes('mollie') && (
                      <div className={`border-2 rounded-2xl overflow-hidden transition-all ${selectedGateway === 'mollie' ? 'border-gray-900' : 'border-gray-100'}`}>
                        <button onClick={() => setSelectedGateway(selectedGateway === 'mollie' ? null : 'mollie')} className={`w-full flex items-center justify-between p-4 transition-all ${selectedGateway === 'mollie' ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}`}>
                          <div className="flex items-center gap-3">
                            <Globe size={24} className={selectedGateway === 'mollie' ? 'text-gray-900' : 'text-gray-400'} weight={selectedGateway === 'mollie' ? 'fill' : 'regular'} />
                            <span className={`text-sm font-bold ${selectedGateway === 'mollie' ? 'text-gray-900' : 'text-gray-500'}`}>Mollie (Bancontact / iDEAL)</span>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedGateway === 'mollie' ? 'border-gray-900' : 'border-gray-300'}`}>
                            {selectedGateway === 'mollie' && <div className="w-2.5 h-2.5 bg-gray-900 rounded-full" />}
                          </div>
                        </button>
                        {selectedGateway === 'mollie' && (
                          <div className="border-t border-gray-100 bg-gray-900 p-8 text-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_white_0%,_transparent_70%)]" />
                            <div className="relative z-10 w-16 h-16 bg-white/10 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                              <LockKey size={32} weight="duotone" className="text-white" />
                            </div>
                            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-2">Redirection Sécurisée</h4>
                            <p className="text-white/60 text-xs font-medium max-w-xs mx-auto mb-6">Vous serez redirigé vers le portail sécurisé de Mollie pour finaliser votre achat.</p>
                            <button onClick={() => handleCreatePayment('mollie')} disabled={isProcessing} className="w-full bg-white text-gray-900 font-black uppercase tracking-widest py-4 rounded-xl hover:bg-gray-100 transition-all text-xs disabled:opacity-50 flex items-center justify-center gap-3">
                              {isProcessing ? <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" /> : <><LockKey size={16} weight="bold" /> Payer {totalPrice.toFixed(2)}€</>}
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* PAYPLUG */}
                    {activeGateways.includes('payplug') && (
                      <div className={`border-2 rounded-2xl overflow-hidden transition-all ${selectedGateway === 'payplug' ? 'border-gray-900' : 'border-gray-100'}`}>
                        <button onClick={() => setSelectedGateway(selectedGateway === 'payplug' ? null : 'payplug')} className={`w-full flex items-center justify-between p-4 transition-all ${selectedGateway === 'payplug' ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}`}>
                          <div className="flex items-center gap-3">
                            <LockKey size={24} className={selectedGateway === 'payplug' ? 'text-gray-900' : 'text-gray-400'} weight={selectedGateway === 'payplug' ? 'fill' : 'regular'} />
                            <span className={`text-sm font-bold ${selectedGateway === 'payplug' ? 'text-gray-900' : 'text-gray-500'}`}>PayPlug (Sécurisé)</span>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedGateway === 'payplug' ? 'border-gray-900' : 'border-gray-300'}`}>
                            {selectedGateway === 'payplug' && <div className="w-2.5 h-2.5 bg-gray-900 rounded-full" />}
                          </div>
                        </button>
                        {selectedGateway === 'payplug' && (
                          <div className="border-t border-gray-100 bg-gray-900 p-8 text-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_white_0%,_transparent_70%)]" />
                            <div className="relative z-10 w-16 h-16 bg-white/10 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                              <LockKey size={32} weight="duotone" className="text-white" />
                            </div>
                            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-2">Redirection Sécurisée</h4>
                            <p className="text-white/60 text-xs font-medium max-w-xs mx-auto mb-6">Vous serez redirigé vers le portail sécurisé de PayPlug pour finaliser votre achat.</p>
                            <button onClick={() => handleCreatePayment('payplug')} disabled={isProcessing} className="w-full bg-white text-gray-900 font-black uppercase tracking-widest py-4 rounded-xl hover:bg-gray-100 transition-all text-xs disabled:opacity-50 flex items-center justify-center gap-3">
                              {isProcessing ? <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" /> : <><LockKey size={16} weight="bold" /> Payer {totalPrice.toFixed(2)}€</>}
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* SQUARE */}
                    {activeGateways.includes('square') && (
                      <div className={`border-2 rounded-2xl overflow-hidden transition-all ${selectedGateway === 'square' ? 'border-gray-900' : 'border-gray-100'}`}>
                        <button onClick={() => setSelectedGateway(selectedGateway === 'square' ? null : 'square')} className={`w-full flex items-center justify-between p-4 transition-all ${selectedGateway === 'square' ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}`}>
                          <div className="flex items-center gap-3">
                            <Bank size={24} className={selectedGateway === 'square' ? 'text-gray-900' : 'text-gray-400'} weight={selectedGateway === 'square' ? 'fill' : 'regular'} />
                            <span className={`text-sm font-bold ${selectedGateway === 'square' ? 'text-gray-900' : 'text-gray-500'}`}>Terminal Square</span>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedGateway === 'square' ? 'border-gray-900' : 'border-gray-300'}`}>
                            {selectedGateway === 'square' && <div className="w-2.5 h-2.5 bg-gray-900 rounded-full" />}
                          </div>
                        </button>
                        {selectedGateway === 'square' && config?.square?.enabled && (
                          <div className="border-t border-gray-100 bg-[#F8F9FA] p-6">
                            <PaymentForm
                              applicationId={config?.square?.applicationId || ''}
                              locationId={config?.square?.locationId || ''}
                              cardTokenizeResponseReceived={async (token) => {
                                if (token.status === 'OK') { await handleCreatePayment('square', { sourceId: token.token }); }
                              }}
                            >
                              <SquareCreditCard
                                buttonProps={{ css: { backgroundColor: '#111827', color: '#fff', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.15em', padding: '16px', borderRadius: '12px', marginTop: '24px', width: '100%' } }}
                              />
                            </PaymentForm>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            )}
          </div>
        )}
        </div>
      </div>


      {/* ─── RIGHT COLUMN: STICKY ORDER SUMMARY ─── */}
      <div className="w-full lg:w-[45%] bg-[#F5F5F5] lg:min-h-screen lg:pl-12 pt-0 lg:pt-12 pb-0 lg:pb-8 border-b lg:border-b-0 border-gray-200">
        <div className="w-full max-w-xl mr-auto sticky top-0 lg:top-12 z-40 lg:z-10">
          
          {/* Mobile ONLY: Updated to Card approach */}
          {isSummaryExpanded && (
            <div className="lg:hidden p-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between sticky top-0 z-[60] backdrop-blur-md">
               <div className="flex items-center gap-2">
                 <ShoppingCart size={18} weight="bold" className="text-gray-900" />
                 <span className="text-xs font-black uppercase tracking-widest text-gray-900">Résumé de commande</span>
               </div>
                <button 
                onClick={() => setIsSummaryExpanded(false)}
                className="p-2 bg-primary/10 rounded-lg border border-primary/20 text-primary hover:bg-primary/20 transition-all shadow-sm flex items-center justify-center translate-y-1"
               >
                 <CaretUp size={16} weight="bold" />
               </button>
            </div>
          )}

          <AnimatePresence>
            {(isSummaryExpanded || window.innerWidth >= 1024) && (
              <motion.div 
                initial={window.innerWidth < 1024 ? { height: 0, opacity: 0 } : {}}
                animate={window.innerWidth < 1024 ? { height: 'auto', opacity: 1 } : {}}
                exit={window.innerWidth < 1024 ? { height: 0, opacity: 0 } : {}}
                className="overflow-hidden bg-[#F5F5F5] lg:bg-transparent"
              >
                <div className="px-6 sm:px-8 lg:px-0 pt-8 lg:pt-0 pb-8">
                  <div className="hidden lg:flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                    <h3 className="text-xl font-black tracking-tighter text-gray-900 uppercase">Résumé de commande</h3>
                    <div className="bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        {totalItems} Article(s)
                      </span>
                    </div>
                  </div>

                  {/* Cart Items — rééinjectés dans la colonne droite */}
                  <div className="mb-8 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Articles
                      </h4>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">{totalItems} article(s)</span>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                          <div className="relative shrink-0">
                            <div className="w-14 h-14 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-2xl">📦</span>
                              )}
                            </div>
                            <span className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full font-black border-2 border-white">{item.quantity}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-black text-gray-900 uppercase tracking-tight truncate">{item.name}</h5>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{item.category || 'Service Premium'}</p>
                            <span className="text-[9px] px-1.5 py-0.5 bg-success/10 text-success rounded font-bold uppercase tracking-widest mt-1 inline-block">En stock</span>
                          </div>
                          <span className="font-black text-sm text-gray-900 tracking-tight shrink-0">{(item.price * item.quantity).toFixed(2)}€</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Promo Code Field */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mb-8">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Code Promotionnel</p>
                    <div className="flex gap-2 items-center">
                      <input type="text" placeholder="Entrez votre code" className="flex-1 min-w-0 bg-white border border-gray-200 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 rounded-xl px-3 py-3 text-sm font-medium outline-none transition-all placeholder:text-gray-400" />
                      <button className="flex-shrink-0 bg-primary text-white font-black text-[10px] px-4 py-3 rounded-xl uppercase tracking-widest transition-all hover:bg-primary/90 shadow-md shadow-primary/10 active:scale-95">Appliquer</button>
                    </div>
                  </div>
                  
                  {/* Price breakdown */}
                  <div className="space-y-4 text-sm mb-8 bg-white/50 p-6 rounded-2xl border border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Sous-total</span>
                      <span className="font-black text-gray-900">{totalPrice.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Expédition</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-success">Gratuite</span>
                        <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                      </div>
                    </div>
                  </div>

                  {/* Total */}
                  {/* Total */}
                  <div className="bg-gray-900 rounded-3xl p-8 flex justify-between items-center mb-8 shadow-[0_20px_40px_rgba(0,0,0,0.1)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/10 transition-colors" />
                    <div className="relative z-10">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1 block">Total à régler</span>
                      <h2 className="text-white text-3xl font-black tracking-tighter uppercase">Total</h2>
                    </div>
                    <div className="relative z-10 text-right">
                      <span className="text-[10px] font-black text-white/30 mb-1 block uppercase">EUR</span>
                      <span className="text-4xl font-black text-white tracking-tighter">
                        {totalPrice.toFixed(2)}<span className="text-2xl ml-0.5">€</span>
                      </span>
                    </div>
                  </div>

                  {/* FOOTER OF SUMMARY: CLOSE BUTTON */}
                  <div className="mt-4 mb-12 lg:hidden">
                    <button 
                      onClick={() => setIsSummaryExpanded(false)}
                      className="w-full py-4 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      Fermer le résumé
                      <CaretUp size={14} weight="bold" />
                    </button>
                  </div>

                  {/* Unified Trust Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                    <div className="bg-white p-2 rounded-xl border border-gray-100 flex items-center gap-2 shadow-sm">
                      <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                        <ShieldCheck size={18} weight="fill" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-900 leading-none">Sécurisé</p>
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5">SSL 256-bit</p>
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-gray-100 flex items-center gap-2 shadow-sm">
                      <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                        <CheckCircle size={18} weight="fill" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-900 leading-none">Garantie</p>
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5">Satisfaction</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      </div>


      {/* ─── MOBILE ONLY: STICKY BOTTOM ACTION BAR (Shopify Pro Style) ─── */}
      {currentStep < 4 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 p-3 z-[100] shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
          <button 
            onClick={() => {
              if (currentStep === 1) setCurrentStep(2);
              else if (currentStep === 2) setCurrentStep(3);
              else if (currentStep === 3) document.dispatchEvent(new CustomEvent('STRIPE_SUBMIT'));
            }}
            disabled={isProcessing || (currentStep === 2 && !selectedAddressId && !formData.address)}
            className="w-full bg-gray-900 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg active:scale-95 transition-all text-[11px] flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {currentStep === 1 && "Continuer vers la livraison"}
                {currentStep === 2 && (
                  (selectedAddressId || formData.address) ? "Passer au paiement sécurisé" : "Choisir une adresse"
                )}
                {currentStep === 3 && `Valider & Payer ${totalPrice.toFixed(2)}€`}
                <ArrowRight size={16} weight="bold" />
              </>
            )}
          </button>
        </div>
      )}
    </div>

  );
}
