const featureCollection = features => ({
  type: 'FeatureCollection',
  features,
  // https://docs.mapbox.com/help/troubleshooting/working-with-large-geojson-data/#adjusting-the-buffer
  buffer: 0,
});

const toPopup = (variant, feature) => {
  const {
    geometry: {
      coordinates: [longitude, latitude],
    },
    properties,
  } = feature;

  return {
    variant,
    latitude,
    longitude,
    ...properties,
  };
};

const toPointPopup = feature => toPopup('point', feature);

const toWebcamPopup = feature => toPopup('webcam', feature);

export { featureCollection, toPointPopup, toWebcamPopup };
