import React from 'react';

import { makeStyles } from '@material-ui/styles';
import { Fade } from '@material-ui/core';

import Logo from '../images/sargassum-watch-logo.svg';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      height: 'calc(100vh - 36px)',
    },
  },
}));

const SplashScreen = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Fade in appear unmountOnExit>
        <img src={Logo} alt="sargassum.watch logo" width={80} />
      </Fade>
    </div>
  );
};

export default SplashScreen;
