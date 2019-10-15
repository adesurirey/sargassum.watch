import ReactGA from 'react-ga';

const isProduction = gon.appENV === 'production';

const useModalView = path => {
  const createModalView = () => {
    if (isProduction) {
      ReactGA.modalview(path);
    } else {
      console.log('ga:', 'modalview', path);
    }
  };

  return createModalView;
};

export default useModalView;
