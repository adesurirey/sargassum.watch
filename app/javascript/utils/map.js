import cheapRuler from 'cheap-ruler';

const bboxAround = ({ longitude, latitude }, squareMeters) => {
  const ruler = cheapRuler(latitude, 'meters');

  return ruler.bufferPoint([longitude, latitude], squareMeters / 2);
};

const validateWaterPresence = (map, { latitude, longitude }) => {
  const [w, s, e, n] = bboxAround({ longitude, latitude }, 50);

  const bbox = [map.project([w, s]), map.project([e, n])];
  const waterFeatures = map.queryRenderedFeatures(bbox, {
    layers: ['water'],
  });

  return !!waterFeatures.length;
};

const onNextIdle = (map, call) => () => {
  map.on('idle', function callback() {
    call(map);
    map.off('idle', callback);
  });
};

export { onNextIdle, validateWaterPresence };
