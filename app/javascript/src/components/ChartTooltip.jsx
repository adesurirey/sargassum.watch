import React from 'react';
import { bool, string, arrayOf, shape, number, oneOf } from 'prop-types';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { Card, CardContent, Grid, Typography } from '@material-ui/core';

import SmartTimeAgo from './SmartTimeAgo';
import LegendPoint from './LegendPoint';

const propTypes = {
  active: bool,
  label: string,
  payload: arrayOf(
    shape({
      color: string.isRequired,
      dataKey: string.isRequired,
      value: number.isRequired,
    }),
  ),
  unit: oneOf(['day', 'month']).isRequired,
};

const defaultProps = {
  active: false,
  label: null,
  payload: null,
};

const useStyles = makeStyles(theme => ({
  root: {
    background: fade(theme.palette.common.white, 0.9),
  },
  content: {
    width: 140,
    padding: theme.spacing(1),
    '&:last-child': {
      paddingBottom: theme.spacing(1),
    },
  },
  header: {
    background: fade(
      theme.palette.text.primary,
      theme.palette.action.hoverOpacity,
    ),
  },
  point: {
    marginRight: theme.spacing(1),
    fontSize: '0.6rem',
  },
}));

const ChartTooltip = ({ active, payload, label, unit }) => {
  const classes = useStyles();

  if (!active || !label || !payload) {
    return null;
  }

  const dateOptions = unit === 'month' ? { month: 'long' } : undefined;
  const data = payload.reverse();

  return (
    <Card className={classes.root}>
      <CardContent className={clsx(classes.content, classes.header)}>
        <SmartTimeAgo
          variant="h3"
          date={parseInt(label)}
          dateOptions={dateOptions}
        />
      </CardContent>
      <CardContent className={classes.content}>
        {data.map(({ dataKey, value }) => (
          <Grid
            key={dataKey}
            container
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Grid container alignItems="center">
                <LegendPoint
                  humanLevel={dataKey}
                  className={classes.point}
                  size="inherit"
                />
                <Typography variant="caption">{dataKey}</Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="caption">{value}</Typography>
            </Grid>
          </Grid>
        ))}
      </CardContent>
    </Card>
  );
};

export default ChartTooltip;

ChartTooltip.propTypes = propTypes;
ChartTooltip.defaultProps = defaultProps;
