// Look at GeocoderContainer.jsx for CSS overrides
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';

import React, { Component, memo } from 'react';
import { shape, instanceOf, number, func } from 'prop-types';
import MapboxGeocoder from 'react-map-gl-geocoder';
import { useTranslation } from 'react-i18next';

import useEvent from '../hooks/useEvent';
import { currentLanguage } from '../utils/i18n';

const propTypes = {
  mapRef: shape({ current: instanceOf(Component) }).isRequired,
  containerRef: shape({ current: instanceOf(Element) }).isRequired,
  longitude: number.isRequired,
  latitude: number.isRequired,
  onChange: func.isRequired,
};

const Geocoder = ({ longitude, latitude, onChange, ...refs }) => {
  const { i18n, t } = useTranslation();
  const createEvent = useEvent();
  const language = currentLanguage(i18n);

  const onResult = ({ result: { place_name } }) => {
    createEvent({
      category: 'Navigation',
      action: 'Searched a place',
      label: `Searched ${place_name}`,
    });
  };

  return (
    <MapboxGeocoder
      {...refs}
      mapboxApiAccessToken={gon.mapboxApiAccessToken}
      proximity={{ longitude, latitude }}
      onResult={onResult}
      onViewportChange={onChange}
      placeholder={t('Search...')}
      language={language}
      clearAndBlurOnEsc
    />
  );
};

export default memo(Geocoder);

Geocoder.propTypes = propTypes;
