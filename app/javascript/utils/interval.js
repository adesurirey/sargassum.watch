import _range from 'lodash/range';
import _groupBy from 'lodash/groupBy';
import _countBy from 'lodash/countBy';
import _sortBy from 'lodash/sortBy';

const getFeatureDate = feature => new Date(feature.properties.updatedAt);

const getIntervalStartDate = ({ value, unit }) => {
  const start = new Date();

  if (unit === 'day') {
    start.setDate(start.getDate() - value);
  } else if (unit === 'week') {
    start.setDate(start.getDate() - value * 7);
  } else if (unit === 'month') {
    start.setMonth(start.getMonth() - value);
  }

  return start;
};

const advanceInTime = (startDate, unit, value) => {
  const clone = new Date(startDate.getTime());

  switch (unit) {
    case 'day':
      clone.setDate(startDate.getDate() + value);
      break;
    case 'month':
      clone.setMonth(startDate.getMonth() + value);
      break;
    default:
      throw new Error(`Unhandled time unit: ${unit}`);
  }

  return clone.getTime();
};

const intervalGranularity = interval => {
  const startDate = getIntervalStartDate(interval);
  const { unit, value } = interval;
  const today = new Date();
  let ticks;

  switch (unit) {
    case 'day':
      ticks = _range(1, value).map(count =>
        advanceInTime(startDate, unit, count),
      );
      break;
    case 'week':
      ticks = _range(7, value * 7, value).map(count =>
        advanceInTime(startDate, 'day', count),
      );
      break;
    case 'month':
      ticks = _range(1, value).map(count =>
        advanceInTime(startDate, unit, count),
      );
      break;
    default:
      throw new Error(`Unknown interval unit: ${unit}`);
  }

  return [startDate.getTime(), ...ticks, today.getTime()];
};

const getIteratee = interval => {
  const ticks = intervalGranularity(interval);

  return feature => {
    const updatedAt = getFeatureDate(feature);
    const nextTick = ticks.find(time => time > updatedAt.getTime());

    return ticks[ticks.indexOf(nextTick) - 1];
  };
};

export const intervals = [
  { id: 1, value: 7, unit: 'day' },
  { id: 2, value: 4, unit: 'week' },
  { id: 3, value: 12, unit: 'month' },
];

export const toString = ({ value, unit }) =>
  `${value} ${unit}${value > 1 && 's'}`;

export const getTickFormatter = interval => time => {
  const date = new Date(parseInt(time));
  const options = { month: 'short' };

  if (interval.unit === 'month') {
    options.year = '2-digit';
  } else {
    options.day = 'numeric';
  }

  return date.toLocaleDateString('default', options);
};

export const featuresInInterval = (features, interval) => {
  const startTime = getIntervalStartDate(interval).getTime();

  return features.filter(({ properties: { updatedAt } }) => {
    const featureDate = new Date(updatedAt);
    return featureDate.getTime() >= startTime;
  });
};

export const featuresPerInterval = (features, interval) => {
  let data = _groupBy(features, getIteratee(interval));

  const defaultProps = { clear: 0, moderate: 0, critical: 0 };

  data = Object.entries(data).map(([time, intervalFeatures]) => ({
    time,
    ...defaultProps,
    ..._countBy(intervalFeatures, 'properties.humanLevel'),
  }));

  return _sortBy(data, 'time');
};
