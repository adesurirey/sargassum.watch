import React, { Component } from 'react';
import { object, func } from 'prop-types';
import { FlyToInterpolator } from 'react-map-gl';
import debounce from 'lodash/debounce';
import uniqBy from 'lodash/uniqBy';
import pull from 'lodash/pull';
import { withStyles } from '@material-ui/styles';
import { withTranslation } from 'react-i18next';
import retry from '../utils/retry';

import {
  REPORTS_SOURCE_ID,
  WEBCAMS_SOURCE_ID,
  WEBCAMS_CLUSTERS_LAYER_ID,
  WEBCAMS_POINTS_LAYER_ID,
  INSERT_BEFORE_LAYER_ID,
  REPORTS_POINTS_LAYER_ID,
  reportsHeatmapLayer,
  reportsPointsLayer,
  webcamsClustersLayer,
  webcamsPointsLayer,
} from '../layers';
import { MIN_ZOOM_LEVEL as POINTS_MIN_ZOOM_LEVEL } from '../layers/reportsPointsLayerFactory';
import { getViewport } from '../utils/geography';
import {
  featureCollection,
  toPointPopup,
  toWebcamPopup,
} from '../utils/geoJSON';
import { getInterval, featuresInInterval } from '../utils/interval';
import { validateWaterPresence, isSamePosition } from '../utils/map';
import textFromError from '../utils/textFromError';
import popupTypes from '../config/popupTypes';
import Api, { API_BASE } from '../services/Api';

import Mapbox from './Mapbox';
import Controls from './Controls';
import SmartPopup from './SmartPopup';
import Eyes from '../images/eyes.png';

const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000,
};

const api = new Api();

