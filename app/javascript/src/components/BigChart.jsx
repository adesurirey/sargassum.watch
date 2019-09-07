import React from 'react';
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

import { useTheme } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

const propTypes = {
  data: arrayOf(
    shape({
      time: string.isRequired,
      clear: number.isRequired,
      moderate: number.isRequired,
      critical: number.isRequired,
    }),
  ).isRequired,
  interval: shape({
    unit: oneOf(['day', 'month']).isRequired,
    value: number.isRequired,
  }),
};

const BigChart = ({ data, interval }) => {
  const theme = useTheme();

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

export default BigChart;

BigChart.propTypes = propTypes;
