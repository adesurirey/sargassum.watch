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
    detection: {
      // order and from where user language should be detected
      order: ['cookie', 'path', 'navigator'],

      // keys or params to lookup language from
      // lookupQuerystring: 'lng',
      // lookupCookie: 'i18next',
      // lookupLocalStorage: 'i18nextLng',
      lookupFromPathIndex: 0,
      // lookupFromSubdomainIndex: 0,
      //
      // cache user language on
      caches: ['cookie'],
      // excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)
      //
      // optional expire and domain for set cookie
      // cookieMinutes: 10,
      // cookieDomain: 'myDomain',
      //
      // optional htmlTag with lang attribute, the default is:
      // htmlTag: document.documentElement
    },
    resources,
    fallbackLng,
    load: 'languageOnly', // only load matched language
    debug: process.env.NODE_ENV === 'development',
    keySeparator: false, // we use content as keys
    interpolation: {
      escapeValue: false, // no need for react
    },
  });

export default i18n;
