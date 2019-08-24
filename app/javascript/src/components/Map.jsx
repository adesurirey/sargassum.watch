import 'mapbox-gl/dist/mapbox-gl.css';

import React, { Component } from 'react';
import { object } from 'prop-types';
import ReactMapGL, { Popup } from 'react-map-gl';
import axios from 'axios';

import { withStyles } from '@material-ui/styles';

import ResponsiveDrawer from './ResponsiveDrawer';
import heatmapLayerFactory from '../layers/heatmapLayerFactory';
import pointsLayerFactory from '../layers/pointsLayerFactory';

const HEATMAP_LAYER_ID = 'reports-heatmap';
const POINTS_LAYER_ID = 'reports-points';

const HEATMAP_SOURCE_ID = 'reports-source';
const INSERT_BEFORE_LAYER_ID = 'waterway-label';

const heatmapLayer = heatmapLayerFactory(HEATMAP_LAYER_ID, HEATMAP_SOURCE_ID);
const pointsLayer = pointsLayerFactory(POINTS_LAYER_ID, HEATMAP_SOURCE_ID);

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
    reports: null,
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
    popup: null,
  };

  mapRef = React.createRef();

  getMap = () => {
    return this.mapRef.current ? this.mapRef.current.getMap() : null;
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

  onViewportChange = viewport => this.setState({ viewport });

  onLoaded = () => {
    const map = this.getMap();

    axios
      .get('/reports', { headers: { accept: 'application/json' } })
      .then(({ data: reports }) => {
        this.setState({ reports });

        map.addSource(HEATMAP_SOURCE_ID, { type: 'geojson', data: reports });
        map.addLayer(heatmapLayer, INSERT_BEFORE_LAYER_ID);
        map.addLayer(pointsLayer, INSERT_BEFORE_LAYER_ID);
      })
      .catch(error =>
        this.setState(({ viewport: { latitude, longitude } }) => ({
          popup: { text: 'Error while loading data 💩', latitude, longitude },
        })),
      );
  };

  onPopupClose = () => this.setState({ popup: null });

  render() {
    const { classes } = this.props;
    const { viewport, settings, popup } = this.state;

    return (
      <div className={classes.root}>
        <ResponsiveDrawer bottomDrawerProps={{ offsetMap: this.offset }}>
          Here comes the controls
        </ResponsiveDrawer>

        <div className={classes.map}>
          <ReactMapGL
            ref={this.mapRef}
            {...viewport}
            {...settings}
            width="100%"
            height="100%"
            attributionControl={false}
            mapStyle="mapbox://styles/adesurirey/cjzh0ooac2mjn1cnnb0ogzus8?optimize=true"
            mapboxApiAccessToken={gon.mapboxApiAccessToken}
            onViewportChange={this.onViewportChange}
            onLoad={this.onLoaded}
            onClick={this.onClick}
          >
            {popup && (
              <Popup
                latitude={popup.latitude}
                longitude={popup.longitude}
                onClose={this.onPopupClose}
              >
                {popup.text}
              </Popup>
            )}
          </ReactMapGL>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Map);

Map.propTypes = propTypes;
