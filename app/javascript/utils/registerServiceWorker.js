export default () => {
  if (navigator.serviceWorker) {
    navigator.serviceWorker
      .register('/service_worker.js', { scope: './' })
      .then(reg => {
        console.log('[Companion]', 'Service worker registered');
      });
  }
};
