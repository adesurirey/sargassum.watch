import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import defaultLanguage from '../i18n/fallbackLng';
import getParams from '../utils/getParams';
import {
  currentLanguage,
  languageVariants,
  languagePaths,
} from '../utils/i18n';

const LanguageRedirect = ({ children, location, navigate }) => {
  const { i18n } = useTranslation();

  const language = currentLanguage(i18n);
  const paths = languagePaths(i18n);
  const variants = languageVariants(i18n, defaultLanguage);

  const params = getParams(location);

  const redirectToLanguage = () => {
    return navigate(paths[language] + location.hash, { replace: true });
  };

  useEffect(() => {
    if (location.pathname === '/' && language !== defaultLanguage) {
      redirectToLanguage();
    } else if (params.language && !variants.includes(params.language)) {
      redirectToLanguage();
    }
  }, []);

  return children;
};

export default LanguageRedirect;
