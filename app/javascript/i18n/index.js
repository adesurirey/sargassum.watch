import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en.json';

const resources = { en };

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: true,
    keySeparator: false, // we use content as keys
    interpolation: {
      escapeValue: false, // no need for react
    },
  });

export default i18n;
