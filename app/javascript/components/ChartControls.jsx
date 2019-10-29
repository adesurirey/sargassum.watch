import React from 'react';
import { bool, object, func } from 'prop-types';
import { useTranslation } from 'react-i18next';

import { interval } from '../utils/propTypes';
import ControlsPanel from './ControlsPanel';
import IntervalControls from './IntervalControls';
import Chart from './Chart';
import Legend from './Legend';

const propTypes = {
  loaded: bool.isRequired,
  interval,
  renderedFeatures: object.isRequired,
  onIntervalChange: func.isRequired,
};

const ChartControls = ({
  loaded,
  interval,
  onIntervalChange,
  renderedFeatures,
}) => {
  const { t } = useTranslation();

  return (
    <ControlsPanel title={t('Reports in the area')}>
      <IntervalControls
        loaded={loaded}
        selectedInterval={interval}
        onChange={onIntervalChange}
      />
      <Chart {...renderedFeatures} />
      <Legend />
    </ControlsPanel>
  );
};

export default ChartControls;

ChartControls.propTypes = propTypes;
