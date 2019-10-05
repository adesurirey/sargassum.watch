export default (id, source) => ({
  id,
  source,
  type: 'symbol',
  filter: ['!', ['has', 'point_count']],
  layout: {
    'icon-image': 'eyes',
    'icon-size': 0.5,
  },
});
