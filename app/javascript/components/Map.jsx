import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';

import React, { useReducer, useRef, useEffect, useCallback } from 'react';
import { func, string } from 'prop-types';
import { FlyToInterpolator } from 'react-map-gl';
import _debounce from 'lodash/debounce';
import _uniqBy from 'lodash/uniqBy';
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from 'react-i18next';

import {
  SOURCE_ID,
  PERMANENT_LAYER_ID,
  INSERT_BEFORE_LAYER_ID,
  heatmapLayer,
  pointsLayer,
  permanentLayer,
} from '../layers';
import { sargassumCenter } from '../utils/geography';
import { featureCollection, toPopup, isSameFeatures } from '../utils/geoJSON';
import { intervals, featuresInInterval } from '../utils/interval';
import {
  onNextIdle,
  validateWaterPresence,
  isDifferentPosition,
} from '../utils/map';
import Api from '../utils/Api';
import textFromError from '../utils/textFromError';

import Mapbox from './Mapbox';
import Controls from './Controls';

const api = new Api();

const propTypes = {
  onDidMount: func,
  path: string.isRequired,
  navigate: func.isRequired,
};

const defaultProps = {
  onDidMount: null,
};

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
  },

  map: {
    flexGrow: 1,
  },
}));

const initialState = {
  loaded: false,
  geolocating: false,
  viewport: {
    ...sargassumCenter,
    zoom: 3,
  },
  features: [],
  interval: intervals[0],
  featuresForInterval: [],
  renderedFeatures: { interval: intervals[0], features: [] },
  interactiveLayerIds: [],
  popup: null,
  user: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADED':
      return {
        ...state,
        loaded: true,
      };
    case 'SET_FEATURES':
      return {
        ...state,
        features: action.payload,
      };
    case 'SET_RENDERED_FEATURES':
      return {
        ...state,
        renderedFeatures: {
          ...state.renderedFeatures,
          ...action.payload,
        },
      };
    case 'SET_FEATURES_FOR_INTERVAL':
      return {
        ...state,
        featuresForInterval: action.payload,
      };
    case 'SET_INTERACTIVE_LAYERS':
      return {
        ...state,
        interactiveLayerIds: action.payload,
      };
    case 'SET_POPUP':
      return {
        ...state,
        popup: action.payload,
      };
    case 'DISMISS_POPUP':
      return {
        ...state,
        popup: null,
      };
    case 'VIEWPORT_CHANGE':
      return {
        ...state,
        viewport: {
          ...state.viewport,
          ...action.payload,
        },
      };
    case 'INTERVAL_CHANGE':
      return {
        ...state,
        interval: action.payload,
      };
    case 'GEOLOCATION':
      return {
        ...state,
        geolocating: true,
      };
    case 'GEOLOCATION_FAIL':
      return {
        ...state,
        geolocating: false,
        popup: {
          text: action.payload,
          latitude: state.viewport.latitude,
          longitude: state.viewport.longitude,
        },
      };
    case 'GEOLOCATION_SUCCESS': {
      const { latitude, longitude } = action.payload;

      return {
        ...state,
        user: { latitude, longitude },
        viewport: {
          ...state.viewport,
          latitude,
          longitude,
          zoom: 19,
          transitionInterpolator: new FlyToInterpolator(),
          transitionDuration: 2000,
        },
      };
    }
    case 'USER_POSITION_HANDLED':
      return {
        ...state,
        geolocating: false,
        popup: action.payload,
      };
    case 'REPORT_SUCCESS': {
      const feature = action.payload;

      const updatedFeatures = [
        ...state.features.filter(
          ({ properties: { id } }) => id !== feature.properties.id,
        ),
        feature,
      ];

      return {
        ...state,
        features: updatedFeatures,
        popup: toPopup(feature),
        user: null,
      };
    }
    default:
      throw new Error();
  }
};

