const { _all } = gon.quickLooks;

const initialPosition = {
  longitude: _all.center[0],
  latitude: _all.center[1],
  zoom: _all.zoom,
};

const getViewport = hash => {
  if (!hash) {
    return initialPosition;
  }

  const [zoom, latitude, longitude] = hash.substr(1).split('/');

  if (!zoom || !latitude || !longitude) {
    return initialPosition;
  }

  return {
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    zoom: parseFloat(zoom),
  };
};

export { initialPosition, getViewport };
