import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactMapGL from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const propTypes = {
  mapboxApiAccessToken: PropTypes.string.isRequired,
};

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
  };

  render() {
    const { viewport, settings } = this.state;

    return (
      <ReactMapGL
        {...this.props}
        {...viewport}
        {...settings}
        width="100%"
        height="100vh"
        mapStyle="mapbox://styles/adesurirey/cjzh0ooac2mjn1cnnb0ogzus8"
        onViewportChange={viewport => this.setState({ viewport })}
      />
    );
  }
}

export default Map;

Map.propTypes = propTypes;
