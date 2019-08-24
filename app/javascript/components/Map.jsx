import 'mapbox-gl/dist/mapbox-gl.css';
import 'typeface-open-sans';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactMapGL from 'react-map-gl';
import axios from 'axios';

import withTheme from './withTheme';
import heatmapLayer from './layers/heatmap';
import pointsLayer from './layers/points';

const HEATMAP_LAYER_ID = 'reports-heatmap';
const POINTS_LAYER_ID = 'reports-points';

const HEATMAP_SOURCE_ID = 'reports-source';
const INSERT_BEFORE_LAYER_ID = 'waterway-label';

const propTypes = {
  mapboxApiAccessToken: PropTypes.string.isRequired,
};

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
  mapRef = React.createRef();

  getMap = () => {
    return this.mapRef.current ? this.mapRef.current.getMap() : null;
  };

  onViewportChange = viewport => this.setState({ viewport });

  handleMapLoaded = () => {
    const map = this.getMap();

    const heatmap = heatmapLayer(HEATMAP_LAYER_ID, HEATMAP_SOURCE_ID);
    const points = pointsLayer(POINTS_LAYER_ID, HEATMAP_SOURCE_ID);

    axios
      .get('/reports', { headers: { accept: 'application/json' } })
      .then(({ data: reports }) => {
        this.setState({ reports });

        map.addSource(HEATMAP_SOURCE_ID, { type: 'geojson', data: reports });
        map.addLayer(heatmap, INSERT_BEFORE_LAYER_ID);
        map.addLayer(points, INSERT_BEFORE_LAYER_ID);
      })
      .catch(error => console.log(error));
  };
  render() {
    const { viewport, settings } = this.state;

    return (
      <ReactMapGL
        ref={this.mapRef}
        {...this.props}
        {...viewport}
        {...settings}
        width="100%"
        height="100vh"
        mapStyle="mapbox://styles/adesurirey/cjzh0ooac2mjn1cnnb0ogzus8"
      />
    );
  }
}

export default withTheme(Map);

Map.propTypes = propTypes;
