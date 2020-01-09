import popupTypes from '../config/popupTypes';

const featureCollection = features => ({
  type: 'FeatureCollection',
  features,
  // https://docs.mapbox.com/help/troubleshooting/working-with-large-geojson-data/#adjusting-the-buffer
  buffer: 0,
});

const toPopup = (variant, feature, other) => {
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
    ...other,
  };
};

const toPointPopup = (feature, other = {}) =>
  toPopup(popupTypes.point, feature, other);

const toWebcamPopup = (feature, other = {}) =>
  toPopup(popupTypes.webcam, feature, other);

export { featureCollection, toPointPopup, toWebcamPopup };
