import React, { memo } from 'react';
import { arrayOf, shape, number, string, oneOf } from 'prop-types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import _groupBy from 'lodash/groupBy';
import _countBy from 'lodash/countBy';

import { useTheme } from '@material-ui/styles';

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
};

const updatedAt = feature => new Date(feature.properties.updatedAt);

const getMonth = feature => {
  return updatedAt(feature).getMonth() + 1;
};

const getDate = feature => {
  return updatedAt(feature).getDate();
};

const getDay = feature => {
  return updatedAt(feature).getDay();
};

const getIteratee = interval => {
  const { unit, value } = interval;

  if (unit === 'day' && value === 7) {
    return getDay;
  } else if (unit === 'day' && value === 30) {
    return getDate;
  } else if (unit === 'month') {
    return getMonth;
  }
};

const Chart = ({ features, interval }) => {
  const theme = useTheme();

  const iteratee = getIteratee(interval);
  const groupedFeatures = _groupBy(features, iteratee);

  const data = Object.entries(groupedFeatures).map(([date, features]) => ({
    name: date,
    ..._countBy(features, 'properties.humanLevel'),
  }));

  return (
    <ResponsiveContainer height={200}>
      <AreaChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        {['clear', 'moderate', 'critical'].map(humanLevel => (
          <Area
            key={humanLevel}
            type="monotone"
            dataKey={humanLevel}
            stackId="1"
            stroke={theme.palette.level[humanLevel].main}
            fill={theme.palette.level[humanLevel].main}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};

const featuresUnchanged = (
  { features: prevFeatures },
  { features: nextFeatures },
) => {
  if (prevFeatures.length > 0 && nextFeatures.length > 0) {
    return prevFeatures[0].properties.id === nextFeatures[0].properties.id;
  }

  return prevFeatures.length === nextFeatures.length;
};

// New interval prop is received before new features prop,
// don't update unless rendered features has change.
export default memo(Chart, featuresUnchanged);

Chart.propTypes = propTypes;
