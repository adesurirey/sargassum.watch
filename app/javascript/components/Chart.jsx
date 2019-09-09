import React, { memo } from 'react';
import { arrayOf, shape, string, bool } from 'prop-types';
import _isEqualWith from 'lodash/isEqualWith';

import TinyChart from './TinyChart';
import BigChart from './BigChart';
import { featuresPerInterval } from '../utils/interval';
import { interval } from '../utils/propTypes';

const propTypes = {
  features: arrayOf(
    shape({
      properties: shape({
        humanLevel: string.isRequired,
        updatedAt: string.isRequired,
      }).isRequired,
    }),
  ).isRequired,
  interval,
  tiny: bool.isRequired,
};

const defaultProps = {
  tiny: false,
};

const Chart = ({ features, interval, tiny, ...containerProps }) => {
  const data = featuresPerInterval(features, interval);

  return tiny ? (
    <TinyChart data={data} {...containerProps} />
  ) : (
    <BigChart data={data} interval={interval} {...containerProps} />
  );
};

const featuresUnchanged = (
  { features: prevFeatures },
  { features: nextFeatures },
) => {
  if (prevFeatures.length > 0 && nextFeatures.length > 0) {
    return _isEqualWith(prevFeatures, nextFeatures, 'properties.id');
  }

  return prevFeatures.length === nextFeatures.length;
};

// New interval prop is received before new features prop,
// don't update unless rendered features has change.
export default memo(Chart, featuresUnchanged);

Chart.propTypes = propTypes;
Chart.defaultProps = defaultProps;
