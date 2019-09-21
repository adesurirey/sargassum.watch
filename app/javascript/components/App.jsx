import React, { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { Router, Redirect, redirectTo } from '@reach/router';

import defaultLanguage from '../i18n/fallbackLng';
import withTheme from '../styles/withTheme';
import { currentLanguage, languageVariants } from '../utils/i18n';
import Spinner from './Spinner';

const Map = lazy(() => import('./Map'));

const App = () => {
  const { i18n } = useTranslation();

  const language = currentLanguage(i18n);
  const variants = languageVariants(i18n, defaultLanguage);

  const redirectToVariant = () => {
    if (language !== defaultLanguage) {
      redirectTo(language);
    }
  };

  return (
    <Suspense fallback={<Spinner delay={100} fullscreen />}>
      <Router>
        <Map path="/" onDidMount={redirectToVariant} />
        {variants.map(language => (
          <Map key={language} path={language} />
        ))}
        <Redirect from="*" to="/" />
      </Router>
    </Suspense>
  );
};

export default withTheme(App);
