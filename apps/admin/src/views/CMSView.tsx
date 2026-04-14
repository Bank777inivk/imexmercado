import React, { useEffect, useState } from 'react';
import {
  Monitor, Megaphone, Plus, Trash, ImageSquare, Check,
  ArrowClockwise, ListDashes, Fire, Storefront,
  Newspaper, Star, Layout, Truck, Lock, ChatCircle, SquaresFour,
  CaretDown, CaretUp, List
} from '@phosphor-icons/react';
import { subscribeToDocument, setDocument } from '@imexmercado/firebase';
import { CloudinaryUploader } from '../components/CloudinaryUploader';

// ─── Section Tabs ──────────────────────────────────────────────────────────────
const TABS = [
  { id: 'promobar', label: 'Bandeau', icon: Megaphone, color: 'text-red-500', bg: 'bg-red-50' },
  { id: 'hero', label: 'Hero Slider', icon: Layout, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'minibanner', label: 'Mini Banners', icon: Storefront, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'trustbar', label: 'Confiance', icon: Truck, color: 'text-green-500', bg: 'bg-green-50' },
  { id: 'categories', label: 'Catégories', icon: SquaresFour, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'blog', label: 'Actualités', icon: Newspaper, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { id: 'flashsale', label: 'Offres Flash', icon: Fire, color: 'text-orange-600', bg: 'bg-orange-100' },
  { id: 'promo', label: 'Blocs Promo', icon: Star, color: 'text-teal-500', bg: 'bg-teal-50' },
  { id: 'newsletter', label: 'Newsletter', icon: Newspaper, color: 'text-gray-500', bg: 'bg-gray-100' },
  { id: 'sidebar', label: 'Barre Latérale', icon: List, color: 'text-cyan-500', bg: 'bg-cyan-50' },
];

// ─── Default settings ──────────────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  promoBar: {
    text: 'Offre spéciale de lancement ! -20% sur tout le site',
    color: '#CC0000',
    isActive: true,
  },
  heroSlides: [
    {
      id: '1',
      title: 'HI-TECH',
      subtitle: 'Le meilleur de la technologie',
      image: 'https://placehold.co/800x450',
      videoUrl: '',
      ctaText: 'VOIR PLUS',
      isActive: true,
    },
  ],
  miniBanners: [
    {
      id: 'mb1',
      label: 'PROMOTION JUSQU\'AU 21 AVRIL',
      title: 'Jusqu\'à -15% sur l\'outillage de Bricolage',
      subtitle: 'Promo Bricolage',
      image: '',
      color: '#6B21A8',
      link: '/boutique?filter=promo',
      isActive: true,
    },
    {
      id: 'mb2',
      label: 'SÉLECTION MAISON',
      title: 'Jusqu\'à 55% de réduction directe',
      subtitle: 'Promo Maison',
      image: '',
      color: '#111111',
      link: '/boutique?category=Maison',
      isActive: true,
    },
  ],
  flashSale: {
    isActive: true,
    title: 'OFFRES DU JOUR',
    endHour: 23,
    endMinute: 59,
  },
  trustBar: [
    { id: '1', icon: 'Truck', title: 'Livraison Gratuite', subtitle: 'Sur commande > €49.86' },
    { id: '2', icon: 'ArrowClockwise', title: 'Protection Commande', subtitle: 'Informations sécurisées' },
    { id: '3', icon: 'Lock', title: 'Paiement Sécurisé', subtitle: 'SSL + 3D Secure' },
    { id: '4', icon: 'ChatCircle', title: 'Retour 30 Jours', subtitle: 'Remboursement garanti' },
  ],
  blogBanner: {
    title: 'Actualités, conseils et inspiration',
    link: '/actualites',
    isActive: true,
  },
  homeCategories: [
    { id: '1', name: 'Téléphones & Hi-Tech', short: 'Tech', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=200', link: '/boutique?category=T%C3%A9l%C3%A9phones+%26+Hi-Tech' },
    { id: '2', name: 'Maison & Décoration', short: 'Maison', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=200', link: '/boutique?category=Maison+%26+D%C3%A9coration' },
    { id: '3', name: 'Meubles & Lampes', short: 'Meubles', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=200', link: '/boutique?category=Meubles+%26+Lampes' },
    { id: '4', name: 'Bricolage', short: 'Brico', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=200', link: '/boutique?category=Bricolage' },
    { id: '5', name: 'Barbecues & Planchas', short: 'BBQ', image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&q=80&w=200', link: '/boutique?category=Barbecues+%26+Planchas' },
    { id: '6', name: 'Piscines & Spas', short: 'Piscines', image: 'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?auto=format&fit=crop&q=80&w=200', link: '/boutique?category=Piscines+%26+Spas' },
  ],
  promoBlocks: [
    { id: 'pb1', title: 'SÉLECTION HI-TECH', discount: "Jusqu'à 60 % de réduction", description: 'sur une sélection de smartphones reconditionnés', color: '#00ADC6', image: '', link: '/boutique?category=Téléphones' },
    { id: 'pb2', title: 'AMÉNAGEMENT JARDIN', discount: "Jusqu'à 20 % de réduction", description: 'sur notre gamme BBQ et salons d\'extérieur', color: '#00A7C1', image: '', link: '/boutique?category=Barbecues' },
    { id: 'pb3', title: 'OFFRE BRICOLAGE', discount: "Jusqu'à 30 % de réduction", description: 'sur l\'outillage électroportatif professionnel', color: '#00B4CC', image: '', link: '/boutique?category=Bricolage' },
    { id: 'pb4', title: 'PROMO MOBILIER', discount: '10 % avec code MAISON10', description: 'à l\'achat de 2 meubles ou canapés', color: '#00B9D6', image: '', link: '/boutique?category=Meubles' },
  ],
  newsletter: {
    isActive: true,
    title: 'Restez dans la Boucle',
    subtitle: 'Offres exclusives, nouveautés et conseils directement dans votre boîte mail.',
    buttonText: 'M\'abonner',
  },
  sidebar: {
    categoryAds: [
      { image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=400', title: 'Offre Hi-Tech', subtitle: '-20% sur tout' },
      { image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=400', title: 'Vente Privée', subtitle: 'Mobilier Design' },
      { image: 'https://images.unsplash.com/photo-1620912189865-1e8a33da4c5e?auto=format&fit=crop&q=80&w=400', title: 'Nouveautés', subtitle: 'Barbecue Inox' }
    ],
    showAllLink: '/boutique',
    latestTitle: 'Derniers Produits',
    popularTitle: 'Populaires',
    verticalAds: [
      { image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400&h=600', title: 'Interior Design', subtitle: 'Shop now', bgColor: '#00000033' },
      { image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400&h=600', title: 'Living Room', subtitle: 'Collection 2026', bgColor: '#0000FF33' }
    ],
    engagementStats: [
      { value: '300+', label: 'Références', subtext: 'En stock réel', emoji: '📦' },
      { value: '50', label: 'Produits', subtext: 'Par catégorie', emoji: '🗂️' },
      { value: '24h', label: 'Traitement', subtext: 'Commande express', emoji: '⚡' },
      { value: '100%', label: 'Vérifiés', subtext: 'Contrôle strict', emoji: '✅' }
    ]
  }
};

// ─── Reusable Toggle ───────────────────────────────────────────────────────────
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

// ─── Field ─────────────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block ml-1">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, className = '' }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <input
      type="text"
      className={`w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/10 outline-none ${className}`}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
    />
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h3 className="font-black text-gray-900 text-lg uppercase tracking-tight">{title}</h3>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
  );
}

function AdvancedSettings({ children, title = "Textes & Métadonnées" }: { children: React.ReactNode; title?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mt-4 border-t border-gray-100 pt-4">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
      >
        {isOpen ? <CaretUp size={14} weight="bold" /> : <CaretDown size={14} weight="bold" />}
        {title}
      </button>
      {isOpen && <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">{children}</div>}
    </div>
  );
}

// ─── Section Components ────────────────────────────────────────────────────────

function PromoBarSection({ settings, setSettings }: any) {
  const pb = settings.promoBar;
  const set = (k: string, v: any) => setSettings((s: any) => ({ ...s, promoBar: { ...s.promoBar, [k]: v } }));
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionTitle title="Bandeau Haut" subtitle="Configuration visuelle de l'accroche site." />
        <Toggle value={pb.isActive} onChange={v => set('isActive', v)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Atmosphère (Couleur)">
          <div className="flex items-center gap-3">
            <input type="color" className="w-12 h-12 rounded-xl border-none cursor-pointer p-0 overflow-hidden shadow-sm" value={pb.color} onChange={e => set('color', e.target.value)} />
            <Input value={pb.color} onChange={v => set('color', v)} placeholder="#CC0000" className="font-mono" />
          </div>
        </Field>

        <div className="flex items-end">
          {pb.isActive && (
            <div className="w-full rounded-xl py-3 px-4 text-center text-white text-[10px] font-black uppercase tracking-widest shadow-lg" style={{ backgroundColor: pb.color }}>
              {pb.text || 'Aperçu du bandeau...'}
            </div>
          )}
        </div>
      </div>

      <AdvancedSettings>
        <Field label="Message d'annonce">
          <textarea
            className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/10 outline-none resize-none"
            rows={2}
            value={pb.text}
            onChange={e => set('text', e.target.value)}
          />
        </Field>
      </AdvancedSettings>
    </div>
  );
}

function HeroSliderSection({ settings, setSettings }: any) {
  const slides = settings.heroSlides || [];
  const addSlide = () => setSettings((s: any) => ({
    ...s, heroSlides: [...s.heroSlides, { id: Date.now().toString(), title: 'NOUVEAU', subtitle: 'Description', image: '', videoUrl: '', ctaText: 'VOIR PLUS', isActive: true }]
  }));
  const removeSlide = (id: string) => setSettings((s: any) => ({ ...s, heroSlides: s.heroSlides.filter((x: any) => x.id !== id) }));
  const update = (id: string, k: string, v: any) => setSettings((s: any) => ({ ...s, heroSlides: s.heroSlides.map((x: any) => x.id === id ? { ...x, [k]: v } : x) }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionTitle title="Hero Slider" subtitle="Gestion des grandes bannières visuelles et vidéos." />
        <button onClick={addSlide} className="flex items-center gap-2 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-2xl shadow-xl hover:scale-105 transition-all">
          <Plus size={16} weight="bold" /> Nouveau Slide
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slides.map((slide: any, i: number) => (
          <div key={slide.id} className="bg-white rounded-3xl p-6 space-y-6 border border-gray-100 shadow-sm relative group/card">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Banner #{i + 1}</span>
              <div className="flex items-center gap-3">
                <Toggle value={slide.isActive} onChange={v => update(slide.id, 'isActive', v)} />
                <button onClick={() => removeSlide(slide.id)} className="p-2 text-gray-200 hover:text-red-500 transition-colors">
                  <Trash size={18} weight="bold" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CloudinaryUploader 
                label="Image de fond" 
                value={slide.image} 
                onChange={url => update(slide.id, 'image', url)} 
              />
              <CloudinaryUploader 
                label="Vidéo (MP4)" 
                resourceType="video"
                value={slide.videoUrl} 
                onChange={url => update(slide.id, 'videoUrl', url)} 
              />
            </div>

            <AdvancedSettings title="Textes de la bannière">
              <div className="grid grid-cols-1 gap-3">
                <Field label="Titre principal"><Input value={slide.title} onChange={v => update(slide.id, 'title', v)} /></Field>
                <Field label="Sous-titre"><Input value={slide.subtitle} onChange={v => update(slide.id, 'subtitle', v)} /></Field>
                <Field label="Texte bouton"><Input value={slide.ctaText} onChange={v => update(slide.id, 'ctaText', v)} /></Field>
              </div>
            </AdvancedSettings>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniBannersSection({ settings, setSettings }: any) {
  const banners = settings.miniBanners || [];
  const update = (id: string, k: string, v: any) => setSettings((s: any) => ({ ...s, miniBanners: s.miniBanners.map((x: any) => x.id === id ? { ...x, [k]: v } : x) }));

  return (
    <div className="space-y-6">
      <SectionTitle title="Mini Banners" subtitle="Les deux blocs d'appoint à droite du slide principal." />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b: any, i: number) => (
          <div key={b.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Bloc #{i + 1}</span>
              <Toggle value={b.isActive} onChange={v => update(b.id, 'isActive', v)} />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <CloudinaryUploader 
                label="Visuel de fond" 
                value={b.image} 
                onChange={url => update(b.id, 'image', url)} 
              />
              
              <Field label="Couleur de secours">
                <div className="flex items-center gap-3">
                  <input type="color" className="w-12 h-12 rounded-xl border-none cursor-pointer p-0 overflow-hidden shadow-sm" value={b.color} onChange={e => update(b.id, 'color', e.target.value)} />
                  <Input value={b.color} onChange={v => update(b.id, 'color', v)} placeholder="#6B21A8" className="font-mono text-xs" />
                </div>
              </Field>
            </div>

            <AdvancedSettings title="Textes & Lien">
              <div className="space-y-3">
                <Field label="Lien de redirection"><Input value={b.link} onChange={v => update(b.id, 'link', v)} /></Field>
                <Field label="Étiquette"><Input value={b.label} onChange={v => update(b.id, 'label', v)} /></Field>
                <Field label="Titre Principal"><Input value={b.title} onChange={v => update(b.id, 'title', v)} /></Field>
                <Field label="Sous-titre (Typo XL)"><Input value={b.subtitle} onChange={v => update(b.id, 'subtitle', v)} /></Field>
              </div>
            </AdvancedSettings>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlashSaleSection({ settings, setSettings }: any) {
  const fs = settings.flashSale || DEFAULT_SETTINGS.flashSale;
  const set = (k: string, v: any) => setSettings((s: any) => ({ ...s, flashSale: { ...s.flashSale, [k]: v } }));
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionTitle title="Ventes Flash" subtitle="Réglages du compte à rebours et de la section d'urgence." />
        <Toggle value={fs.isActive} onChange={v => set('isActive', v)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-orange-50/50 p-6 rounded-[2.5rem] border border-orange-100">
        <Field label="Heure de fin (0-23)">
          <input type="number" min={0} max={23} className="w-full bg-white border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-orange-200 outline-none shadow-sm" value={fs.endHour} onChange={e => set('endHour', parseInt(e.target.value))} />
        </Field>
        <Field label="Minute de fin (0-59)">
          <input type="number" min={0} max={59} className="w-full bg-white border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-orange-200 outline-none shadow-sm" value={fs.endMinute} onChange={e => set('endMinute', parseInt(e.target.value))} />
        </Field>
      </div>

      <AdvancedSettings title="Textes & Flag">
        <div className="space-y-3">
          <Field label="Titre section"><Input value={fs.title} onChange={v => set('title', v)} /></Field>
          <div className="bg-orange-100/50 rounded-xl p-4 text-[10px] text-orange-800 font-bold uppercase tracking-widest leading-relaxed">
            💡 Les produits affichés sont ceux marqués "Offre du Jour" dans leur fiche.
          </div>
        </div>
      </AdvancedSettings>
    </div>
  );
}

function PromoBlocksSection({ settings, setSettings }: any) {
  const blocks = settings.promoBlocks || DEFAULT_SETTINGS.promoBlocks;
  const update = (id: string, k: string, v: any) => setSettings((s: any) => ({ ...s, promoBlocks: s.promoBlocks.map((x: any) => x.id === id ? { ...x, [k]: v } : x) }));
  return (
    <div className="space-y-6">
      <SectionTitle title="Blocs Promotionnels" subtitle="Les 4 grandes cartes visuelles avec images de fond." />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blocks.map((b: any, i: number) => (
          <div key={b.id} className="bg-white border border-gray-100 rounded-3xl p-6 space-y-6 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
               <div className="w-4 h-4 rounded-full" style={{ backgroundColor: b.color }} />
               <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Carte #{i + 1}</span>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <CloudinaryUploader 
                label="Image du bloc" 
                value={b.image} 
                onChange={url => update(b.id, 'image', url)} 
              />
              <Field label="Couleur de fond">
                <div className="flex items-center gap-3">
                  <input type="color" className="w-12 h-12 rounded-xl border-none cursor-pointer p-0 overflow-hidden shadow-sm" value={b.color} onChange={e => update(b.id, 'color', e.target.value)} />
                  <Input value={b.color} onChange={v => update(b.id, 'color', v)} className="font-mono text-xs" />
                </div>
              </Field>
            </div>

            <AdvancedSettings title="Textes & Lien">
              <div className="space-y-3">
                <Field label="Titre Principal"><Input value={b.title} onChange={v => update(b.id, 'title', v)} /></Field>
                <Field label="Accroche (Réduction)"><Input value={b.discount} onChange={v => update(b.id, 'discount', v)} /></Field>
                <Field label="Description"><Input value={b.description} onChange={v => update(b.id, 'description', v)} /></Field>
                <Field label="Lien"><Input value={b.link} onChange={v => update(b.id, 'link', v)} /></Field>
              </div>
            </AdvancedSettings>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsletterSection({ settings, setSettings }: any) {
  const nl = settings.newsletter || DEFAULT_SETTINGS.newsletter;
  const set = (k: string, v: any) => setSettings((s: any) => ({ ...s, newsletter: { ...s.newsletter, [k]: v } }));
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionTitle title="Newsletter" subtitle="Réglages de l'appel à l'inscription mail." />
        <Toggle value={nl.isActive} onChange={v => set('isActive', v)} />
      </div>

      <div className="bg-gray-900 rounded-[2.5rem] p-8 text-center border-t-4 border-primary shadow-2xl">
        <p className="text-white font-black text-xl uppercase tracking-tighter">{nl.title}</p>
        <p className="text-gray-400 text-xs mt-2 max-w-md mx-auto">{nl.subtitle}</p>
        <div className="flex gap-2 max-w-sm mx-auto mt-6">
          <div className="flex-1 bg-white/5 rounded-xl py-3 px-4 text-gray-600 text-[10px] font-bold uppercase tracking-widest text-left">votre@email.com</div>
          <div className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl">{nl.buttonText}</div>
        </div>
      </div>

      <AdvancedSettings>
        <div className="grid grid-cols-1 gap-3">
          <Field label="Titre principal"><Input value={nl.title} onChange={v => set('title', v)} /></Field>
          <Field label="Sous-titre / Description">
            <textarea className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/10 outline-none resize-none" rows={2} value={nl.subtitle} onChange={e => set('subtitle', e.target.value)} />
          </Field>
          <Field label="Libellé bouton"><Input value={nl.buttonText} onChange={v => set('buttonText', v)} /></Field>
        </div>
      </AdvancedSettings>
    </div>
  );
}

function TrustBarSection({ settings, setSettings }: any) {
  const items = settings.trustBar || [];
  const update = (id: string, k: string, v: any) => setSettings((s: any) => ({ ...s, trustBar: s.trustBar.map((x: any) => x.id === id ? { ...x, [k]: v } : x) }));
  const icons = ['Truck', 'ArrowClockwise', 'Lock', 'ChatCircle', 'Phone', 'House', 'Star'];

  return (
    <div className="space-y-6">
      <SectionTitle title="Réassurance" subtitle="Les 4 badges techniques sous le header." />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item: any, i: number) => (
          <div key={item.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Badge #{i + 1}</span>
            </div>
            <Field label="Icône Technique">
              <select 
                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/10 outline-none appearance-none cursor-pointer"
                value={item.icon}
                onChange={e => update(item.id, 'icon', e.target.value)}
              >
                {icons.map(icon => <option key={icon} value={icon}>{icon}</option>)}
              </select>
            </Field>
            
            <AdvancedSettings title="Libellés du badge">
              <div className="space-y-3">
                <Field label="Titre"><Input value={item.title} onChange={v => update(item.id, 'title', v)} /></Field>
                <Field label="Sous-titre"><Input value={item.subtitle} onChange={v => update(item.id, 'subtitle', v)} /></Field>
              </div>
            </AdvancedSettings>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlogBannerSection({ settings, setSettings }: any) {
  const bb = settings.blogBanner || DEFAULT_SETTINGS.blogBanner;
  const set = (k: string, v: any) => setSettings((s: any) => ({ ...s, blogBanner: { ...s.blogBanner, [k]: v } }));
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionTitle title="Bandeau News" subtitle="Barre d'inspiration au dessus des catégories." />
        <Toggle value={bb.isActive} onChange={v => set('isActive', v)} />
      </div>
      
      <div className="bg-gray-100 rounded-[2.5rem] p-6 flex justify-between items-center shadow-inner">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm">
             <Newspaper size={20} weight="bold" className="text-primary" />
          </div>
          <span className="text-xs font-black uppercase text-gray-900 tracking-tighter">{bb.title}</span>
        </div>
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
           <span className="text-primary font-black">{">"}</span>
        </div>
      </div>

      <AdvancedSettings title="Textes & URL">
        <div className="space-y-3">
          <Field label="Titre du bandeau"><Input value={bb.title} onChange={v => set('title', v)} /></Field>
          <Field label="Lien (URL)"><Input value={bb.link} onChange={v => set('link', v)} /></Field>
        </div>
      </AdvancedSettings>
    </div>
  );
}

function HomeCategoriesSection({ settings, setSettings }: any) {
  const cats = settings.homeCategories || [];
  const update = (id: string, k: string, v: any) => setSettings((s: any) => ({ ...s, homeCategories: s.homeCategories.map((x: any) => x.id === id ? { ...x, [k]: v } : x) }));
  
  return (
    <div className="space-y-6">
      <SectionTitle title="Catégories Bulles" subtitle="Les 6 cercles de catégories sur la page d'accueil." />
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {cats.map((cat: any, i: number) => (
          <div key={cat.id} className="bg-white border border-gray-100 rounded-[2rem] p-4 flex flex-col items-center gap-4 shadow-sm group">
            <div className="w-20">
              <CloudinaryUploader 
                value={cat.image} 
                onChange={url => update(cat.id, 'image', url)} 
                label=""
              />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black uppercase text-gray-900 truncate w-full">{cat.short}</p>
            </div>
            
            <AdvancedSettings title="Lien & Nom">
               <div className="space-y-3">
                 <Field label="Libellé"><Input value={cat.short} onChange={v => update(cat.id, 'short', v)} /></Field>
                 <Field label="Lien"><Input value={cat.link} onChange={v => update(cat.id, 'link', v)} /></Field>
               </div>
            </AdvancedSettings>
          </div>
        ))}
      </div>
    </div>
  );
}

function SidebarSection({ settings, setSettings }: any) {
  const side = settings.sidebar || DEFAULT_SETTINGS.sidebar;
  const set = (path: string, v: any) => {
    const keys = path.split('.');
    setSettings((s: any) => {
      let next = { ...s, sidebar: { ...s.sidebar } };
      let curr = next.sidebar;
      for (let i = 0; i < keys.length - 1; i++) {
        curr[keys[i]] = { ...curr[keys[i]] };
        curr = curr[keys[i]];
      }
      curr[keys[keys.length - 1]] = v;
      return next;
    });
  };

  const updateItem = (listKey: string, index: number, k: string, v: any) => {
    const newList = [...side[listKey]];
    newList[index] = { ...newList[index], [k]: v };
    set(listKey, newList);
  };

  return (
    <div className="space-y-10">
      {/* ── Category Sidebar Ads ── */}
      <div className="space-y-6">
        <SectionTitle title="Sidebar Catégories" subtitle="Publicités horizontales en bas du menu catégories." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {side.categoryAds.map((ad: any, i: number) => (
            <div key={i} className="bg-white border border-gray-100 rounded-3xl p-5 space-y-4 shadow-sm">
              <CloudinaryUploader value={ad.image || ad.img} onChange={v => updateItem('categoryAds', i, 'image', v)} label={`Ad #${i + 1}`} />
              <AdvancedSettings title="Textes de l'Ad">
                <div className="space-y-3">
                  <Field label="Titre"><Input value={ad.title} onChange={v => updateItem('categoryAds', i, 'title', v)} /></Field>
                  <Field label="Sous-titre"><Input value={ad.subtitle} onChange={v => updateItem('categoryAds', i, 'subtitle', v)} /></Field>
                </div>
              </AdvancedSettings>
            </div>
          ))}
        </div>
          <Field label="Lien 'Voir tout le catalogue'"><Input value={side.showAllLink} onChange={v => set('showAllLink', v)} /></Field>
          <Field label="Titre 'Derniers Produits'"><Input value={side.latestTitle} onChange={v => set('latestTitle', v)} /></Field>
          <Field label="Titre 'Populaires'"><Input value={side.popularTitle} onChange={v => set('popularTitle', v)} /></Field>
        </div>

      {/* ── Home Sidebar Ads (Vertical) ── */}
      <div className="space-y-6 pt-6 border-t border-gray-100">
        <SectionTitle title="Sidebar Principale (Bas)" subtitle="Grands visuels verticaux à gauche des produits." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {side.verticalAds.map((ad: any, i: number) => (
            <div key={i} className="bg-white border border-gray-100 rounded-[2.5rem] p-6 space-y-4 shadow-sm">
              <CloudinaryUploader value={ad.image} onChange={v => updateItem('verticalAds', i, 'image', v)} label={`Vertical Ad #${i + 1}`} />
              <div className="flex items-center gap-3">
                <Field label="Couleur d'ambiance (overlay)">
                   <input type="color" className="w-10 h-10 rounded-lg border-none cursor-pointer p-0" value={ad.bgColor.substring(0, 7)} onChange={e => updateItem('verticalAds', i, 'bgColor', e.target.value + '33')} />
                </Field>
              </div>
              <AdvancedSettings title="Textes & CTA">
                <div className="space-y-3">
                  <Field label="Titre principal"><Input value={ad.title} onChange={v => updateItem('verticalAds', i, 'title', v)} /></Field>
                  <Field label="Sous-titre / Lien"><Input value={ad.subtitle} onChange={v => updateItem('verticalAds', i, 'subtitle', v)} /></Field>
                </div>
              </AdvancedSettings>
            </div>
          ))}
        </div>
      </div>

      {/* ── Engagement Stats ── */}
      <div className="space-y-6 pt-6 border-t border-gray-100">
        <SectionTitle title="Badges d'Engagement" subtitle="Les 4 statistiques de réassurance dans la sidebar." />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {side.engagementStats.map((stat: any, i: number) => (
            <div key={i} className="bg-gray-50 border border-gray-100 rounded-[2rem] p-5 space-y-3">
               <div className="flex items-center justify-between">
                 <span className="text-2xl">{stat.emoji}</span>
                 <Input value={stat.emoji} onChange={v => updateItem('engagementStats', i, 'emoji', v)} className="w-12 py-1 px-1 text-center bg-white" />
               </div>
               <Field label="Valeur"><Input value={stat.value} onChange={v => updateItem('engagementStats', i, 'value', v)} className="font-black" /></Field>
               <Field label="Libellé"><Input value={stat.label} onChange={v => updateItem('engagementStats', i, 'label', v)} /></Field>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main CMSView ──────────────────────────────────────────────────────────────
export function CMSView() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('promobar');
  const [settings, setSettings] = useState<any>(DEFAULT_SETTINGS);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToDocument('settings', 'homepage', (data) => {
      if (data) {
        setSettings({ ...DEFAULT_SETTINGS, ...data });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDocument('settings', 'homepage', settings);
      alert('✅ Modifications enregistrées avec succès !');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Chargement du CMS...</p>
    </div>
  );

  const currentTab = TABS.find(t => t.id === activeTab)!;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 md:pb-10 text-left">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Gestion du Contenu</h2>
          <p className="text-sm font-medium text-gray-400 mt-1">Pilotez chaque section de votre page d'accueil en temps réel.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-6 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50"
        >
          {saving ? <ArrowClockwise size={18} className="animate-spin" /> : <Check size={18} weight="bold" />}
          Enregistrer les modifications
        </button>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-2 flex flex-wrap gap-1.5">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                isActive
                  ? `${tab.bg} ${tab.color} shadow-sm`
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <Icon size={16} weight={isActive ? 'fill' : 'bold'} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Section Panel ── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
        {/* Section header badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl ${currentTab.bg} mb-6`}>
          {React.createElement(currentTab.icon, { size: 14, weight: 'fill', className: currentTab.color })}
          <span className={`text-[9px] font-black uppercase tracking-widest ${currentTab.color}`}>{currentTab.label}</span>
        </div>

        {activeTab === 'promobar' && <PromoBarSection settings={settings} setSettings={setSettings} />}
        {activeTab === 'hero' && <HeroSliderSection settings={settings} setSettings={setSettings} />}
        {activeTab === 'minibanner' && <MiniBannersSection settings={settings} setSettings={setSettings} />}
        {activeTab === 'trustbar' && <TrustBarSection settings={settings} setSettings={setSettings} />}
        {activeTab === 'categories' && <HomeCategoriesSection settings={settings} setSettings={setSettings} />}
        {activeTab === 'blog' && <BlogBannerSection settings={settings} setSettings={setSettings} />}
        {activeTab === 'flashsale' && <FlashSaleSection settings={settings} setSettings={setSettings} />}
        {activeTab === 'promo' && <PromoBlocksSection settings={settings} setSettings={setSettings} />}
        {activeTab === 'newsletter' && <NewsletterSection settings={settings} setSettings={setSettings} />}
        {activeTab === 'sidebar' && <SidebarSection settings={settings} setSettings={setSettings} />}
      </div>

      {/* ── Info card ── */}
      <div className="bg-gray-900 rounded-3xl p-6 flex items-start gap-4 text-white">
        <Monitor size={28} weight="duotone" className="text-primary flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-black text-sm uppercase tracking-widest mb-1">Aperçu en temps réel activé</p>
          <p className="text-gray-400 text-xs leading-relaxed">Les modifications sont synchronisées en direct. Dès que vous enregistrez, tous les clients connectés verront les changements instantanément sans rafraîchir.</p>
        </div>
      </div>

      {/* Mobile sticky save */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-gray-100 flex md:hidden z-50">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest py-4 rounded-[1.5rem] shadow-xl shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? <ArrowClockwise size={18} className="animate-spin" /> : <Check size={18} weight="bold" />}
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}
