import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { subscribeToCollection, subscribeToDocument } from '@imexmercado/firebase';
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
  CaretRight,
  Package
} from '@imexmercado/ui';

const ICON_MAP: Record<string, any> = {
  'Téléphones & Hi-Tech': DeviceMobile,
  'Maison & Décoration': House,
  'Meubles & Lampes': Couch,
  'Bricolage': Screwdriver,
  'Barbecues & Planchas': Tree,
  'Piscines & Spas': SwimmingPool,
  'Loisirs': SwimmingPool,
  'Meubles': Armchair,
  'Hi-Tech': Cpu,
  'Maison': House,
  'Tech': DeviceMobile
};

export function CategorySidebar({ isOpen = true }: { isOpen?: boolean }) {
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubCats = subscribeToCollection('categories', (data) => {
      // 1. Trier par ordre
      const sorted = data.sort((a, b) => (a.order || 0) - (b.order || 0));
      
      // 2. Dédupliquer par nom (on garde la version avec submenu si elle existe)
      const unique = sorted.reduce((acc: any[], current) => {
        const x = acc.find(item => item.name === current.name);
        if (!x) {
          return acc.concat([current]);
        } else if (current.hasSubmenu && !x.hasSubmenu) {
          return acc.map(item => item.name === current.name ? current : item);
        }
        return acc;
      }, []);

      setCategories(unique.filter(c => c.isActive !== false));
    });

    const unsubSettings = subscribeToDocument('settings', 'homepage', (data) => {
      setSettings(data);
    });

    return () => {
      unsubCats();
      unsubSettings();
    };
  }, []);

  const toggleSubmenu = (idx: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveSubmenu(activeSubmenu === idx ? null : idx);
  };

  const handleCategoryClick = (catName: string) => {
    navigate(`/boutique?category=${encodeURIComponent(catName)}`);
  };

  if (!isOpen) return null;

  const sidebarSettings = settings?.sidebar || {};
  const categoryAds = sidebarSettings.categoryAds?.length > 0 ? sidebarSettings.categoryAds : [
    {
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=400',
      title: 'Offre Hi-Tech',
      subtitle: '-20% sur tout'
    },
    {
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=400',
      title: 'Vente Privée',
      subtitle: 'Mobilier Design'
    }
  ];
  const showAllLink = sidebarSettings.showAllLink || '/boutique';

  return (
    <div className="w-[250px] bg-white border-x border-b border-gray-300 shadow-sm hidden lg:flex flex-col flex-shrink-0 relative z-40 h-full">
      <ul className="pt-2 flex-1 flex flex-col h-full">
        {categories.map((cat, idx) => (
          <li key={idx} className="relative group/item">
            <div 
              className={`w-full flex items-center justify-between px-4 py-2.5 text-gray-600 hover:text-primary hover:bg-gray-50 transition-all cursor-pointer
                ${activeSubmenu === idx ? 'bg-gray-50 text-primary' : ''}
              `}
              onClick={() => handleCategoryClick(cat.name)}
            >
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = ICON_MAP[cat.name] || ICON_MAP[cat.short] || Package;
                  return <Icon size={20} className={`transition-colors ${activeSubmenu === idx ? 'text-primary' : 'text-gray-400 group-hover/item:text-primary'}`} />;
                })()}
                <span className="text-sm font-medium">{cat.name}</span>
              </div>
              {cat.hasSubmenu && (
                <button 
                  onClick={(e) => toggleSubmenu(idx, e)}
                  className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <CaretRight size={14} weight="bold" className={`transition-transform ${activeSubmenu === idx ? 'rotate-90 text-primary' : 'text-gray-400 group-hover/item:text-primary'}`} />
                </button>
              )}
            </div>

            {/* Dynamic Submenu */}
            {cat.hasSubmenu && cat.subcategories?.length > 0 && (
              <div className="absolute left-[249px] top-0 w-[400px] min-h-[400px] bg-white border border-gray-300 shadow-2xl p-8 z-50 invisible group-hover/item:visible opacity-0 group-hover/item:opacity-100 transition-all duration-200">
                <div className="flex flex-col h-full">
                  <h4 className="font-black text-gray-900 text-lg mb-6 border-b border-gray-100 pb-4 tracking-tight uppercase">
                    {cat.name}
                  </h4>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {cat.subcategories.map((sub: string, i: number) => (
                      <div 
                        key={i} 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/boutique?category=${encodeURIComponent(cat.name)}&subcategory=${encodeURIComponent(sub)}`);
                        }}
                        className="group/sub flex items-center gap-3 py-1 cursor-pointer transition-all hover:translate-x-1"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover/sub:bg-primary transition-colors" />
                        <span className="text-[13px] font-bold text-gray-600 group-hover/sub:text-primary transition-colors">
                          {sub}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Special Offer / Featured for category */}
                  <div className="mt-auto pt-8">
                     <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Offre Spéciale</p>
                        <p className="text-xs font-bold text-gray-900 leading-tight">Profitez de -10% sur toute la gamme {cat.name} ce weekend !</p>
                     </div>
                  </div>
                </div>
              </div>
            )}
          </li>
        ))}
        
        {/* Promotional Ad Slider — Now dynamic */}
        <li className="px-4 py-4 mt-auto">
          <div className="relative h-32 w-full rounded-2xl overflow-hidden group/ad cursor-pointer border border-gray-100 shadow-sm">
            <AdSlider ads={categoryAds} />
          </div>
        </li>

        <li className="border-t border-gray-100 mt-0">
          <Link to={showAllLink} className="flex items-center px-4 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-primary transition-colors bg-gray-50/50">
            Voir tout le catalogue +
          </Link>
        </li>
      </ul>
    </div>
  );
}

// Internal Mini-Slider for Ads — Now accepts dynamic ads
function AdSlider({ ads = [] }: { ads?: any[] }) {
  const [current, setCurrent] = React.useState(0);
  
  const displayAds = ads.length > 0 ? ads : [
    {
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=400',
      title: 'Offre Hi-Tech',
      subtitle: '-20% sur tout'
    },
    {
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=400',
      title: 'Vente Privée',
      subtitle: 'Mobilier Design'
    }
  ];

  React.useEffect(() => {
    if (displayAds.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % displayAds.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [displayAds.length]);

  return (
    <div className="w-full h-full relative">
      {displayAds.map((ad, idx) => (
        <div 
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${current === idx ? 'opacity-100' : 'opacity-0'}`}
        >
          <img 
            src={ad.image || ad.img} 
            alt="" 
            className="w-full h-full object-cover group-hover/ad:scale-110 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3">
             <span className="text-[8px] font-black text-primary uppercase tracking-widest">{ad.title}</span>
             <span className="text-xs font-bold text-white leading-tight">{ad.subtitle}</span>
          </div>
        </div>
      ))}
      {displayAds.length > 1 && (
        <div className="absolute bottom-2 right-2 flex gap-1">
          {displayAds.map((_, i) => (
            <div key={i} className={`w-1 h-1 rounded-full transition-all ${current === i ? 'bg-primary w-2' : 'bg-white/50'}`} />
          ))}
        </div>
      )}
    </div>
  );
}
