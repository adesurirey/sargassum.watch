import React from 'react';
import { node } from 'prop-types';

import { makeStyles } from '@material-ui/styles';
import { Drawer } from '@material-ui/core';

const propTypes = {
  children: node,
};

const width = 240;

const useStyles = makeStyles({
  root: {
    flexShrink: 0,
    width,
  },

  paper: {
    width,
  },
});

const SideDrawer = ({ children }) => {
  const classes = useStyles();

  return (
    <Drawer
      className={classes.root}
      classes={{ paper: classes.paper }}
      anchor="left"
      variant="permanent"
    >
      {children}
    </Drawer>
  );
};

export default SideDrawer;

SideDrawer.propTypes = propTypes;
