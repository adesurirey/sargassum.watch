import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';

import React, { PureComponent, lazy } from 'react';
import { object, func, string } from 'prop-types';
import MapGL, { FlyToInterpolator } from 'react-map-gl';
import _debounce from 'lodash/debounce';
import _uniqBy from 'lodash/uniqBy';
import { withStyles } from '@material-ui/styles';
import { withTranslation } from 'react-i18next';

import {
  SOURCE_ID,
  PERMANENT_LAYER_ID,
  INSERT_BEFORE_LAYER_ID,
  heatmapLayer,
  pointsLayer,
  permanentLayer,
} from '../layers';
import { sargassumCenter } from '../utils/geography';
import { featureCollection, toPopup, isSameFeatures } from '../utils/geoJSON';
import { intervals, featuresInInterval } from '../utils/interval';
import {
  onNextIdle,
  validateWaterPresence,
  isDifferentPosition,
} from '../utils/map';
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
  onDidMount: func,
  path: string.isRequired,
  navigate: func.isRequired,
  classes: object.isRequired,
  t: func.isRequired,
};

const defaultProps = {
  onDidMount: null,
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
    loaded: false,
    features: [],
    interval: intervals[0],
    featuresForInterval: [],
    renderedFeatures: { interval: intervals[0], features: [] },
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

  componentDidMount() {
    const { onDidMount } = this.props;
    return onDidMount && onDidMount();
  }

  getFeaturesInInterval() {
    const { features, interval, featuresForInterval } = this.state;

    const newFeatures = featuresInInterval(features, interval);

    if (isSameFeatures(newFeatures, featuresForInterval)) {
      // Because it won't trigger a map idle event,
      // which is responsible for updating rendered features interval,
      // we update rendered features interval manualy.
      this.setState(({ renderedFeatures }) => ({
        renderedFeatures: { interval, ...renderedFeatures },
      }));
    } else {
      this.setState({ featuresForInterval: newFeatures });
    }

    return newFeatures;
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

    map.on('idle', _debounce(this.setRenderedFeatures, 500));

    this.setState({ interactiveLayerIds: [pointsLayer.id] });
  };

  setRenderedFeatures = () => {
    const map = this.getMap();

    const features = map.queryRenderedFeatures({
      layers: [PERMANENT_LAYER_ID],
    });

    features &&
      this.setState(({ interval }) => ({
        renderedFeatures: {
          interval,
          features: _uniqBy(features, 'properties.id'),
        },
      }));
  };

  setMapData = features => {
    const map = this.getMap();
    const source = map && map.getSource(SOURCE_ID);

    source && source.setData(featureCollection(features));
  };

  dismissPopup = () => this.setState({ popup: null });

  onError(error, coordinates = null) {
    const { t } = this.props;
    const { latitude, longitude } = coordinates || this.state.viewport;

    let text;
    switch (error.response.status) {
      case 422:
        text = t("Can't save your report. Did you disable cookies?");
        break;
      default:
        text = t('Oops… something wrong happened');
    }

    this.setState({
      popup: {
        text,
        latitude,
        longitude,
      },
    });
  }

  onLoaded = () => {
    this.setState({ loaded: true });

    api
      .getAll()
      .then(({ data: { features } }) =>
        this.setState({ features }, this.initMapData),
      )
      .catch(error => this.onError(error));
  };

  onViewportChange = viewport =>
    this.setState({
      viewport: { ...this.state.viewport, ...viewport },
    });

  onClick = event => {
    // Cannot prevent event propagation on map childrens,
    // so we check here that the click was trageting the map.
    if (!event.target.classList.contains('overlays')) {
      return;
    }

    this.dismissPopup();

    const feature = event.features && event.features[0];
    feature && this.setState({ popup: toPopup(feature) });
  };

  onIntervalChange = interval => {
    if (this.state.interval.id !== interval.id) {
      this.setState({ interval }, () =>
        this.setMapData(this.getFeaturesInInterval()),
      );
    }
  };

  onReportSuccess = feature =>
    this.setState(
      ({ features }) => ({
        features: [
          ...features.filter(
            ({ properties: { id } }) => id !== feature.properties.id,
          ),
          feature,
        ],
        popup: toPopup(feature),
        user: null,
      }),
      () => this.setMapData(this.getFeaturesInInterval()),
    );

  onReportSubmit = level => {
    const { user } = this.state;

    api
      .create({ level, ...user })
      .then(({ data: feature }) => this.onReportSuccess(feature))
      .catch(error => this.onError(error, user));
  };

  handleUserPosition = () => {
    const map = this.getMap();
    const { user } = this.state;
    const { t } = this.props;

    const isNearWater = validateWaterPresence(map, user);

    let popup = { ...user };
    if (isNearWater) {
      popup.variant = 'report';
      popup.onSubmit = this.onReportSubmit;
    } else {
      popup.text = t('Please get closer to the beach');
    }

    this.setState({
      popup,
      geolocating: false,
    });
  };

  onGeolocated = ({ latitude, longitude }) => {
    const { viewport } = this.state;
    const map = this.getMap();

    let handlePosition = this.handleUserPosition;
    if (isDifferentPosition(map, [viewport, { latitude, longitude }])) {
      handlePosition = onNextIdle(map, handlePosition);
    }

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
      handlePosition,
    );
  };

  onGeolocationFailed = () => {
    const { t } = this.props;

    this.setState(({ viewport }) => ({
      popup: {
        text: t('Location not found'),
        latitude: viewport.latitude,
        longitude: viewport.longitude,
      },
      geolocating: false,
    }));
  };

  onReportClick = () => {
    this.setState({ geolocating: true });

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => this.onGeolocated(coords),
      this.onGeolocationFailed,
    );
  };

  render() {
    const { classes, navigate } = this.props;
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
          navigate={navigate}
          intervalControlsProps={{
            loaded,
            intervals,
            selectedInterval: interval,
            onIntervalChange: this.onIntervalChange,
          }}
          chartProps={{ ...renderedFeatures }}
          reportButton={
            <ReportButton
              visible={loaded}
              loading={geolocating}
              onClick={this.onReportClick}
              tiny
            />
          }
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
          reuseMaps
          preventStyleDiffing
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

export default withTranslation()(withStyles(styles)(Map));

Map.propTypes = propTypes;
Map.defaultProps = defaultProps;
