import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';

import React, { PureComponent, lazy } from 'react';
import { object } from 'prop-types';
import MapGL from 'react-map-gl';
import Geocoder from 'react-map-gl-geocoder';
import axios from 'axios';
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
import { sargassumCenter, sargassumBbox } from '../utils/geography';
import { featureCollection } from '../utils/geoJSON';
import { intervals, featuresInInterval } from '../utils/interval';
import Controls from './Controls';
import SmartPopup from './SmartPopup';
import ZoomControl from './ZoomControl';

const GeocoderContainer = lazy(() => import('./GeocoderContainer'));

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

  removePopup = () => this.setState({ popup: null });

  onLoaded = () =>
    axios
      .get('/reports', { headers: { accept: 'application/json' } })
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

  onViewportChange = viewport =>
    this.setState({
      viewport: { ...this.state.viewport, ...viewport },
    });

  onClick = event => {
    const { popup } = this.state;
    if (popup && popup.variant === 'point') {
      this.removePopup();
    }

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

  onIntervalChange = interval => {
    if (this.state.interval.id !== interval.id) {
      this.setState({ interval }, () =>
        this.setMapData(this.getFeaturesInInterval()),
      );
    }
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
        <GeocoderContainer ref={this.geocoderContainerRef} />

        <Controls
          offsetMap={this.offset}
          intervalControlsProps={{
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
            mapboxApiAccessToken={gon.mapboxApiAccessToken}
            mapRef={this.mapRef}
            containerRef={this.geocoderContainerRef}
            placeholder="Find a beach"
            clearAndBlurOnEsc
            bbox={[
              sargassumBbox.sw.lng,
              sargassumBbox.sw.lat,
              sargassumBbox.ne.lng,
              sargassumBbox.ne.lat,
            ]}
            proximity={{
              longitude: viewport.longitude,
              latitude: viewport.latitude,
            }}
            onViewportChange={this.onViewportChange}
          />

          {popup && <SmartPopup {...popup} onClose={this.removePopup} />}

          <ZoomControl />
        </MapGL>
      </div>
    );
  }
}

export default withStyles(styles)(Map);

Map.propTypes = propTypes;
