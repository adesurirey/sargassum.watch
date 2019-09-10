import React, { Suspense, lazy } from 'react';

import withTheme from '../styles/withTheme';
import Spinner from './Spinner';

const Map = lazy(() => import('./Map'));

const App = () => (
  <Suspense fallback={<Spinner delay={100} fullscreen />}>
    <Map />
  </Suspense>
);

export default withTheme(App);
