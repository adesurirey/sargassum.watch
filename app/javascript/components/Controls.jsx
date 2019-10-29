import React, { lazy } from 'react';
import { func, object, bool, string } from 'prop-types';

import { interval } from '../utils/propTypes';
import ReportButton from './ReportButton';
import MapSettings from './MapSettings';
import ResponsiveDrawer from './ResponsiveDrawer';
import ChartControls from './ChartControls';
import Footer from './Footer';

const GeocoderContainer = lazy(() => import('./GeocoderContainer'));

const propTypes = {
  geocoderContainerRef: object,
  loaded: bool.isRequired,
  geolocating: bool.isRequired,
  interval,
  renderedFeatures: object.isRequired,
  style: string.isRequired,
  navigate: func.isRequired,
  onIntervalChange: func.isRequired,
  onReportClick: func.isRequired,
  onStyleChange: func.isRequired,
  onWebcamsToggle: func.isRequired,
  onViewportChange: func.isRequired,
};

const defaultProps = {
  geocoderContainerRef: null,
};

const Controls = ({
  geocoderContainerRef,
  loaded,
  geolocating,
  interval,
  renderedFeatures,
  style,
  navigate,
  onIntervalChange,
  onReportClick,
  onStyleChange,
  onWebcamsToggle,
  onViewportChange,
}) => (
  <>
    <GeocoderContainer
      loaded={loaded}
      ref={geocoderContainerRef}
      onViewportChange={onViewportChange}
    />

    <ReportButton
      visible={loaded}
      loading={geolocating}
      onClick={onReportClick}
    />

    <MapSettings
      loaded={loaded}
      style={style}
      onStyleChange={onStyleChange}
      onWebcamsToggle={onWebcamsToggle}
    />

    <ResponsiveDrawer chartProps={renderedFeatures}>
      <ChartControls
        loaded={loaded}
        interval={interval}
        onIntervalChange={onIntervalChange}
        renderedFeatures={renderedFeatures}
      />

      <Footer navigate={navigate} />
    </ResponsiveDrawer>
  </>
);

export default Controls;

Controls.propTypes = propTypes;
Controls.defaultProps = defaultProps;
