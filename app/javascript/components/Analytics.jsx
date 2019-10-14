import { useEffect } from 'react';
import ReactGA from 'react-ga';

const isProduction = gon.appENV === 'production';
const trackingId = 'UA-105377140-2';

const Analytics = ({ location: { pathname, search }, children }) => {
  useEffect(() => {
    if (isProduction) {
      ReactGA.initialize(trackingId);
    } else {
      console.log('ga:', 'initialized', trackingId);
    }
  }, []);

  useEffect(() => {
    if (isProduction) {
      ReactGA.pageview(pathname + search);
    } else {
      console.log('ga:', 'pageview', pathname + search);
    }
  }, [pathname, search]);

  return children;
};

export default Analytics;
