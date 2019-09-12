import { arrayOf, shape, number, string, oneOf } from 'prop-types';

export const data = arrayOf(
  shape({
    time: string.isRequired,
    clear: number,
    moderate: number,
    critical: number,
  }),
).isRequired;

export const interval = shape({
  id: number.isRequired,
  unit: oneOf(['day', 'week', 'month']).isRequired,
  value: number.isRequired,
}).isRequired;
