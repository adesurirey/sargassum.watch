import reportsHeatmapLayerFactory from './reportsHeatmapLayerFactory';
import reportsPointsLayerFactory from './reportsPointsLayerFactory';
import reportsPermanentLayerFactory from './reportsPermanentLayerFactory';
import webcamsPointsLayerFactory from './webcamsPointsLayerFactory';

export const REPORTS_SOURCE_ID = 'reports-source';
export const WEBCAMS_SOURCE_ID = 'webcams-source';

export const REPORTS_HEATMAP_LAYER_ID = 'reports-heatmap';
export const REPORTS_POINTS_LAYER_ID = 'reports-points';
export const REPORTS_PERMANENT_LAYER_ID = 'reports-permanent';

export const WEBCAMS_POINTS_LAYER_ID = 'webcams-points';

export const INSERT_BEFORE_LAYER_ID = 'waterway-label';

export const reportsHeatmapLayer = reportsHeatmapLayerFactory(
  REPORTS_HEATMAP_LAYER_ID,
  REPORTS_SOURCE_ID,
);

export const reportsPointsLayer = reportsPointsLayerFactory(
  REPORTS_POINTS_LAYER_ID,
  REPORTS_SOURCE_ID,
);

export const reportsPermanentLayer = reportsPermanentLayerFactory(
  REPORTS_PERMANENT_LAYER_ID,
  REPORTS_SOURCE_ID,
);

export const webcamsPointsLayer = webcamsPointsLayerFactory(
  WEBCAMS_POINTS_LAYER_ID,
  WEBCAMS_SOURCE_ID,
);
