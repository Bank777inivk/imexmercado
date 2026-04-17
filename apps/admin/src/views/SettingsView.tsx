import React, { useEffect, useState } from 'react';
import { 
  CreditCard, Globe, ShieldCheck, Check, ArrowClockwise, 
  Eye, EyeSlash, Fingerprint, Bank, PaypalLogo, Gear
} from '@phosphor-icons/react';
import { subscribeToDocument, setDocument } from '@imexmercado/firebase';

// ─── Types & Defaults ──────────────────────────────────────────────────────────
const TABS = [
  { id: 'stripe', label: 'Stripe', icon: CreditCard, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { id: 'mollie', label: 'Mollie', icon: Bank, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'payplug', label: 'PayPlug', icon: Fingerprint, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { id: 'square', label: 'Square', icon: Globe, color: 'text-gray-900', bg: 'bg-gray-100' },
  { id: 'paypal', label: 'PayPal', icon: PaypalLogo, color: 'text-blue-800', bg: 'bg-blue-100' },
];

const DEFAULT_PAYMENT_CONFIG = {
  stripe: { enabled: false, mode: 'test', test: { publishableKey: '', secretKey: '', webhookSecret: '' }, live: { publishableKey: '', secretKey: '', webhookSecret: '' } },
  mollie: { enabled: false, mode: 'test', test: { apiKey: '', profileId: '' }, live: { apiKey: '', profileId: '' } },
  payplug: { enabled: false, mode: 'test', test: { secretKey: '' }, live: { secretKey: '' } },
  square: { enabled: false, mode: 'test', test: { applicationId: '', accessToken: '', locationId: '' }, live: { applicationId: '', accessToken: '', locationId: '' } },
  paypal: { enabled: false, mode: 'test', test: { clientId: '', secret: '' }, live: { clientId: '', secret: '' } },
};

// ─── Shared UI Components ──────────────────────────────────────────────────────
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`w-12 h-6 rounded-full relative transition-all flex-shrink-0 ${value ? 'bg-green-500' : 'bg-gray-200'}`}
    >
      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${value ? 'right-1' : 'left-1'}`} />
    </button>
  );
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block ml-1">{label}</label>
        {hint && <span className="text-[8px] font-bold text-gray-300 uppercase tracking-tighter">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = 'text' }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  const [show, setShow] = useState(false);
  const isSecret = type === 'password';

  return (
    <div className="relative">
      <input
        type={isSecret ? (show ? 'text' : 'password') : type}
        className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/10 outline-none pr-10"
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
      />
      {isSecret && (
        <button 
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
        >
          {show ? <EyeSlash size={16} weight="bold" /> : <Eye size={16} weight="bold" />}
        </button>
      )}
    </div>
  );
}

function ModeSelector({ value, onChange }: { value: 'test' | 'live', onChange: (v: 'test' | 'live') => void }) {
  return (
    <div className="flex p-1 bg-gray-100 rounded-xl w-fit">
      <button 
        onClick={() => onChange('test')}
        className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${value === 'test' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
      >
        Mode Test
      </button>
      <button 
        onClick={() => onChange('live')}
        className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${value === 'live' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-gray-400'}`}
      >
        Mode Live
      </button>
    </div>
  );
}

