import React, { memo } from 'react';
import { oneOfType, arrayOf, shape, string, number, bool } from 'prop-types';

import TinyChart from './TinyChart';
import BigChart from './BigChart';
import { featuresPerInterval } from '../utils/interval';
import { interval } from '../utils/propTypes';

const propTypes = {
  loading: bool.isRequired,
  interval,
  features: arrayOf(
    shape({
      properties: shape({
        id: oneOfType([number, string]).isRequired,
        humanLevel: string.isRequired,
        updatedAt: string.isRequired,
      }).isRequired,
    }),
  ).isRequired,
  tiny: bool.isRequired,
};

const defaultProps = {
  tiny: false,
};

const Chart = ({ loading, features, interval, tiny, ...containerProps }) => {
  const data = featuresPerInterval(features, interval);

  return tiny ? (
    <TinyChart data={data} {...containerProps} />
  ) : (
    <BigChart
      loading={loading}
      data={data}
      interval={interval}
      {...containerProps}
    />
  );
};

const featuresUnchanged = (
  { loading: prevLoading, interval: prevInterval, features: prevFeatures },
  { loading: nextLoading, interval: nextInterval, features: nextFeatures },
) => {
  if (
    prevLoading === nextLoading &&
    prevInterval.id === nextInterval.id &&
    prevFeatures.length === nextFeatures.length
  ) {
    return true;
  }
  return false;
};

export default memo(Chart, featuresUnchanged);

Chart.propTypes = propTypes;
Chart.defaultProps = defaultProps;
