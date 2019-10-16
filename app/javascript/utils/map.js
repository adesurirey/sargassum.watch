import cheapRuler from 'cheap-ruler';

const bboxAround = ({ longitude, latitude }, squareMeters) => {
  const ruler = cheapRuler(latitude, 'meters');

  return ruler.bufferPoint([longitude, latitude], squareMeters / 2);
};

const validateWaterPresence = (map, { latitude, longitude }) => {
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  const [w, s, e, n] = bboxAround({ longitude, latitude }, 50);

  const bbox = [map.project([w, s]), map.project([e, n])];
  const waterFeatures = map.queryRenderedFeatures(bbox, {
    layers: ['water'],
  });

  return !!waterFeatures.length;
};

const isSamePosition = (map, [viewport, coordinates]) => {
  if (viewport.zoom !== 19) {
    return false;
  }

  const a = map.project([viewport.longitude, viewport.latitude]);
  const b = map.project([coordinates.longitude, coordinates.latitude]);

  return a.x.toFixed(2) === b.x.toFixed(2) && a.y.toFixed(2) === b.y.toFixed(2);
};

export { validateWaterPresence, isSamePosition };
