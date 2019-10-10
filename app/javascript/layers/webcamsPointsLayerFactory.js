export default (id, source) => ({
  id,
  source,
  type: 'symbol',
  filter: ['!', ['has', 'point_count']],
  layout: {
    'icon-image': 'eyes',
    'icon-size': ['interpolate', ['linear'], ['zoom'], 3, 0.33, 14, 0.5],
    'icon-allow-overlap': true,
  },
});
