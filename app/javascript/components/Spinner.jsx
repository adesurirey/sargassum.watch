import React from 'react';
import { oneOf, number, string } from 'prop-types';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import { Fade } from '@material-ui/core';

import useDelayedLoading from '../hooks/useDelayedLoading';
import LocalErrorBoundary from './LocalErrorBoundary';

const propTypes = {
  delay: number,
  variant: oneOf(['small', 'medium', 'large']),
  containerClassName: string,
};

const defaultProps = {
  delay: 1000,
  variant: 'large',
  containerClassName: null,
};

const SIZE = 44;
const THIKENESS = 3.6;

const sizes = {
  small: 16,
  medium: 24,
  large: 62,
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
    animation: '$circular-rotate 500ms linear infinite',
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

const Spinner = ({ delay, variant, containerClassName }) => {
  const loading = useDelayedLoading(delay);
  const classes = useStyles();

  const size = sizes[variant];

  const circleProps = {
    cx: SIZE,
    cy: SIZE,
    r: (SIZE - THIKENESS) / 2,
    fill: 'none',
    strokeWidth: THIKENESS,
  };

  return (
    <LocalErrorBoundary>
      <div className={clsx(classes.container, containerClassName)}>
        <Fade in={loading}>
          <div
            className={classes.root}
            style={{ width: size, height: size }}
            role="progressbar"
          >
            <svg
              className={classes.svg}
              viewBox={`${SIZE / 2} ${SIZE / 2} ${SIZE} ${SIZE}`}
            >
              <circle className={classes.circle} {...circleProps} />
              <circle className={classes.dash} {...circleProps} />
            </svg>
          </div>
        </Fade>
      </div>
    </LocalErrorBoundary>
  );
};

export default Spinner;

Spinner.propTypes = propTypes;
Spinner.defaultProps = defaultProps;
