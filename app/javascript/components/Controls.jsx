import React from 'react';
import { object } from 'prop-types';
import { useTranslation } from 'react-i18next';

import ResponsiveDrawer from './ResponsiveDrawer';
import ControlsPanel from './ControlsPanel';
import IntervalControls from './IntervalControls';
import Chart from './Chart';

const propTypes = {
  intervalControlsProps: object.isRequired,
  chartProps: object.isRequired,
};

const Controls = ({
  intervalControlsProps,
  chartProps,
  ...bottomDrawerProps
}) => {
  const { t } = useTranslation();

  return (
    <ResponsiveDrawer chartProps={chartProps} {...bottomDrawerProps}>
      <ControlsPanel title={t('Status of beaches in the area')}>
        <IntervalControls {...intervalControlsProps} />
        <Chart {...chartProps} />
      </ControlsPanel>
    </ResponsiveDrawer>
  );
};

export default Controls;

Controls.propTypes = propTypes;
