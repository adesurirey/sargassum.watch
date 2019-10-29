import React, { useMemo } from 'react';
import { bool } from 'prop-types';
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

import { makeStyles, useTheme } from '@material-ui/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Grid } from '@material-ui/core';

import Spinner from './Spinner';
import ChartTooltip from './ChartTooltip';
import { data, interval } from '../utils/propTypes';
import {
  intervalStartDate,
  toTickDate,
  getTickFormatter,
} from '../utils/interval';

const { levels } = gon;

const propTypes = {
  loading: bool.isRequired,
  data,
  interval,
};

const useStyles = makeStyles(theme => ({
  container: {
    position: 'relative',
  },
}));

const BigChart = ({ loading, data, interval }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();
  const isSmallScreen = useMediaQuery('(max-width:350px)');
  const height = isSmallScreen ? 100 : 160;

  const start = useMemo(() => intervalStartDate(interval).getTime(), [
    interval,
  ]);

  const now = useMemo(() => toTickDate(new Date(), interval.unit).getTime(), [
    interval,
  ]);

  const tickFormatter = useMemo(() => getTickFormatter(interval, t), [
    interval,
    t,
  ]);

  return (
    <Grid item xs={12} className={classes.container}>
      {loading && <Spinner variant="small" delay={200} />}

      <ResponsiveContainer height={height}>
        <AreaChart
          data={data}
          margin={{ left: 5, right: 5, top: 8, bottom: 0 }}
        >
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
