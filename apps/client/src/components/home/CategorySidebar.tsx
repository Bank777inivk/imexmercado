import React from 'react';
import { 
  DeviceMobile, 
  House, 
  Couch, 
  Screwdriver, 
  Tree, 
  SwimmingPool, 
  Armchair, 
  Factory, 
  Cpu, 
  Lamp,
  CaretRight 
} from '@imexmercado/ui';

const categories = [
  { icon: DeviceMobile, name: 'Téléphones & Hi-Tech', hasSubmenu: true },
  { icon: House, name: 'Maison', hasSubmenu: false },
  { icon: Couch, name: 'Meubles & Déco', hasSubmenu: false },
  { icon: Screwdriver, name: 'Bricolage', hasSubmenu: true },
  { icon: Tree, name: 'BBQ & Jardin', hasSubmenu: false },
  { icon: SwimmingPool, name: 'Piscines & Loisirs', hasSubmenu: false },
  { icon: Factory, name: 'Industriel', hasSubmenu: false },
  { icon: Cpu, name: 'Composants', hasSubmenu: false },
  { icon: Lamp, name: 'Luminaires', hasSubmenu: false },
];

export function CategorySidebar({ isOpen = true }: { isOpen?: boolean }) {
  const [activeSubmenu, setActiveSubmenu] = React.useState<number | null>(null);

  const toggleSubmenu = (idx: number) => {
    setActiveSubmenu(activeSubmenu === idx ? null : idx);
  };

  if (!isOpen) return null;

  return (
    <div className="w-[250px] bg-white border-x border-b border-gray-300 shadow-sm hidden lg:flex flex-col flex-shrink-0 relative z-40">
      <ul className="py-2">
        {categories.map((cat, idx) => (
          <li key={idx} className="relative">
            <button 
              onClick={() => toggleSubmenu(idx)}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-gray-600 hover:text-primary hover:bg-gray-50 transition-all group
                ${activeSubmenu === idx ? 'bg-gray-50 text-primary' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                <cat.icon size={20} className={`transition-colors ${activeSubmenu === idx ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`} />
                <span className="text-sm font-medium">{cat.name}</span>
              </div>
              {cat.hasSubmenu && (
                <CaretRight size={14} className={`transition-transform ${activeSubmenu === idx ? 'rotate-90 text-primary' : 'text-gray-300 group-hover:text-primary'}`} />
              )}
            </button>

            {/* Submenu — Dynamic on Click */}
            {cat.hasSubmenu && activeSubmenu === idx && (
              <div className="absolute left-[249px] top-0 w-[400px] min-h-full bg-white border border-gray-300 shadow-2xl p-6 grid grid-cols-2 gap-8 z-50">
                <div>
                  <h4 className="font-bold text-gray-900 mb-4 border-b pb-2">Populaires</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="hover:text-primary cursor-pointer transition-colors">Derniers arrivages</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Meilleures ventes</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Promotions flash</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-4 border-b pb-2">Par Type</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="hover:text-primary cursor-pointer transition-colors">Smartphones Android</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">iPhones Reconditionnés</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Accessoires Hi-Tech</li>
                  </ul>
                </div>
              </div>
            )}
          </li>
        ))}
        <li className="mt-2 border-t border-gray-100">
          <a href="#" className="flex items-center px-4 py-3 text-xs font-bold text-gray-400 hover:text-primary transition-colors">
            Voir tout le catalogue +
          </a>
        </li>
      </ul>
    </div>
  );
}
