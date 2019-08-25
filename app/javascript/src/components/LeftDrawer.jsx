import React from 'react';
import { node } from 'prop-types';

import { makeStyles } from '@material-ui/styles';
import { Drawer, Grid } from '@material-ui/core';

const propTypes = {
  children: node.isRequired,
};

const width = 400;

const useStyles = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    width,
  },

  paper: {
    width,
    paddingTop: theme.spacing(8),
    background: theme.palette.grey[100],
    border: 0,
  },

  container: {
    flex: 1,
  },
}));

const LeftDrawer = ({ children }) => {
  const classes = useStyles();

  return (
    <Drawer
      className={classes.root}
      classes={{ paper: classes.paper }}
      PaperProps={{ elevation: 4 }}
      anchor="left"
      variant="permanent"
    >
      <Grid
        className={classes.container}
        container
        direction="column"
        alignItems="center"
      >
        <Grid item>{children}</Grid>
      </Grid>
    </Drawer>
  );
};

export default LeftDrawer;

LeftDrawer.propTypes = propTypes;
