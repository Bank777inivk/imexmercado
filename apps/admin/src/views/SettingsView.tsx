import React, { useEffect, useState } from "react";
import {
  CreditCard,
  Globe,
  ShieldCheck,
  Check,
  ArrowClockwise,
  Eye,
  EyeSlash,
  Fingerprint,
  Bank,
  PaypalLogo,
  Gear,
  Megaphone,
} from "@phosphor-icons/react";
import {
  subscribeToDocument,
  setDocument,
  seedReviewsForExistingProducts,
} from "@imexmercado/firebase";

// ─── Types & Defaults ──────────────────────────────────────────────────────────
const TABS = [
  {
    id: "stripe",
    label: "Stripe",
    icon: CreditCard,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    id: "mollie",
    label: "Mollie",
    icon: Bank,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    id: "payplug",
    label: "PayPlug",
    icon: Fingerprint,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
  {
    id: "square",
    label: "Square",
    icon: Globe,
    color: "text-gray-900",
    bg: "bg-gray-100",
  },
  {
    id: "paypal",
    label: "PayPal",
    icon: PaypalLogo,
    color: "text-blue-800",
    bg: "bg-blue-100",
  },
  {
    id: "bank_transfer",
    label: "Virement",
    icon: Bank,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    id: "mbway",
    label: "MB WAY",
    icon: CreditCard,
    color: "text-pink-600",
    bg: "bg-pink-50",
  },
  {
    id: "multibanco",
    label: "Multibanco",
    icon: Bank,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    id: "marketing",
    label: "Marketing & Pixels",
    icon: Megaphone,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    id: "seo",
    label: "SEO & Pages",
    icon: Globe,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    id: "inventory",
    label: "Stocks",
    icon: Gear,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
  },
  {
    id: "shipping_zones",
    label: "Zones de Livraison",
    icon: Globe,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
];

const DEFAULT_PAYMENT_CONFIG = {
  stripe: {
    enabled: false,
    mode: "test",
    test: { publishableKey: "", secretKey: "", webhookSecret: "" },
    live: { publishableKey: "", secretKey: "", webhookSecret: "" },
  },
  mollie: {
    enabled: false,
    mode: "test",
    test: { apiKey: "", profileId: "" },
    live: { apiKey: "", profileId: "" },
  },
  payplug: {
    enabled: false,
    mode: "test",
    test: { secretKey: "" },
    live: { secretKey: "" },
  },
  square: {
    enabled: false,
    mode: "test",
    test: { applicationId: "", accessToken: "", locationId: "" },
    live: { applicationId: "", accessToken: "", locationId: "" },
  },
  paypal: {
    enabled: false,
    mode: "test",
    test: { clientId: "", secret: "" },
    live: { clientId: "", secret: "" },
  },
  bank_transfer: { enabled: false, iban: "", bic: "", beneficiary: "" },
  mbway: { enabled: false, merchantId: "" },
  multibanco: { enabled: false, entity: "" },
  marketing: {
    ga4Enabled: false,
    ga4Id: "",
    gtmEnabled: false,
    gtmId: "",
    metaEnabled: false,
    metaId: "",
    customScripts: "",
  },
  seo: {
    home: { title: "", description: "" },
    shop: { title: "", description: "" },
    contact: { title: "", description: "" },
    about: { title: "", description: "" },
    faq: { title: "", description: "" },
  },
  inventory: {
    lowStockThreshold: 5,
    hideOutOfStock: false,
  },
  shipping_zones: {
    zones: [
      { countryCode: "FR", name: "France", price: 4.99 },
      { countryCode: "PT", name: "Portugal", price: 4.99 },
      { countryCode: "ES", name: "Espagne", price: 4.99 },
      { countryCode: "BE", name: "Belgique", price: 5.99 },
      { countryCode: "CH", name: "Suisse", price: 9.99 },
    ],
  },
};

// ─── Shared UI Components ──────────────────────────────────────────────────────
function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`w-12 h-6 rounded-full relative transition-all flex-shrink-0 ${value ? "bg-green-500" : "bg-gray-200"}`}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${value ? "right-1" : "left-1"}`}
      />
    </button>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block ml-1">
          {label}
        </label>
        {hint && (
          <span className="text-[8px] font-bold text-gray-300 uppercase tracking-tighter">
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  const [show, setShow] = useState(false);
  const isSecret = type === "password";

  return (
    <div className="relative">
      <input
        type={isSecret ? (show ? "text" : "password") : type}
        className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/10 outline-none pr-10"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {isSecret && (
        <button
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
        >
          {show ? (
            <EyeSlash size={16} weight="bold" />
          ) : (
            <Eye size={16} weight="bold" />
          )}
        </button>
      )}
    </div>
  );
}

function ModeSelector({
  value,
  onChange,
}: {
  value: "test" | "live";
  onChange: (v: "test" | "live") => void;
}) {
  return (
    <div className="flex p-1 bg-gray-100 rounded-xl w-fit">
      <button
        onClick={() => onChange("test")}
        className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${value === "test" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400"}`}
      >
        Mode Test
      </button>
      <button
        onClick={() => onChange("live")}
        className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${value === "live" ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "text-gray-400"}`}
      >
        Mode Live
      </button>
    </div>
  );
}

// ─── Main View ──────────────────────────────────────────────────────────────
export function SettingsView() {
  const [activeTab, setActiveTab] = useState("stripe");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<any>(DEFAULT_PAYMENT_CONFIG);

  useEffect(() => {
    const unsubscribe = subscribeToDocument(
      "settings",
      "payment_secrets",
      (data) => {
        if (data) setConfig({ ...DEFAULT_PAYMENT_CONFIG, ...data });
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Sauvegarder l'intégralité (Secrets + Config) pour l'Admin
      await setDocument("settings", "payment_secrets", config);

      // 2. Extraire uniquement les données publiques pour la Boutique
      const publicConfig = {
        stripe: {
          enabled: config.stripe.enabled,
          mode: config.stripe.mode,
          publishableKey: config.stripe[config.stripe.mode].publishableKey,
        },
        mollie: {
          enabled: config.mollie.enabled,
          mode: config.mollie.mode,
          profileId: config.mollie[config.mollie.mode].profileId,
        },
        payplug: {
          enabled: config.payplug.enabled,
          mode: config.payplug.mode,
        },
        square: {
          enabled: config.square.enabled,
          mode: config.square.mode,
          applicationId: config.square[config.square.mode].applicationId,
          locationId: config.square[config.square.mode].locationId,
        },
        paypal: {
          enabled: config.paypal.enabled,
          mode: config.paypal.mode,
          clientId: config.paypal[config.paypal.mode].clientId,
        },
        bank_transfer: {
          enabled: config.bank_transfer.enabled,
          iban: config.bank_transfer.iban,
          bic: config.bank_transfer.bic,
          beneficiary: config.bank_transfer.beneficiary,
        },
        mbway: {
          enabled: config.mbway.enabled,
          merchantId: config.mbway.merchantId,
        },
        multibanco: {
          enabled: config.multibanco.enabled,
          entity: config.multibanco.entity,
        },
      };
      await setDocument("settings", "payment_public", publicConfig);

      // 3. Sauvegarder les configurations marketing pour la Boutique
      await setDocument(
        "settings",
        "marketing_tracking",
        config.marketing || DEFAULT_PAYMENT_CONFIG.marketing,
      );
      await setDocument(
        "settings",
        "seo",
        config.seo || DEFAULT_PAYMENT_CONFIG.seo,
      );
      await setDocument(
        "settings",
        "inventory",
        config.inventory || DEFAULT_PAYMENT_CONFIG.inventory,
      );
      await setDocument(
        "settings",
        "shipping_zones",
        config.shipping_zones || DEFAULT_PAYMENT_CONFIG.shipping_zones,
      );

      alert("✅ Paramètres sauvegardés et synchronisés en temps réel !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  const handleSeed = async () => {
    if (!confirm("Voulez-vous initialiser les paramètres de test par défaut ?"))
      return;

    setSaving(true);
    try {
      const TEST_CONFIG = {
        ...DEFAULT_PAYMENT_CONFIG,
        stripe: {
          enabled: true,
          mode: "test",
          test: {
            publishableKey: "pk_test_sample_key",
            secretKey: "sk_test_sample_key",
            webhookSecret: "whsec_sample",
          },
          live: { publishableKey: "", secretKey: "", webhookSecret: "" },
        },
        paypal: {
          enabled: true,
          mode: "test",
          test: { clientId: "sb", secret: "sample_secret" },
          live: { clientId: "", secret: "" },
        },
        mollie: {
          enabled: true,
          mode: "test",
          test: { apiKey: "test_sample_key", profileId: "pfl_sample" },
          live: { apiKey: "", profileId: "" },
        },
        square: {
          enabled: true,
          mode: "test",
          test: {
            applicationId: "sq0idp-sample",
            accessToken: "EAAA-sample",
            locationId: "L_sample",
          },
          live: { applicationId: "", accessToken: "", locationId: "" },
        },
        payplug: {
          enabled: true,
          mode: "test",
          test: { secretKey: "sk_test_sample" },
          live: { secretKey: "" },
        },
        bank_transfer: {
          enabled: true,
          iban: "PT50 0003 1234 5678 9012 345",
          bic: "MBWAYPT",
          beneficiary: "IMEXMERCADO PORTUGAL",
        },
        mbway: {
          enabled: true,
          merchantId: "MBW-PT-12345",
        },
        multibanco: {
          enabled: true,
          entity: "12345",
        },
      };

      await setDocument("settings", "payment_secrets", TEST_CONFIG);

      const publicConfig = {
        stripe: {
          enabled: true,
          mode: "test",
          publishableKey: "pk_test_sample_key",
        },
        paypal: { enabled: true, mode: "test", clientId: "sb" },
        mollie: { enabled: true, mode: "test", profileId: "pfl_sample" },
        payplug: { enabled: true, mode: "test" },
        square: {
          enabled: true,
          mode: "test",
          applicationId: "sq0idp-sample",
          locationId: "L_sample",
        },
        bank_transfer: {
          enabled: true,
          iban: "PT50 0003 1234 5678 9012 345",
          bic: "MBWAYPT",
          beneficiary: "IMEXMERCADO PORTUGAL",
        },
        mbway: { enabled: true, merchantId: "MBW-PT-12345" },
        multibanco: { enabled: true, entity: "12345" },
      };
      await setDocument("settings", "payment_public", publicConfig);

      setConfig(TEST_CONFIG);
      alert("✅ Paramètres de test initialisés !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'initialisation.");
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (terminal: string, key: string, value: any) => {
    setConfig((prev: any) => ({
      ...prev,
      [terminal]: { ...prev[terminal], [key]: value },
    }));
  };

  const updateKeys = (
    terminal: string,
    mode: "test" | "live",
    key: string,
    value: string,
  ) => {
    setConfig((prev: any) => ({
      ...prev,
      [terminal]: {
        ...prev[terminal],
        [mode]: { ...prev[terminal][mode], [key]: value },
      },
    }));
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
          Initialisation des terminaux...
        </p>
      </div>
    );

  const currentTab = TABS.find((t) => t.id === activeTab)!;
  const terminalConfig =
    config[activeTab] ||
    DEFAULT_PAYMENT_CONFIG[activeTab as keyof typeof DEFAULT_PAYMENT_CONFIG];
  const mode = terminalConfig.mode;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Paramètres de Paiement
          </h2>
          <p className="text-sm font-medium text-gray-400 mt-1">
            Configurez et activez vos passerelles de paiement en un clic.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={async () => {
              if (
                !confirm("Générer 20 avis pour chaque produit dans la base ?")
              )
                return;
              setSaving(true);
              try {
                await seedReviewsForExistingProducts();
                alert("✅ 20 avis par produit générés avec succès !");
              } catch (err) {
                console.error(err);
                alert("Erreur lors de la génération.");
              } finally {
                setSaving(false);
              }
            }}
            disabled={saving}
            className="flex items-center gap-2 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest px-6 py-4 rounded-2xl hover:bg-gray-200 transition-all disabled:opacity-50"
          >
            <Gear size={18} weight="bold" />
            Générer Avis
          </button>
          <button
            onClick={handleSeed}
            disabled={saving}
            className="flex items-center gap-2 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest px-6 py-4 rounded-2xl hover:bg-gray-200 transition-all disabled:opacity-50"
          >
            <ArrowClockwise
              size={18}
              weight="bold"
              className={saving ? "animate-spin" : ""}
            />
            Initialiser Test
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-6 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50"
          >
            {saving ? (
              <ArrowClockwise size={18} className="animate-spin" />
            ) : (
              <Check size={18} weight="bold" />
            )}
            Enregistrer les API
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-2 flex flex-wrap gap-1.5">
        {TABS.map((tab) => {
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
                  : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <Icon size={16} weight={isActive ? "fill" : "bold"} />
              <span>{tab.label}</span>
              {isEnabled && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white shadow-sm" />
              )}
            </button>
          );
        })}
      </div>

      {/* Terminal Panel */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-2xl ${currentTab.bg} flex items-center justify-center shadow-inner`}
            >
              <currentTab.icon
                size={24}
                weight="fill"
                className={currentTab.color}
              />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-lg uppercase tracking-tight">
                Configuration {currentTab.label}
              </h3>
              <p className="text-xs text-gray-400 font-medium">
                Gestion des clés API et de l'environnement.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            {activeTab !== "marketing" && (
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Activer le terminal
                </span>
                <Toggle
                  value={terminalConfig.enabled}
                  onChange={(v) => updateConfig(activeTab, "enabled", v)}
                />
              </div>
            )}
            {["stripe", "mollie", "payplug", "square", "paypal"].includes(
              activeTab,
            ) && (
              <ModeSelector
                value={mode}
                onChange={(v) => updateConfig(activeTab, "mode", v)}
              />
            )}
          </div>
        </div>

        {/* Dynamic Forms based on Tab */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-50">
          {/* STRIPE */}
          {activeTab === "stripe" && (
            <>
              <Field label="Clé Publique" hint={`Stripe ${mode.toUpperCase()}`}>
                <Input
                  value={terminalConfig[mode].publishableKey}
                  onChange={(v) =>
                    updateKeys("stripe", mode, "publishableKey", v)
                  }
                  placeholder="pk_test_..."
                />
              </Field>
              <Field label="Clé Secrète" hint="Garder confidentiel">
                <Input
                  type="password"
                  value={terminalConfig[mode].secretKey}
                  onChange={(v) => updateKeys("stripe", mode, "secretKey", v)}
                  placeholder="sk_test_..."
                />
              </Field>
              <Field label="Webhook Secret" hint="Pour la synchro paiement">
                <Input
                  type="password"
                  value={terminalConfig[mode].webhookSecret}
                  onChange={(v) =>
                    updateKeys("stripe", mode, "webhookSecret", v)
                  }
                  placeholder="whsec_..."
                />
              </Field>
            </>
          )}

          {/* MOLLIE */}
          {activeTab === "mollie" && (
            <>
              <Field label="Clé API Mollie" hint="Test ou Live">
                <Input
                  type="password"
                  value={terminalConfig[mode].apiKey}
                  onChange={(v) => updateKeys("mollie", mode, "apiKey", v)}
                  placeholder="test_..."
                />
              </Field>
              <Field label="Profil ID" hint="Identifiant commerçant">
                <Input
                  value={terminalConfig[mode].profileId}
                  onChange={(v) => updateKeys("mollie", mode, "profileId", v)}
                  placeholder="pfl_..."
                />
              </Field>
            </>
          )}

          {/* PAYPLUG */}
          {activeTab === "payplug" && (
            <Field label="Clé Secrète PayPlug" hint="Unique API Key">
              <Input
                type="password"
                value={terminalConfig[mode].secretKey}
                onChange={(v) => updateKeys("payplug", mode, "secretKey", v)}
                placeholder="sk_test_..."
              />
            </Field>
          )}

          {/* SQUARE */}
          {activeTab === "square" && (
            <>
              <Field label="Application ID">
                <Input
                  value={terminalConfig[mode].applicationId}
                  onChange={(v) =>
                    updateKeys("square", mode, "applicationId", v)
                  }
                  placeholder="sq0idp-..."
                />
              </Field>
              <Field label="Access Token">
                <Input
                  type="password"
                  value={terminalConfig[mode].accessToken}
                  onChange={(v) => updateKeys("square", mode, "accessToken", v)}
                  placeholder="EAAA..."
                />
              </Field>
              <Field label="Location ID" hint="Identifiant point de vente">
                <Input
                  value={terminalConfig[mode].locationId}
                  onChange={(v) => updateKeys("square", mode, "locationId", v)}
                  placeholder="L..."
                />
              </Field>
            </>
          )}

          {/* PAYPAL */}
          {activeTab === "paypal" && (
            <>
              <Field label="Client ID">
                <Input
                  value={terminalConfig[mode].clientId}
                  onChange={(v) => updateKeys("paypal", mode, "clientId", v)}
                  placeholder="AU..."
                />
              </Field>
              <Field label="Secret Key">
                <Input
                  type="password"
                  value={terminalConfig[mode].secret}
                  onChange={(v) => updateKeys("paypal", mode, "secret", v)}
                  placeholder="EM..."
                />
              </Field>
            </>
          )}

          {/* BANK TRANSFER */}
          {activeTab === "bank_transfer" && (
            <>
              <Field label="Bénéficiaire" hint="Nom de l'entreprise">
                <Input
                  value={terminalConfig.beneficiary}
                  onChange={(v) =>
                    updateConfig("bank_transfer", "beneficiary", v)
                  }
                  placeholder="IMEXMERCADO SARL"
                />
              </Field>
              <Field label="IBAN" hint="Identifiant compte">
                <Input
                  value={terminalConfig.iban}
                  onChange={(v) => updateConfig("bank_transfer", "iban", v)}
                  placeholder="FR76..."
                />
              </Field>
              <Field label="BIC / SWIFT" hint="Code banque international">
                <Input
                  value={terminalConfig.bic}
                  onChange={(v) => updateConfig("bank_transfer", "bic", v)}
                  placeholder="IMEX..."
                />
              </Field>
            </>
          )}

          {/* MB WAY */}
          {activeTab === "mbway" && (
            <Field
              label="Identifiant Marchand MB WAY (Merchant ID)"
              hint="Requis pour MB WAY Portugal"
            >
              <Input
                value={terminalConfig.merchantId}
                onChange={(v) => updateConfig("mbway", "merchantId", v)}
                placeholder="MBW-PT-..."
              />
            </Field>
          )}

          {/* MULTIBANCO */}
          {activeTab === "multibanco" && (
            <Field
              label="Entité Multibanco (Entity)"
              hint="Entité à 5 chiffres"
            >
              <Input
                value={terminalConfig.entity}
                onChange={(v) => updateConfig("multibanco", "entity", v)}
                placeholder="12345"
              />
            </Field>
          )}

          {/* MARKETING & TRACKING */}
          {activeTab === "marketing" && (
            <div className="col-span-full space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Google Analytics GA4 */}
                <div className="p-5 bg-gray-50 rounded-2xl space-y-4 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-sm">
                      Google Analytics GA4
                    </span>
                    <Toggle
                      value={terminalConfig.ga4Enabled || false}
                      onChange={(v) =>
                        updateConfig("marketing", "ga4Enabled", v)
                      }
                    />
                  </div>
                  <Field label="ID de mesure GA4" hint="ex: G-XXXXXXXXXX">
                    <Input
                      value={terminalConfig.ga4Id || ""}
                      onChange={(v) => updateConfig("marketing", "ga4Id", v)}
                      placeholder="G-XXXXXXXXXX"
                    />
                  </Field>
                </div>

                {/* Google Tag Manager */}
                <div className="p-5 bg-gray-50 rounded-2xl space-y-4 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-sm">
                      Google Tag Manager (GTM)
                    </span>
                    <Toggle
                      value={terminalConfig.gtmEnabled || false}
                      onChange={(v) =>
                        updateConfig("marketing", "gtmEnabled", v)
                      }
                    />
                  </div>
                  <Field label="ID de conteneur GTM" hint="ex: GTM-XXXXXXX">
                    <Input
                      value={terminalConfig.gtmId || ""}
                      onChange={(v) => updateConfig("marketing", "gtmId", v)}
                      placeholder="GTM-XXXXXXX"
                    />
                  </Field>
                </div>

                {/* Meta Pixel */}
                <div className="p-5 bg-gray-50 rounded-2xl space-y-4 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-sm">
                      Meta Pixel (Facebook Ads)
                    </span>
                    <Toggle
                      value={terminalConfig.metaEnabled || false}
                      onChange={(v) =>
                        updateConfig("marketing", "metaEnabled", v)
                      }
                    />
                  </div>
                  <Field label="ID du Pixel" hint="ex: 1234567890">
                    <Input
                      value={terminalConfig.metaId || ""}
                      onChange={(v) => updateConfig("marketing", "metaId", v)}
                      placeholder="1234567890"
                    />
                  </Field>
                </div>
              </div>

              {/* Custom Scripts */}
              <div className="p-5 bg-gray-50 rounded-2xl space-y-4 text-left">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">
                    Scripts tiers personnalisés
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Collez ici n'importe quel code script complet ou widget
                    (Pixel TikTok, script d'intégration complet Meta
                    Facebook/Instagram, balise Google Ads, Live Chat, etc.). Ils
                    seront exécutés automatiquement sur toutes les pages.
                  </p>
                </div>
                <Field label="Code HTML / JS Personnalisé">
                  <textarea
                    rows={6}
                    value={terminalConfig.customScripts || ""}
                    onChange={(e) =>
                      updateConfig("marketing", "customScripts", e.target.value)
                    }
                    placeholder="<!-- Ex: Tiktok Pixel Script -->&#10;<script>...</script>"
                    className="w-full bg-white border border-gray-100 rounded-xl py-3 px-4 text-xs font-mono focus:ring-2 focus:ring-primary/10 outline-none resize-y"
                  />
                </Field>
              </div>
            </div>
          )}

          {/* SEO & PAGES */}
          {activeTab === "seo" && (
            <div className="col-span-full space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {(
                  [
                    { key: "home", label: "Page d'Accueil" },
                    { key: "shop", label: "Page de la Boutique" },
                    { key: "contact", label: "Page de Contact" },
                    { key: "about", label: "Page À Propos" },
                    { key: "faq", label: "Page FAQ" },
                  ] as { key: string; label: string }[]
                ).map(({ key, label }) => (
                  <div
                    key={key}
                    className="p-5 bg-gray-50 rounded-2xl space-y-4 text-left"
                  >
                    <span className="font-bold text-gray-900 text-sm">
                      {label}
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="Meta Title">
                        <Input
                          value={terminalConfig?.[key]?.title || ""}
                          onChange={(v) => {
                            updateConfig("seo", key, {
                              ...(terminalConfig?.[key] || {}),
                              title: v,
                            });
                          }}
                          placeholder="Titre de la page..."
                        />
                      </Field>
                      <Field label="Meta Description">
                        <Input
                          value={terminalConfig?.[key]?.description || ""}
                          onChange={(v) => {
                            updateConfig("seo", key, {
                              ...(terminalConfig?.[key] || {}),
                              description: v,
                            });
                          }}
                          placeholder="Description de la page..."
                        />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INVENTORY / STOCKS */}
          {activeTab === "inventory" && (
            <div className="col-span-full space-y-6">
              <div className="p-5 bg-gray-50 rounded-2xl space-y-4 text-left">
                <span className="font-bold text-gray-900 text-sm">
                  Alerte de Stock Bas
                </span>
                <Field
                  label="Seuil d'alerte de stock bas"
                  hint="Nombre de produits restants"
                >
                  <Input
                    type="number"
                    value={(terminalConfig?.lowStockThreshold ?? 5).toString()}
                    onChange={(v) =>
                      updateConfig(
                        "inventory",
                        "lowStockThreshold",
                        parseInt(v) || 0,
                      )
                    }
                    placeholder="5"
                  />
                </Field>
              </div>

              <div className="p-5 bg-gray-50 rounded-2xl space-y-4 text-left flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-900 text-sm block">
                    Masquer les produits hors stock
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    Masque automatiquement les articles dont le stock est égal à
                    0
                  </span>
                </div>
                <Toggle
                  value={terminalConfig?.hideOutOfStock || false}
                  onChange={(v) =>
                    updateConfig("inventory", "hideOutOfStock", v)
                  }
                />
              </div>
            </div>
          )}

          {/* SHIPPING ZONES */}
          {activeTab === "shipping_zones" && (
            <div className="col-span-full space-y-6">
              <div className="p-5 bg-gray-50 rounded-2xl space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900 text-sm">
                      Zones de Livraison Européennes
                    </span>
                    <p className="text-xs text-gray-400 mt-1 font-medium">
                      Configurez les pays de livraison et leurs tarifs
                      correspondants.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const currentZones = terminalConfig?.zones || [];
                      updateConfig("shipping_zones", "zones", [
                        ...currentZones,
                        { countryCode: "", name: "", price: 0 },
                      ]);
                    }}
                    className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                  >
                    + Ajouter une zone
                  </button>
                </div>

                <div className="space-y-3 mt-4">
                  {(terminalConfig?.zones || []).map(
                    (zone: any, index: number) => (
                      <div key={index} className="flex gap-3 items-center">
                        <input
                          type="text"
                          placeholder="Code pays (ex: FR)"
                          maxLength={2}
                          className="w-24 bg-white border border-gray-100 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/10 outline-none uppercase"
                          value={zone.countryCode}
                          onChange={(e) => {
                            const updated = [...(terminalConfig?.zones || [])];
                            updated[index] = {
                              ...updated[index],
                              countryCode: e.target.value.toUpperCase(),
                            };
                            updateConfig("shipping_zones", "zones", updated);
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Nom du pays (ex: France)"
                          className="flex-1 bg-white border border-gray-100 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/10 outline-none"
                          value={zone.name}
                          onChange={(e) => {
                            const updated = [...(terminalConfig?.zones || [])];
                            updated[index] = {
                              ...updated[index],
                              name: e.target.value,
                            };
                            updateConfig("shipping_zones", "zones", updated);
                          }}
                        />
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Tarif (€)"
                          className="w-32 bg-white border border-gray-100 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/10 outline-none"
                          value={zone.price}
                          onChange={(e) => {
                            const updated = [...(terminalConfig?.zones || [])];
                            updated[index] = {
                              ...updated[index],
                              price: parseFloat(e.target.value) || 0,
                            };
                            updateConfig("shipping_zones", "zones", updated);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (
                              terminalConfig?.zones || []
                            ).filter((_: any, i: number) => i !== index);
                            updateConfig("shipping_zones", "zones", updated);
                          }}
                          className="p-2.5 text-red-400 bg-red-50 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ),
                  )}
                  {(terminalConfig?.zones || []).length === 0 && (
                    <p className="text-xs text-gray-300 font-bold text-center py-4">
                      Aucune zone configurée (Livraison gratuite par défaut)
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Global Protection Advice */}
        <div className="bg-gray-900 rounded-[2rem] p-6 flex items-start gap-4 text-white shadow-2xl">
          <ShieldCheck
            size={28}
            weight="duotone"
            className="text-green-500 flex-shrink-0 mt-0.5"
          />
          <div>
            <p className="font-black text-sm uppercase tracking-widest mb-1">
              Protection des données
            </p>
            <p className="text-gray-400 text-xs leading-relaxed">
              Toutes vos clés API sont stockées dans un environnement Firestore
              sécurisé. Ne partagez jamais ces accès avec des tiers. Pour plus
              de sécurité, utilisez le **Mode Test** jusqu'à ce que votre
              boutique soit prête pour le lancement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
