import React, { useEffect, useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { TrendUp, TrendDown, Package, ShoppingCart, Users, CurrencyEur, ArrowClockwise, Database } from '@phosphor-icons/react';
import { subscribeToCollection, seedProducts, seedCategories } from '@imexmercado/firebase';
import { useMemo } from 'react';

const StatCard = ({ label, value, diff, trend, icon: Icon, color }: any) => (
  <div className="bg-white p-5 md:p-8 rounded-3xl border border-gray-200 shadow-sm transition-all hover:shadow-md animate-in zoom-in-95 duration-500">
    <div className="flex items-start justify-between mb-3 md:mb-4">
      <div className={`p-2.5 md:p-3 rounded-2xl ${color} bg-opacity-10 text-opacity-100`}>
        <Icon size={22} weight="bold" className="md:size-24" />
      </div>
      <div className={`flex items-center gap-1 font-black text-[10px] md:text-xs ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
        {trend === 'up' ? <TrendUp size={14} weight="bold" /> : <TrendDown size={14} weight="bold" />}
        {diff}
      </div>
    </div>
    <div className="text-left">
      <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-0.5 md:mb-1">{label}</p>
      <p className="text-xl md:text-3xl font-black text-gray-900 tracking-tight">{value}</p>
    </div>
  </div>
);

export function DashboardView() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [seeding, setSeeding] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubOrders = subscribeToCollection('orders', (data) => setOrders(data));
    const unsubProducts = subscribeToCollection('products', (data) => setProducts(data));
    const unsubUsers = subscribeToCollection('users', (data) => {
      setUsers(data);
      setLoading(false);
    });
    return () => {
      unsubOrders();
      unsubProducts();
      unsubUsers();
    };
  }, []);

  const statsData = useMemo(() => {
    if (orders.length === 0 && products.length === 0 && users.length === 0) {
      return { revenue: 0, orders: 0, customers: 0, products: 0, recentOrders: [], chartData: [] };
    }

    const totalRevenue = orders.reduce((acc, curr) => acc + (curr.total || 0), 0);
    const sortedOrders = [...orders].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const recent = sortedOrders.slice(0, 4);

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        date: d.toLocaleDateString('fr-FR', { weekday: 'short' }),
        fullDate: d.toISOString().split('T')[0],
        sales: 0
      };
    });

    orders.forEach(order => {
      if (!order.createdAt) return;
      const orderDate = order.createdAt.split('T')[0];
      const dayMatch = last7Days.find(d => d.fullDate === orderDate);
      if (dayMatch) {
        dayMatch.sales += (order.total || 0);
      }
    });

    return {
      revenue: totalRevenue,
      orders: orders.length,
      customers: users.length,
      products: products.length,
      recentOrders: recent,
      chartData: last7Days
    };
  }, [orders, products, users]);

  const handleSeed = async () => {
    if (!window.confirm("BOMBARDER LA BASE DE DONNÉES ? (350 produits vont être générés et ajoutés)")) return;
    setSeeding(true);
    try {
      await Promise.all([
        seedProducts(),
        seedCategories()
      ]);
      alert("🔥 BOMBARDEMENT RÉUSSI ! Produits et catégories ont été injectés.");
    } catch (error) {
      console.error("Error seeding:", error);
      alert("Erreur lors du bombardement.");
    } finally {
      setSeeding(false);
    }
  };


  return (
    <div className="space-y-8">
      
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Bonjour, Mode Admin 👋</h2>
          <p className="text-sm font-medium text-gray-500">Voici ce qui se passe sur votre boutique aujourd'hui.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            disabled={loading}
            className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-colors shadow-sm disabled:opacity-50"
            title="Rafraîchir"
          >
            <ArrowClockwise size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          
          <button 
            onClick={handleSeed}
            disabled={seeding}
            className="flex items-center gap-2 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-6 py-4 rounded-2xl shadow-xl shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {seeding ? <ArrowClockwise size={16} className="animate-spin" /> : <Database size={16} weight="bold" />}
            BOMBARDER FIRESTORE
          </button>

          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm w-fit font-black">
            <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-gray-900 text-white rounded-xl">7 Jours</button>
          </div>
        </div>
      </div>

      {loading && statsData.revenue === 0 ? (
        <div className="py-20 text-center animate-pulse">
           <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Initialisation des statistiques...</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              label="Chiffre d'Affaires" 
              value={`${statsData.revenue.toLocaleString('fr-FR')} €`} 
              diff="+12.5%" 
              trend="up" 
              icon={CurrencyEur} 
              color="bg-primary text-primary" 
            />
            <StatCard 
              label="Commandes" 
              value={statsData.orders} 
              diff="+8.2%" 
              trend="up" 
              icon={ShoppingCart} 
              color="bg-blue-500 text-blue-500" 
            />
            <StatCard 
              label="Nouveaux Clients" 
              value={statsData.customers} 
              diff="-3.1%" 
              trend="down" 
              icon={Users} 
              color="bg-purple-500 text-purple-500" 
            />
            <StatCard 
              label="Produits Actifs" 
              value={statsData.products} 
              diff="+4.5%" 
              trend="up" 
              icon={Package} 
              color="bg-orange-500 text-orange-500" 
            />
          </div>

          {/* Main Analytics Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Sales Chart */}
            <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                <div className="text-left">
                  <h3 className="font-black text-gray-900 uppercase tracking-tight">Analyse des Ventes</h3>
                  <p className="text-xs font-medium text-gray-400 mt-1">Évolution hebdomadaire du CA</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-primary rounded-full shadow-sm shadow-primary/20"></span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Ventes</span>
                  </div>
                </div>
              </div>
              
              <div className="h-[250px] md:h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={statsData.chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff5a1f" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#ff5a1f" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F1F1" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#9CA3AF', fontSize: 9, fontWeight: 700}} 
                      dy={10}
                      interval={0}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#9CA3AF', fontSize: 9, fontWeight: 700}} 
                      tickFormatter={(value) => `${value}€`}
                    />
                    <Tooltip 
                      contentStyle={{
                        borderRadius: '16px',
                        border: 'none',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        fontSize: '11px',
                        fontWeight: 'bold'
                      }}
                      cursor={{ stroke: '#ff5a1f', strokeWidth: 2, strokeDasharray: '5 5' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#ff5a1f" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorSales)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Orders Side Card */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col animate-in slide-in-from-right-4 duration-700">
              <h3 className="font-black text-xs md:text-sm text-gray-900 uppercase tracking-widest mb-6 md:mb-8 text-left">Dernières Commandes</h3>
              <div className="space-y-5 md:space-y-6 flex-grow ">
                {statsData.recentOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-300 py-10">
                    <ShoppingCart size={40} weight="thin" />
                    <p className="text-[9px] font-black uppercase tracking-widest mt-4">Aucune commande</p>
                  </div>
                ) : (
                  statsData.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between group cursor-pointer border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          order.status === 'Processing' ? 'bg-orange-500' : 
                          order.status === 'Shipped' ? 'bg-blue-500' : 'bg-green-500'
                        }`} />
                        <div className="text-left">
                          <p className="text-xs font-black text-gray-900 truncate max-w-[100px] md:max-w-[120px]">{order.userName}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                            #{order.id.substring(0,6)}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs font-black text-gray-900">{order.total.toFixed(0)}€</p>
                    </div>
                  ))
                )}
              </div>
              <button className="mt-8 w-full py-4 border-2 border-gray-50 rounded-2xl text-[9px] font-black uppercase tracking-widest text-gray-400 hover:border-primary hover:text-primary transition-all active:scale-95">
                Voir tout
              </button>
            </div>

          </div>
        </>
      )}

    </div>
  );
}
