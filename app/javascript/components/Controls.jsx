import React from 'react';
import { func, object } from 'prop-types';
import { useTranslation } from 'react-i18next';

import ResponsiveDrawer from './ResponsiveDrawer';
import ControlsPanel from './ControlsPanel';
import IntervalControls from './IntervalControls';
import Chart from './Chart';
import LanguageSwitch from './LanguageSwitch';

const propTypes = {
  navigate: func.isRequired,
  intervalControlsProps: object.isRequired,
  chartProps: object.isRequired,
};

const Controls = ({
  navigate,
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

      <ControlsPanel>
        <LanguageSwitch navigate={navigate} />
      </ControlsPanel>
    </ResponsiveDrawer>
  );
};

export default Controls;

Controls.propTypes = propTypes;
