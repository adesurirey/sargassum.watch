import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';

import React, { PureComponent, lazy } from 'react';
import { object } from 'prop-types';
import MapGL, { FlyToInterpolator } from 'react-map-gl';
import _uniqBy from 'lodash/uniqBy';
import { withStyles } from '@material-ui/styles';

import {
  SOURCE_ID,
  PERMANENT_LAYER_ID,
  INSERT_BEFORE_LAYER_ID,
  heatmapLayer,
  pointsLayer,
  permanentLayer,
} from '../layers';
import { sargassumCenter } from '../utils/geography';
import { featureCollection } from '../utils/geoJSON';
import { intervals, featuresInInterval } from '../utils/interval';
import { onNextIdle, validateWaterPresence } from '../utils/map';
import Api from '../utils/Api';

import Controls from './Controls';
import Geocoder from './Geocoder';
import ReportButton from './ReportButton';
import SmartPopup from './SmartPopup';
import ZoomControl from './ZoomControl';
import UserMarker from './UserMarker';

const GeocoderContainer = lazy(() => import('./GeocoderContainer'));
const api = new Api();

const propTypes = {
  classes: object.isRequired,
};

const styles = theme => ({
  root: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
  },

  map: {
    flexGrow: 1,
  },
});

class Map extends PureComponent {
  state = {
    loaded: false,
    viewport: {
      ...sargassumCenter,
      zoom: 3,
    },
    settings: {
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
    },
    features: [],
    interval: intervals[0],
    renderedFeatures: [],
    interactiveLayerIds: [],
    popup: null,
    geolocating: false,
    user: null,
  };

  mapRef = React.createRef();
  geocoderContainerRef = React.createRef();

  getMap = () => {
    return this.mapRef.current ? this.mapRef.current.getMap() : null;
  };

  getFeaturesInInterval() {
    const { features, interval } = this.state;

    return featuresInInterval(features, interval);
  }

  initMapData = () => {
    const map = this.getMap();

    map.addSource(SOURCE_ID, {
      type: 'geojson',
      data: featureCollection(this.getFeaturesInInterval()),
    });

    map.addLayer(permanentLayer);
    map.addLayer(heatmapLayer, INSERT_BEFORE_LAYER_ID);
    map.addLayer(pointsLayer, INSERT_BEFORE_LAYER_ID);

    map.on('idle', this.setRenderedFeatures);

    this.setState({ interactiveLayerIds: [pointsLayer.id] });
  };

  setRenderedFeatures = () => {
    const map = this.getMap();

    const features = map.queryRenderedFeatures({
      layers: [PERMANENT_LAYER_ID],
    });

    features &&
      this.setState({
        renderedFeatures: _uniqBy(features, 'properties.id'),
      });
  };

  setMapData = features => {
    const map = this.getMap();
    const source = map && map.getSource(SOURCE_ID);

    source && source.setData(featureCollection(features));
  };

  dismissPopup = () => this.setState({ popup: null });

  onLoaded = () => {
    this.setState({ loaded: true });

    api
      .getAll()
      .then(({ data: { features } }) =>
        this.setState({ features }, this.initMapData),
      )
      .catch(error =>
        this.setState(({ viewport: { latitude, longitude } }) => ({
          popup: {
            text: 'Oops… something wrong happened 🐛',
            latitude,
            longitude,
          },
        })),
      );
  };

  onViewportChange = viewport =>
    this.setState({
      viewport: { ...this.state.viewport, ...viewport },
    });

  onClick = ({ features }) => {
    this.dismissPopup();

    const feature = features && features[0];

    if (!feature) {
      return;
    }

    const {
      geometry: {
        coordinates: [longitude, latitude],
      },
      properties,
    } = feature;

    this.setState({
      popup: {
        variant: 'point',
        latitude,
        longitude,
        ...properties,
      },
    });
  };

  onIntervalChange = interval => {
    if (this.state.interval.id !== interval.id) {
      this.setState({ interval }, () =>
        this.setMapData(this.getFeaturesInInterval()),
      );
    }
  };

  handleUserPosition = map => {
    const { user } = this.state;
    const isNearWater = validateWaterPresence(map, user);

    let popup = user;
    if (isNearWater) {
      popup.text = 'Found you';
    } else {
      popup.text = 'Please get closer to the beach';
    }

    this.setState(({ user }) => ({
      geolocating: false,
      popup,
      user: {
        ...user,
        isNearWater,
      },
    }));
  };

  onGeolocated = ({ latitude, longitude }) => {
    const handleUserPosition = onNextIdle(
      this.getMap(),
      this.handleUserPosition,
    );

    this.setState(
      {
        user: { latitude, longitude },
        viewport: {
          latitude,
          longitude,
          zoom: 19,
          transitionInterpolator: new FlyToInterpolator(),
          transitionDuration: 2000,
        },
      },
      handleUserPosition,
    );
  };

  onGeolocationFailed = () =>
    this.setState(({ viewport }) => ({
      popup: {
        text: 'Location not found',
        latitude: viewport.latitude,
        longitude: viewport.longitude,
      },
      geolocating: false,
    }));

  onReportClick = () => {
    this.setState({ geolocating: true });

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => this.onGeolocated(coords),
      this.onGeolocationFailed,
    );
  };

  render() {
    const { classes } = this.props;
    const {
      loaded,
      viewport,
      settings,
      interactiveLayerIds,
      renderedFeatures,
      popup,
      interval,
      geolocating,
      user,
    } = this.state;

    return (
      <div className={classes.root}>
        <GeocoderContainer ref={this.geocoderContainerRef} />
        <Controls
          intervalControlsProps={{
            loaded,
            intervals,
            selectedInterval: interval,
            onIntervalChange: this.onIntervalChange,
          }}
          chartProps={{ features: renderedFeatures, interval }}
        />
        <MapGL
          ref={this.mapRef}
          className={classes.map}
          {...viewport}
          {...settings}
          width="100%"
          height="100%"
          attributionControl={false}
          mapStyle="mapbox://styles/adesurirey/ck0e1s9fk0gvb1cpb7na085mf"
          mapboxApiAccessToken={gon.mapboxApiAccessToken}
          getCursor={this.getCursor}
          interactiveLayerIds={interactiveLayerIds}
          onViewportChange={this.onViewportChange}
          onLoad={this.onLoaded}
          onClick={this.onClick}
        >
          <Geocoder
            mapRef={this.mapRef}
            containerRef={this.geocoderContainerRef}
            longitude={viewport.longitude}
            latitude={viewport.latitude}
            onChange={this.onViewportChange}
          />
          <ReportButton
            visible={loaded}
            loading={geolocating}
            onClick={this.onReportClick}
          />
          {popup && <SmartPopup {...popup} onClose={this.dismissPopup} />}
          {user && <UserMarker {...user} />}
          <ZoomControl />
        </MapGL>
      </div>
    );
  }
}

export default withStyles(styles)(Map);

Map.propTypes = propTypes;
