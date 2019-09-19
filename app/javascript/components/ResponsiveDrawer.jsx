import React from 'react';
import { node, object } from 'prop-types';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import LeftDrawer from './LeftDrawer';
import BottomDrawer from './BottomDrawer';

const propTypes = {
  children: node.isRequired,
  chartProps: object.isRequired,
};

const ResponsiveDrawer = ({ children, chartProps, ...bottomDrawerProps }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));

  return matches ? (
    <BottomDrawer chartProps={chartProps} {...bottomDrawerProps}>
      {children}
    </BottomDrawer>
  ) : (
    <LeftDrawer>{children}</LeftDrawer>
  );
};

export default ResponsiveDrawer;

ResponsiveDrawer.propTypes = propTypes;
