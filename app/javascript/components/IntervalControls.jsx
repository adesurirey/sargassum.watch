import React from 'react';
import { func, arrayOf, object } from 'prop-types';

import { Grid } from '@material-ui/core';

import IntervalControl from './IntervalControl';
import { interval } from '../utils/propTypes';

const propTypes = {
  intervals: arrayOf(object).isRequired,
  selectedInterval: interval,
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
            interval={interval}
            active={selectedInterval.id === interval.id}
            onClick={onIntervalChange}
          />
        </Grid>
      ))}
    </Grid>
  </Grid>
);

export default IntervalControls;

IntervalControls.propTypes = propTypes;
