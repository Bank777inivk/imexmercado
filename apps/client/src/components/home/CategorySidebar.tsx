import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  { icon: House, name: 'Maison & Décoration', hasSubmenu: false },
  { icon: Couch, name: 'Meubles & Lampes', hasSubmenu: false },
  { icon: Screwdriver, name: 'Bricolage', hasSubmenu: true },
  { icon: Tree, name: 'Barbecues & Planchas', hasSubmenu: false },
  { icon: SwimmingPool, name: 'Piscines & Spas', hasSubmenu: false },
];

export function CategorySidebar({ isOpen = true }: { isOpen?: boolean }) {
  const [activeSubmenu, setActiveSubmenu] = React.useState<number | null>(null);
  const navigate = useNavigate();

  const toggleSubmenu = (idx: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveSubmenu(activeSubmenu === idx ? null : idx);
  };

  const handleCategoryClick = (catName: string) => {
    navigate(`/boutique?category=${encodeURIComponent(catName)}`);
  };

  if (!isOpen) return null;

  return (
    <div className="w-[250px] bg-white border-x border-b border-gray-300 shadow-sm hidden lg:flex flex-col flex-shrink-0 relative z-40 h-[450px]">
      <ul className="py-2 flex-1 flex flex-col">
        {categories.map((cat, idx) => (
          <li key={idx} className="relative group/item">
            <div 
              className={`w-full flex items-center justify-between px-4 py-2.5 text-gray-600 hover:text-primary hover:bg-gray-50 transition-all cursor-pointer
                ${activeSubmenu === idx ? 'bg-gray-50 text-primary' : ''}
              `}
              onClick={() => handleCategoryClick(cat.name)}
            >
              <div className="flex items-center gap-3">
                <cat.icon size={20} className={`transition-colors ${activeSubmenu === idx ? 'text-primary' : 'text-gray-400 group-hover/item:text-primary'}`} />
                <span className="text-sm font-medium">{cat.name}</span>
              </div>
              {cat.hasSubmenu && (
                <button 
                  onClick={(e) => toggleSubmenu(idx, e)}
                  className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <CaretRight size={14} className={`transition-transform ${activeSubmenu === idx ? 'rotate-90 text-primary' : 'text-gray-300 group-hover/item:text-primary'}`} />
                </button>
              )}
            </div>

            {/* Submenu — Dynamic on Hover/Click */}
            {cat.hasSubmenu && (
              <div className="absolute left-[249px] top-0 w-[400px] min-h-[450px] bg-white border border-gray-300 shadow-2xl p-6 grid grid-cols-2 gap-8 z-50 invisible group-hover/item:visible opacity-0 group-hover/item:opacity-100 transition-all duration-200">
                <div>
                  <h4 className="font-bold text-gray-900 mb-4 border-b pb-2 tracking-tight">Découvrir</h4>
                  <ul className="space-y-2 text-[13px] text-gray-600">
                    <li onClick={() => handleCategoryClick(cat.name)} className="hover:text-primary cursor-pointer transition-colors flex items-center gap-2">
                       <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                       Derniers arrivages
                    </li>
                    <li onClick={() => handleCategoryClick(cat.name)} className="hover:text-primary cursor-pointer transition-colors flex items-center gap-2">
                       <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                       Meilleures ventes
                    </li>
                    <li 
                      onClick={() => navigate('/boutique?promo=true')}
                      className="hover:text-primary cursor-pointer transition-colors flex items-center gap-2 text-primary font-bold"
                    >
                       <span className="w-1 h-1 bg-primary rounded-full"></span>
                       Promotions flash
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-4 border-b pb-2 tracking-tight">Accessoires</h4>
                  <ul className="space-y-2 text-[13px] text-gray-600">
                    <li onClick={() => handleCategoryClick(cat.name)} className="hover:text-primary cursor-pointer transition-colors flex items-center gap-2">
                       <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                       Nouveautés 2026
                    </li>
                    <li onClick={() => handleCategoryClick(cat.name)} className="hover:text-primary cursor-pointer transition-colors flex items-center gap-2">
                       <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                       Sélection Premium
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </li>
        ))}
        
        {/* Promotional Ad Slider */}
        <li className="px-4 py-4 mt-auto">
          <div className="relative h-40 w-full rounded-2xl overflow-hidden group/ad cursor-pointer border border-gray-100 shadow-sm">
            <AdSlider />
          </div>
        </li>

        <li className="border-t border-gray-100">
          <Link to="/boutique" className="flex items-center px-4 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-primary transition-colors bg-gray-50/50">
            Voir tout le catalogue +
          </Link>
        </li>
      </ul>
    </div>
  );
}

// Internal Mini-Slider for Ads
function AdSlider() {
  const [current, setCurrent] = React.useState(0);
  const ads = [
    {
      img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=400',
      title: 'Offre Hi-Tech',
      subtitle: '-20% sur tout'
    },
    {
      img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=400',
      title: 'Vente Privée',
      subtitle: 'Mobilier Design'
    },
    {
      img: 'https://images.unsplash.com/photo-1620912189865-1e8a33da4c5e?auto=format&fit=crop&q=80&w=400',
      title: 'Nouveautés',
      subtitle: 'Barbecue Inox'
    }
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % ads.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [ads.length]);

  return (
    <div className="w-full h-full relative">
      {ads.map((ad, idx) => (
        <div 
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${current === idx ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={ad.img} alt="" className="w-full h-full object-cover group-hover/ad:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3">
             <span className="text-[8px] font-black text-primary uppercase tracking-widest">{ad.title}</span>
             <span className="text-xs font-bold text-white leading-tight">{ad.subtitle}</span>
          </div>
        </div>
      ))}
      <div className="absolute bottom-2 right-2 flex gap-1">
        {ads.map((_, i) => (
          <div key={i} className={`w-1 h-1 rounded-full transition-all ${current === i ? 'bg-primary w-2' : 'bg-white/50'}`} />
        ))}
      </div>
    </div>
  );
}
