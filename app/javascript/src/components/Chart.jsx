import React, { memo } from 'react';
import { arrayOf, shape, number, string, oneOf } from 'prop-types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import _groupBy from 'lodash/groupBy';
import _countBy from 'lodash/countBy';
import _sortBy from 'lodash/sortBy';
import _isEqualWith from 'lodash/isEqualWith';

import { useTheme } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

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
};

const Chart = ({ features, interval }) => {
  const theme = useTheme();

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

  const today = new Date();

  const timeFormatter = time => {
    const date = new Date(parseInt(time));
    const options = { month: 'short' };

    if (interval.unit === 'month') {
      options.year = '2-digit';
    } else {
      options.day = 'numeric';
    }

    return date.toLocaleDateString('default', options);
  };

  return (
    <Grid item xs={12}>
      <ResponsiveContainer height={160}>
        <AreaChart data={data} margin={{ left: -4, top: 4 }}>
          {data.map(tick => (
            <ReferenceLine
              key={tick.time}
              x={tick.time}
              stroke={theme.palette.grey[200]}
            />
          ))}
          <YAxis domain={[0, 'dataMax + 1']} hide />
          <XAxis
            dataKey="time"
            type="number"
            domain={['dataMin', today.getTime()]}
            interval="preserveStartEnd"
            tickCount={3}
            tickLine={false}
            tickFormatter={timeFormatter}
            axisLine={{ stroke: theme.palette.grey[200] }}
          />
          <Tooltip
            labelFormatter={timeFormatter}
            cursor={{ stroke: theme.palette.grey[400] }}
          />
          <Legend iconType="circle" />
          {['clear', 'moderate', 'critical'].map(humanLevel => (
            <Area
              key={humanLevel}
              type="linear"
              dataKey={humanLevel}
              stackId="1"
              stroke={theme.palette.level[humanLevel].main}
              fill={theme.palette.level[humanLevel].main}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </Grid>
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