const Map = ({ onDidMount, path, navigate }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const mapRef = useRef(null);
  const geocoderContainerRef = useRef(null);
  const { t } = useTranslation();
  const classes = useStyles();

  useEffect(() => {
    if (onDidMount) {
      onDidMount();
    }
  });

  const getMap = () => {
    return mapRef.current ? mapRef.current.getMap() : null;
  };

  const getFeaturesInInterval = useCallback(() => {
    const { features, interval, featuresForInterval, renderedFeatures } = state;

    const newFeatures = featuresInInterval(features, interval);

    if (isSameFeatures(newFeatures, featuresForInterval)) {
      // Because it won't trigger a map idle event,
      // which is responsible for updating rendered features interval,
      // we update rendered features interval manualy.
      dispatch({
        type: 'SET_RENDERED_FEATURES',
        payload: { interval, ...renderedFeatures },
      });
    } else {
      dispatch({ type: 'SET_FEATURES_FOR_INTERVAL', payload: newFeatures });
    }

    return newFeatures;
  }, [state]);

  const initMapData = useCallback(() => {
    const map = getMap();

    map.addSource(SOURCE_ID, {
      type: 'geojson',
      data: featureCollection(getFeaturesInInterval()),
    });

    map.addLayer(permanentLayer);
    map.addLayer(heatmapLayer, INSERT_BEFORE_LAYER_ID);
    map.addLayer(pointsLayer, INSERT_BEFORE_LAYER_ID);

    map.on('idle', setRenderedFeaturesDebounced);

    dispatch({ type: 'SET_INTERACTIVE_LAYERS', payload: [pointsLayer.id] });
  }, [getFeaturesInInterval]);

  useEffect(() => {
    if (state.loaded) {
      initMapData();
    }
  }, [initMapData, state.loaded, state.features]);

  const setRenderedFeatures = () => {
    const map = getMap();
    const { interval } = state;

    const features = map.queryRenderedFeatures({
      layers: [PERMANENT_LAYER_ID],
    });

    features &&
      dispatch({
        type: 'SET_RENDERED_FEATURES',
        payload: { interval, features: _uniqBy(features, 'properties.id') },
      });
  };
  const setRenderedFeaturesDebounced = _debounce(setRenderedFeatures, 500);

  useEffect(() => {
    return () => {
      const map = getMap();
      map && map.off('idle', setRenderedFeaturesDebounced);
    };
  }, [setRenderedFeaturesDebounced]);

  useEffect(() => {
    const features = getFeaturesInInterval();
    const map = getMap();
    const source = map && map.getSource(SOURCE_ID);

    source && source.setData(featureCollection(features));
  }, [state.interval, state.features, getFeaturesInInterval]);

  const dismissPopup = () => dispatch({ type: 'DISMISS_POPUP' });

  const onError = (error, coordinates = null) => {
    const { latitude, longitude } = coordinates || state.viewport;

    dispatch({
      type: 'SET_POPUP',
      payload: {
        text: textFromError(error, t),
        latitude,
        longitude,
      },
    });
  };

  const onLoaded = () => {
    dispatch({ type: 'SET_LOADED' });

    api
      .getAll()
      .then(({ data: { features } }) =>
        dispatch({ type: 'SET_FEATURES', payload: features }),
      )
      .catch(onError);
  };

  const onViewportChange = viewport =>
    dispatch({ type: 'VIEWPORT_CHANGE', payload: viewport });

  const onClick = features => {
    const feature = features && features[0];
    feature && dispatch({ type: 'SET_POPUP', payload: toPopup(feature) });
  };

  const onIntervalChange = interval => {
    if (state.interval.id !== interval.id) {
      dispatch({ type: 'INTERVAL_CHANGE', payload: interval });
    }
  };

  const onReportSubmit = level => {
    const { user } = state;

    api
      .create({ level, ...user })
      .then(({ data: payload }) =>
        dispatch({ type: 'REPORT_SUCCESS', payload }),
      )
      .catch(error => onError(error, user));
  };

  const handleUserPosition = () => {
    const { user } = state;
    const isNearWater = validateWaterPresence(getMap(), user);

    let popup = { ...user };
    if (isNearWater) {
      popup.variant = 'report';
      popup.onSubmit = onReportSubmit;
    } else {
      popup.text = t('Please get closer to the beach');
    }

    dispatch({ type: 'USER_POSITION_HANDLED', payload: popup });
  };

  const onGeolocationSuccess = ({ latitude, longitude }) => {
    const { viewport } = state;
    const map = getMap();

    let handlePosition = handleUserPosition;
    if (isDifferentPosition(map, [viewport, { latitude, longitude }])) {
      handlePosition = onNextIdle(map, handlePosition);
    }

    dispatch({ type: 'GEOLOCATION_SUCCESS', payload: { latitude, longitude } });

    handlePosition();
  };

  const onGeolocationFail = () =>
    dispatch({ type: 'GEOLOCATION_FAIL', payload: t('Location not found') });

  const onReportClick = () => {
    dispatch({ type: 'GEOLOCATION' });

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => onGeolocationSuccess(coords),
      onGeolocationFail,
    );
  };

  return (
    <div className={classes.root}>
      <Controls
        geocoderContainerRef={geocoderContainerRef}
        loaded={state.loaded}
        geolocating={state.geolocating}
        interval={state.interval}
        renderedFeatures={state.renderedFeatures}
        navigate={navigate}
        onIntervalChange={onIntervalChange}
        onReportClick={onReportClick}
      />
      <Mapbox
        ref={mapRef}
        geocoderContainerRef={geocoderContainerRef}
        className={classes.map}
        viewport={state.viewport}
        popup={state.popup}
        user={state.user}
        interactiveLayerIds={state.interactiveLayerIds}
        dismissPopup={dismissPopup}
        onViewportChange={onViewportChange}
        onLoaded={onLoaded}
        onClick={onClick}
      />
    </div>
  );
};

export default Map;

Map.propTypes = propTypes;
Map.defaultProps = defaultProps;
