import React, { Suspense, lazy } from 'react';
import { Router } from '@reach/router';

import withTheme from '../styles/withTheme';
import Spinner from './Spinner';
import LanguageRedirect from './LanguageRedirect';

const Intro = lazy(() => import('./Intro'));
const Map = lazy(() => import('./Map'));

const App = () => (
  <Suspense fallback={<Spinner fullscreen />}>
    <Intro />
    <Router>
      <LanguageRedirect default>
        <Map default />
      </LanguageRedirect>
    </Router>
  </Suspense>
);

export default withTheme(App);
