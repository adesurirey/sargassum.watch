import theme from '../styles/theme';

export default (id, source) => {
  const MAX_ZOOM_LEVEL = 9;

  return {
    id,
    source,
    maxzoom: MAX_ZOOM_LEVEL,
    type: 'heatmap',
    paint: {
      // Increase the heatmap weight based on frequency and property level
      'heatmap-weight': [
        'interpolate',
        ['linear'],
        ['get', 'level'],
        0,
        0,
        3,
        1,
      ],
      // Increase the heatmap color weight weight by zoom level
      // heatmap-intensity is a multiplier on top of heatmap-weight
      'heatmap-intensity': [
        'interpolate',
        ['linear'],
        ['zoom'],
        0,
        1,
        MAX_ZOOM_LEVEL,
        3,
      ],
      // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
      // Begin color ramp at 0-stop with a 0-transparancy color
      // to create a blur-like effect.
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(0, 0, 0, 0)',
        0.25,
        theme.palette.level.moderate.light,
        0.5,
        theme.palette.level.moderate.main,
        0.75,
        theme.palette.level.critical.light,
        1,
        theme.palette.level.critical.main,
      ],
      // Adjust the heatmap radius by zoom level
      'heatmap-radius': [
        'interpolate',
        ['linear'],
        ['zoom'],
        0,
        2,
        MAX_ZOOM_LEVEL,
        20,
      ],
      // Transition from heatmap to circle layer by zoom level
      'heatmap-opacity': [
        'interpolate',
        ['linear'],
        ['zoom'],
        7,
        1,
        MAX_ZOOM_LEVEL,
        0,
      ],
    },
  };
};
