import React from 'react';
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
        level: number.isRequired,
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
    ..._countBy(features, 'properties.level'),
  }));

  return (
    <ResponsiveContainer height={200}>
      <AreaChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="0"
          stackId="1"
          stroke={theme.palette.level.clear.main}
          fill={theme.palette.level.clear.main}
        />
        <Area
          type="monotone"
          dataKey="1"
          stackId="1"
          stroke={theme.palette.level.moderate.main}
          fill={theme.palette.level.moderate.main}
        />
        <Area
          type="monotone"
          dataKey="2"
          stackId="1"
          stroke={theme.palette.level.critical.main}
          fill={theme.palette.level.critical.main}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Chart;

Chart.propTypes = propTypes;
