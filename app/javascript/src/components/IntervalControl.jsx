import React from 'react';
import { func, number, oneOf, bool } from 'prop-types';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';
import { fade } from '@material-ui/core/styles/colorManipulator';

const propTypes = {
  value: number.isRequired,
  unit: oneOf(['day', 'month']).isRequired,
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

const IntervalControl = ({ value, unit, active, onClick }) => {
  const classes = useStyles();

  const label = `${value} ${unit}${value > 1 && 's'}`;

  return (
    <Button
      className={clsx(classes.root, active && classes.active)}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

export default IntervalControl;

IntervalControl.propTypes = propTypes;
IntervalControl.defaultProps = defaultProps;
