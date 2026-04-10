import { List, ShoppingCart, User, House } from '@imexmercado/ui';

function App() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Placeholder */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 text-xl font-bold border-b">
          IMEX ADMIN
        </div>
        <nav className="mt-6">
          <div className="flex items-center gap-3 px-6 py-3 text-primary bg-primary/5 border-r-4 border-primary font-medium">
            <House size={20} />
            Dashboard
          </div>
          <div className="flex items-center gap-3 px-6 py-3 text-gray-600 hover:bg-gray-50 transition-colors">
            <List size={20} />
            Produtos
          </div>
          <div className="flex items-center gap-3 px-6 py-3 text-gray-600 hover:bg-gray-50 transition-colors">
            <ShoppingCart size={20} />
            Encomendas
          </div>
          <div className="flex items-center gap-3 px-6 py-3 text-gray-600 hover:bg-gray-50 transition-colors">
            <User size={20} />
            Clientes
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <div className="flex items-center gap-4">
            <div className="bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center">
              <User size={20} />
            </div>
          </div>
        </header>

        <section className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500 uppercase font-semibold">Vendas de Hoje</p>
              <p className="text-2xl font-bold mt-1">1 240,00 €</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500 uppercase font-semibold">Encomendas</p>
              <p className="text-2xl font-bold mt-1">12</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500 uppercase font-semibold">Novos Clientes</p>
              <p className="text-2xl font-bold mt-1">4</p>
            </div>
          </div>

          <div className="mt-8 bg-white p-8 rounded-lg shadow-sm min-h-[400px]">
            <h3 className="text-lg font-bold mb-4">Vendas por Categoria</h3>
            <p className="text-gray-400">Gráfico a ser implementado...</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
