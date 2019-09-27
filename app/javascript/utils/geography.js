const sargassumBbox = {
  ne: { lng: -34.31, lat: 46.04 },
  sw: { lng: -113.41, lat: -9.33 },
};

const sargassumCenter = {
  latitude: 20.83,
  longitude: -73.86,
  zoom: 3,
};

const getViewport = hash => {
  if (!hash) {
    return sargassumCenter;
  }

  const [zoom, latitude, longitude] = hash.substr(1).split('/');

  if (!zoom || !latitude || !longitude) {
    return sargassumCenter;
  }

  return {
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    zoom: parseFloat(zoom),
  };
};

export { sargassumBbox, sargassumCenter, getViewport };
