import React, { useState, useEffect } from 'react';
import { Truck, ArrowClockwise, Lock, ChatCircle, Phone, House, Star } from '@imexmercado/ui';
import { subscribeToDocument } from '@imexmercado/firebase';

const ICON_MAP: Record<string, any> = {
  Truck,
  ArrowClockwise,
  Lock,
  ChatCircle,
  Phone,
  House,
  Star
};

const DEFAULT_ITEMS = [
  { icon: 'Truck', title: 'Livraison Gratuite', subtitle: 'Sur commande > €49.86' },
  { icon: 'ArrowClockwise', title: 'Protection Commande', subtitle: 'Informations sécurisées' },
  { icon: 'Lock', title: 'Paiement Sécurisé', subtitle: 'SSL + 3D Secure' },
  { icon: 'ChatCircle', title: 'Retour 30 Jours', subtitle: 'Remboursement garanti' },
];

export function TrustBar() {
  const [items, setItems] = useState(DEFAULT_ITEMS);

  useEffect(() => {
    const unsubscribe = subscribeToDocument('settings', 'homepage', (data) => {
      if (data && data.trustBar) {
        setItems(data.trustBar);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white border-b border-gray-200 py-3 w-full px-4 md:px-8 lg:px-12">
      <div className="w-full grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200">
        {items.map((item, idx) => {
          const Icon = ICON_MAP[item.icon] || Star;
          return (
            <div key={idx} className="flex items-center gap-3 px-4 py-2">
              <Icon size={28} className="text-primary flex-shrink-0" weight="regular" />
              <div>
                <p className="text-xs font-bold text-gray-800">{item.title || (item as any).text}</p>
                <p className="text-[11px] text-gray-500">{item.subtitle || (item as any).subtext}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
