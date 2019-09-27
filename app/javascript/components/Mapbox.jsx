import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';

import React, { forwardRef } from 'react';
import { object, arrayOf, func, string } from 'prop-types';
import MapGL from 'react-map-gl';

import Geocoder from './Geocoder';
import SmartPopup from './SmartPopup';
import UserMarker from './UserMarker';
import ZoomControl from './ZoomControl';

const settings = {
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
};

const propTypes = {
  className: string,
  viewport: object.isRequired,
  user: object,
  popup: object,
  interactiveLayerIds: arrayOf(string).isRequired,
  geocoderContainerRef: object,
  dismissPopup: func.isRequired,
  onViewportChange: func.isRequired,
  onLoaded: func.isRequired,
  onClick: func.isRequired,
};

const defaultProps = {
  className: null,
  popup: null,
  user: null,
  geocoderContainerRef: null,
};

const Mapbox = forwardRef(
  (
    {
      className,
      viewport,
      user,
      popup,
      interactiveLayerIds,
      geocoderContainerRef,
      dismissPopup,
      onViewportChange,
      onLoaded,
      onClick,
    },
    ref,
  ) => {
    const handleClick = event => {
      // Cannot prevent event propagation on map childrens,
      // so we check here that the click was trageting the map.
      if (!event.target.classList.contains('overlays')) {
        return;
      }

      dismissPopup();

      return onClick(event.features);
    };

    return (
      <MapGL
        ref={ref}
        mapboxApiAccessToken={gon.mapboxApiAccessToken}
        {...viewport}
        {...settings}
        className={className}
        width="100%"
        height="100%"
        attributionControl={false}
        mapStyle="mapbox://styles/adesurirey/ck0e1s9fk0gvb1cpb7na085mf"
        preventStyleDiffing
        mapOptions={{ hash: true }}
        interactiveLayerIds={interactiveLayerIds}
        onViewportChange={onViewportChange}
        onLoad={onLoaded}
        onClick={handleClick}
      >
        <Geocoder
          mapRef={ref}
          containerRef={geocoderContainerRef}
          longitude={viewport.longitude}
          latitude={viewport.latitude}
          onChange={onViewportChange}
        />
        {popup && <SmartPopup {...popup} onClose={dismissPopup} />}
        {user && <UserMarker {...user} />}
        <ZoomControl />
      </MapGL>
    );
  },
);

export default Mapbox;

Mapbox.propTypes = propTypes;
Mapbox.defaultProps = defaultProps;
