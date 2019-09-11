import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';

import React, { Component, memo } from 'react';
import { shape, instanceOf, number, func } from 'prop-types';
import GeocoderGL from 'react-map-gl-geocoder';

const propTypes = {
  mapRef: shape({ current: instanceOf(Component) }).isRequired,
  containerRef: shape({ current: instanceOf(Element) }).isRequired,
  longitude: number.isRequired,
  latitude: number.isRequired,
  onChange: func.isRequired,
};

const Geocoder = ({ longitude, latitude, onChange, ...refs }) => (
  <GeocoderGL
    mapboxApiAccessToken={gon.mapboxApiAccessToken}
    {...refs}
    proximity={{ longitude, latitude }}
    onViewportChange={onChange}
    placeholder="Find a beach"
    clearAndBlurOnEsc
  />
);

export default memo(Geocoder);

Geocoder.propTypes = propTypes;
