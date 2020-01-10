import * as Sentry from '@sentry/browser';

const isProduction = process.env.NODE_ENV === 'production';

const useException = () => {
  const logException = (message, extras = []) => {
    if (!isProduction) {
      console.warn('sentry:', message, { extras });
      return;
    }

    Sentry.withScope(scope => {
      scope.setLevel(Sentry.Severity.Warning);
      extras.map(([key, value]) => scope.setExtra(key, value));
      Sentry.captureException(new Error(message));
    });
  };

  return logException;
};

export default useException;
