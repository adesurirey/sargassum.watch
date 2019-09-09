import { arrayOf, shape, number, string, oneOf } from 'prop-types';

export const data = arrayOf(
  shape({
    time: string.isRequired,
    clear: number.isRequired,
    moderate: number.isRequired,
    critical: number.isRequired,
  }),
).isRequired;

export const interval = shape({
  id: number.isRequired,
  unit: oneOf(['day', 'week', 'month']).isRequired,
  value: number.isRequired,
}).isRequired;
