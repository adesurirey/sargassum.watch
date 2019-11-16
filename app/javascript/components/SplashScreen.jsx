import React from 'react';

import { makeStyles } from '@material-ui/styles';
import { Fade } from '@material-ui/core';

import useDelayedLoading from '../hooks/useDelayedLoading';
import LocalErrorBoundary from './LocalErrorBoundary';
import Logo from '../images/sargassum-watch-logo.svg';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const SplashScreen = () => {
  const loading = useDelayedLoading(200);
  const classes = useStyles();

  return (
    <LocalErrorBoundary>
      <div className={classes.root}>
        <Fade in={loading}>
          <img src={Logo} alt="sargassum.watch logo" width={80} />
        </Fade>
      </div>
    </LocalErrorBoundary>
  );
};

export default SplashScreen;
