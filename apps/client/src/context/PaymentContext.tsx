import React, { createContext, useContext, useEffect, useState } from 'react';
import { subscribeToDocument } from '@imexmercado/firebase';

interface PaymentConfig {
  stripe: { enabled: boolean; mode: 'test' | 'live'; publishableKey: string };
  mollie: { enabled: boolean; mode: 'test' | 'live'; profileId: string };
  payplug: { enabled: boolean; mode: 'test' | 'live' };
  square: { enabled: boolean; mode: 'test' | 'live'; applicationId: string; locationId: string };
  paypal: { enabled: boolean; mode: 'test' | 'live'; clientId: string };
}

interface PaymentContextType {
  config: PaymentConfig | null;
  isLoading: boolean;
  activeGateways: string[];
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

const DEFAULT_CONFIG: PaymentConfig = {
  stripe: { enabled: false, mode: 'test', publishableKey: '' },
  mollie: { enabled: false, mode: 'test', profileId: '' },
  payplug: { enabled: false, mode: 'test' },
  square: { enabled: false, mode: 'test', applicationId: '', locationId: '' },
  paypal: { enabled: false, mode: 'test', clientId: '' },
};

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<PaymentConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Écoute en temps réel des réglages publics de paiement
    const unsubscribe = subscribeToDocument<PaymentConfig>('settings', 'payment_public', (data) => {
      if (data) {
        setConfig(data);
      } else {
        setConfig(DEFAULT_CONFIG);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const activeGateways = config 
    ? Object.entries(config)
        .filter(([_, value]) => value.enabled)
        .map(([key]) => key)
    : [];

  return (
    <PaymentContext.Provider value={{ config, isLoading, activeGateways }}>
      {children}
    </PaymentContext.Provider>
  );
}

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};
