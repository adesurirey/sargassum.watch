import _range from 'lodash/range';
import _groupBy from 'lodash/groupBy';
import _countBy from 'lodash/countBy';
import _sortBy from 'lodash/sortBy';

import {
  setToBeginOfDay,
  setToLastMonday,
  setToBeginOfMonth,
  advanceInTime,
} from './date';

const intervals = [
  { id: 1, value: 7, unit: 'day' },
  { id: 2, value: 4, unit: 'week' },
  { id: 3, value: 12, unit: 'month' },
];

const toString = ({ value, unit }) => `${value} ${unit}${value > 1 && 's'}`;

const featureDate = feature => new Date(feature.properties.updatedAt);

const getTickFormatter = interval => time => {
  const date = new Date(parseInt(time));
  const options = { month: 'short' };

  switch (interval.unit) {
    case 'day':
    case 'week':
      options.day = 'numeric';
      break;
    case 'month':
      options.year = '2-digit';
      break;
    default:
      throw new Error(`Unknown interval unit: ${interval.unit}`);
  }

  return date.toLocaleDateString('default', options);
};

const tooltipDateOptions = unit => {
  switch (unit) {
    case 'day':
    case 'week':
      return { weekday: 'short', day: 'numeric', month: 'long' };
    case 'month':
      return { month: 'long' };
    default:
      throw new Error(`Unknown interval unit: ${unit}`);
  }
};

const intervalStartDate = ({ value, unit }) => {
  const start = new Date();

  switch (unit) {
    case 'day':
      start.setDate(start.getDate() - value);
      setToBeginOfDay(start);
      break;
    case 'week':
      start.setDate(start.getDate() - value * 7);
      setToLastMonday(start);
      break;
    case 'month':
      start.setMonth(start.getMonth() - value);
      setToBeginOfMonth(start);
      break;
    default:
      throw new Error(`Unknown interval unit: ${unit}`);
  }

  return start;
};

const featuresInInterval = (features, interval) => {
  const startTime = intervalStartDate(interval).getTime();

  return features.filter(({ properties: { updatedAt } }) => {
    const featureDate = new Date(updatedAt);
    return featureDate.getTime() >= startTime;
  });
};

const intervalGranularity = interval => {
  const { unit, value } = interval;
  const startDate = intervalStartDate(interval);

  let ticks;
  switch (unit) {
    case 'day':
    case 'month':
      ticks = _range(1, value + 1).map(count =>
        advanceInTime(startDate, unit, count),
      );
      break;
    case 'week':
      ticks = _range(7, value * 7 + 1, 7).map(count =>
        advanceInTime(startDate, 'day', count),
      );
      break;
    default:
      throw new Error(`Unknown interval unit: ${unit}`);
  }

  return [startDate.getTime(), ...ticks];
};

const getRelatedInterval = interval => {
  const ticks = intervalGranularity(interval);

  return feature => {
    const updatedAt = featureDate(feature);
    const nextTick = ticks.find(time => time > updatedAt.getTime());

    if (nextTick) {
      return ticks[ticks.indexOf(nextTick) - 1];
    }
    return ticks[ticks.length - 1];
  };
};

const featuresPerInterval = (features, interval) => {
  const defaultProps = { clear: 0, moderate: 0, critical: 0 };

  let data = _groupBy(features, getRelatedInterval(interval));
  data = Object.entries(data).map(([time, intervalFeatures]) => ({
    time,
    ...defaultProps,
    ..._countBy(intervalFeatures, 'properties.humanLevel'),
  }));

  return _sortBy(data, 'time');
};

export {
  intervals,
  toString,
  getTickFormatter,
  tooltipDateOptions,
  featuresInInterval,
  featuresPerInterval,
};
