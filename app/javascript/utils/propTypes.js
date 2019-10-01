import { arrayOf, shape, number, string, oneOf } from 'prop-types';

import { intervals } from './interval';

const data = arrayOf(
  shape({
    time: string.isRequired,
    clear: number,
    moderate: number,
    critical: number,
  }),
).isRequired;

const interval = shape({
  id: oneOf(intervals.map(interval => interval.id)).isRequired,
  unit: oneOf(['day', 'week', 'month']).isRequired,
  value: number.isRequired,
}).isRequired;

const humanLevel = oneOf(['clear', 'moderate', 'na', 'critical']).isRequired;

export { data, interval, humanLevel };
