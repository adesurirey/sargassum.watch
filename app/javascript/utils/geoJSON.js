import _isEqualWith from 'lodash/isEqualWith';

const featureCollection = features => ({
  type: 'FeatureCollection',
  features,
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

const isSameFeatures = (features, otherFeatures) => {
  if (features.length !== otherFeatures.length) {
    return false;
  }

  return _isEqualWith(features, otherFeatures, 'properties.id');
};

export { featureCollection, toPointPopup, toWebcamPopup, isSameFeatures };
