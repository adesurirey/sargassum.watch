import { useEffect } from 'react';
import ReactGA from 'react-ga';

const isProduction = gon.appENV === 'production';

const useModalView = path => {
  useEffect(() => {
    if (isProduction) {
      ReactGA.modalview(path);
    } else {
      console.log('ga:', 'modalview', path);
    }
  }, [path]);
};

export default useModalView;
