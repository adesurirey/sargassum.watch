import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';

import React, { PureComponent, lazy } from 'react';
import { object } from 'prop-types';
import MapGL from 'react-map-gl';
import _uniqBy from 'lodash/uniqBy';
import { withStyles } from '@material-ui/styles';

import {
  SOURCE_ID,
  POINTS_LAYER_ID,
  PERMANENT_LAYER_ID,
  INSERT_BEFORE_LAYER_ID,
  heatmapLayer,
  pointsLayer,
  permanentLayer,
} from '../layers';
import { sargassumCenter, bboxAround } from '../utils/geography';
import { featureCollection } from '../utils/geoJSON';
import { intervals, featuresInInterval } from '../utils/interval';
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

  getCursor = ({ isHovering, isDragging }) => {
    return isHovering ? 'pointer' : 'grab';
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

  dismissPopup() {
    const { popup } = this.state;

    if (popup && popup.variant === 'point') {
      this.removePopup();
    }
  }

  removePopup = () => this.setState({ popup: null });

  offset = offset => {
    this.dismissPopup();

    const {
      viewport: { latitude, longitude },
    } = this.state;
    const map = this.getMap();

    map &&
      map.flyTo({
        center: [longitude, latitude],
        offset: [0, offset],
        speed: 0.8,
        curve: 0,
      });
  };

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
            title: '🐛',
            text: 'Oops… something wrong happened',
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

    const feature =
      features && features.find(({ layer }) => layer.id === POINTS_LAYER_ID);

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

  hasWaterAround = (latitude, longitude) => {
    const timeout = 500;
    const [w, s, e, n] = bboxAround({ longitude, latitude }, 50);

    // Wait for map to render features before querying.
    return new Promise(resolve =>
      setTimeout(() => {
        const map = this.getMap();

        const bbox = [map.project([w, s]), map.project([e, n])];
        const waterFeatures = map.queryRenderedFeatures(bbox, {
          layers: ['water'],
        });

        return resolve(!!waterFeatures.length);
      }, timeout),
    );
  };

  onGeolocated = ({ latitude, longitude }) => {
    this.setState(
      {
        user: { latitude, longitude },
        viewport: { latitude, longitude, zoom: 19 },
      },
      async () => {
        const isNearWater = await this.hasWaterAround(latitude, longitude);

        let popup = { latitude, longitude };
        if (isNearWater) {
          popup.title = '👀';
          popup.text = 'Found you';
        } else {
          popup.title = '👀';
          popup.text = 'Please get closer to the water';
        }

        this.setState({ popup, geolocating: false });
      },
    );
  };

  onGeolocationFailed = () =>
    this.setState(({ viewport }) => ({
      popup: {
        title: '👀',
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
          offsetMap={this.offset}
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
          {popup && <SmartPopup {...popup} onClose={this.removePopup} />}
          {user && <UserMarker {...user} />}
          <ZoomControl />
        </MapGL>
      </div>
    );
  }
}

export default withStyles(styles)(Map);

Map.propTypes = propTypes;
