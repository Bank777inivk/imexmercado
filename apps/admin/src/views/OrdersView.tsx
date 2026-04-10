import React, { useEffect, useState } from 'react';
import { 
  Package, ShoppingCart, Calendar, 
  User, CreditCard, CaretRight, 
  Funnel, Export, MagnifyingGlass,
  ArrowClockwise
} from '@phosphor-icons/react';
import { getCollection } from '@imexmercado/firebase';

export function OrdersView() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getCollection('orders');
      // Sort by date descending
      const sorted = [...data].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sorted);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing': return 'bg-orange-50 text-orange-500 border-orange-100';
      case 'Shipped': return 'bg-blue-50 text-blue-500 border-blue-100';
      case 'Delivered': return 'bg-green-50 text-green-500 border-green-100';
      case 'Cancelled': return 'bg-red-50 text-red-500 border-red-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  const filteredOrders = orders.filter(order => 
    order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-left">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Gestion des Commandes</h2>
          <p className="text-sm font-medium text-gray-500">Suivez et traitez les commandes de vos clients.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchOrders}
            className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-all shadow-sm"
          >
            <ArrowClockwise size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button className="flex items-center gap-2 bg-white border border-gray-100 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-all shadow-sm">
            <Export size={18} weight="bold" />
            Exporter CSV
          </button>
          <button className="flex items-center gap-2 bg-gray-900 text-white p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-gray-200 hover:scale-105 transition-transform">
            <Funnel size={18} weight="bold" />
            Filtrer
          </button>
        </div>
      </div>

      {/* Quick Search */}
      <div className="relative">
        <MagnifyingGlass size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder="Rechercher par ID, nom du client ou email..." 
          className="w-full bg-white border border-gray-100 rounded-3xl py-6 pl-14 pr-8 text-sm font-medium focus:ring-4 focus:ring-primary/5 outline-none transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 gap-4">
        {loading && orders.length === 0 ? (
          <div className="py-20 text-center">
             <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
             <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Récupération des commandes...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-gray-100">
             <ShoppingCart size={48} className="mx-auto text-gray-200 mb-4" weight="thin" />
             <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Aucune commande trouvée</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md group">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                
                {/* Main Order Info */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-8 flex-1">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                      <ShoppingCart size={24} weight="bold" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">#{order.id.substring(0,8).toUpperCase()}</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="h-10 w-px bg-gray-50 hidden sm:block" />

                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center font-bold text-xs uppercase">
                      {order.userName?.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{order.userName}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{order.userEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Status & Total */}
                <div className="flex items-center justify-between lg:justify-end gap-10">
                  <div className="text-left lg:text-right">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">Statut</p>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total</p>
                    <p className="text-lg font-black text-gray-900">{order.total?.toFixed(2)}€</p>
                  </div>

                  <button className="p-3 text-gray-400 hover:text-primary transition-all">
                    <CaretRight size={24} weight="bold" />
                  </button>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
