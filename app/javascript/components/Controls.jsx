import React from 'react';
import { object } from 'prop-types';

import ResponsiveDrawer from './ResponsiveDrawer';
import ControlsPanel from './ControlsPanel';
import IntervalControls from './IntervalControls';
import Chart from './Chart';

const propTypes = {
  intervalControlsProps: object.isRequired,
  chartProps: object.isRequired,
};

const Controls = ({ intervalControlsProps, chartProps }) => (
  <ResponsiveDrawer chartProps={chartProps}>
    <ControlsPanel title="Sargassum monitoring">
      <IntervalControls {...intervalControlsProps} />
      <Chart {...chartProps} />
    </ControlsPanel>
  </ResponsiveDrawer>
);

export default Controls;

Controls.propTypes = propTypes;
