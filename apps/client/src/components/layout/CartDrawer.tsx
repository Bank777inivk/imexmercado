import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  X, Trash, Minus, Plus, ShoppingBag, 
  ArrowRight, Truck, Receipt, CheckCircle
} from '@phosphor-icons/react';
import { useCart } from '../../context/CartContext';

export function CartDrawer() {
  const { 
    isDrawerOpen, setDrawerOpen, items, 
    updateQuantity, removeItem, clearCart, totalPrice, totalItems,
    isSyncing
  } = useCart();
  const navigate = useNavigate();

  const freeShippingThreshold = 150;
  const progressToFreeShipping = Math.min((totalPrice / freeShippingThreshold) * 100, 100);

  const handleCheckout = () => {
    setDrawerOpen(false);
    navigate('/commande');
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
          />
          
          {/* Drawer Panel */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full md:w-[450px] bg-white z-[110] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl">
                    <ShoppingBag size={24} className="text-primary" weight="duotone" />
                </div>
                <div>
                    <h2 className="text-lg font-black uppercase tracking-tight text-gray-900">Mon Panier</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {totalItems} article{totalItems > 1 ? 's' : ''} selectionné{totalItems > 1 ? 's' : ''}
                    </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {isSyncing && (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
                  />
                )}
                <button 
                    onClick={() => setDrawerOpen(false)}
                    className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all shadow-sm"
                >
                    <X size={20} weight="bold" />
                </button>
              </div>
            </div>

            {/* Free Shipping Progress */}
            <div className="px-6 py-4 border-b border-gray-50 bg-white">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Truck size={16} className={totalPrice >= freeShippingThreshold ? 'text-success' : 'text-primary'} weight="duotone" />
                        {totalPrice >= freeShippingThreshold ? (
                            <span className="text-success">Livraison offerte !</span>
                        ) : (
                            <span>Plus que <span className="text-primary">{(freeShippingThreshold - totalPrice).toFixed(2)}€</span></span>
                        )}
                    </p>
                    <span className="text-[9px] font-black text-gray-300 uppercase">{Math.round(progressToFreeShipping)}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progressToFreeShipping}%` }}
                        className={`h-full rounded-full ${totalPrice >= freeShippingThreshold ? 'bg-success' : 'bg-primary'}`}
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 relative">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                    <ShoppingBag size={64} weight="duotone" className="text-gray-300" />
                    <p className="text-sm font-black uppercase tracking-widest text-gray-400">Votre panier est vide</p>
                </div>
              ) : (
                <div className="space-y-6 pb-8">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 p-2 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                          <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                              <div className="flex justify-between items-start gap-2">
                                  <Link 
                                      to={`/p/${item.id}`} 
                                      onClick={() => setDrawerOpen(false)}
                                      className="text-[11px] font-black uppercase text-gray-900 leading-tight hover:text-primary transition-colors line-clamp-2"
                                  >
                                      {item.name}
                                  </Link>
                                  <button 
                                      onClick={() => removeItem(item.id)}
                                      className="text-gray-300 hover:text-red-500 transition-colors"
                                  >
                                      <Trash size={14} weight="bold" />
                                  </button>
                              </div>
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">€{item.price.toFixed(2)} / unité</p>
                          </div>

                          <div className="flex justify-between items-center mt-2">
                              <div className="flex items-center border border-gray-100 rounded-lg bg-white shadow-sm h-8 px-1">
                                  <button 
                                      onClick={() => updateQuantity(item.id, -1)}
                                      className="p-1 text-gray-400 hover:text-primary transition-colors"
                                  >
                                      <Minus size={12} weight="bold" />
                                  </button>
                                  <span className="w-8 text-center font-black text-[11px] text-gray-900">{item.quantity}</span>
                                  <button 
                                      onClick={() => updateQuantity(item.id, 1)}
                                      className="p-1 text-gray-400 hover:text-primary transition-colors"
                                  >
                                      <Plus size={12} weight="bold" />
                                  </button>
                              </div>
                              <p className="text-sm font-black text-primary">€{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Clear Cart Button */}
                  <div className="flex justify-end pt-2">
                    <button 
                      onClick={clearCart} 
                      className="text-[10px] uppercase font-black tracking-widest text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1.5"
                    >
                      <Trash size={14} weight="bold" />
                      Vider le panier
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-4">
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total TTC</span>
                    <span className="text-2xl font-black text-gray-900">€{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 text-success">
                    <CheckCircle size={14} weight="fill" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Paiement 100% sécurisé</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={handleCheckout}
                  disabled={items.length === 0}
                  className="w-full bg-primary text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-3 active:scale-95 text-[11px] disabled:opacity-50 disabled:pointer-events-none"
                >
                  <span>Passer en Caisse</span>
                  <ArrowRight size={18} weight="bold" />
                </button>
                
                <Link 
                  to="/panier" 
                  onClick={() => setDrawerOpen(false)}
                  className="w-full bg-white text-gray-900 border-2 border-gray-200 font-black uppercase tracking-widest py-4 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-3 active:scale-95 text-[11px]"
                >
                  <Receipt size={18} weight="bold" />
                  <span>Voir le Panier</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
