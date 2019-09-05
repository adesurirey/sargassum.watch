import React from 'react';
import { arrayOf, shape, number, string } from 'prop-types';

const propTypes = {
  features: arrayOf(
    shape({
      properties: shape({
        level: number.isRequired,
        updatedAt: string.isRequired,
      }).isRequired,
    }),
  ).isRequired,
};

const Chart = ({ features }) => {
  return `${features.length} features charted`;
};

export default Chart;

Chart.propTypes = propTypes;
