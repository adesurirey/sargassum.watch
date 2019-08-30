import React from 'react';
import { node, shape, func } from 'prop-types';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import LeftDrawer from './LeftDrawer';
import BottomDrawer from './BottomDrawer';

const propTypes = {
  children: node.isRequired,
  bottomDrawerProps: shape({
    offsetMap: func.isRequired,
  }).isRequired,
};

const ResponsiveDrawer = ({ children, bottomDrawerProps }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));

  return matches ? (
    <BottomDrawer {...bottomDrawerProps}>{children}</BottomDrawer>
  ) : (
    <LeftDrawer>{children}</LeftDrawer>
  );
};

export default ResponsiveDrawer;

ResponsiveDrawer.propTypes = propTypes;
