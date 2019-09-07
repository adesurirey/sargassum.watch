import React, { memo } from 'react';
import { arrayOf, shape, number, string, oneOf, bool } from 'prop-types';
import _groupBy from 'lodash/groupBy';
import _countBy from 'lodash/countBy';
import _sortBy from 'lodash/sortBy';
import _isEqualWith from 'lodash/isEqualWith';

import TinyChart from './TinyChart';
import BigChart from './BigChart';
import { getIteratee } from '../utils/interval';

const propTypes = {
  features: arrayOf(
    shape({
      properties: shape({
        humanLevel: string.isRequired,
        updatedAt: string.isRequired,
      }).isRequired,
    }),
  ).isRequired,
  interval: shape({
    unit: oneOf(['day', 'month']).isRequired,
    value: number.isRequired,
  }),
  tiny: bool.isRequired,
};

const defaultProps = {
  tiny: false,
};

const Chart = ({ features, interval, tiny, ...containerProps }) => {
  const iteratee = getIteratee(interval);
  const groupedFeatures = _groupBy(features, iteratee);

  let data = Object.entries(groupedFeatures).map(([time, features]) => ({
    time,
    clear: 0,
    moderate: 0,
    critical: 0,
    ..._countBy(features, 'properties.humanLevel'),
  }));

  data = _sortBy(data, 'time');

  if (tiny) {
    return <TinyChart data={data} {...containerProps} />;
  }

  return <BigChart data={data} interval={interval} {...containerProps} />;
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
