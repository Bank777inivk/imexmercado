import React from 'react';
import { CardElement } from '@stripe/react-stripe-js';

const cardElementOptions = {
    style: {
      base: {
        fontSize: '14px',
        color: '#111827',
        fontFamily: 'Inter, system-ui, sans-serif',
        '::placeholder': {
          color: '#D1D5DB',
        },
      },
      invalid: {
        color: '#EF4444',
      },
    },
    hidePostalCode: true,
  };

export function StripePaymentForm() {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-white border border-gray-200 rounded-xl transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary shadow-sm">
        <CardElement options={cardElementOptions} />
      </div>
      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
        <p className="text-[10px] items-center font-black uppercase tracking-widest text-gray-400">
          Chiffrement SSL 256 bits activé par Stripe
        </p>
      </div>
    </div>
  );
}
