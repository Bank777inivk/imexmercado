import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Trash, Minus, Plus, ShoppingBag, 
  ArrowRight, ShieldCheck, Truck, Receipt 
} from '@phosphor-icons/react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

export function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice, totalItems } = useCart();

  const subtotal = totalPrice;
  const freeShippingThreshold = 150;
  const shipping = subtotal > freeShippingThreshold ? 0 : 9.90;
  const tax = subtotal * 0.23; 
  const total = subtotal + shipping;
  const progressToFreeShipping = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  if (items.length === 0) {
    return (
      <div className="bg-bg min-h-screen flex items-center justify-center p-4">
        <motion.div 
          {...fadeIn}
          className="max-w-md w-full text-center bg-white p-12 rounded-3xl shadow-xl border-2 border-gray-200 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-16 -mt-16 pointer-events-none opacity-50" />
          
          <div className="bg-gray-50 border border-gray-100 w-32 h-32 rounded-3xl flex items-center justify-center text-gray-300 mx-auto mb-10 relative z-10">
            <ShoppingBag size={56} weight="duotone" />
            <div className="absolute -top-3 -right-3 bg-primary w-10 h-10 rounded-full border-4 border-white flex items-center justify-center text-white font-black shadow-sm">0</div>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-black uppercase text-gray-900 mb-4 tracking-tight relative z-10">Votre panier est vide</h1>
          <p className="text-gray-400 mb-10 font-bold leading-relaxed uppercase text-[10px] tracking-widest relative z-10 px-4">
            Nos meilleures offres vous attendent. Ne passez pas à côté !
          </p>
          
          <Link 
            to="/boutique" 
            className="inline-block relative z-10 w-full bg-gray-900 text-white font-black uppercase tracking-widest py-5 rounded-xl hover:bg-primary transition-all shadow-lg active:scale-95 text-xs"
          >
            Commencer mon shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-screen pb-24">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-50">
        <div className="container mx-auto px-4 py-4 md:py-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">
          <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
          <span className="text-gray-200">/</span>
          <span className="text-gray-900">Mon Panier</span>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-6 md:pt-12">
        <motion.div 
          {...fadeIn}
          className="bg-white rounded-3xl border-2 border-gray-200 shadow-xl overflow-hidden"
        >
          {/* Header Section */}
          <div className="p-6 md:px-16 md:py-12 border-b border-gray-100 bg-gray-50/30 flex flex-col lg:flex-row gap-6 items-baseline justify-between relative overflow-hidden">
             
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter relative z-10">
              Mon <span className="text-primary italic-none">Panier</span>
            </h1>

            <div className="flex items-center gap-4 relative z-10 flex-wrap">
              <button 
                onClick={clearCart}
                className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-red-500 transition-colors flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm"
              >
                <Trash size={16} weight="bold" />
                <span>Vider le panier</span>
              </button>
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-900 bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2">
                 <ShoppingBag size={16} weight="bold" />
                <span>{totalItems} article{totalItems > 1 ? 's' : ''} selectionné{totalItems > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar (Free Shipping) */}
          <div className="px-6 md:px-16 py-6 md:py-8 border-b border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <p className="text-xs font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
                <Truck size={20} className={subtotal >= freeShippingThreshold ? 'text-success' : 'text-primary'} weight="duotone" />
                {subtotal >= freeShippingThreshold ? (
                  <span className="text-success">Félicitations ! La livraison est offerte.</span>
                ) : (
                  <span>Plus que <span className="text-primary">{(freeShippingThreshold - subtotal).toFixed(2)}€</span> pour la livraison gratuite !</span>
                )}
              </p>
              <span className="text-[10px] font-black text-gray-400 uppercase hidden md:block">{Math.round(progressToFreeShipping)}% complété</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ease-out rounded-full ${subtotal >= freeShippingThreshold ? 'bg-success' : 'bg-primary'}`}
                style={{ width: `${progressToFreeShipping}%` }}
              ></div>
            </div>
          </div>

          {/* Content Split */}
          <div className="grid grid-cols-1 xl:grid-cols-3">
            
            {/* Left Column: Item List */}
            <div className="xl:col-span-2 p-6 md:p-16 border-b xl:border-b-0 xl:border-r border-gray-100 relative">
              <div className="divide-y divide-gray-100 border-b border-gray-100 pb-8 mb-8">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 py-8 gap-6 sm:gap-4 items-center group">
                    {/* Image & Detail */}
                    <div className="sm:col-span-5 flex items-center gap-6">
                      <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 flex items-center justify-center p-3 group-hover:scale-105 transition-all duration-500">
                        <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                      </div>
                      <div className="space-y-1">
                        <Link to={`/p/${item.id}`} className="text-sm font-black uppercase text-gray-900 hover:text-primary transition-colors block leading-tight tracking-tight">
                          {item.name}
                        </Link>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <span>SKU: {item.id}</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span className="text-success">En stock</span>
                        </p>
                      </div>
                    </div>

                    {/* Quantity Control */}
                    <div className="sm:col-span-3 flex justify-start sm:justify-center">
                      <div className="flex items-center border border-gray-200 rounded-xl bg-white shadow-sm p-1">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-2 text-gray-400 hover:text-primary transition-colors active:scale-90">
                          <Minus size={14} weight="bold" />
                        </button>
                        <span className="w-8 text-center font-black text-xs text-gray-900">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-2 text-gray-400 hover:text-primary transition-colors active:scale-90">
                          <Plus size={14} weight="bold" />
                        </button>
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div className="sm:col-span-2 text-center space-y-1 hidden sm:block">
                      <p className="text-sm font-black text-gray-900">{item.price}€</p>
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">Unité</p>
                    </div>

                    {/* Total Price & Delete */}
                    <div className="sm:col-span-2 flex flex-row sm:flex-col items-center sm:items-end justify-between gap-2">
                      <p className="text-xl font-black text-primary">{(item.price * item.quantity).toFixed(2)}€</p>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-[9px] font-black uppercase text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100"
                      >
                        <Trash size={12} weight="bold" />
                        <span className="hidden sm:inline">Retirer</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping CTA (Left side tail) */}
              <Link to="/boutique" className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-all group">
                <div className="w-10 h-10 border-2 border-gray-200 rounded-xl flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                  <ArrowRight size={16} className="rotate-180" weight="bold" />
                </div>
                <span>Continuer mes achats</span>
              </Link>
            </div>


            {/* Right Column: Summary */}
            <div className="bg-gray-50/50 p-6 md:p-16 flex flex-col relative overflow-hidden">
               {/* Tiny background accent */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full -mr-32 -mt-32 pointer-events-none" />

               <h2 className="text-lg font-black uppercase tracking-tight text-gray-900 mb-8 flex items-center gap-3 relative z-10">
                 <Receipt size={24} className="text-primary" weight="duotone" />
                 <span>Récapitulatif</span>
               </h2>

               <div className="space-y-4 mb-8 flex-1 relative z-10 w-full relative z-10 text-sm">
                 <div className="flex justify-between items-center text-gray-600">
                   <span className="font-black uppercase text-[10px] tracking-widest text-gray-400">Sous-total HT</span>
                   <span className="font-black">{(subtotal - tax).toFixed(2)}€</span>
                 </div>
                 <div className="flex justify-between items-center text-gray-600">
                   <span className="font-black uppercase text-[10px] tracking-widest text-gray-400">TVA (23%)</span>
                   <span className="font-black">{tax.toFixed(2)}€</span>
                 </div>
                 <div className="flex justify-between items-center text-gray-600 pb-6 border-b border-gray-200">
                   <span className="font-black uppercase text-[10px] tracking-widest text-gray-400">Livraison (CEE)</span>
                   <span className={`font-black uppercase text-[10px] tracking-widest ${shipping === 0 ? 'text-success' : 'text-gray-900'}`}>
                     {shipping === 0 ? 'Offerte' : `${shipping.toFixed(2)}€`}
                   </span>
                 </div>
                 <div className="flex justify-between items-center pt-2">
                   <span className="text-xs font-black uppercase tracking-widest text-gray-900">Total TTC</span>
                   <span className="text-4xl font-black text-primary tracking-tighter">{total.toFixed(2)}€</span>
                 </div>
               </div>

               <Link 
                 to="/commande" 
                 className="w-full bg-primary text-white font-black uppercase tracking-widest py-5 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-3 active:scale-95 text-xs relative z-10"
               >
                 <span>Passer en Caisse</span>
                 <ArrowRight size={20} weight="bold" />
               </Link>

               <div className="mt-8 space-y-4 relative z-10 mt-auto pt-8">
                 <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                   <ShieldCheck size={32} className="text-success flex-shrink-0" weight="duotone" />
                   <div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 block mb-0.5">Paiement 100% sécurisé</span>
                     <p className="text-[9px] text-gray-400 font-bold leading-tight uppercase">Transactions Stripe & SSL.</p>
                   </div>
                 </div>
               </div>
               
               <p className="text-[9px] text-center text-gray-400 font-black uppercase tracking-widest px-4 leading-relaxed mt-6 relative z-10">
                 En validant, vous acceptez nos <Link to="/cgv" className="text-gray-900 border-b border-gray-900 pb-0.5 hover:text-primary transition-colors">CGV</Link>.
               </p>

            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
