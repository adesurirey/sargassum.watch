import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';

import React, { Component } from 'react';
import { object } from 'prop-types';
import MapGL from 'react-map-gl';
import Geocoder from 'react-map-gl-geocoder';
import axios from 'axios';

import { withStyles } from '@material-ui/styles';

import GeocoderContainer from './GeocoderContainer';
import Controls from './Controls';
import SmartPopup from './SmartPopup';
import ZoomControl from './ZoomControl';
import heatmapLayerFactory from '../layers/heatmapLayerFactory';
import pointsLayerFactory from '../layers/pointsLayerFactory';

const HEATMAP_LAYER_ID = 'reports-heatmap';
const POINTS_LAYER_ID = 'reports-points';

const HEATMAP_SOURCE_ID = 'reports-source';
const INSERT_BEFORE_LAYER_ID = 'waterway-label';

const heatmapLayer = heatmapLayerFactory(HEATMAP_LAYER_ID, HEATMAP_SOURCE_ID);
const pointsLayer = pointsLayerFactory(POINTS_LAYER_ID, HEATMAP_SOURCE_ID);

const featureCollection = features => ({ type: 'FeatureCollection', features });

const intervals = [
  { id: 3, value: 7, unit: 'day' },
  { id: 2, value: 30, unit: 'day' },
  { id: 1, value: 12, unit: 'month' },
];

const intervalStartTime = ({ value, unit }) => {
  const date = new Date();

  if (unit === 'day') {
    date.setDate(date.getDate() - value);
  } else if (unit === 'month') {
    date.setMonth(date.getMonth() - value);
  }

  return date.getTime();
};

const featuresInInterval = (features, interval) => {
  const startTime = intervalStartTime(interval);

  return features.filter(({ properties: { updatedAt } }) => {
    const featureDate = new Date(updatedAt);
    return featureDate.getTime() >= startTime;
  });
};

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

class Map extends Component {
  state = {
    viewport: {
      latitude: 20.827873989993776,
      longitude: -73.86145304236818,
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
    interval: intervals[0],
    reports: null,
    renderedFeatures: [],
    interactiveLayerIds: [],
    popup: null,
  };

  mapRef = React.createRef();
  geocoderContainerRef = React.createRef();

  getMap = () => {
    return this.mapRef.current ? this.mapRef.current.getMap() : null;
  };

  getCursor = ({ isHovering, isDragging }) => {
    return isHovering ? 'pointer' : 'grab';
  };

  initMapData = () => {
    const { reports, interval } = this.state;
    const map = this.getMap();

    const features = featuresInInterval(reports.features, interval);

    map.addSource(HEATMAP_SOURCE_ID, {
      type: 'geojson',
      data: featureCollection(features),
    });

    map.addLayer(heatmapLayer, INSERT_BEFORE_LAYER_ID);
    map.addLayer(pointsLayer, INSERT_BEFORE_LAYER_ID);

    this.setState({ interactiveLayerIds: [pointsLayer.id] });
  };

  setMapData = features => {
    const map = this.getMap();

    map &&
      map.getSource(HEATMAP_SOURCE_ID).setData(featureCollection(features));
  };

  offset = offset => {
    const map = this.getMap();
    const {
      viewport: { latitude, longitude },
    } = this.state;

    map &&
      map.flyTo({
        center: [longitude, latitude],
        offset: [0, offset],
        speed: 0.8,
        curve: 0,
      });
  };

  onLoaded = () =>
    axios
      .get('/reports', { headers: { accept: 'application/json' } })
      .then(({ data: reports }) => this.setState({ reports }, this.initMapData))
      .catch(error =>
        this.setState(({ viewport: { latitude, longitude } }) => ({
          popup: { text: 'Error while loading data 🐛', latitude, longitude },
        })),
      );

  onViewportChange = viewport =>
    this.setState({
      viewport: { ...this.state.viewport, ...viewport },
    });

  onClick = event => {
    const feature =
      event.features &&
      event.features.find(({ layer }) => layer.id === POINTS_LAYER_ID);

    if (feature) {
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
    }
  };

  onPopupClose = () => this.setState({ popup: null });

  onIntervalChange = interval => {
    this.setState({ interval }, () => {
      const { reports, interval } = this.state;

      reports &&
        this.setMapData(featuresInInterval(reports.features, interval));
    });
  };

  render() {
    const { classes } = this.props;
    const {
      viewport,
      settings,
      interactiveLayerIds,
      renderedFeatures,
      popup,
      interval,
    } = this.state;

    return (
      <div className={classes.root}>
        <GeocoderContainer forwardRef={this.geocoderContainerRef} />

        <Controls
          offsetMap={this.offset}
          intervalControlsProps={{
            intervals,
            selectedInterval: interval,
            onIntervalChange: this.onIntervalChange,
          }}
          chartProps={{ features: renderedFeatures }}
        />

        <MapGL
          ref={this.mapRef}
          className={classes.map}
          {...viewport}
          {...settings}
          width="100%"
          height="100%"
          attributionControl={false}
          mapStyle="mapbox://styles/adesurirey/cjzh0ooac2mjn1cnnb0ogzus8?optimize=true"
          mapboxApiAccessToken={gon.mapboxApiAccessToken}
          getCursor={this.getCursor}
          interactiveLayerIds={interactiveLayerIds}
          onViewportChange={this.onViewportChange}
          onLoad={this.onLoaded}
          onClick={this.onClick}
        >
          <Geocoder
            mapboxApiAccessToken={gon.mapboxApiAccessToken}
            mapRef={this.mapRef}
            containerRef={this.geocoderContainerRef}
            placeholder="Find a beach"
            clearAndBlurOnEsc
            onViewportChange={this.onViewportChange}
          />

          {popup && <SmartPopup {...popup} onClose={this.onPopupClose} />}

          <ZoomControl />
        </MapGL>
      </div>
    );
  }
}

export default withStyles(styles)(Map);

Map.propTypes = propTypes;
