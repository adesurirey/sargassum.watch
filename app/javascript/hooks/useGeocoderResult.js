import { FlyToInterpolator } from 'react-map-gl';
import WebMercatorViewport from 'viewport-mercator-project';

import useException from './useException';

const DEFAULT_ZOOM = 16;
const TRANSITION_DURATION = 3000;

const bboxExceptions = {
  fr: {
    name: 'France',
    bbox: [
      [-4.59235, 41.380007],
      [9.560016, 51.148506],
    ],
  },
  us: {
    name: 'United States',
    bbox: [
      [-171.791111, 18.91619],
      [-66.96466, 71.357764],
    ],
  },
  ru: {
    name: 'Russia',
    bbox: [
      [19.66064, 41.151416],
      [190.10042, 81.2504],
    ],
  },
  ca: {
    name: 'Canada',
    bbox: [
      [-140.99778, 41.675105],
      [-52.648099, 83.23324],
    ],
  },
};

const fitBounds = (bounds, viewport) =>
  new WebMercatorViewport(viewport).fitBounds(bounds);

const useGeocoderResult = getMap => {
  const logException = useException();

  const getZoom = result => {
    const { bbox, properties = {} } = result;
    const { short_code } = properties;

    const { width, height } = getMap()
      .getContainer()
      .getBoundingClientRect();

    let zoom = DEFAULT_ZOOM;
    try {
      if (!bboxExceptions[short_code] && bbox) {
        zoom = fitBounds(
          [
            [bbox[0], bbox[1]],
            [bbox[2], bbox[3]],
          ],
          { width, height },
        ).zoom;
      } else if (bboxExceptions[short_code]) {
        zoom = fitBounds(bboxExceptions[short_code].bbox, { width, height })
          .zoom;
      }
    } catch (error) {
      logException(
        'Geocoder result raised an error when trying to get bbox zoom',
        [
          ['result', result],
          ['error', error],
        ],
      );
      zoom = DEFAULT_ZOOM;
    }

    return zoom;
  };

  const getViewport = result => {
    const {
      center: [longitude, latitude],
    } = result;

    // Popular results already have a zoom prop
    const zoom = result.zoom || getZoom(result);

    return {
      longitude,
      latitude,
      zoom,
      transitionInterpolator: new FlyToInterpolator(),
      transitionDuration: TRANSITION_DURATION,
    };
  };

  return getViewport;
};

export default useGeocoderResult;