// ─── Main View ──────────────────────────────────────────────────────────────
export function SettingsView() {
  const [activeTab, setActiveTab] = useState('stripe');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<any>(DEFAULT_PAYMENT_CONFIG);

  useEffect(() => {
    const unsubscribe = subscribeToDocument('settings', 'payment_secrets', (data) => {
      if (data) setConfig({ ...DEFAULT_PAYMENT_CONFIG, ...data });
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Sauvegarder l'intégralité (Secrets + Config) pour l'Admin
      await setDocument('settings', 'payment_secrets', config);

      // 2. Extraire uniquement les données publiques pour la Boutique
      const publicConfig = {
        stripe: { 
          enabled: config.stripe.enabled, 
          mode: config.stripe.mode, 
          publishableKey: config.stripe[config.stripe.mode].publishableKey 
        },
        mollie: { 
          enabled: config.mollie.enabled, 
          mode: config.mollie.mode, 
          profileId: config.mollie[config.mollie.mode].profileId 
        },
        payplug: { 
          enabled: config.payplug.enabled, 
          mode: config.payplug.mode 
        },
        square: { 
          enabled: config.square.enabled, 
          mode: config.square.mode, 
          applicationId: config.square[config.square.mode].applicationId,
          locationId: config.square[config.square.mode].locationId 
        },
        paypal: { 
          enabled: config.paypal.enabled, 
          mode: config.paypal.mode, 
          clientId: config.paypal[config.paypal.mode].clientId 
        },
      };
      await setDocument('settings', 'payment_public', publicConfig);

      alert('✅ Paramètres de paiement synchronisés en temps réel !');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (terminal: string, key: string, value: any) => {
    setConfig((prev: any) => ({
      ...prev,
      [terminal]: { ...prev[terminal], [key]: value }
    }));
  };

  const updateKeys = (terminal: string, mode: 'test' | 'live', key: string, value: string) => {
    setConfig((prev: any) => ({
      ...prev,
      [terminal]: { 
        ...prev[terminal], 
        [mode]: { ...prev[terminal][mode], [key]: value }
      }
    }));
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Initialisation des terminaux...</p>
    </div>
  );

  const currentTab = TABS.find(t => t.id === activeTab)!;
  const terminalConfig = config[activeTab] || DEFAULT_PAYMENT_CONFIG[activeTab as keyof typeof DEFAULT_PAYMENT_CONFIG];
  const mode = terminalConfig.mode;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Paramètres de Paiement</h2>
          <p className="text-sm font-medium text-gray-400 mt-1">Configurez et activez vos passerelles de paiement en un clic.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-6 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50"
        >
          {saving ? <ArrowClockwise size={18} className="animate-spin" /> : <Check size={18} weight="bold" />}
          Enregistrer les API
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-2 flex flex-wrap gap-1.5">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isEnabled = config[tab.id]?.enabled;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all relative ${
                isActive
                  ? `${tab.bg} ${tab.color} shadow-sm`
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <Icon size={16} weight={isActive ? 'fill' : 'bold'} />
              <span>{tab.label}</span>
              {isEnabled && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white shadow-sm" />}
            </button>
          );
        })}
      </div>

      {/* Terminal Panel */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${currentTab.bg} flex items-center justify-center shadow-inner`}>
              <currentTab.icon size={24} weight="fill" className={currentTab.color} />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-lg uppercase tracking-tight">Configuration {currentTab.label}</h3>
              <p className="text-xs text-gray-400 font-medium">Gestion des clés API et de l'environnement.</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Activer le terminal</span>
              <Toggle value={terminalConfig.enabled} onChange={v => updateConfig(activeTab, 'enabled', v)} />
            </div>
            <ModeSelector value={mode} onChange={v => updateConfig(activeTab, 'mode', v)} />
          </div>
        </div>

        {/* Dynamic Forms based on Tab */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-50">
          
          {/* STRIPE */}
          {activeTab === 'stripe' && (
            <>
              <Field label="Clé Publique" hint={`Stripe ${mode.toUpperCase()}`}>
                <Input value={terminalConfig[mode].publishableKey} onChange={v => updateKeys('stripe', mode, 'publishableKey', v)} placeholder="pk_test_..." />
              </Field>
              <Field label="Clé Secrète" hint="Garder confidentiel">
                <Input type="password" value={terminalConfig[mode].secretKey} onChange={v => updateKeys('stripe', mode, 'secretKey', v)} placeholder="sk_test_..." />
              </Field>
              <Field label="Webhook Secret" hint="Pour la synchro paiement">
                <Input type="password" value={terminalConfig[mode].webhookSecret} onChange={v => updateKeys('stripe', mode, 'webhookSecret', v)} placeholder="whsec_..." />
              </Field>
            </>
          )}

          {/* MOLLIE */}
          {activeTab === 'mollie' && (
            <>
              <Field label="Clé API Mollie" hint="Test ou Live">
                <Input type="password" value={terminalConfig[mode].apiKey} onChange={v => updateKeys('mollie', mode, 'apiKey', v)} placeholder="test_..." />
              </Field>
              <Field label="Profil ID" hint="Identifiant commerçant">
                <Input value={terminalConfig[mode].profileId} onChange={v => updateKeys('mollie', mode, 'profileId', v)} placeholder="pfl_..." />
              </Field>
            </>
          )}

          {/* PAYPLUG */}
          {activeTab === 'payplug' && (
            <Field label="Clé Secrète PayPlug" hint="Unique API Key">
              <Input type="password" value={terminalConfig[mode].secretKey} onChange={v => updateKeys('payplug', mode, 'secretKey', v)} placeholder="sk_test_..." />
            </Field>
          )}

          {/* SQUARE */}
          {activeTab === 'square' && (
            <>
              <Field label="Application ID">
                <Input value={terminalConfig[mode].applicationId} onChange={v => updateKeys('square', mode, 'applicationId', v)} placeholder="sq0idp-..." />
              </Field>
              <Field label="Access Token">
                <Input type="password" value={terminalConfig[mode].accessToken} onChange={v => updateKeys('square', mode, 'accessToken', v)} placeholder="EAAA..." />
              </Field>
              <Field label="Location ID" hint="Identifiant point de vente">
                <Input value={terminalConfig[mode].locationId} onChange={v => updateKeys('square', mode, 'locationId', v)} placeholder="L..." />
              </Field>
            </>
          )}

          {/* PAYPAL */}
          {activeTab === 'paypal' && (
            <>
              <Field label="Client ID">
                <Input value={terminalConfig[mode].clientId} onChange={v => updateKeys('paypal', mode, 'clientId', v)} placeholder="AU..." />
              </Field>
              <Field label="Secret Key">
                <Input type="password" value={terminalConfig[mode].secret} onChange={v => updateKeys('paypal', mode, 'secret', v)} placeholder="EM..." />
              </Field>
            </>
          )}
        </div>

        {/* Global Protection Advice */}
        <div className="bg-gray-900 rounded-[2rem] p-6 flex items-start gap-4 text-white shadow-2xl">
          <ShieldCheck size={28} weight="duotone" className="text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-black text-sm uppercase tracking-widest mb-1">Protection des données</p>
            <p className="text-gray-400 text-xs leading-relaxed">
              Toutes vos clés API sont stockées dans un environnement Firestore sécurisé. Ne partagez jamais ces accès avec des tiers. Pour plus de sécurité, utilisez le **Mode Test** jusqu'à ce que votre boutique soit prête pour le lancement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
