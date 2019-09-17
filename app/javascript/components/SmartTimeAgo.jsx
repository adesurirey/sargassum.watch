import React from 'react';
import {
  oneOfType,
  string,
  number,
  instanceOf,
  shape,
  oneOf,
} from 'prop-types';
import TimeAgo from 'react-timeago';

const units = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];

const getFormatter = (date, options, now) => (
  value,
  unit,
  _suffix,
  _epochSeconds,
  nextFormatter,
) => {
  const unitIndex = units.indexOf(unit);

  if (unitIndex < units.indexOf('minute')) {
    return 'right now';
  }
  if (unitIndex < units.indexOf('week')) {
    return nextFormatter();
  }
  if (date.getFullYear() < now.getFullYear()) {
    options.year = 'numeric';
  }

  return date.toLocaleDateString('default', options);
};

const propTypes = {
  date: oneOfType([string, number]).isRequired,
  now: instanceOf(Date),
  dateOptions: shape({
    weekday: oneOf(['long', 'short', 'narrow']),
    day: oneOf(['numeric', '2-digit']),
    hour: oneOf(['numeric', '2-digit']),
    minute: oneOf(['numeric', '2-digit']),
    second: oneOf(['numeric', '2-digit']),
    year: oneOf(['numeric', '2-digit']),
    month: oneOf(['long', 'short', 'narrow', 'numeric', '2-digit']),
  }),
};

const defaultProps = {
  now: new Date(),
  dateOptions: { day: 'numeric', month: 'long' },
};

const SmartTimeAgo = ({ date: time, now, dateOptions, ...typographyProps }) => {
  const date = new Date(time);
  const options = { ...dateOptions };
  const formatter = getFormatter(date, options, now);

  return <TimeAgo date={date} formatter={formatter} />;
};

export default SmartTimeAgo;

SmartTimeAgo.propTypes = propTypes;
SmartTimeAgo.defaultProps = defaultProps;
