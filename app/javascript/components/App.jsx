import React, { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { Router, Redirect } from '@reach/router';

import fallbackLng from '../i18n/fallbackLng';
import withTheme from '../styles/withTheme';
import Spinner from './Spinner';

const Map = lazy(() => import('./Map'));

const App = () => {
  const { i18n } = useTranslation();

  const locales = Object.keys(i18n.services.resourceStore.data);
  const variants = locales.filter(locale => locale !== fallbackLng);

  return (
    <Suspense fallback={<Spinner delay={100} fullscreen />}>
      <Router>
        <Map path="/" />

        {variants.map(locale => (
          <Map key={locale} path={locale} />
        ))}

        <Redirect from="*" to="/" noThrow />
      </Router>
    </Suspense>
  );
};

export default withTheme(App);
