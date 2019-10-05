import reportsHeatmapLayerFactory from './reportsHeatmapLayerFactory';
import reportsPointsLayerFactory from './reportsPointsLayerFactory';
import reportsPermanentLayerFactory from './reportsPermanentLayerFactory';
import webcamsClustersLayerFactory from './webcamsClustersLayerFactory';
import webcamsPointsLayerFactory from './webcamsPointsLayerFactory';

const REPORTS_SOURCE_ID = 'reports-source';
const WEBCAMS_SOURCE_ID = 'webcams-source';

const REPORTS_HEATMAP_LAYER_ID = 'reports-heatmap';
const REPORTS_POINTS_LAYER_ID = 'reports-points';
const REPORTS_PERMANENT_LAYER_ID = 'reports-permanent';

const WEBCAMS_CLUSTERS_LAYER_ID = 'webcams-clusters';
const WEBCAMS_POINTS_LAYER_ID = 'webcams-points';

const INSERT_BEFORE_LAYER_ID = 'waterway-label';

const reportsHeatmapLayer = reportsHeatmapLayerFactory(
  REPORTS_HEATMAP_LAYER_ID,
  REPORTS_SOURCE_ID,
);

const reportsPointsLayer = reportsPointsLayerFactory(
  REPORTS_POINTS_LAYER_ID,
  REPORTS_SOURCE_ID,
);

const reportsPermanentLayer = reportsPermanentLayerFactory(
  REPORTS_PERMANENT_LAYER_ID,
  REPORTS_SOURCE_ID,
);

const webcamsClustersLayer = webcamsClustersLayerFactory(
  WEBCAMS_CLUSTERS_LAYER_ID,
  WEBCAMS_SOURCE_ID,
);

const webcamsPointsLayer = webcamsPointsLayerFactory(
  WEBCAMS_POINTS_LAYER_ID,
  WEBCAMS_SOURCE_ID,
);

export {
  REPORTS_SOURCE_ID,
  WEBCAMS_SOURCE_ID,
  REPORTS_POINTS_LAYER_ID,
  REPORTS_PERMANENT_LAYER_ID,
  INSERT_BEFORE_LAYER_ID,
  WEBCAMS_CLUSTERS_LAYER_ID,
  WEBCAMS_POINTS_LAYER_ID,
  reportsHeatmapLayer,
  reportsPointsLayer,
  reportsPermanentLayer,
  webcamsClustersLayer,
  webcamsPointsLayer,
};
