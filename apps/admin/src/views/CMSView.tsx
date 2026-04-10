import React, { useEffect, useState } from 'react';
import { 
  Monitor, Megaphone, Plus, 
  Trash, ImageSquare, Check, 
  ArrowClockwise, ListDashes 
} from '@phosphor-icons/react';
import { getDocument, setDocument } from '@imexmercado/firebase';

export function CMSView() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>({
    promoBar: { text: 'Offre spéciale de lancement ! -20% sur tout le site', color: '#CC0000', isActive: true },
    heroSlides: [
      { id: '1', title: 'HI-TECH', subtitle: 'Le meilleur de la technologie', image: 'https://placehold.co/800x450', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-interior-of-a-modern-living-room-4417-large.mp4', ctaText: 'VOIR PLUS', isActive: true }
    ]
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await getDocument('settings', 'homepage');
        if (data) {
          // Merge video demo if missing for the first slide to ensure the user sees the feature
          if (data.heroSlides && data.heroSlides.length > 0 && (!data.heroSlides[0].videoUrl || data.heroSlides[0].videoUrl.includes('mixkit'))) {
            data.heroSlides[0].videoUrl = 'https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4';
          }
          setSettings(data);
        }
      } catch (error) {
        console.error("Error fetching homepage settings:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDocument('settings', 'homepage', settings);
      alert("Paramètres enregistrés avec succès !");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  const addSlide = () => {
    const newSlide = {
      id: Date.now().toString(),
      title: 'NOUVEAU TITRE',
      subtitle: 'Nouveau sous-titre',
      image: 'https://placehold.co/800x450',
      videoUrl: '',
      ctaText: 'EN SAVOIR PLUS',
      isActive: true
    };
    setSettings({ ...settings, heroSlides: [...settings.heroSlides, newSlide] });
  };

  const removeSlide = (id: string) => {
    setSettings({ 
      ...settings, 
      heroSlides: settings.heroSlides.filter((s: any) => s.id !== id) 
    });
  };

  const updateSlide = (id: string, field: string, value: any) => {
    setSettings({
      ...settings,
      heroSlides: settings.heroSlides.map((s: any) => 
        s.id === id ? { ...s, [field]: value } : s
      )
    });
  };

  if (loading) return <div className="p-8 text-center animate-pulse">Chargement du CMS...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500 text-left">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Gestion du Contenu</h2>
          <p className="text-sm font-medium text-gray-500">Pilotez le contenu dynamique de votre boutique en temps réel.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-white text-xs font-black uppercase tracking-widest px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? <ArrowClockwise size={18} className="animate-spin" /> : <Check size={18} weight="bold" />}
          Enregistrer les modifications
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Promo Bar & Sections */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Promo Bar Settings */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-50 text-red-500 rounded-xl">
                <Megaphone size={20} weight="fill" />
              </div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Bandeau Promo</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5 ml-1">Message</label>
                <textarea 
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-xs font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  rows={3}
                  value={settings.promoBar.text}
                  onChange={e => setSettings({ ...settings, promoBar: { ...settings.promoBar, text: e.target.value } })}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <span className="text-xs font-bold text-gray-600">Activer le bandeau</span>
                <button 
                  onClick={() => setSettings({ ...settings, promoBar: { ...settings.promoBar, isActive: !settings.promoBar.isActive } })}
                  className={`w-12 h-6 rounded-full relative transition-colors ${settings.promoBar.isActive ? 'bg-primary' : 'bg-gray-200'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${settings.promoBar.isActive ? 'right-1' : 'left-1'} shadow-sm`} />
                </button>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5 ml-1">Couleur de fond</label>
                <div className="flex gap-3">
                  <input 
                    type="color" 
                    className="w-12 h-12 rounded-xl border-none cursor-pointer overflow-hidden p-0"
                    value={settings.promoBar.color}
                    onChange={e => setSettings({ ...settings, promoBar: { ...settings.promoBar, color: e.target.value } })}
                  />
                  <input 
                    type="text"
                    className="flex-1 bg-gray-50 border-none rounded-2xl px-4 text-xs font-mono font-bold"
                    value={settings.promoBar.color}
                    onChange={e => setSettings({ ...settings, promoBar: { ...settings.promoBar, color: e.target.value } })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-8 rounded-3xl text-white space-y-4 shadow-2xl">
            <Monitor size={32} weight="duotone" className="text-primary" />
            <h4 className="font-black text-lg tracking-tight uppercase">Aperçu en direct</h4>
            <p className="text-gray-400 text-xs leading-relaxed">Les modifications sont appliquées instantanément sur le site public dès que vous cliquez sur "Enregistrer".</p>
          </div>
        </div>

        {/* Right Column: Hero Slider Repeater */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-500 rounded-xl">
                <ListDashes size={20} weight="fill" />
              </div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Bannières Slider Hero</h3>
            </div>
            <button 
              onClick={addSlide}
              className="p-2 bg-gray-50 text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Plus size={20} weight="bold" />
            </button>
          </div>

          <div className="space-y-4">
            {settings.heroSlides.map((slide: any, index: number) => (
              <div key={slide.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6 group">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Slide #{index + 1}</span>
                  <button 
                    onClick={() => removeSlide(slide.id)}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash size={18} weight="bold" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Image Preview */}
                  <div className="md:col-span-1 space-y-2">
                    <div className="aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center">
                      {slide.image ? (
                        <img src={slide.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <ImageSquare size={24} className="text-gray-200" />
                      )}
                    </div>
                    <input 
                      type="text"
                      placeholder="URL Image"
                      className="w-full bg-gray-50 border-none rounded-xl py-2 px-3 text-[10px] font-medium outline-none"
                      value={slide.image}
                      onChange={e => updateSlide(slide.id, 'image', e.target.value)}
                    />
                    <input 
                      type="text"
                      placeholder="URL Vidéo (Direct .mp4)"
                      className="w-full bg-blue-50/50 border-none rounded-xl py-2 px-3 text-[10px] font-medium outline-none text-blue-600 placeholder:text-blue-300"
                      value={slide.videoUrl || ''}
                      onChange={e => updateSlide(slide.id, 'videoUrl', e.target.value)}
                    />
                  </div>

                  {/* Content Fields */}
                  <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-[9px] font-black uppercase text-gray-400 block mb-1">Titre (Rouge)</label>
                      <input 
                        type="text"
                        className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-xs font-bold"
                        value={slide.title}
                        onChange={e => updateSlide(slide.id, 'title', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[9px] font-black uppercase text-gray-400 block mb-1">Sous-titre (Blanc)</label>
                      <input 
                        type="text"
                        className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-xs font-bold"
                        value={slide.subtitle}
                        onChange={e => updateSlide(slide.id, 'subtitle', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase text-gray-400 block mb-1">Texte Bouton</label>
                      <input 
                        type="text"
                        className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-xs font-bold"
                        value={slide.ctaText}
                        onChange={e => updateSlide(slide.id, 'ctaText', e.target.value)}
                      />
                    </div>
                    <div className="flex items-center justify-between px-4 bg-gray-50 rounded-xl">
                      <span className="text-[9px] font-black uppercase text-gray-400">Actif</span>
                      <button 
                        onClick={() => updateSlide(slide.id, 'isActive', !slide.isActive)}
                        className={`w-10 h-5 rounded-full relative transition-colors ${slide.isActive ? 'bg-green-500' : 'bg-gray-200'}`}
                      >
                        <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${slide.isActive ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
