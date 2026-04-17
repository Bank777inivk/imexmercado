import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, Truck, CreditCard, CheckCircle, 
  ArrowRight, ShieldCheck, CaretRight, NavigationArrow,
  Bank, Globe, Fingerprint, PaypalLogo
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePayment } from '../context/PaymentContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { StripePaymentForm } from '../components/shop/StripePaymentForm';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const steps = [
  { id: 1, label: 'Identité', icon: User },
  { id: 2, label: 'Livraison', icon: Truck },
  { id: 3, label: 'Paiement', icon: CreditCard },
  { id: 4, label: 'Confirmation', icon: CheckCircle },
];

export function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const { config, activeGateways, isLoading: isPaymentLoading } = usePayment();
  const [selectedGateway, setSelectedGateway] = useState<string | null>(null);
  const [stripePromise, setStripePromise] = useState<any>(null);

  // Load Stripe only if enabled and key exists
  React.useEffect(() => {
    if (config?.stripe?.enabled && config?.stripe?.publishableKey) {
      setStripePromise(loadStripe(config.stripe.publishableKey));
    }
  }, [config]);

  // Initialize selected gateway when config loads if none selected
  React.useEffect(() => {
    if (activeGateways.length > 0 && !selectedGateway) {
      setSelectedGateway(activeGateways[0]);
    }
  }, [activeGateways, selectedGateway]);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="bg-bg min-h-screen pb-24">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-50">
        <div className="container mx-auto px-4 py-4 md:py-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">
          <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
          <span className="text-gray-200">/</span>
          <Link to="/panier" className="hover:text-primary transition-colors">Mon Panier</Link>
          <span className="text-gray-200">/</span>
          <span className="text-gray-900">Validation de Commande</span>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-6 md:pt-12">
        <motion.div 
          {...fadeIn}
          className="bg-white rounded-3xl border-2 border-gray-200 shadow-xl overflow-hidden"
        >
          {/* Checkout Header inside the unified card */}
          <div className="bg-gray-50/50 p-6 md:px-16 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
             {/* Stepper */}
             <div className="flex items-center gap-2 md:gap-6 relative z-10 w-full justify-between md:justify-start">
               {steps.map((step) => (
                 <div key={step.id} className="flex items-center gap-3">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all ${
                     currentStep >= step.id 
                      ? 'bg-gray-900 text-white shadow-md' 
                      : 'bg-white border border-gray-200 text-gray-400'
                   }`}>
                     {currentStep > step.id ? <CheckCircle size={20} weight="fill" className="text-primary"/> : step.id}
                   </div>
                   <span className={`hidden sm:block text-[10px] font-black uppercase tracking-widest ${
                     currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'
                   }`}>
                     {step.label}
                   </span>
                   {step.id < 4 && <CaretRight size={14} className="text-gray-300 ml-1 hidden md:block" weight="bold" />}
                 </div>
               ))}
             </div>
             
             <Link to="/panier" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors bg-white px-4 py-2 border border-gray-200 rounded-lg shadow-sm shrink-0 relative z-10 hidden md:block">
               Annuler
             </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3">
            
            {/* Main Form Content */}
            <div className="lg:col-span-2 relative border-b lg:border-b-0 lg:border-r border-gray-100">
              
              <div className="min-h-[500px] p-6 md:p-16 flex flex-col">
                {currentStep === 1 && (
                  <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1">
                    <div className="flex items-center gap-4 mb-10">
                      <div className="bg-primary/10 p-3 rounded-xl text-primary"><User size={24} weight="duotone" /></div>
                      <div>
                        <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900">Informations Personnelles</h2>
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Étape 1 sur 3</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Prénom</label>
                        <input type="text" placeholder="Jean" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Nom</label>
                        <input type="text" placeholder="Dupont" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm" />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Adresse E-mail</label>
                        <input type="email" placeholder="jean.dupont@email.com" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm" />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Téléphone</label>
                        <input type="tel" placeholder="+351 000 000 000" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm" />
                      </div>
                    </div>
                  </section>
                )}

                {currentStep === 2 && (
                  <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1">
                    <div className="flex items-center gap-4 mb-10">
                      <div className="bg-primary/10 p-3 rounded-xl text-primary"><Truck size={24} weight="duotone" /></div>
                      <div>
                        <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900">Adresse de Livraison</h2>
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Étape 2 sur 3</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Adresse Complète</label>
                        <input type="text" placeholder="Rue des Fleurs, 123" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Ville</label>
                        <input type="text" placeholder="Lisbonne" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Code Postal</label>
                        <input type="text" placeholder="1000-001" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm" />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Pays</label>
                        <div className="relative">
                          <select className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm appearance-none cursor-pointer">
                            <option>Portugal</option>
                            <option>France</option>
                            <option>Belgique</option>
                            <option>Luxembourg</option>
                          </select>
                           <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 mt-8 border-t border-gray-100">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 pl-1">Mode de Livraison</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className="flex flex-col p-5 border-2 border-primary bg-primary/5 rounded-2xl cursor-pointer shadow-sm relative">
                          <div className="absolute top-4 right-4 text-primary">
                            <CheckCircle size={20} weight="fill" />
                          </div>
                          <div className="bg-primary text-white p-2.5 rounded-xl w-fit mb-4"><NavigationArrow size={24} weight="duotone" /></div>
                          <h4 className="font-black uppercase tracking-tight text-gray-900 mb-1">Standard (CTT)</h4>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight mb-4 flex-1">Livraison sous 3-5 jours ouvrés</p>
                          <span className="font-black text-gray-900 border-t border-primary/20 pt-3">OFFERT</span>
                          <input type="radio" checked className="hidden" />
                        </label>

                        <label className="flex flex-col p-5 border-2 border-gray-100 hover:border-gray-300 bg-white rounded-2xl cursor-pointer shadow-sm transition-all grayscale hover:grayscale-0">
                          <div className="bg-gray-100 text-gray-400 p-2.5 rounded-xl w-fit mb-4"><Truck size={24} weight="duotone" /></div>
                          <h4 className="font-black uppercase tracking-tight text-gray-900 mb-1">Express (DHL)</h4>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight mb-4 flex-1">Livraison sous 24h-48h Max</p>
                          <span className="font-black text-gray-900 border-t border-gray-100 pt-3">14.90€</span>
                          <input type="radio" className="hidden" />
                        </label>
                      </div>
                    </div>
                  </section>
                )}

                {currentStep === 3 && (
                  <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1">
                    <div className="flex items-center gap-4 mb-10">
                      <div className="bg-primary/10 p-3 rounded-xl text-primary"><CreditCard size={24} weight="duotone" /></div>
                      <div>
                        <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900">Moyen de Paiement</h2>
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">
                          {isPaymentLoading ? 'Chargement des options sécurisées...' : 'Dernière étape ! 🔐'}
                        </p>
                      </div>
                    </div>
                    
                    {isPaymentLoading ? (
                      <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : activeGateways.length === 0 ? (
                      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 text-center">
                         <p className="text-sm font-bold text-orange-800">Aucun moyen de paiement n'est disponible pour le moment.</p>
                         <p className="text-[10px] uppercase font-black text-orange-400 mt-2">Veuillez contacter le support ou réessayer plus tard.</p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {/* Gateway Selection Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          {activeGateways.includes('stripe') && (
                            <button 
                              onClick={() => setSelectedGateway('stripe')}
                              className={`flex flex-col items-center justify-center gap-3 p-4 border-2 rounded-2xl relative shadow-sm transition-all ${selectedGateway === 'stripe' ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white hover:border-gray-300'}`}
                            >
                              {selectedGateway === 'stripe' && <div className="absolute top-2 right-2 text-primary"><CheckCircle size={14} weight="fill" /></div>}
                              <CreditCard size={24} weight={selectedGateway === 'stripe' ? 'fill' : 'bold'} className={selectedGateway === 'stripe' ? 'text-primary' : 'text-gray-400'} />
                              <span className={`text-[10px] font-black uppercase tracking-widest ${selectedGateway === 'stripe' ? 'text-gray-900' : 'text-gray-500'}`}>Carte / Stripe</span>
                            </button>
                          )}
                          
                          {activeGateways.includes('paypal') && (
                            <button 
                               onClick={() => setSelectedGateway('paypal')}
                               className={`flex flex-col items-center justify-center gap-3 p-4 border-2 rounded-2xl relative shadow-sm transition-all ${selectedGateway === 'paypal' ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white hover:border-gray-300'}`}
                            >
                              {selectedGateway === 'paypal' && <div className="absolute top-2 right-2 text-primary"><CheckCircle size={14} weight="fill" /></div>}
                              <PaypalLogo size={24} weight={selectedGateway === 'paypal' ? 'fill' : 'bold'} className={selectedGateway === 'paypal' ? 'text-blue-600' : 'text-gray-400'} />
                              <span className={`text-[10px] font-black uppercase tracking-widest ${selectedGateway === 'paypal' ? 'text-gray-900' : 'text-gray-500'}`}>PayPal</span>
                            </button>
                          )}

                          {activeGateways.includes('mollie') && (
                            <button 
                               onClick={() => setSelectedGateway('mollie')}
                               className={`flex flex-col items-center justify-center gap-3 p-4 border-2 rounded-2xl relative shadow-sm transition-all ${selectedGateway === 'mollie' ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white hover:border-gray-300'}`}
                            >
                              {selectedGateway === 'mollie' && <div className="absolute top-2 right-2 text-primary"><CheckCircle size={14} weight="fill" /></div>}
                              <Bank size={24} weight={selectedGateway === 'mollie' ? 'fill' : 'bold'} className={selectedGateway === 'mollie' ? 'text-blue-500' : 'text-gray-400'} />
                              <span className={`text-[10px] font-black uppercase tracking-widest ${selectedGateway === 'mollie' ? 'text-gray-900' : 'text-gray-500'}`}>Mollie</span>
                            </button>
                          )}

                          {activeGateways.includes('square') && (
                            <button 
                               onClick={() => setSelectedGateway('square')}
                               className={`flex flex-col items-center justify-center gap-3 p-4 border-2 rounded-2xl relative shadow-sm transition-all ${selectedGateway === 'square' ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white hover:border-gray-300'}`}
                            >
                              {selectedGateway === 'square' && <div className="absolute top-2 right-2 text-primary"><CheckCircle size={14} weight="fill" /></div>}
                              <Globe size={24} weight={selectedGateway === 'square' ? 'fill' : 'bold'} className={selectedGateway === 'square' ? 'text-gray-900' : 'text-gray-400'} />
                              <span className={`text-[10px] font-black uppercase tracking-widest ${selectedGateway === 'square' ? 'text-gray-900' : 'text-gray-500'}`}>Square</span>
                            </button>
                          )}
                        </div>
                        
                        {/* Dynamic Payment Forms Area */}
                        <div className="pt-8 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500">
                          <AnimatePresence mode="wait">
                            {selectedGateway === 'stripe' && (
                              <motion.div 
                                key="stripe-form"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                              >
                                {stripePromise ? (
                                  <Elements stripe={stripePromise}>
                                    <StripePaymentForm />
                                  </Elements>
                                ) : (
                                  <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center gap-3">
                                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-[10px] font-black uppercase tracking-widest">Initialisation sécurisée...</p>
                                  </div>
                                )}
                              </motion.div>
                            )}

                            {selectedGateway === 'paypal' && config?.paypal?.enabled && (
                              <motion.div 
                                key="paypal-btn"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                              >
                                <div className="flex flex-col items-center justify-center py-6 bg-blue-50/30 rounded-[2.5rem] border-2 border-dashed border-blue-100 p-8">
                                  <PayPalScriptProvider options={{ clientId: config.paypal.clientId, currency: "EUR" }}>
                                    <PayPalButtons 
                                      style={{ layout: "vertical", shape: "pill", label: "pay" }}
                                      createOrder={(data, actions) => {
                                        return actions.order.create({
                                          intent: "CAPTURE",
                                          purchase_units: [{
                                            amount: {
                                              currency_code: "EUR",
                                              value: "538.00" // Devrait être dynamique
                                            }
                                          }]
                                        });
                                      }}
                                    />
                                  </PayPalScriptProvider>
                                </div>
                              </motion.div>
                            )}

                            {selectedGateway === 'mollie' && config?.mollie?.enabled && (
                              <motion.div 
                                key="mollie-section"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex flex-col items-center justify-center py-10 bg-blue-50/20 rounded-[2.5rem] border-2 border-dashed border-blue-200 p-8 text-center"
                              >
                                <Bank size={48} weight="fill" className="text-blue-500 mb-4" />
                                <p className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-1">Terminal Mollie Activé</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight max-w-[200px]">Vous pourrez choisir iDEAL, Bancontact ou Carte après validation.</p>
                              </motion.div>
                            )}

                            {selectedGateway === 'square' && config?.square?.enabled && (
                              <motion.div 
                                key="square-section"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex flex-col items-center justify-center py-10 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 p-8 text-center"
                              >
                                <Globe size={48} weight="fill" className="text-gray-900 mb-4" />
                                <p className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-1">Paiement Square (Squareup)</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Terminal de paiement sécurisé activé.</p>
                              </motion.div>
                            )}

                            {!selectedGateway && !isPaymentLoading && (
                              <p className="text-center text-gray-300 italic text-sm">Sélectionnez une méthode pour continuer</p>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    )}
                  </section>
                )}

                {currentStep === 4 && (
                  <div className="text-center bg-white flex flex-col items-center justify-center flex-1 animate-in zoom-in duration-500 mt-10 lg:mt-0">
                    <div className="relative mb-10">
                      <div className="absolute inset-0 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
                      <div className="bg-success text-white w-32 h-32 rounded-full flex items-center justify-center mx-auto shadow-2xl relative z-10 border-8 border-green-50">
                        <CheckCircle size={64} weight="bold" />
                      </div>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter mb-4 leading-none">Commande <br /><span className="text-success italic-none">Confirmée !</span></h1>
                    <p className="text-gray-500 mb-8 font-medium max-w-sm">Merci pour votre confiance, Jean. Votre colis est déjà en cours de préparation dans notre hub.</p>
                    
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-12 w-full max-w-sm">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Numéro de commande</p>
                       <p className="text-xl font-black text-gray-900 tracking-widest">#IMX-2026-8892</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-sm">
                      <Link to="/compte/commandes" className="flex-1 bg-gray-900 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg hover:bg-black transition-all text-xs">Suivre ma commande</Link>
                      <Link to="/boutique" className="flex-1 bg-white border-2 border-gray-100 text-gray-500 font-black uppercase tracking-widest py-4 rounded-xl hover:border-gray-300 hover:text-gray-900 transition-all text-xs">Acheter plus</Link>
                    </div>
                  </div>
                )}

                {/* Bottom Navigation Buttons */}
                {currentStep < 4 && (
                  <div className="flex items-center justify-between pt-10 border-t border-gray-100 mt-auto">
                    {currentStep > 1 ? (
                      <button 
                        onClick={prevStep}
                        className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors border border-transparent hover:border-gray-200 rounded-xl"
                      >
                        ← Retour
                      </button>
                    ) : (
                      <div /> /* Empty div to push next button to right */
                    )}
                    <button 
                      onClick={nextStep}
                      className="bg-gray-900 text-white font-black uppercase tracking-widest py-4 px-10 rounded-xl shadow-lg hover:bg-black transition-all flex items-center gap-3 active:scale-95 text-xs"
                    >
                      <span>{currentStep === 3 ? 'Payer avec sécurité' : 'Étape suivante'}</span>
                      {currentStep !== 3 && <ArrowRight size={18} weight="bold" />}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Checkout Summary Right Panel */}
            <div className="bg-gray-50/50 p-6 md:p-16 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full -mr-32 -mt-32 pointer-events-none" />
              
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-8 flex items-center gap-3 relative z-10">
                 <Truck size={20} className="text-primary" weight="duotone" />
                 <span>Résumé du Panier</span>
              </h3>
              
              <div className="space-y-4 mb-8 flex-1 relative z-10 w-full">
                {/* Mock abstract items summary */}
                <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-xl border border-gray-200">📦</div>
                    <div>
                      <p className="text-xs font-black uppercase text-gray-900">Articles (x2)</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">En stock</p>
                    </div>
                  </div>
                  <span className="font-black text-sm">538.00€</span>
                </div>

                <div className="flex justify-between items-center text-gray-600 px-2 mt-8">
                  <span className="font-black uppercase text-[10px] tracking-widest text-gray-400">Sous-total</span>
                  <span className="font-black text-sm">538.00€</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 px-2">
                  <span className="font-black uppercase text-[10px] tracking-widest text-gray-400">Livraison CTT</span>
                  <span className="font-black uppercase text-[10px] tracking-widest text-success border border-success/20 bg-success/10 px-2 py-0.5 rounded">Offerte</span>
                </div>
                <div className="flex justify-between items-center pt-6 pb-2 px-2 mt-4 border-t border-gray-200">
                  <span className="text-xs font-black uppercase tracking-widest text-gray-900">Total TTC</span>
                  <span className="text-4xl font-black text-primary tracking-tighter">538.00€</span>
                </div>
              </div>
              
              <div className="mt-8 space-y-4 relative z-10 mt-auto pt-8">
                <div className="flex items-center gap-3 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <ShieldCheck size={36} className="text-success flex-shrink-0" weight="duotone" />
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-gray-900 block mb-1">Achat Hyper Sécurisé</span>
                    <p className="text-[9px] text-gray-400 font-bold leading-relaxed uppercase pr-2">
                      Nos transactions sont 100% cryptées de bout en bout par la norme SSL et Stripe.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
