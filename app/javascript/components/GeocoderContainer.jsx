import React, { forwardRef, memo } from 'react';

import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 380,
    height: theme.spacing(8),
    zIndex: theme.zIndex.drawer + 1,
    padding: theme.spacing(1),
    display: 'flex',
    background: theme.palette.common.white,
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.grey[100],
    fontSize: theme.typography.h1.fontSize,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      background: 'transparent',
      borderBottomWidth: 0,
    },
  },
}));

const GeocoderContainer = forwardRef((_, ref) => {
  const classes = useStyles();

  return <div ref={ref} className={classes.root} />;
});

export default memo(GeocoderContainer, () => true);
