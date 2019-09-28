import React from 'react';
import { node } from 'prop-types';

import { makeStyles } from '@material-ui/styles';
import { Drawer, Grid } from '@material-ui/core';

const propTypes = {
  children: node.isRequired,
};

const width = 380;

const useStyles = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    width,
  },

  paper: {
    width,
    paddingTop: 72,
    background: theme.palette.grey[50],
    border: 0,
  },

  container: {
    height: '100%',
    marginTop: theme.spacing(1) / 2,
    marginBottom: 0,
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
