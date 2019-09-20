import React, { Suspense, lazy } from 'react';
import { Router } from '@reach/router';

import withTheme from '../styles/withTheme';
import Spinner from './Spinner';

const Map = lazy(() => import('./Map'));

const App = () => (
  <Suspense fallback={<Spinner delay={100} fullscreen />}>
    <Router>
      <Map path="/" />
    </Router>
  </Suspense>
);

export default withTheme(App);
