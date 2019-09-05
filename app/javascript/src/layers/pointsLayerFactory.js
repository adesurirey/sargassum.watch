import theme from '../theme';

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
        4,
        16,
        30,
      ],
      // Color circle by report level
      'circle-color': [
        'interpolate',
        ['linear'],
        ['get', 'level'],
        0,
        theme.palette.level.clear.main,
        1,
        theme.palette.level.moderate.main,
        2,
        theme.palette.level.critical.main,
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
