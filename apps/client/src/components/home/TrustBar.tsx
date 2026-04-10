import React from 'react';
import { Truck, ArrowClockwise, Lock, ChatCircle } from '@imexmercado/ui';

const trustItems = [
  { icon: Truck, text: 'Livraison Gratuite', subtext: 'Sur commande > €49.86' },
  { icon: ArrowClockwise, text: 'Protection Commande', subtext: 'Informations sécurisées' },
  { icon: Lock, text: 'Paiement Sécurisé', subtext: 'SSL + 3D Secure' },
  { icon: ChatCircle, text: 'Retour 30 Jours', subtext: 'Remboursement garanti' },
];

export function TrustBar() {
  return (
    <div className="bg-white border-b border-gray-200 py-3">
      <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200">
        {trustItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 px-4 py-2">
            <item.icon size={28} className="text-primary flex-shrink-0" weight="regular" />
            <div>
              <p className="text-xs font-bold text-gray-800">{item.text}</p>
              <p className="text-[11px] text-gray-500">{item.subtext}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
