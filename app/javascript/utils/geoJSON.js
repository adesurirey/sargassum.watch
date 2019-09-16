const featureCollection = features => ({
  type: 'FeatureCollection',
  features,
});

const toPopup = feature => {
  const {
    geometry: {
      coordinates: [longitude, latitude],
    },
    properties,
  } = feature;

  return {
    variant: 'point',
    latitude,
    longitude,
    ...properties,
  };
};

export { featureCollection, toPopup };
