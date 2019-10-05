import React, { lazy } from 'react';
import { func, object, bool } from 'prop-types';
import { useTranslation } from 'react-i18next';

import { interval } from '../utils/propTypes';
import ReportButton from './ReportButton';
import ResponsiveDrawer from './ResponsiveDrawer';
import ControlsPanel from './ControlsPanel';
import IntervalControls from './IntervalControls';
import Chart from './Chart';
import Legend from './Legend';
import WebcamsToggle from './WebcamsToggle';
import LanguageSwitch from './LanguageSwitch';
import Credits from './Credits';

const GeocoderContainer = lazy(() => import('./GeocoderContainer'));

const propTypes = {
  geocoderContainerRef: object,
  loaded: bool.isRequired,
  geolocating: bool.isRequired,
  interval,
  renderedFeatures: object.isRequired,
  navigate: func.isRequired,
  onIntervalChange: func.isRequired,
  onReportClick: func.isRequired,
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
  navigate,
  onIntervalChange,
  onReportClick,
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
        ref={geocoderContainerRef}
        onViewportChange={onViewportChange}
      />

      <ReportButton {...buttonProps} />

      <ResponsiveDrawer chartProps={renderedFeatures} buttonProps={buttonProps}>
        <ControlsPanel title={t('Status of beaches in the area')}>
          <IntervalControls
            loaded={loaded}
            selectedInterval={interval}
            onIntervalChange={onIntervalChange}
          />
          <Chart {...renderedFeatures} />
          <Legend />
        </ControlsPanel>

        <ControlsPanel title={t('Map settings')}>
          <WebcamsToggle onToggle={onWebcamsToggle} />
        </ControlsPanel>

        <ControlsPanel>
          <LanguageSwitch navigate={navigate} />
          <Credits />
        </ControlsPanel>
      </ResponsiveDrawer>
    </>
  );
};

export default Controls;

Controls.propTypes = propTypes;
Controls.defaultProps = defaultProps;
