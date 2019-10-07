import React from 'react';
import { node } from 'prop-types';

import { makeStyles } from '@material-ui/styles';
import { Drawer, Grid } from '@material-ui/core';

const propTypes = {
  children: node.isRequired,
};

export const width = 380;

const useStyles = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    width,
  },

  paper: {
    width,
    paddingTop: 72,
    background: theme.palette.grey[100],
    border: 0,
  },

  container: {
    height: '100%',
    width: '100%',
    margin: 0,
    paddingTop: theme.spacing(1) / 2,
    overflowY: 'scroll',
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
      <Grid classes={{ container: classes.container }} container spacing={1}>
        {children}
      </Grid>
    </Drawer>
  );
};

export default LeftDrawer;

LeftDrawer.propTypes = propTypes;
