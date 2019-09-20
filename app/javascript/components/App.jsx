import React, { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { Router, Redirect, redirectTo } from '@reach/router';

import fallbackLng from '../i18n/fallbackLng';
import withTheme from '../styles/withTheme';
import Spinner from './Spinner';

const Map = lazy(() => import('./Map'));

const App = () => {
  const {
    i18n: { services, languages },
  } = useTranslation();

  const locales = Object.keys(services.resourceStore.data);
  const variants = locales.filter(locale => locale !== fallbackLng);

  const redirectToVariant = () => {
    const locale = languages[0];

    if (locale !== fallbackLng) {
      redirectTo(locale);
    }
  };

  return (
    <Suspense fallback={<Spinner delay={100} fullscreen />}>
      <Router>
        <Map path="/" onDidMount={redirectToVariant} />

        {variants.map(locale => (
          <Map key={locale} path={locale} />
        ))}

        <Redirect from="*" to="/" />
      </Router>
    </Suspense>
  );
};

export default withTheme(App);
