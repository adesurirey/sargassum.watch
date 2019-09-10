import React from 'react';
import { func, bool } from 'prop-types';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';
import { fade } from '@material-ui/core/styles/colorManipulator';

import { toString } from '../utils/interval';
import { interval } from '../utils/propTypes';

const propTypes = {
  interval,
  active: bool,
  onClick: func.isRequired,
};

const defaultProps = {
  active: false,
};

const useStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.text.primary,
    '&:hover': {
      background: 'transparent',
    },
  },
  active: {
    background: fade(
      theme.palette.text.primary,
      theme.palette.action.hoverOpacity,
    ),
    '&:hover': {
      background: fade(
        theme.palette.text.primary,
        theme.palette.action.hoverOpacity,
      ),
    },
  },
}));

const IntervalControl = ({ interval, active, onClick }) => {
  const classes = useStyles();

  const handleClick = () => onClick(interval);

  return (
    <Button
      aria-pressed={active}
      className={clsx(classes.root, active && classes.active)}
      onClick={handleClick}
    >
      {toString(interval)}
    </Button>
  );
};

export default IntervalControl;

IntervalControl.propTypes = propTypes;
IntervalControl.defaultProps = defaultProps;
