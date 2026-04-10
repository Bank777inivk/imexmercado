import React, { useEffect, useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { TrendUp, TrendDown, Package, ShoppingCart, Users, CurrencyEur, ArrowClockwise } from '@phosphor-icons/react';
import { getCollection } from '@imexmercado/firebase';

const StatCard = ({ label, value, diff, trend, icon: Icon, color }: any) => (
  <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-opacity-100`}>
        <Icon size={24} weight="bold" />
      </div>
      <div className={`flex items-center gap-1 font-bold text-xs ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
        {trend === 'up' ? <TrendUp size={14} /> : <TrendDown size={14} />}
        {diff}
      </div>
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{label}</p>
      <p className="text-2xl md:text-3xl font-black text-gray-900">{value}</p>
    </div>
  </div>
);

export function DashboardView() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    products: 0,
    recentOrders: [] as any[],
    chartData: [] as any[]
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const orders = await getCollection('orders');
      const products = await getCollection('products');
      const users = await getCollection('users');

      // Aggregate Stats
      const totalRevenue = orders.reduce((acc, curr) => acc + (curr.total || 0), 0);
      
      // Sort and Slice Recent Orders
      const sortedOrders = [...orders].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      const recent = sortedOrders.slice(0, 4);

      // Chart Data: Group by Date (last 7 days)
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
        const orderDate = order.createdAt.split('T')[0];
        const dayMatch = last7Days.find(d => d.fullDate === orderDate);
        if (dayMatch) {
          dayMatch.sales += order.total;
        }
      });

      setStats({
        revenue: totalRevenue,
        orders: orders.length,
        customers: users.length,
        products: products.length,
        recentOrders: recent,
        chartData: last7Days
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Bonjour, Mode Admin 👋</h2>
          <p className="text-sm font-medium text-gray-500">Voici ce qui se passe sur votre boutique aujourd'hui.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchData}
            className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-colors shadow-sm"
          >
            <ArrowClockwise size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm w-fit font-black">
            <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-gray-900 text-white rounded-xl">7 Jours</button>
          </div>
        </div>
      </div>

      {loading && stats.revenue === 0 ? (
        <div className="py-20 text-center animate-pulse">
           <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Initialisation des statistiques...</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              label="Chiffre d'Affaires" 
              value={`${stats.revenue.toLocaleString('fr-FR')} €`} 
              diff="+12.5%" 
              trend="up" 
              icon={CurrencyEur} 
              color="bg-primary text-primary" 
            />
            <StatCard 
              label="Commandes" 
              value={stats.orders} 
              diff="+8.2%" 
              trend="up" 
              icon={ShoppingCart} 
              color="bg-blue-500 text-blue-500" 
            />
            <StatCard 
              label="Nouveaux Clients" 
              value={stats.customers} 
              diff="-3.1%" 
              trend="down" 
              icon={Users} 
              color="bg-purple-500 text-purple-500" 
            />
            <StatCard 
              label="Produits Actifs" 
              value={stats.products} 
              diff="+4.5%" 
              trend="up" 
              icon={Package} 
              color="bg-orange-500 text-orange-500" 
            />
          </div>

          {/* Main Analytics Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Sales Chart */}
            <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
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
              
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.chartData}>
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
                      tick={{fill: '#9CA3AF', fontSize: 10, fontWeight: 700}} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#9CA3AF', fontSize: 10, fontWeight: 700}} 
                      tickFormatter={(value) => `${value}€`}
                    />
                    <Tooltip 
                      contentStyle={{
                        borderRadius: '16px',
                        border: 'none',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                      cursor={{ stroke: '#ff5a1f', strokeWidth: 2, strokeDasharray: '5 5' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#ff5a1f" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorSales)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Orders Side Card */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
              <h3 className="font-black text-gray-900 uppercase tracking-tight mb-8 text-left">Dernières Commandes</h3>
              <div className="space-y-6 flex-grow ">
                {stats.recentOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-300">
                    <ShoppingCart size={48} weight="thin" />
                    <p className="text-[10px] font-black uppercase tracking-widest mt-4">Aucune commande</p>
                  </div>
                ) : (
                  stats.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          order.status === 'Processing' ? 'bg-orange-500' : 
                          order.status === 'Shipped' ? 'bg-blue-500' : 'bg-green-500'
                        }`} />
                        <div className="text-left">
                          <p className="text-xs font-black text-gray-900 truncate max-w-[120px]">{order.userName}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            {order.id.substring(0,6)} • {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs font-black text-gray-900">{order.total.toFixed(0)}€</p>
                    </div>
                  ))
                )}
              </div>
              <button className="mt-8 w-full py-4 border-2 border-gray-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:border-primary hover:text-primary transition-all">
                Voir tout
              </button>
            </div>

          </div>
        </>
      )}

    </div>
  );
}
