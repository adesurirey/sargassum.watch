import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';

const root = document.getElementById('root');

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<App />, document.body.appendChild(root));
});
