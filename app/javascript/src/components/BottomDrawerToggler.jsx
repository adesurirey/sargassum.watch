import React from 'react';
import { func, object } from 'prop-types';

import { makeStyles } from '@material-ui/styles';
import { Drawer, ButtonBase, Grid, Typography } from '@material-ui/core';

import Chart from './Chart';

const propTypes = {
  onOpen: func.isRequired,
  chartProps: object.isRequired,
};

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(1),
    border: 0,
  },
}));

const BottomDrawerToggler = ({ onOpen, chartProps }) => {
  const classes = useStyles();

  return (
    <Drawer PaperProps={{ elevation: 16 }} variant="permanent" anchor="bottom">
      <ButtonBase className={classes.paper} disableTouchRipple onClick={onOpen}>
        <Grid container spacing={2}>
          <Grid item xs={2} sm={1}>
            <Chart tiny height={20} {...chartProps} />
          </Grid>
          <Grid item>
            <Typography color="textSecondary" variant="caption" noWrap>
              Tap to see evolution over time
            </Typography>
          </Grid>
        </Grid>
      </ButtonBase>
    </Drawer>
  );
};

export default BottomDrawerToggler;

BottomDrawerToggler.propTypes = propTypes;
