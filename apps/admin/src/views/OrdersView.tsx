import React, { useEffect, useState } from 'react';
import { 
  Package, ShoppingCart, Calendar, 
  User, CreditCard, CaretRight, 
  Funnel, Export, MagnifyingGlass,
  ArrowClockwise
} from '@phosphor-icons/react';
import { subscribeToCollection } from '@imexmercado/firebase';

export function OrdersView() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToCollection('orders', (data) => {
      const sorted = [...data].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sorted);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'Shipped': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Delivered': return 'bg-green-50 text-green-600 border-green-100';
      case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const filteredOrders = orders.filter(order => 
    order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 md:space-y-8">
      
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-left">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Suivi Commandes</h2>
          <p className="text-sm font-medium text-gray-500">Gérez le flux de vos ventes en temps réel.</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <button 
            disabled={loading}
            className="p-3.5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-all shadow-sm active:scale-90 disabled:opacity-50"
          >
            <ArrowClockwise size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-gray-100 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-all shadow-sm active:scale-95">
            <Export size={16} weight="bold" />
            <span className="hidden sm:inline">Exporter</span>
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-gray-200 hover:scale-105 transition-transform active:scale-95">
            <Funnel size={16} weight="bold" />
            <span className="hidden sm:inline">Filtrer</span>
            <span className="sm:hidden">Filtres</span>
          </button>
        </div>
      </div>

      {/* Modern Search Field */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <MagnifyingGlass size={20} className="text-gray-400 group-focus-within:text-primary transition-colors" />
        </div>
        <input 
          type="text" 
          placeholder="Client, Email, ID commande..." 
          className="w-full bg-white border border-gray-100 rounded-[2rem] py-5 md:py-6 pl-14 pr-8 text-sm font-medium focus:ring-4 focus:ring-primary/5 focus:border-primary/20 outline-none transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loading && orders.length === 0 ? (
          <div className="py-20 text-center animate-pulse">
             <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Synchronisation...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-[2.5rem] border border-gray-100">
             <ShoppingCart size={48} className="mx-auto text-gray-100 mb-4" weight="thin" />
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Aucune commande</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={`order-${order.id}`} className="bg-white p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-gray-200 shadow-sm transition-all hover:shadow-xl hover:border-primary/10 group cursor-pointer">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-8">
                
                {/* Order Identity & Customer */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 md:gap-8 flex-grow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                      <ShoppingCart size={22} weight="bold" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-black text-gray-900 tracking-tight">ORD-{order.id.substring(0,8).toUpperCase()}</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="h-10 w-px bg-gray-100 hidden sm:block" />

                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 bg-gray-50 border border-gray-100 text-gray-400 rounded-xl flex items-center justify-center font-black text-xs uppercase group-hover:border-primary/20 group-hover:text-primary transition-colors">
                      {order.userName?.split(' ').map((n: string) => n[0]).join('') || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{order.userName}</p>
                      <p className="text-[10px] text-gray-400 font-medium truncate max-w-[150px] md:max-w-none">{order.userEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Status, Pricing & Actions */}
                <div className="flex items-center justify-between lg:justify-end gap-6 md:gap-10 border-t border-gray-50 pt-6 lg:border-0 lg:pt-0">
                  <div className="text-left lg:text-right">
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.15em] mb-2">État</p>
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="text-left lg:text-right flex-grow sm:flex-grow-0">
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.15em] mb-1">Montant</p>
                    <p className="text-lg font-black text-gray-900 tracking-tight">{order.total?.toLocaleString('fr-FR')}€</p>
                  </div>

                  <div className="hidden sm:flex p-3 bg-gray-50 text-gray-300 rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-all">
                    <CaretRight size={20} weight="bold" />
                  </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
