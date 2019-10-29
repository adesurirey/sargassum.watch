import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';

import React, { forwardRef } from 'react';
import { bool, object, oneOf, arrayOf, func, string } from 'prop-types';
import MapGL from 'react-map-gl';

import { useTheme } from '@material-ui/styles';

import {
  REPORTS_POINTS_LAYER_ID,
  WEBCAMS_CLUSTERS_LAYER_ID,
  WEBCAMS_POINTS_LAYER_ID,
} from '../layers';
import Spinner from './Spinner';
import Geocoder from './Geocoder';
import SmartPopup from './SmartPopup';
import UserMarker from './UserMarker';
import ZoomControl from './ZoomControl';

const propTypes = {
  className: string,
  loading: bool.isRequired,
  viewport: object.isRequired,
  style: oneOf(['map', 'satellite']).isRequired,
  user: object,
  popup: object,
  interactiveLayerIds: arrayOf(string).isRequired,
  geocoderContainerRef: object,
  dismissPopup: func.isRequired,
  onViewportChange: func.isRequired,
  onLoaded: func.isRequired,
  onReportFeatureClick: func.isRequired,
  onWebcamsClusterClick: func.isRequired,
  onWebcamFeatureClick: func.isRequired,
};

const defaultProps = {
  className: null,
  popup: null,
  user: null,
  geocoderContainerRef: null,
};

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

const mapStyle = {
  dark: 'mapbox://styles/adesurirey/ck1v6gz6q1k5o1cq115zjwovw?optimize=true',
  light: 'mapbox://styles/adesurirey/ck1v473zq0ee51clddiyaztnh?optimize=true',
};

const satelliteStyle =
  'mapbox://styles/adesurirey/cjzgt6e0h1aau1cqq89lsakr6?optimize=true';

const getStyles = colorScheme => ({
  map: mapStyle[colorScheme],
  satellite: satelliteStyle,
});

const Mapbox = forwardRef(
  (
    {
      className,
      loading,
      viewport,
      style,
      user,
      popup,
      interactiveLayerIds,
      geocoderContainerRef,
      dismissPopup,
      onViewportChange,
      onLoaded,
      onReportFeatureClick,
      onWebcamsClusterClick,
      onWebcamFeatureClick,
    },
    ref,
  ) => {
    const theme = useTheme();
    const colorScheme = theme.palette.type;
    const styles = getStyles(colorScheme);

    const dispatchClick = feature => {
      const layerId = feature.layer.id;

      switch (layerId) {
        case REPORTS_POINTS_LAYER_ID:
          return onReportFeatureClick(feature);
        case WEBCAMS_CLUSTERS_LAYER_ID:
          return onWebcamsClusterClick(feature);
        case WEBCAMS_POINTS_LAYER_ID:
          return onWebcamFeatureClick(feature);
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
        mapStyle={styles[style]}
        preventStyleDiffing
        mapOptions={{ hash: true }}
        interactiveLayerIds={interactiveLayerIds}
        onViewportChange={onViewportChange}
        onLoad={onLoaded}
        onClick={handleClick}
        asyncRender
      >
        {loading && <Spinner delay={50} />}

        <Geocoder
          mapRef={ref}
          containerRef={geocoderContainerRef}
          longitude={viewport.longitude}
          latitude={viewport.latitude}
          onChange={onViewportChange}
        />

        {popup && (
          <SmartPopup
            {...popup}
            onClose={dismissPopup}
            closeButton={false}
            closeOnClick={false}
            captureClick
          />
        )}

        {user && <UserMarker {...user} />}

        <ZoomControl />
      </MapGL>
    );
  },
);

export default Mapbox;

Mapbox.propTypes = propTypes;
Mapbox.defaultProps = defaultProps;
