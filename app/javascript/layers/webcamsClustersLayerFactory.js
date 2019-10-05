export default (id, source) => ({
  id,
  source,
  type: 'symbol',
  filter: ['has', 'point_count'],
  layout: {
    'icon-image': 'eyes',
    'icon-size': 0.5,
    'icon-anchor': 'bottom',
    'icon-allow-overlap': true,
    'text-field': '{point_count_abbreviated}',
    'text-size': 14,
    'text-anchor': 'bottom',
  },
  paint: {
    'text-halo-width': 1,
    'text-halo-color': 'rgba(255, 255, 255, 1)',
  },
});