const { mapStyle } = gon;

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

    const interval = getInterval(window.location.search);

    this.state = {
      loaded: false,
      loading: true,
      geolocating: false,
      viewport: {
        ...getViewport(window.location.hash),
        transitionInterpolator: new FlyToInterpolator(),
      },
      style: mapStyle,
      features: [],
      interval,
      featuresForInterval: [],
      renderedFeatures: { loading: true, interval, features: [] },
      interactiveLayerIds: [],
      popup: null,
      user: null,
    };

    this.mapRef = React.createRef();

    this.onReportsIdle = debounce(this.onReportsIdle, 600);
  }

  componentDidMount() {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addListener(this.reinitializeMap);
  }

  setStateAsync(state) {
    return new Promise(resolve => {
      this.setState(state, resolve);
    });
  }

  geolocate(callback) {
    const { t } = this.props;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        callback(coords);
      },
      () => {
        this.setState({
          popup: { text: t('Location not found') },
          geolocating: false,
        });
      },
      GEOLOCATION_OPTIONS,
    );
  }

  zoom({ zoom, minDuration = 1000, ...coordinates }) {
    const zoomDifference = zoom - this.state.viewport.zoom;
    const transitionDuration = Math.max(zoomDifference * 100, minDuration);

    this.onViewportChange({ zoom, ...coordinates, transitionDuration });
  }

  getMap = () => {
    return this.mapRef.current ? this.mapRef.current.getMap() : null;
  };

  queryRenderedFeatures = (geometry, options) => {
    const map = this.getMap();
    return map && map.queryRenderedFeatures(geometry, options);
  };

  getFeaturesInInterval() {
    const { features, interval } = this.state;

    const newFeatures = featuresInInterval(features, interval);

    this.setState(({ renderedFeatures }) => ({
      featuresForInterval: newFeatures,
      renderedFeatures: { interval, ...renderedFeatures },
    }));

    return newFeatures;
  }

  initMap = () => {
    const map = this.getMap();

    map.addSource(REPORTS_SOURCE_ID, {
      type: 'geojson',
      data: featureCollection(this.getFeaturesInInterval()),
    });

    map.addSource(WEBCAMS_SOURCE_ID, {
      type: 'geojson',
      data: `${API_BASE}/webcams.json`,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 40,
    });

    this.initLayers();
  };

  initLayers = () => {
    const map = this.getMap();

    this.handleReportsIdle();

    map.addLayer(reportsHeatmapLayer, INSERT_BEFORE_LAYER_ID);
    map.addLayer(reportsPointsLayer, INSERT_BEFORE_LAYER_ID);

    map.loadImage(Eyes, (error, image) => {
      if (error) throw error;

      map.addImage('eyes', image);
      map.addLayer(webcamsClustersLayer);
      map.addLayer(webcamsPointsLayer);

      this.setState({
        loading: false,
        interactiveLayerIds: [webcamsClustersLayer.id, webcamsPointsLayer.id],
      });
    });
  };

  reinitializeMap = () => {
    if (!this.state.loaded) return;

    const map = this.getMap();
    map.once('idle', this.initMap);
  };

  onReportsIdle = () => {
    if (this.state.loading) {
      return this.handleReportsIdle();
    }

    this.handleLayersInteractivity();
    this.setRenderedFeatures();
  };

  handleReportsIdle = () => {
    const map = this.getMap();
    if (!map) return;

    map.once('idle', this.onReportsIdle);
  };

  setRenderedFeatures = () => {
    let features = this.queryRenderedFeatures({
      layers: [REPORTS_POINTS_LAYER_ID],
    });

    if (features) {
      features = uniqBy(features, 'properties.id');

      this.setState(({ interval }) => ({
        renderedFeatures: {
          loading: false,
          interval,
          features,
        },
      }));
    }
  };

  setMapData = () => {
    const map = this.getMap();
    const source = map && map.getSource(REPORTS_SOURCE_ID);

    if (!source) return;

    const features = this.getFeaturesInInterval();

    this.handleReportsIdle();
    source.setData(featureCollection(features));
  };

  dismissPopup = () => this.setState({ popup: null });

  handleLayersInteractivity = () => {
    const { zoom } = this.state.viewport;

    const interactiveLayerIds = [...this.state.interactiveLayerIds];
    const pointsLayerInteractive = interactiveLayerIds.includes(
      REPORTS_POINTS_LAYER_ID,
    );

    if (zoom >= POINTS_MIN_ZOOM_LEVEL && !pointsLayerInteractive) {
      interactiveLayerIds.push(REPORTS_POINTS_LAYER_ID);
    } else if (zoom < POINTS_MIN_ZOOM_LEVEL && pointsLayerInteractive) {
      pull(interactiveLayerIds, REPORTS_POINTS_LAYER_ID);
    } else {
      return;
    }

    this.setState({ interactiveLayerIds });
  };

  onError = error => {
    this.setState({
      popup: {
        text: textFromError(error, this.props.t),
      },
    });
  };

  onLoaded = () => {
    if (this.state.loaded) return;

    this.setState({ loaded: true });

    retry(api.getReports)
      .then(({ data: { features } }) =>
        this.setState({ features }, this.initMap),
      )
      .catch(this.onError);
  };

  onViewportChange = viewportChange => {
    this.setState(
      ({ viewport }) => ({
        viewport: { ...viewport, ...viewportChange },
      }),
      this.handleReportsIdle,
    );
  };

  onReportFeatureClick = feature =>
    this.setState({
      popup: toPointPopup(feature, { onUpdate: this.onReportUpdate }),
    });

  onWebcamsClusterClick = ({
    properties: { cluster_id: clusterId },
    geometry: {
      coordinates: [longitude, latitude],
    },
  }) => {
    const map = this.getMap();

    map
      .getSource(WEBCAMS_SOURCE_ID)
      .getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        this.zoom({ zoom, longitude, latitude, minDuration: 200 });
      });
  };

  onWebcamFeatureClick = feature => {
    const {
      geometry: {
        coordinates: [longitude, latitude],
      },
    } = feature;

    this.zoom({ zoom: 14, longitude, latitude });
    this.setState({ popup: toWebcamPopup(feature) });
  };

  onIntervalChange = interval => {
    const { navigate } = this.props;

    this.setState(
      ({ renderedFeatures }) => ({
        interval,
        renderedFeatures: { ...renderedFeatures, loading: true },
      }),
      this.setMapData,
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
        popup: toPointPopup(feature, { onUpdate: this.onReportUpdate }),
        user: null,
      }),
      this.setMapData,
    );

  onReportUpdate = report => {
    api
      .updateReport(report)
      .then(({ data: feature }) => this.onReportSuccess(feature))
      .catch(this.onError);
  };

  onReportSubmit = level => {
    const { user } = this.state;

    api
      .createReport({ level, ...user })
      .then(({ data: feature }) => this.onReportSuccess(feature))
      .catch(this.onError);
  };

  handleUserPosition = () => {
    const map = this.getMap();
    const { user } = this.state;
    const { t } = this.props;

    const isNearWater = validateWaterPresence(map, user);

    let popup = { ...user };
    if (isNearWater) {
      popup.variant = popupTypes.report;
      popup.onSubmit = this.onReportSubmit;
    } else {
      popup.text = t('Please get closer to the beach');
    }

    this.setState({
      popup,
      geolocating: false,
    });
  };

  onReporterGeolocated = async ({ latitude, longitude }) => {
    const map = this.getMap();
    const { viewport } = this.state;
    const user = { latitude, longitude };

    await this.setStateAsync({ user });

    if (isSamePosition(map, [viewport, user])) {
      return this.handleUserPosition();
    }

    map.once('idle', this.handleUserPosition);
    this.zoom({ zoom: 16, ...user });
  };

  onReportClick = () => {
    this.dismissPopup();

    this.setState({ geolocating: true }, () => {
      this.geolocate(this.onReporterGeolocated);
    });
  };

  onStyleChange = style => {
    this.setState({ style }, this.reinitializeMap);

    api.createSetting({ map_style: style });
  };

  onWebcamsToggle = value => {
    const map = this.getMap();

    map.setLayoutProperty(WEBCAMS_CLUSTERS_LAYER_ID, 'visibility', value);
    map.setLayoutProperty(WEBCAMS_POINTS_LAYER_ID, 'visibility', value);
  };

  render() {
    const { classes, navigate } = this.props;

    const {
      loaded,
      loading,
      viewport,
      style,
      interactiveLayerIds,
      renderedFeatures,
      popup,
      interval,
      geolocating,
      user,
    } = this.state;

    const center = [viewport.longitude, viewport.latitude];

    const userIsReporting =
      user && popup && popup.variant === popupTypes.report;

    return (
      <div className={classes.root}>
        <Controls
          loaded={loaded}
          geolocating={geolocating}
          interval={interval}
          renderedFeatures={renderedFeatures}
          center={center}
          style={style}
          navigate={navigate}
          getMap={this.getMap}
          onIntervalChange={this.onIntervalChange}
          onReportClick={this.onReportClick}
          onStyleChange={this.onStyleChange}
          onWebcamsToggle={this.onWebcamsToggle}
          onViewportChange={this.onViewportChange}
        />
        <Mapbox
          ref={this.mapRef}
          className={classes.map}
          loading={loading}
          viewport={viewport}
          style={style}
          popup={popup}
          user={user}
          userIsReporting={userIsReporting}
          interactiveLayerIds={interactiveLayerIds}
          dismissPopup={this.dismissPopup}
          onViewportChange={this.onViewportChange}
          onLoaded={this.onLoaded}
          onReportFeatureClick={this.onReportFeatureClick}
          onWebcamsClusterClick={this.onWebcamsClusterClick}
          onWebcamFeatureClick={this.onWebcamFeatureClick}
        />
        {popup && <SmartPopup {...popup} onClose={this.dismissPopup} />}
      </div>
    );
  }
}

export default withTranslation()(withStyles(styles)(Map));

Map.propTypes = propTypes;
