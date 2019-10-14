import ReactGA from 'react-ga';

const isProduction = gon.appENV === 'production';

const useEvent = () => {
  const createEvent = props => {
    if (isProduction) {
      ReactGA.event(props);
    } else {
      console.log('ga:', 'event', props);
    }
  };

  return createEvent;
};

export default useEvent;
