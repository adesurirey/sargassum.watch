import React from 'react';
import { func } from 'prop-types';

import { makeStyles } from '@material-ui/styles';
import { Drawer } from '@material-ui/core';

const propTypes = {
  onOpen: func.isRequired,
};

const height = 40;

const useStyles = makeStyles({
  root: { height },
  paper: { height },
});

const BottomDrawerToggler = ({ onOpen }) => {
  const classes = useStyles();

  return (
    <Drawer
      className={classes.root}
      classes={{ paper: classes.paper }}
      variant="permanent"
      anchor="bottom"
      onClick={onOpen}
    >
      Press to display filters
    </Drawer>
  );
};

export default BottomDrawerToggler;

BottomDrawerToggler.propTypes = propTypes;
