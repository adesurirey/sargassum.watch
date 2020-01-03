import React from 'react';
import { NavigationControl } from 'react-map-gl';

import { makeStyles } from '@material-ui/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const ZoomControl = () => {
  const theme = useTheme();
  const isWideScreen = useMediaQuery(theme.breakpoints.up('md'));
  const classes = useStyles();

  return (
    isWideScreen && (
      <div className={classes.root}>
        <NavigationControl showCompass={false} />
      </div>
    )
  );
};

export default ZoomControl;
