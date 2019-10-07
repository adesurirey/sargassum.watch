import React from 'react';
import { bool, string, arrayOf, shape, number, oneOf } from 'prop-types';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';

import { tickFormatter } from '../utils/interval';
import { currentLanguage } from '../utils/i18n';
import Tooltip from './Tooltip';
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
    <Tooltip className={classes.root} title={title}>
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
    </Tooltip>
  );
};

export default ChartTooltip;

ChartTooltip.propTypes = propTypes;
ChartTooltip.defaultProps = defaultProps;
