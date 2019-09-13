import React, { memo } from 'react';
import { bool, func, arrayOf, object } from 'prop-types';

import { Grid, Slide } from '@material-ui/core';

import IntervalControl from './IntervalControl';
import { interval } from '../utils/propTypes';

const propTypes = {
  loaded: bool,
  intervals: arrayOf(object).isRequired,
  selectedInterval: interval,
  onIntervalChange: func.isRequired,
};

const defaultProps = {
  loaded: false,
};

const IntervalControls = ({
  loaded,
  intervals,
  selectedInterval,
  onIntervalChange,
}) => (
  <Grid item xs={12}>
    <Grid container justify="space-evenly" role="group">
      {intervals.map((interval, index) => (
        <Slide
          key={interval.id}
          in={loaded}
          direction="right"
          style={{ transitionDelay: index * 50 }}
        >
          <Grid item>
            <IntervalControl
              interval={interval}
              active={selectedInterval.id === interval.id}
              onClick={onIntervalChange}
            />
          </Grid>
        </Slide>
      ))}
    </Grid>
  </Grid>
);

export default memo(IntervalControls);

IntervalControls.propTypes = propTypes;
IntervalControls.defaultProps = defaultProps;
