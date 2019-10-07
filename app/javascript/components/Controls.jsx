import React, { lazy } from 'react';
import { func, object, bool, string } from 'prop-types';
import { useTranslation } from 'react-i18next';

import { interval } from '../utils/propTypes';
import ReportButton from './ReportButton';
import MapSettings from './MapSettings';
import ResponsiveDrawer from './ResponsiveDrawer';
import ControlsPanel from './ControlsPanel';
import IntervalControls from './IntervalControls';
import Chart from './Chart';
import Legend from './Legend';
import LanguageSwitch from './LanguageSwitch';
import About from './About';
import Credits from './Credits';

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
}) => {
  const { t } = useTranslation();

  const buttonProps = {
    visible: loaded,
    loading: geolocating,
    onClick: onReportClick,
  };

  return (
    <>
      <GeocoderContainer
        loaded={loaded}
        ref={geocoderContainerRef}
        onViewportChange={onViewportChange}
      />

      <ReportButton {...buttonProps} />

      <MapSettings
        loaded={loaded}
        style={style}
        onStyleChange={onStyleChange}
        onWebcamsToggle={onWebcamsToggle}
      />

      <ResponsiveDrawer chartProps={renderedFeatures} buttonProps={buttonProps}>
        <ControlsPanel title={t('Status of beaches in the area')}>
          <IntervalControls
            loaded={loaded}
            selectedInterval={interval}
            onChange={onIntervalChange}
          />
          <Chart {...renderedFeatures} />
          <Legend />
        </ControlsPanel>

        <ControlsPanel>
          <LanguageSwitch navigate={navigate} />
          <About />
          <Credits />
        </ControlsPanel>
      </ResponsiveDrawer>
    </>
  );
};

export default Controls;

Controls.propTypes = propTypes;
Controls.defaultProps = defaultProps;
