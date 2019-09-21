import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';

import React, { forwardRef } from 'react';
import { object, arrayOf, func, string, oneOfType, node } from 'prop-types';
import MapGL from 'react-map-gl';

const propTypes = {
  className: string,
  viewport: object.isRequired,
  settings: object.isRequired,
  interactiveLayerIds: arrayOf(string).isRequired,
  onViewportChange: func.isRequired,
  onLoaded: func.isRequired,
  onClick: func.isRequired,
  children: oneOfType([node, arrayOf(node)]),
};

const defaultProps = {
  className: null,
  children: null,
};

const Mapbox = forwardRef(
  (
    {
      children,
      className,
      viewport,
      settings,
      interactiveLayerIds,
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
        reuseMaps
        preventStyleDiffing
        interactiveLayerIds={interactiveLayerIds}
        onViewportChange={onViewportChange}
        onLoad={onLoaded}
        onClick={handleClick}
      >
        {children}
      </MapGL>
    );
  },
);

export default Mapbox;

Mapbox.propTypes = propTypes;
Mapbox.defaultProps = defaultProps;
