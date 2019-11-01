import React, { Suspense, lazy } from 'react';
import { Router } from '@reach/router';

import withTheme from '../styles/withTheme';
import GlobalErrorBoundary from './GlobalErrorBoundary';
import MetaTags from './MetaTags';
import SplashScreen from './SplashScreen';
import Analytics from './Analytics';
import LanguageRedirect from './LanguageRedirect';

import retry from '../utils/retry';

const Intro = lazy(() => retry(() => import('./Intro')));
const Map = lazy(() => retry(() => import('./Map')));

const App = () => (
  <GlobalErrorBoundary>
    <MetaTags />
    <Suspense fallback={<SplashScreen />}>
      <Intro />
      <Router>
        <Analytics default>
          <LanguageRedirect default>
            <Map default />
          </LanguageRedirect>
        </Analytics>
      </Router>
    </Suspense>
  </GlobalErrorBoundary>
);

export default withTheme(App);
