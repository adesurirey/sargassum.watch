import React from 'react';
import ReactDOM from 'react-dom';

import '../i18n';
import configureErrorNotifier from '../utils/configureErrorNotifier';
import registerServiceWorker from '../utils/registerServiceWorker';
import App from '../components/App';

configureErrorNotifier();

const root = document.getElementById('root');

if (root) {
  document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<App />, document.body.appendChild(root));
  });
}

registerServiceWorker();

// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)
