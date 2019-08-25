import React from 'react';

import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 400,
    zIndex: theme.zIndex.drawer + 1,
    height: theme.spacing(8),
    padding: theme.spacing(1),
    display: 'flex',
    background: theme.palette.common.white,
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.grey[200],
    fontSize: '1.125rem',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      background: 'transparent',
      borderBottomWidth: 0,
    },
  },
}));

const GeocoderContainer = ({ forwardRef }) => {
  const classes = useStyles();

  return <div ref={forwardRef} className={classes.root} />;
};

export default GeocoderContainer;
