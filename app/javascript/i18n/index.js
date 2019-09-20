import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import fallbackLng from './fallbackLng';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';

const resources = { en, es, fr };

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng,
    debug: true,
    keySeparator: false, // we use content as keys
    interpolation: {
      escapeValue: false, // no need for react
    },
  });

export default i18n;
