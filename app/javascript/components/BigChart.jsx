import React from 'react';
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

import ChartTooltip from './ChartTooltip';
import { data, interval } from '../utils/propTypes';
import { getTickFormatter } from '../utils/interval';

const propTypes = {
  data,
  interval,
};

const BigChart = ({ data, interval }) => {
  const theme = useTheme();

  const today = new Date();
  const tickFormatter = getTickFormatter(interval);

  return (
    <Grid item xs={12}>
      <ResponsiveContainer height={160}>
        <AreaChart data={data} margin={{ left: 4, right: 4, top: 4 }}>
          <YAxis domain={[0, 'dataMax + 1']} hide />
          <XAxis
            dataKey="time"
            type="number"
            domain={['dataMin', today.getTime()]}
            interval="preserveStartEnd"
            tickCount={3}
            tickLine={false}
            tickFormatter={tickFormatter}
            axisLine={{ stroke: theme.palette.grey[200] }}
          />
          {data.map(tick => (
            <ReferenceLine
              key={tick.time}
              x={tick.time}
              stroke={theme.palette.grey[200]}
            />
          ))}
          <Tooltip
            cursor={{ stroke: theme.palette.grey[400] }}
            content={<ChartTooltip unit={interval.unit} />}
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
