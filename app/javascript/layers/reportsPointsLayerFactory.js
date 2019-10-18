import theme from '../styles/theme';

export const MIN_ZOOM_LEVEL = 7;

export default (id, source) => ({
  id,
  source,
  type: 'circle',
  paint: {
    // Size circle radius report level and zoom level
    'circle-radius': [
      'interpolate',
      ['linear'],
      ['zoom'],
      MIN_ZOOM_LEVEL - 1,
      0,
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
      theme.palette.level.na.main,
      3,
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
      MIN_ZOOM_LEVEL + 1,
      1,
    ],
    'circle-stroke-opacity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      MIN_ZOOM_LEVEL - 0.1,
      0,
      MIN_ZOOM_LEVEL,
      1,
    ],
  },
});
