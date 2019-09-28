import { arrayToObject } from './root';

const currentLanguage = i18n => i18n.languages[0];

const availableLanguages = i18n =>
  Object.keys(i18n.services.resourceStore.data);

const languageVariants = (i18n, language) =>
  availableLanguages(i18n).filter(lang => lang !== language);

const languagePaths = i18n => ({
  ...arrayToObject(availableLanguages(i18n), (obj, language) => {
    obj[language] = `/${language}`;
  }),
  en: '/',
});

export { currentLanguage, availableLanguages, languageVariants, languagePaths };
