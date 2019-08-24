export default (id, source) => {
  const MIN_ZOOM_LEVEL = 7;

  return {
    id,
    source,
    minzoom: MIN_ZOOM_LEVEL,
    type: 'circle',
    paint: {
      // Size circle radius report level and zoom level
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['zoom'],
        MIN_ZOOM_LEVEL,
        ['interpolate', ['linear'], ['get', 'level'], 0, 1, 2, 4],
        16,
        ['interpolate', ['linear'], ['get', 'level'], 0, 5, 2, 50],
      ],
      // Color circle by report level
      'circle-color': [
        'interpolate',
        ['linear'],
        ['get', 'level'],
        0,
        'rgb(30, 221, 136)',
        1,
        'rgb(230, 126, 34)',
        2,
        'rgb(252, 16, 21)',
      ],
      'circle-stroke-color': 'white',
      'circle-stroke-width': 1,
      // Transition from heatmap to circle layer by zoom level
      'circle-opacity': [
        'interpolate',
        ['linear'],
        ['zoom'],
        MIN_ZOOM_LEVEL,
        0,
        8,
        1,
      ],
    },
  };
};
