import React from 'react';
import { func, arrayOf, object, shape, number, oneOf } from 'prop-types';

import { Grid } from '@material-ui/core';

import IntervalControl from './IntervalControl';

const propTypes = {
  intervals: arrayOf(object).isRequired,
  selectedInterval: shape({
    id: number.isRequired,
    value: number.isRequired,
    unit: oneOf(['day', 'month']).isRequired,
  }).isRequired,
  onIntervalChange: func.isRequired,
};

const IntervalControls = ({
  intervals,
  selectedInterval,
  onIntervalChange,
}) => (
  <Grid item xs={12}>
    <Grid container justify="space-evenly">
      {intervals.map(interval => (
        <Grid item key={interval.id}>
          <IntervalControl
            {...interval}
            active={selectedInterval.id === interval.id}
            onClick={() => onIntervalChange(interval)}
          />
        </Grid>
      ))}
    </Grid>
  </Grid>
);

export default IntervalControls;

IntervalControls.propTypes = propTypes;
