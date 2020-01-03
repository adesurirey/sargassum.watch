import React from 'react';
import { bool, string, arrayOf, shape, number, oneOf } from 'prop-types';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { Card, CardContent, Grid, Typography } from '@material-ui/core';

import { tickFormatter } from '../utils/interval';
import { currentLanguage } from '../utils/i18n';
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
  unit: oneOf(['day', 'week', 'month']).isRequired,
};

const defaultProps = {
  active: false,
  label: null,
  payload: null,
};

const useStyles = makeStyles(theme => ({
  root: {
    width: 160,
    background: fade(theme.palette.background.paper, 0.9),
  },
  content: {
    padding: theme.spacing(1),
    '&:last-child': {
      paddingBottom: theme.spacing(1),
    },
  },
  title: {
    fontWeight: 700,
    fontSize: '0.85rem',
    lineHeight: '1.1',
    paddingBottom: theme.spacing(1),
  },
  point: {
    marginRight: theme.spacing(1),
    fontSize: '0.6rem',
  },
}));

const ChartTooltip = ({ active, payload, label, unit }) => {
  const { t, i18n } = useTranslation();
  const classes = useStyles();

  if (!active || !label || !payload) {
    return null;
  }

  const language = currentLanguage(i18n);
  const title = tickFormatter(label, unit, t, language, 'long');

  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        <Typography className={classes.title}>{title}</Typography>

        {payload.map(({ dataKey, value }) => (
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
                <Typography variant="caption">{t(dataKey)}</Typography>
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
