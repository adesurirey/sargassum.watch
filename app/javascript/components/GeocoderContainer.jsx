import React, { forwardRef, memo } from 'react';
import { makeStyles } from '@material-ui/styles';

import Logo from './Logo';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 380,
    zIndex: theme.zIndex.drawer + 1,
    padding: theme.spacing(2),
    display: 'flex',
    background: theme.palette.common.white,
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.grey[100],
    fontSize: theme.typography.h1.fontSize,
    [theme.breakpoints.down('sm')]: {
      height: theme.spacing(8),
      width: '100%',
      padding: theme.spacing(1),
      background: 'transparent',
      borderBottomWidth: 0,
    },
  },

  logoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    paddingLeft: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    zIndex: theme.zIndex.drawer + 2,
  },
}));

const GeocoderContainer = forwardRef((_, ref) => {
  const classes = useStyles();

  return (
    <div ref={ref} className={classes.root}>
      <div className={classes.logoContainer}>
        <Logo />
      </div>
    </div>
  );
});

export default memo(GeocoderContainer, () => true);
