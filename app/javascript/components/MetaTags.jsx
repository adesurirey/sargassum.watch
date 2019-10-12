import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

import {
  currentLanguage,
  availableLanguages,
  languagePaths,
} from '../utils/i18n';

const MetaTags = () => {
  const { t, i18n } = useTranslation();

  const locale = currentLanguage(i18n);
  const locales = availableLanguages(i18n);
  const localePaths = languagePaths(i18n);

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const url = `${baseUrl}${window.location.pathname}`;

  return (
    <Helmet>
      <html lang={locale} />

      <title>{t('title')}</title>
      <meta name="description" content={t('description')} />

      <meta property="og:title" content={t('title')} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content={locale} />
      <meta property="og:description" content={t('description')} />

      <meta name="twitter:title" content={t('title')} />
      <meta name="twitter:description" content={t('description')} />

      <link rel="canonical" href={url} />

      {locales.map(lang => (
        <link
          rel="alternate"
          href={`${baseUrl}${localePaths[lang]}`}
          hrefLang={lang}
          key={lang}
        />
      ))}
    </Helmet>
  );
};

export default MetaTags;
