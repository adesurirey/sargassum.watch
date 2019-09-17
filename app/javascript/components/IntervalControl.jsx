import React from 'react';
import { func, bool } from 'prop-types';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { Button } from '@material-ui/core';

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
    transition: theme.transitions.create(['background', 'fontWeight'], {
      duration: theme.transitions.duration.short,
    }),
    '&:hover': {
      background: fade(
        theme.palette.text.primary,
        theme.palette.action.hoverOpacity / 2,
      ),
    },
  },
  active: {
    background: theme.palette.action.hover,
    fontWeight: 600,
    '&:hover': {
      background: theme.palette.action.hover,
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
