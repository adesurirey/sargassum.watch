import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

import { useTheme } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

import ChartTooltip from './ChartTooltip';
import { data, interval } from '../utils/propTypes';
import {
  intervalStartDate,
  toTickDate,
  getTickFormatter,
} from '../utils/interval';

const { levels } = gon;

const propTypes = {
  data,
  interval,
};

const BigChart = ({ data, interval }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const start = intervalStartDate(interval).getTime();
  const now = toTickDate(new Date(), interval.unit).getTime();

  const tickFormatter = getTickFormatter(interval, t);

  return (
    <Grid item xs={12}>
      <ResponsiveContainer height={160}>
        <AreaChart data={data} margin={{ left: 4, right: 4, top: 4 }}>
          <YAxis domain={[0, 'dataMax + 1']} hide />
          <XAxis
            dataKey="time"
            type="number"
            domain={[start, now]}
            interval="preserveStartEnd"
            tickCount={3}
            tickLine={false}
            tickFormatter={tickFormatter}
            tick={{
              fontSize: theme.typography.caption.fontSize,
              fill: theme.palette.text.secondary,
            }}
            axisLine={{ stroke: theme.palette.action.selected }}
          />
          {data.map(tick => (
            <ReferenceLine
              key={tick.time}
              x={tick.time}
              stroke={theme.palette.action.selected}
            />
          ))}
          <Tooltip
            cursor={{ stroke: theme.palette.text.primary }}
            content={<ChartTooltip unit={interval.unit} />}
          />
          {levels.map(({ label }) => (
            <Area
              key={label}
              type="linear"
              dataKey={label}
              stackId="1"
              stroke={theme.palette.level[label].main}
              fill={theme.palette.level[label].main}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </Grid>
  );
};

export default BigChart;

BigChart.propTypes = propTypes;
