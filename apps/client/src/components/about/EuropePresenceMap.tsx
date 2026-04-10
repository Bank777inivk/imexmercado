import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from '@phosphor-icons/react';
import europeMap from '../../assets/europe-map.png';

const locations = [
  { id: 'pt', name: 'Alhos Vedros, Portugal (Siège)', x: '18%', y: '82%', isBase: true },
  { id: 'fr', name: 'France (Opérationnel)', x: '35%', y: '58%', isBase: false },
  { id: 'it', name: 'Milan, Italie', x: '52%', y: '68%', isBase: false },
  { id: 'de', name: 'Berlin, Allemagne', x: '55%', y: '42%', isBase: false },
];

export function EuropePresenceMap() {
  return (
    <div className="relative w-full h-full bg-white rounded-3xl overflow-hidden border-2 border-gray-200 shadow-xl group">
      {/* Background Map Image */}
      <img 
        src={europeMap} 
        alt="Europe Logistics Map" 
        className="w-full h-full object-cover grayscale opacity-30 group-hover:opacity-40 transition-opacity duration-1000" 
      />
      
      {/* Abstract Animated Lines (Connecting Dots) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        {locations.filter(l => !l.isBase).map((loc) => (
          <motion.line
            key={`line-${loc.id}`}
            x1="18%" y1="82%"
            x2={loc.x} y2={loc.y}
            stroke="#f97316"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 1.5, delay: 1 }}
          />
        ))}
      </svg>

      {/* Pulsing Base (Portugal) */}
      <motion.div 
        className="absolute w-32 h-32 bg-primary/10 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
        style={{ left: '18%', top: '82%' }}
        animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Location Markers */}
      {locations.map((loc) => (
        <motion.div
          key={loc.id}
          className="absolute z-20"
          style={{ left: loc.x, top: loc.y }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            delay: loc.isBase ? 0.3 : (0.5 + Math.random() * 0.5), 
            type: 'spring', 
            stiffness: 100 
          }}
        >
          <div className="relative -translate-x-1/2 -translate-y-1/2 group/pin">
            {/* The Pin */}
            <div className={`p-1.5 rounded-full ${loc.isBase ? 'bg-primary text-white shadow-lg shadow-primary/40' : 'bg-gray-900/10 backdrop-blur-sm text-gray-900 hover:bg-white'} border border-white/50 transition-all cursor-pointer`}>
              <MapPin size={loc.isBase ? 20 : 12} weight="fill" />
            </div>
            
            {/* Tooltip (Label) */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 text-white text-[8px] font-black uppercase tracking-widest rounded whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-opacity z-30 shadow-2xl">
              {loc.name}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Overlay Stats/Text */}
      <div className="absolute bottom-6 left-6 z-20">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Hub Logistique</p>
        <p className="text-sm font-black text-gray-900 uppercase">Alhos Vedros, PT</p>
      </div>
      
      <div className="absolute top-6 right-6 z-20 bg-white/50 backdrop-blur-sm px-3 py-1.5 border border-white/50 rounded-full">
        <p className="text-[9px] font-bold text-gray-600 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Réseau Actif : Europe du Sud & Centrale
        </p>
      </div>

      {/* Decorative Gradients */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
    </div>
  );
}
