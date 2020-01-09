import 'mapbox-gl/dist/mapbox-gl.css';

import React, { forwardRef } from 'react';
import { bool, object, oneOf, arrayOf, func, string } from 'prop-types';
import MapGL from 'react-map-gl';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/styles';

import {
  REPORTS_POINTS_LAYER_ID,
  WEBCAMS_CLUSTERS_LAYER_ID,
  WEBCAMS_POINTS_LAYER_ID,
} from '../layers';
import Spinner from './Spinner';
import UserMarker from './UserMarker';
import ZoomControl from './ZoomControl';

const propTypes = {
  className: string,
  loading: bool.isRequired,
  viewport: object.isRequired,
  style: oneOf(['map', 'satellite']).isRequired,
  user: object,
  userIsReporting: bool,
  interactiveLayerIds: arrayOf(string).isRequired,
  dismissPopup: func.isRequired,
  onViewportChange: func.isRequired,
  onLoaded: func.isRequired,
  onReportFeatureClick: func.isRequired,
  onWebcamsClusterClick: func.isRequired,
  onWebcamFeatureClick: func.isRequired,
};

const defaultProps = {
  className: null,
  user: null,
  userIsReporting: false,
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
      userIsReporting,
      interactiveLayerIds,
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
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const colorScheme = theme.palette.type;
    const styles = getStyles(colorScheme);

    const dispatchClick = feature => {
      const layerId = feature.layer.id;

      switch (layerId) {
        case REPORTS_POINTS_LAYER_ID: {
          onReportFeatureClick(feature);
          break;
        }
        case WEBCAMS_CLUSTERS_LAYER_ID: {
          onWebcamsClusterClick(feature);
          break;
        }
        case WEBCAMS_POINTS_LAYER_ID: {
          onWebcamFeatureClick(feature);
          break;
        }
        default:
          throw new Error(`Unhandled layer click: ${layerId}`);
      }
    };

    const handleClick = ({ target, features }) => {
      // Cannot prevent event propagation on map childrens,
      // so we check here that the click was trageting the map.
      if (!target.classList.contains('overlays')) return;

      if (features && features[0]) {
        dismissPopup();
        dispatchClick(features[0]);
      }
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
        {loading && isSmallScreen && <Spinner delay={50} />}
        {userIsReporting && <UserMarker {...user} />}
        <ZoomControl />
      </MapGL>
    );
  },
);

export default Mapbox;

Mapbox.propTypes = propTypes;
Mapbox.defaultProps = defaultProps;
