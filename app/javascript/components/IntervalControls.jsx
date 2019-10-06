import React, { memo } from 'react';
import { bool, func } from 'prop-types';
import { useTranslation } from 'react-i18next';

import { Grid, Slide } from '@material-ui/core';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';

import { interval } from '../utils/propTypes';
import { intervals, toString } from '../utils/interval';

const propTypes = {
  loaded: bool,
  selectedInterval: interval,
  onChange: func.isRequired,
};

const defaultProps = {
  loaded: false,
};

const IntervalControls = ({ loaded, selectedInterval, onChange }) => {
  const { t } = useTranslation();

  const handleChange = (_e, intervalId) =>
    onChange(intervals.find(({ id }) => id === intervalId));

  return (
    <Grid item xs={12}>
      <ToggleButtonGroup
        aria-label={t('interval control')}
        size="small"
        value={selectedInterval.id}
        exclusive
        onChange={handleChange}
      >
        {intervals.map((interval, index) => (
          <Slide
            key={interval.id}
            in={loaded}
            direction="right"
            style={{ transitionDelay: index * 50 }}
            value={interval.id}
          >
            <ToggleButton value={interval.id}>
              {t(toString(interval))}
            </ToggleButton>
          </Slide>
        ))}
      </ToggleButtonGroup>
    </Grid>
  );
};

export default memo(IntervalControls);

IntervalControls.propTypes = propTypes;
IntervalControls.defaultProps = defaultProps;
