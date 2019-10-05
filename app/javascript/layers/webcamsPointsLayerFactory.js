export default (id, source) => {
  // const MIN_ZOOM_LEVEL = 7;

  return {
    id,
    source,
    // minzoom: MIN_ZOOM_LEVEL,
    type: 'symbol',
    // filter: ['!', ['has', 'point_count']],
    layout: {
      'icon-image': 'eyes',
      'icon-size': 0.5,
    },
  };
};
