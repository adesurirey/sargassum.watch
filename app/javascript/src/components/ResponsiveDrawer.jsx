import React from 'react';
import { node } from 'prop-types';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import SideDrawer from './SideDrawer';
import BottomDrawer from './BottomDrawer';

const propTypes = {
  children: node,
};

const ResponsiveDrawer = ({ children }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));

  return matches ? (
    <BottomDrawer>{children}</BottomDrawer>
  ) : (
    <SideDrawer>{children}</SideDrawer>
  );
};

export default ResponsiveDrawer;

ResponsiveDrawer.propTypes = propTypes;
