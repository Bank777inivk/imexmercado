import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import pt from '../locales/pt/common.json';
import fr from '../locales/fr/common.json';
import de from '../locales/de/common.json';
import it from '../locales/it/common.json';

const resources = {
  pt: { common: pt },
  fr: { common: fr },
  de: { common: de },
  it: { common: it },
};

export const initI18n = (defaultLang: string = 'pt') => {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: defaultLang,
      fallbackLng: 'pt',
      interpolation: {
        escapeValue: false,
      },
      defaultNS: 'common',
    });
  return i18n;
};

export default i18n;
