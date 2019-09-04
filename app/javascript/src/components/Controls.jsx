import React from 'react';
import { object } from 'prop-types';

import ResponsiveDrawer from './ResponsiveDrawer';
import ControlsPanel from './ControlsPanel';
import IntervalControls from './IntervalControls';

const propTypes = {
  intervalControlsProps: object.isRequired,
};

const Controls = ({ intervalControlsProps, ...bottomDrawerProps }) => (
  <ResponsiveDrawer bottomDrawerProps={bottomDrawerProps}>
    <ControlsPanel title="Sargassum monitoring">
      <IntervalControls {...intervalControlsProps} />
    </ControlsPanel>
  </ResponsiveDrawer>
);

export default Controls;

Controls.propTypes = propTypes;
