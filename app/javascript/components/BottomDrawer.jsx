import React, { useState } from 'react';
import { node, object } from 'prop-types';

import BottomDrawerToggler from './BottomDrawerToggler';
import BottomDrawerToggled from './BottomDrawerToggled';

const propTypes = {
  children: node.isRequired,
  chartProps: object.isRequired,
};

const BottomDrawer = ({ children, chartProps }) => {
  const [isOpen, setOpen] = useState(false);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  return (
    <>
      <BottomDrawerToggler onOpen={onOpen} chartProps={chartProps} />

      <BottomDrawerToggled
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        children={children}
      />
    </>
  );
};

export default BottomDrawer;

BottomDrawer.propTypes = propTypes;
