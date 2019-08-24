import React, { useState } from 'react';
import { node, func } from 'prop-types';

import { makeStyles } from '@material-ui/styles';
import { SwipeableDrawer, Grid } from '@material-ui/core';
import { MaximizeRounded } from '@material-ui/icons';

import BottomDrawerToggler from './BottomDrawerToggler';

const height = 400;
const onOpenMapOffset = -height / 2;
const onCloseMapOffset = -onOpenMapOffset / 26;

const useStyles = makeStyles(theme => ({
  paper: {
    height,
    padding: theme.spacing(1),
  },

  icon: {
    marginBottom: -theme.spacing(3),
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
          <MaximizeRounded
            className={classes.icon}
            color="disabled"
            fontSize="large"
          />
          <Grid item>{children}</Grid>
        </Grid>
      </SwipeableDrawer>
    </>
  );
};

export default BottomDrawer;

BottomDrawer.propTypes = propTypes;
BottomDrawer.defaultProps = defaultProps;
