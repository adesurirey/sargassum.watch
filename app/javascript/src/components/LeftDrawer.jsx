import React from 'react';
import { node } from 'prop-types';

import { makeStyles } from '@material-ui/styles';
import { Drawer, Grid } from '@material-ui/core';

const propTypes = {
  children: node.isRequired,
};

const width = 400;

const useStyles = makeStyles({
  root: {
    flexShrink: 0,
    width,
  },

  paper: {
    width,
    border: 0,
  },
});

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
      <Grid container direction="column" alignItems="center">
        <Grid item>{children}</Grid>
      </Grid>
    </Drawer>
  );
};

export default LeftDrawer;

LeftDrawer.propTypes = propTypes;
