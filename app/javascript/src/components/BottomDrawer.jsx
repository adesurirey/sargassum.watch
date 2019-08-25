import React, { useState } from 'react';
import { node, func } from 'prop-types';

import { makeStyles } from '@material-ui/styles';
import { SwipeableDrawer, Grid } from '@material-ui/core';
import { MaximizeRounded } from '@material-ui/icons';

import BottomDrawerToggler from './BottomDrawerToggler';

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

const height = 400;
const onOpenMapOffset = -height / 2;
const onCloseMapOffset = -onOpenMapOffset / 26;

const useStyles = makeStyles(theme => ({
  paper: {
    height,
    background: theme.palette.grey[100],
  },
  icon: {
    marginBottom: -theme.spacing(3),
  },
  iconContainer: {
    paddingTop: theme.spacing(1),
    background: theme.palette.common.white,
  },
}));

const propTypes = {
  children: node.isRequired,
  offsetMap: func,
};

const defaultProps = {
  offsetMap: () => null,
};

const BottomDrawer = ({ children, offsetMap }) => {
  const classes = useStyles();
  const [isOpen, setOpen] = useState(false);

  const onOpen = () => {
    setOpen(true);
    offsetMap(onOpenMapOffset);
  };

  const onClose = () => {
    setOpen(false);
    offsetMap(onCloseMapOffset);
  };

  return (
    <>
      <BottomDrawerToggler onOpen={onOpen} />

      <SwipeableDrawer
        classes={{
          paper: classes.paper,
        }}
        anchor="bottom"
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        ModalProps={{
          BackdropProps: {
            invisible: true,
          },
        }}
        PaperProps={{ square: false }}
        open={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      >
        <Grid container spacing={1} direction="column" alignItems="center">
          <Grid
            className={classes.iconContainer}
            container
            spacing={1}
            justify="center"
          >
            <Grid item>
              <MaximizeRounded
                className={classes.icon}
                color="disabled"
                fontSize="large"
              />
            </Grid>
          </Grid>
          <Grid item>{children}</Grid>
        </Grid>
      </SwipeableDrawer>
    </>
  );
};

export default BottomDrawer;

BottomDrawer.propTypes = propTypes;
BottomDrawer.defaultProps = defaultProps;
