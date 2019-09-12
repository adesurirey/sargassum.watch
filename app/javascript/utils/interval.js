import _range from 'lodash/range';
import _groupBy from 'lodash/groupBy';
import _countBy from 'lodash/countBy';
import _sortBy from 'lodash/sortBy';

import {
  getWeek,
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

const toTickDate = (date, unit) => {
  switch (unit) {
    case 'day':
      setToBeginOfDay(date);
      break;
    case 'week':
      setToLastMonday(date);
      break;
    case 'month':
      setToBeginOfMonth(date);
      break;
    default:
      throw new Error(`Unknown interval unit: ${unit}`);
  }

  return date;
};

const intervalStartDate = ({ value, unit }) => {
  let start = new Date();

  switch (unit) {
    case 'day':
      start.setDate(start.getDate() - value);
      break;
    case 'week':
      start.setDate(start.getDate() - value * 7);
      break;
    case 'month':
      start.setMonth(start.getMonth() - value);
      break;
    default:
      throw new Error(`Unknown interval unit: ${unit}`);
  }

  return toTickDate(start, unit);
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
    const tick = toTickDate(featureDate(feature), interval.unit);
    return ticks.find(time => time === tick.getTime());
  };
};

const featuresPerInterval = (features, interval) => {
  let data = _groupBy(features, getRelatedInterval(interval));
  data = Object.entries(data).map(([time, intervalFeatures]) => ({
    time,
    ..._countBy(intervalFeatures, 'properties.humanLevel'),
  }));

  return _sortBy(data, 'time');
};

const intervalEndFormatter = unit => {
  switch (unit) {
    case 'day':
      return 'today';
    case 'week':
      return 'this week';
    case 'month':
      return 'this month';
    default:
      throw new Error(`Unknown interval unit: ${unit}`);
  }
};

const tickFormatter = (time, unit, format) => {
  const date = new Date(parseInt(time));
  let options = { month: 'short' };

  switch (unit) {
    case 'day':
      options.day = 'numeric';
      if (format === 'long') {
        options.weekday = 'long';
      }
      break;
    case 'week':
      return `week ${getWeek(date)[1]}`;
    case 'month':
      options.year = 'numeric';
      if (format === 'long') {
        options.month = 'long';
      }
      break;
    default:
      throw new Error(`Unknown interval unit: ${unit}`);
  }

  return date.toLocaleDateString('default', options);
};

const getTickFormatter = (interval, format = 'short') => time => {
  const date = new Date(parseInt(time));
  const intervalStart = intervalStartDate(interval);

  if (intervalStart.getTime() < date.getTime()) {
    return intervalEndFormatter(interval.unit);
  }

  return tickFormatter(time, interval.unit);
};

export {
  intervals,
  toString,
  featuresInInterval,
  featuresPerInterval,
  toTickDate,
  tickFormatter,
  getTickFormatter,
};
