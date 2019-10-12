import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

import { currentLanguage } from '../utils/i18n';

const MetaTags = () => {
  const { t, i18n } = useTranslation();

  const language = currentLanguage(i18n);
  const url = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;

  return (
    <Helmet>
      <title>{t('title')}</title>
      <meta name="description" content={t('description')} />

      <meta property="og:title" content={t('title')} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content={language} />
      <meta property="og:description" content={t('description')} />

      <meta name="twitter:title" content={t('title')} />
      <meta name="twitter:description" content={t('description')} />

      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default MetaTags;
