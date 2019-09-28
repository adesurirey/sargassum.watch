import { useEffect, useRef, memo } from 'react';
import { useTranslation } from 'react-i18next';

import defaultLanguage from '../i18n/fallbackLng';
import getParams from '../utils/getParams';
import {
  currentLanguage,
  languageVariants,
  languagePaths,
} from '../utils/i18n';

const LanguageRedirect = props => {
  const { i18n } = useTranslation();

  const latestProps = useRef({ ...props, i18n });

  useEffect(() => {
    const getProps = () => latestProps.current;
    const { i18n, location, navigate } = getProps();

    const language = currentLanguage(i18n);
    const paths = languagePaths(i18n);
    const variants = languageVariants(i18n, defaultLanguage);

    const params = getParams(location);

    const redirectToLanguage = () => {
      return navigate(paths[language] + location.search + location.hash, {
        replace: true,
      });
    };

    if (location.pathname === '/' && language !== defaultLanguage) {
      redirectToLanguage();
    } else if (params.language && !variants.includes(params.language)) {
      redirectToLanguage();
    }
  }, []);

  return props.children;
};

export default memo(LanguageRedirect, () => true);
