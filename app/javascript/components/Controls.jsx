import React from 'react';
import { func, object, array, bool, string } from 'prop-types';
import { useTranslation } from 'react-i18next';

import { interval } from '../utils/propTypes';
import ReportButton from './ReportButton';
import Geocoder from './Geocoder';
import MapSettings from './MapSettings';
import ResponsiveDrawer from './ResponsiveDrawer';
import ControlsPanel from './ControlsPanel';
import IntervalControls from './IntervalControls';
import Chart from './Chart';
import Legend from './Legend';
import Footer from './Footer';

const propTypes = {
  loaded: bool.isRequired,
  geolocating: bool.isRequired,
  interval,
  center: array.isRequired,
  renderedFeatures: object.isRequired,
  style: string.isRequired,
  navigate: func.isRequired,
  getMap: func.isRequired,
  onIntervalChange: func.isRequired,
  onReportClick: func.isRequired,
  onStyleChange: func.isRequired,
  onWebcamsToggle: func.isRequired,
  onViewportChange: func.isRequired,
};

const Controls = ({
  loaded,
  geolocating,
  interval,
  center,
  renderedFeatures,
  style,
  navigate,
  getMap,
  onIntervalChange,
  onReportClick,
  onStyleChange,
  onWebcamsToggle,
  onViewportChange,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Geocoder
        loaded={loaded}
        center={center}
        getMap={getMap}
        onChange={onViewportChange}
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
        <ControlsPanel title={t('Reports in the area')}>
          <IntervalControls
            loaded={loaded}
            selectedInterval={interval}
            onChange={onIntervalChange}
          />
          <Chart {...renderedFeatures} />
          <Legend />
        </ControlsPanel>

        <ControlsPanel>
          <Footer navigate={navigate} />
        </ControlsPanel>
      </ResponsiveDrawer>
    </>
  );
};

export default Controls;

Controls.propTypes = propTypes;
