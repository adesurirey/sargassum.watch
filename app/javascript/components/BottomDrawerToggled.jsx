import React, { memo } from 'react';
import { bool, func, node } from 'prop-types';

import { makeStyles } from '@material-ui/styles';
import { SwipeableDrawer, Grid } from '@material-ui/core';
import { MaximizeRounded } from '@material-ui/icons';

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

const propTypes = {
  isOpen: bool.isRequired,
  onOpen: func.isRequired,
  onClose: func.isRequired,
  children: node.isRequired,
};

const useStyles = makeStyles(theme => ({
  paper: {
    background: theme.palette.grey[100],
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  iconContainer: {
    marginBottom: -theme.spacing(2),
    zIndex: 2,
    background: theme.palette.background.paper,
    textAlign: 'center',
  },

  icon: {
    marginBottom: -theme.spacing(3),
  },

  container: {
    height: '100%',
    width: '100%',
    margin: 0,
  },
}));

const BottomDrawerToggled = ({ isOpen, onOpen, onClose, children }) => {
  const classes = useStyles();

  return (
    <SwipeableDrawer
      classes={{
        paper: classes.paper,
      }}
      anchor="bottom"
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      ModalProps={{
        keepMounted: true,
        BackdropProps: {
          invisible: true,
        },
      }}
      PaperProps={{ square: false }}
      open={isOpen}
      onOpen={onOpen}
      onClose={onClose}
    >
      <Grid classes={{ container: classes.container }} container spacing={1}>
        <Grid className={classes.iconContainer} item xs={12}>
          <MaximizeRounded
            className={classes.icon}
            color="disabled"
            fontSize="large"
          />
        </Grid>
        <Grid classes={{ container: classes.container }} container spacing={1}>
          {children}
        </Grid>
      </Grid>
    </SwipeableDrawer>
  );
};

const isEqual = (prevProps, nextProps) => {
  return !prevProps.isOpen && !nextProps.isOpen;
};

export default memo(BottomDrawerToggled, isEqual);

BottomDrawerToggled.propTypes = propTypes;
