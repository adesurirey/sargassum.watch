import * as Sentry from '@sentry/browser';

const { sentryPublicDSN, release, appENV } = gon;

export default () => {
  if (process.env.NODE_ENV === 'development') {
    return;
  }

  Sentry.init({
    dsn: sentryPublicDSN,
    environment: appENV,
    release: release,
  });
};
