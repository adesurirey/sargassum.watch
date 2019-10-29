import React, { useState, useRef, useEffect } from 'react';
import { oneOf, number } from 'prop-types';

import { makeStyles } from '@material-ui/styles';
import { Fade } from '@material-ui/core';

const propTypes = {
  delay: number,
  variant: oneOf(['small', 'large']),
};

const defaultProps = {
  delay: 1000,
  variant: 'large',
};

const SIZE = 44;
const THIKENESS = 3.6;

const sizes = {
  small: 16,
  large: 50,
};

const useStyles = makeStyles(theme => ({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    maxHeight: '100vh', // Fix fullheight positionning on mobile browsers
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.palette.action.disabled,
    zIndex: 1,
  },

  root: {
    display: 'inline-block',
    animation: '$circular-rotate 1s linear infinite',
  },

  svg: {
    display: 'block',
  },

  circle: {
    stroke: 'currentColor',
  },

  dash: {
    stroke: theme.palette.text.primary,
    strokeDasharray: '35px, 200px',
    strokeDashoffset: '0px', // Add the unit to fix a Edge 16 and below bug.
  },

  '@keyframes circular-rotate': {
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
}));

const Spinner = ({ delay, variant }) => {
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

  const size = sizes[variant];

  return (
    <div className={classes.container}>
      <Fade in={loading} unmountOnExit>
        <div
          className={classes.root}
          style={{ width: size, height: size }}
          role="progressbar"
        >
          <svg
            className={classes.svg}
            viewBox={`${SIZE / 2} ${SIZE / 2} ${SIZE} ${SIZE}`}
          >
            <circle
              className={classes.circle}
              cx={SIZE}
              cy={SIZE}
              r={(SIZE - THIKENESS) / 2}
              fill="none"
              strokeWidth={THIKENESS}
            />
            <circle
              className={classes.dash}
              cx={SIZE}
              cy={SIZE}
              r={(SIZE - THIKENESS) / 2}
              fill="none"
              strokeWidth={THIKENESS}
            />
          </svg>
        </div>
      </Fade>
    </div>
  );
};

export default Spinner;

Spinner.propTypes = propTypes;
Spinner.defaultProps = defaultProps;
