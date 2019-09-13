import cheapRuler from 'cheap-ruler';

const sargassumBbox = {
  ne: { lng: -34.31067179238596, lat: 46.03500843336249 },
  sw: { lng: -113.41223429238529, lat: -9.32997469975038 },
};

const sargassumCenter = {
  latitude: 20.827873989993776,
  longitude: -73.86145304236818,
};

const bboxAround = ({ longitude, latitude }, squareMeters) => {
  const ruler = cheapRuler(latitude, 'meters');

  // Returns [w, s, e, n]
  return ruler.bufferPoint([longitude, latitude], squareMeters / 2);
};

export { sargassumBbox, sargassumCenter, bboxAround };
