import React from 'react';
// import {} from 'prop-types';

import { makeStyles } from '@material-ui/styles';
import { Grid, Paper, Typography } from '@material-ui/core';

import ResponsiveDrawer from './ResponsiveDrawer';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    borderTopStyle: 'solid',
    borderBottomStyle: 'solid',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: theme.palette.grey[200],
    borderBottomColor: theme.palette.grey[200],
  },
}));

const propTypes = {};

const Controls = ({ ...bottomDrawerProps }) => {
  const classes = useStyles();

  return (
    <ResponsiveDrawer bottomDrawerProps={bottomDrawerProps}>
      <Grid item xs={12}>
        <Paper className={classes.paper} square elevation={0}>
          <Grid container spacing={1}>
            <Grid component={Grid} item xs={12}>
              <Typography variant="h1" align="center">
                Sargassum monitoring
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </ResponsiveDrawer>
  );
};

export default Controls;

Controls.propTypes = propTypes;
