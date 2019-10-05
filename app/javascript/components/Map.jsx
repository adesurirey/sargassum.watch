import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';

import React, { Component } from 'react';
import { object, func } from 'prop-types';
import { FlyToInterpolator } from 'react-map-gl';
import _debounce from 'lodash/debounce';
import _uniqBy from 'lodash/uniqBy';
import { withStyles } from '@material-ui/styles';
import { withTranslation } from 'react-i18next';

import {
  REPORTS_SOURCE_ID,
  WEBCAMS_SOURCE_ID,
  REPORTS_PERMANENT_LAYER_ID,
  INSERT_BEFORE_LAYER_ID,
  reportsHeatmapLayer,
  reportsPointsLayer,
  reportsPermanentLayer,
  webcamsPointsLayer,
} from '../layers';
import { getViewport } from '../utils/geography';
import { featureCollection, toPopup, isSameFeatures } from '../utils/geoJSON';
import { getInterval, featuresInInterval } from '../utils/interval';
import {
  onNextIdle,
  validateWaterPresence,
  isDifferentPosition,
} from '../utils/map';
import Api from '../utils/Api';
import textFromError from '../utils/textFromError';

import Mapbox from './Mapbox';
import Controls from './Controls';
import Eyes from '../images/sargassum.watch-nude@2x.png';

const api = new Api();
const { webcams } = gon;

const propTypes = {
  navigate: func.isRequired,
  classes: object.isRequired,
  t: func.isRequired,
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

class Map extends Component {
  constructor(props) {
    super(props);

    const viewport = getViewport(window.location.hash);
    const interval = getInterval(window.location.search);

    this.state = {
      loaded: false,
      geolocating: false,
      viewport,
      features: [],
      interval,
      featuresForInterval: [],
      renderedFeatures: { interval, features: [] },
      interactiveLayerIds: [],
      popup: null,
      user: null,
    };

    this.mapRef = React.createRef();
    this.geocoderContainerRef = React.createRef();

    this.setRenderedFeaturesDebounced = _debounce(
      this.setRenderedFeatures,
      500,
    );
  }

  getMap = () => {
    return this.mapRef.current ? this.mapRef.current.getMap() : null;
  };

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

    map.addSource(REPORTS_SOURCE_ID, {
      type: 'geojson',
      data: featureCollection(this.getFeaturesInInterval()),
    });

    map.addLayer(reportsPermanentLayer);
    map.addLayer(reportsHeatmapLayer, INSERT_BEFORE_LAYER_ID);
    map.addLayer(reportsPointsLayer, INSERT_BEFORE_LAYER_ID);

    map.loadImage(Eyes, (error, image) => {
      if (error) throw error;

      map.addImage('eyes', image);
      map.addSource(WEBCAMS_SOURCE_ID, {
        type: 'geojson',
        data: featureCollection(webcams),
      });
      map.addLayer(webcamsPointsLayer, INSERT_BEFORE_LAYER_ID);
    });

    map.on('idle', this.setRenderedFeaturesDebounced);

    this.setState({
      interactiveLayerIds: [reportsPointsLayer.id],
    });
  };

  setRenderedFeatures = () => {
    const map = this.getMap();

    const features = map.queryRenderedFeatures({
      layers: [REPORTS_PERMANENT_LAYER_ID],
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
    const source = map && map.getSource(REPORTS_SOURCE_ID);

    source && source.setData(featureCollection(features));
  };

  dismissPopup = () => this.setState({ popup: null });

  onError(error, coordinates = null) {
    const { t } = this.props;
    const { latitude, longitude } = coordinates || this.state.viewport;

    this.setState({
      popup: {
        text: textFromError(error, t),
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

  onClick = features => {
    const feature = features && features[0];
    feature && this.setState({ popup: toPopup(feature) });
  };

  onIntervalChange = interval => {
    const { navigate } = this.props;

    this.setState({ interval }, () =>
      this.setMapData(this.getFeaturesInInterval()),
    );

    navigate(`?interval=${interval.id}${window.location.hash}`);
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
      interactiveLayerIds,
      renderedFeatures,
      popup,
      interval,
      geolocating,
      user,
    } = this.state;

    return (
      <div className={classes.root}>
        <Controls
          geocoderContainerRef={this.geocoderContainerRef}
          loaded={loaded}
          geolocating={geolocating}
          interval={interval}
          renderedFeatures={renderedFeatures}
          navigate={navigate}
          onIntervalChange={this.onIntervalChange}
          onReportClick={this.onReportClick}
          onViewportChange={this.onViewportChange}
        />
        <Mapbox
          ref={this.mapRef}
          geocoderContainerRef={this.geocoderContainerRef}
          className={classes.map}
          viewport={viewport}
          popup={popup}
          user={user}
          interactiveLayerIds={interactiveLayerIds}
          dismissPopup={this.dismissPopup}
          onViewportChange={this.onViewportChange}
          onLoaded={this.onLoaded}
          onClick={this.onClick}
        />
      </div>
    );
  }
}

export default withTranslation()(withStyles(styles)(Map));

Map.propTypes = propTypes;
