import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';

import React, { forwardRef } from 'react';
import { object, arrayOf, func, string } from 'prop-types';
import MapGL from 'react-map-gl';
import { useTranslation } from 'react-i18next';

import { currentLanguage } from '../utils/i18n';
import {
  REPORTS_PERMANENT_LAYER_ID,
  WEBCAMS_CLUSTERS_LAYER_ID,
} from '../layers';
import Geocoder from './Geocoder';
import SmartPopup from './SmartPopup';
import UserMarker from './UserMarker';
import ZoomControl from './ZoomControl';

const settings = {
  dragPan: true,
  dragRotate: false,
  scrollZoom: true,
  touchZoom: true,
  touchRotate: false,
  keyboard: true,
  doubleClickZoom: true,
  minZoom: 0,
  maxZoom: 20,
  minPitch: 0,
  maxPitch: 85,
};

const propTypes = {
  className: string,
  viewport: object.isRequired,
  user: object,
  popup: object,
  interactiveLayerIds: arrayOf(string).isRequired,
  geocoderContainerRef: object,
  dismissPopup: func.isRequired,
  onViewportChange: func.isRequired,
  onLoaded: func.isRequired,
  onReportFeatureClick: func.isRequired,
  onWebcamsClusterClick: func.isRequired,
};

const defaultProps = {
  className: null,
  popup: null,
  user: null,
  geocoderContainerRef: null,
};

const Mapbox = forwardRef(
  (
    {
      className,
      viewport,
      user,
      popup,
      interactiveLayerIds,
      geocoderContainerRef,
      dismissPopup,
      onViewportChange,
      onLoaded,
      onReportFeatureClick,
      onWebcamsClusterClick,
    },
    ref,
  ) => {
    const { i18n } = useTranslation();
    const language = currentLanguage(i18n);

    const dispatchClick = feature => {
      const layerId = feature.layer.id;

      switch (layerId) {
        case REPORTS_PERMANENT_LAYER_ID:
          return onReportFeatureClick(feature);
        case WEBCAMS_CLUSTERS_LAYER_ID:
          return onWebcamsClusterClick(feature);
        default:
          throw new Error(`Unhandled layer click: ${layerId}`);
      }
    };

    const handleClick = ({ target, features }) => {
      // Cannot prevent event propagation on map childrens,
      // so we check here that the click was trageting the map.
      if (!target.classList.contains('overlays')) return;

      dismissPopup();
      features && features[0] && dispatchClick(features[0]);
    };

    return (
      <MapGL
        ref={ref}
        mapboxApiAccessToken={gon.mapboxApiAccessToken}
        {...viewport}
        {...settings}
        className={className}
        width="100%"
        height="100%"
        attributionControl={false}
        mapStyle="mapbox://styles/adesurirey/ck0e1s9fk0gvb1cpb7na085mf"
        preventStyleDiffing
        mapOptions={{ hash: true }}
        interactiveLayerIds={interactiveLayerIds}
        onViewportChange={onViewportChange}
        onLoad={onLoaded}
        onClick={handleClick}
      >
        <Geocoder
          mapRef={ref}
          containerRef={geocoderContainerRef}
          language={language}
          longitude={viewport.longitude}
          latitude={viewport.latitude}
          onChange={onViewportChange}
        />
        {popup && <SmartPopup {...popup} onClose={dismissPopup} />}
        {user && <UserMarker {...user} />}
        <ZoomControl />
      </MapGL>
    );
  },
);

export default Mapbox;

Mapbox.propTypes = propTypes;
Mapbox.defaultProps = defaultProps;
