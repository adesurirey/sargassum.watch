import React, { useState } from 'react';
import { node, func } from 'prop-types';

import { makeStyles } from '@material-ui/styles';
import { SwipeableDrawer } from '@material-ui/core';

import BottomDrawerToggler from './BottomDrawerToggler';

const height = 400;
const onOpenMapOffset = -height / 2;
const onCloseMapOffset = -onOpenMapOffset / 26;

const useStyles = makeStyles({
  paper: { height },
});

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
        open={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      >
        {children}
      </SwipeableDrawer>
    </>
  );
};

export default BottomDrawer;

BottomDrawer.propTypes = propTypes;
BottomDrawer.defaultProps = defaultProps;
