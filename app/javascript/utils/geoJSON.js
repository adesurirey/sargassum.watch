import _isEqualWith from 'lodash/isEqualWith';

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

const isSameFeatures = (features, otherFeatures) => {
  if (features.length !== otherFeatures.length) {
    return false;
  }

  return _isEqualWith(features, otherFeatures, 'properties.id');
};

export { featureCollection, toPopup, isSameFeatures };
