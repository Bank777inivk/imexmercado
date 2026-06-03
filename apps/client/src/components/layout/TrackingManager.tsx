import React from 'react';
import { useLocation } from 'react-router-dom';
import { subscribeToDocument } from '@imexmercado/firebase';

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

const getConsent = () => {
  const consentStr = localStorage.getItem('imex_cookie_consent');
  if (!consentStr) return { necessary: true, analytics: false, marketing: false };
  try {
    return JSON.parse(consentStr);
  } catch (e) {
    return { necessary: true, analytics: false, marketing: false };
  }
};

export function TrackingManager() {
  const location = useLocation();
  const [trackingConfig, setTrackingConfig] = React.useState<any>(null);
  const [consent, setConsent] = React.useState(getConsent());

  // 1. Écouter les changements de consentement aux cookies
  React.useEffect(() => {
    const handleConsentChange = () => {
      setConsent(getConsent());
    };
    window.addEventListener('imex_cookie_consent_changed', handleConsentChange);
    return () => window.removeEventListener('imex_cookie_consent_changed', handleConsentChange);
  }, []);

  // 2. S'abonner aux configurations Firestore et injecter si consenti
  React.useEffect(() => {
    const unsubscribe = subscribeToDocument('settings', 'marketing_tracking', (data) => {
      if (!data) return;
      setTrackingConfig(data);
    });
    return () => unsubscribe();
  }, []);

  // 3. Gérer l'injection et le nettoyage dynamique des scripts en fonction de la config et du consentement
  React.useEffect(() => {
    if (!trackingConfig) return;

    // Nettoyer les scripts précédents pour éviter les doublons lors des rechargements/mises à jour
    const injectedElements = document.querySelectorAll('[data-tracking-injected]');
    injectedElements.forEach(el => el.remove());

    const tagElement = (el: HTMLElement) => {
      el.setAttribute('data-tracking-injected', 'true');
    };

    // --- Google Analytics GA4 (uniquement si consenti) ---
    if (trackingConfig.ga4Enabled && trackingConfig.ga4Id && consent.analytics) {
      const gaId = trackingConfig.ga4Id.trim();
      
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      tagElement(script);
      document.head.appendChild(script);

      const configScript = document.createElement('script');
      configScript.textContent = `
        window.dataLayer = window.dataLayer || [];
        window.gtag = function(){dataLayer.push(arguments);}
        window.gtag('js', new Date());
        window.gtag('config', '${gaId}', { send_page_view: false });
      `;
      tagElement(configScript);
      document.head.appendChild(configScript);
    }

    // --- Google Tag Manager (GTM) (uniquement si consenti) ---
    if (trackingConfig.gtmEnabled && trackingConfig.gtmId && consent.analytics) {
      const gtmId = trackingConfig.gtmId.trim();

      const headScript = document.createElement('script');
      headScript.textContent = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');
      `;
      tagElement(headScript);
      document.head.appendChild(headScript);

      const noscript = document.createElement('noscript');
      noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
      tagElement(noscript);
      document.body.appendChild(noscript);
    }

    // --- Meta Pixel (Facebook Ads) (uniquement si consenti) ---
    if (trackingConfig.metaEnabled && trackingConfig.metaId && consent.marketing) {
      const pixelId = trackingConfig.metaId.trim();

      const pixelScript = document.createElement('script');
      pixelScript.textContent = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window,document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${pixelId}');
      `;
      tagElement(pixelScript);
      document.head.appendChild(pixelScript);

      const noscript = document.createElement('noscript');
      noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" />`;
      tagElement(noscript);
      document.body.appendChild(noscript);
    }

    // --- Scripts Personnalisés (uniquement si consenti) ---
    if (trackingConfig.customScripts && consent.marketing) {
      try {
        const div = document.createElement('div');
        div.innerHTML = trackingConfig.customScripts;

        const scripts = div.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
          const oldScript = scripts[i];
          const newScript = document.createElement('script');
          
          Array.from(oldScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
          });
          
          newScript.textContent = oldScript.textContent;
          tagElement(newScript);
          document.head.appendChild(newScript);
        }

        const otherTags = Array.from(div.childNodes).filter(node => node.nodeName !== 'SCRIPT');
        otherTags.forEach(node => {
          const clone = node.cloneNode(true) as HTMLElement;
          if (clone.nodeType === 1) {
            tagElement(clone);
          }
          document.body.appendChild(clone);
        });
      } catch (e) {
        console.error('Erreur lors de l\'injection des scripts personnalisés:', e);
      }
    }
  }, [trackingConfig, consent]);

  // 4. Déclencher les événements de PageView à chaque changement de page (React Router)
  React.useEffect(() => {
    if (!trackingConfig) return;

    const path = location.pathname + location.search;

    // GA4 Page View (si consenti)
    if (trackingConfig.ga4Enabled && trackingConfig.ga4Id && consent.analytics && window.gtag) {
      window.gtag('config', trackingConfig.ga4Id.trim(), {
        page_path: path,
      });
    }

    // Meta Pixel Page View (si consenti)
    if (trackingConfig.metaEnabled && trackingConfig.metaId && consent.marketing && window.fbq) {
      window.fbq('track', 'PageView');
    }

    // Google Tag Manager page change notification event (si consenti)
    if (trackingConfig.gtmEnabled && consent.analytics && window.dataLayer) {
      window.dataLayer.push({
        event: 'pageview',
        page: path,
      });
    }
  }, [location, trackingConfig, consent]);

  return null;
}
