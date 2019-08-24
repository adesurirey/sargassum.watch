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
        2,
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
        'rgba(255, 198, 91, 0)',
        0.25,
        'rgb(255, 198, 91)',
        0.5,
        'rgb(230, 126, 34)',
        0.75,
        'rgb(252, 81, 84)',
        1,
        'rgb(252, 16, 21)',
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
