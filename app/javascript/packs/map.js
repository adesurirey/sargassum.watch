import React from 'react';
import ReactDOM from 'react-dom';

import Map from '../components/Map';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Map mapboxApiAccessToken={gon.mapboxApiAccessToken} />,
    document.body.appendChild(document.createElement('div')),
  );
});
