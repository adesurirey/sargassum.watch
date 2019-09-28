const { quickLooks } = gon;

const getViewport = hash => {
  if (!hash) {
    return quickLooks.all;
  }

  const [zoom, latitude, longitude] = hash.substr(1).split('/');

  if (!zoom || !latitude || !longitude) {
    return quickLooks.all;
  }

  return {
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    zoom: parseFloat(zoom),
  };
};

export { getViewport };
