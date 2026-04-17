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

  // ─── Développement Fallback ────────────────────────────────────────────────
  // Si aucun moyen n'est configuré en DB, on active Stripe/PayPal par défaut
  // en mode développement pour permettre les tests immédiats.
  const isDev = import.meta.env.DEV;
  const hasNoConfig = activeGateways.length === 0;

  const finalGateways = (isDev && hasNoConfig) ? ['stripe', 'paypal', 'mollie', 'square', 'payplug'] : activeGateways;
  const finalConfig: PaymentConfig | null = (isDev && hasNoConfig) 
    ? {
        ...DEFAULT_CONFIG,
        stripe: { enabled: true, mode: 'test' as const, publishableKey: 'pk_test_sample_key' },
        paypal: { enabled: true, mode: 'test' as const, clientId: 'sb' },
        mollie: { enabled: true, mode: 'test' as const, profileId: 'pfl_test_sample' },
        square: { enabled: true, mode: 'test' as const, applicationId: 'sq0idp-sample', locationId: 'L_sample' },
        payplug: { enabled: true, mode: 'test' as const }
      }
    : config;

  return (
    <PaymentContext.Provider value={{ config: finalConfig, isLoading, activeGateways: finalGateways }}>
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
