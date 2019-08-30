import React from 'react';
import { string, instanceOf } from 'prop-types';
import TimeAgo from 'react-timeago';

import { Typography } from '@material-ui/core';

const units = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];

const propTypes = {
  date: string.isRequired,
  now: instanceOf(Date),
};

const defaultProps = {
  now: new Date(),
};

const SmartTimeAgo = ({ date: dateString, now, ...typographyProps }) => {
  const date = new Date(dateString);
  const dateOptions = { day: 'numeric', month: 'long' };

  const formatter = (_value, unit, _suffix, _epochSeconds, nextFormatter) => {
    if (units.indexOf(unit) < units.indexOf('week')) {
      return nextFormatter();
    }

    if (date.getFullYear() < now.getFullYear()) {
      dateOptions.year = 'numeric';
    }

    return date.toLocaleDateString('default', dateOptions);
  };

  return (
    <Typography variant="caption" {...typographyProps}>
      <TimeAgo date={date} formatter={formatter} />
    </Typography>
  );
};

export default SmartTimeAgo;

SmartTimeAgo.propTypes = propTypes;
SmartTimeAgo.defaultProps = defaultProps;
