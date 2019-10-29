import React, { useState, useRef, useEffect } from 'react';
import { bool, number } from 'prop-types';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import { CircularProgress, Fade } from '@material-ui/core';

const propTypes = {
  fullscreen: bool,
  delay: number,
};

const defaultProps = {
  fullscreen: false,
  delay: 1000,
};

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.palette.text.disabled,
  },

  fullscreen: {
    width: '100vw',
    height: '100vh',
  },
}));

const Spinner = ({ fullscreen, delay, ...circularProgressProps }) => {
  const [loading, setLoading] = useState(false);
  const timerRef = useRef();
  const classes = useStyles();

  useEffect(
    () => () => {
      clearTimeout(timerRef.current);
    },
    [],
  );

  timerRef.current = setTimeout(() => {
    setLoading(true);
  }, delay);

  return (
    <div className={clsx(classes.root, fullscreen && classes.fullscreen)}>
      <Fade in={loading} unmountOnExit>
        <CircularProgress color="inherit" {...circularProgressProps} />
      </Fade>
    </div>
  );
};

export default Spinner;

Spinner.propTypes = propTypes;
Spinner.defaultProps = defaultProps;
