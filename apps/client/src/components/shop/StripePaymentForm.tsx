import React, { useState } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { ShieldCheck, CreditCard } from '@phosphor-icons/react';

// ─── Stripe Element Styling ───────────────────────────────────────────────────
const stripeElementStyle = {
  style: {
    base: {
      fontSize: '14px',
      color: '#111827',
      fontFamily: '"Inter", system-ui, sans-serif',
      fontWeight: '500',
      letterSpacing: '0.02em',
      fontSmoothing: 'antialiased',
      '::placeholder': { color: '#9ca3af' },
    },
    invalid: { color: '#ef4444' },
  },
};

const stripeCardNumberStyle = {
  style: {
    base: {
      ...stripeElementStyle.style.base,
      fontSize: '15px',
      letterSpacing: '0.08em',
    },
    invalid: stripeElementStyle.style.invalid,
  },
};

// ─── Shared field wrapper ─────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">{label}</label>
      <div className="bg-white border border-gray-200 focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900 rounded-xl px-4 py-3.5 transition-all">
        {children}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function StripePaymentForm() {
  const [cardBrand, setCardBrand] = useState<string>('unknown');

  return (
    <div className="space-y-4">

      {/* Card brand indicator */}
      <div className="flex items-center gap-2 mb-2">
        <CreditCard size={16} className="text-gray-400" weight="bold" />
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          {cardBrand !== 'unknown' ? cardBrand.toUpperCase() : 'Carte bancaire'}
        </span>
        <div className="flex items-center gap-1.5 ml-auto opacity-50">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
        </div>
      </div>

      {/* Numéro de carte */}
      <Field label="Numéro de carte">
        <CardNumberElement
          options={stripeCardNumberStyle}
          onChange={(e) => setCardBrand(e.brand)}
        />
      </Field>

      {/* Expiration + CVC */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Expiration">
          <CardExpiryElement options={stripeElementStyle} />
        </Field>
        <Field label="CVC">
          <CardCvcElement options={stripeElementStyle} />
        </Field>
      </div>

      {/* Titulaire */}
      <Field label="Titulaire de la carte">
        <input
          type="text"
          placeholder="Votre nom complet"
          className="w-full bg-transparent outline-none border-none text-sm font-medium text-gray-900 placeholder:text-gray-400"
        />
      </Field>

      {/* Badge sécurité */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <ShieldCheck weight="fill" size={13} className="text-green-500" />
        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Paiement chiffré SSL 256-bit</span>
      </div>

    </div>
  );
}
