import defaultLanguage from '../i18n/fallbackLng';

const currentLanguage = i18n => i18n.languages[0];

const availableLanguages = i18n =>
  Object.keys(i18n.services.resourceStore.data);

const languageVariants = (i18n, language) =>
  availableLanguages(i18n).filter(lang => lang !== language);

const variantPath = variant => {
  if (variant === defaultLanguage) {
    return '/';
  }
  return `/${variant}`;
};

export { currentLanguage, availableLanguages, languageVariants, variantPath };
