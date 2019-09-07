import heatmapLayerFactory from './heatmapLayerFactory';
import pointsLayerFactory from './pointsLayerFactory';
import permanentLayerFactory from './permanentLayerFactory';

export const SOURCE_ID = 'reports-source';

export const HEATMAP_LAYER_ID = 'reports-heatmap';
export const POINTS_LAYER_ID = 'reports-points';
export const PERMANENT_LAYER_ID = 'reports-permanent';

export const INSERT_BEFORE_LAYER_ID = 'waterway-label';

export const heatmapLayer = heatmapLayerFactory(HEATMAP_LAYER_ID, SOURCE_ID);
export const pointsLayer = pointsLayerFactory(POINTS_LAYER_ID, SOURCE_ID);
export const permanentLayer = permanentLayerFactory(
  PERMANENT_LAYER_ID,
  SOURCE_ID,
);
