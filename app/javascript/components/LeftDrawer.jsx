import React from 'react';
import { node } from 'prop-types';

import { makeStyles } from '@material-ui/styles';
import { Drawer } from '@material-ui/core';

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
    width: '100%',
    height: '100%',
    paddingTop: theme.spacing(1) / 2,
    overflowY: 'scroll',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
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
      <div className={classes.container}>{children}</div>
    </Drawer>
  );
};

export default LeftDrawer;

LeftDrawer.propTypes = propTypes;
