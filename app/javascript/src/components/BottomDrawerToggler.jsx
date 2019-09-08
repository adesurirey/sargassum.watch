import React from 'react';
import { func, shape, oneOf, number } from 'prop-types';

import { makeStyles } from '@material-ui/styles';
import { Drawer, ButtonBase, Grid, Typography } from '@material-ui/core';

import Chart from './Chart';
import { toString } from '../utils/interval';

const propTypes = {
  onOpen: func.isRequired,
  chartProps: shape({
    interval: shape({
      unit: oneOf(['day', 'month']).isRequired,
      value: number.isRequired,
    }).isRequired,
  }).isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
    border: 0,
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

const BottomDrawerToggler = ({ onOpen, chartProps: { interval, ...rest } }) => {
  const classes = useStyles();

  const text = `Last ${toString(interval)} reported sargassum`;

  return (
    <Drawer
      classes={{ paper: classes.root }}
      PaperProps={{ elevation: 16 }}
      variant="permanent"
      anchor="bottom"
    >
      <ButtonBase className={classes.paper} disableTouchRipple onClick={onOpen}>
        <Grid container spacing={2}>
          <Grid item xs={2} sm={1}>
            <Chart tiny height={20} interval={interval} {...rest} />
          </Grid>
          <Grid item>
            <Typography color="textSecondary" variant="caption" noWrap>
              {text}
            </Typography>
          </Grid>
        </Grid>
      </ButtonBase>
    </Drawer>
  );
};

export default BottomDrawerToggler;

BottomDrawerToggler.propTypes = propTypes;
