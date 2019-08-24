import React, { useState } from 'react';
import { node } from 'prop-types';

import { SwipeableDrawer } from '@material-ui/core';

import BottomDrawerToggler from './BottomDrawerToggler';

const propTypes = {
  children: node,
};

const BottomDrawer = ({ children }) => {
  const [isOpen, setOpen] = useState(false);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  return (
    <>
      <BottomDrawerToggler onOpen={onOpen} />

      <SwipeableDrawer
        open={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        anchor="bottom"
        ModalProps={{
          BackdropProps: {
            invisible: true,
          },
        }}
      >
        {children}
      </SwipeableDrawer>
    </>
  );
};

export default BottomDrawer;

BottomDrawer.propTypes = propTypes;
