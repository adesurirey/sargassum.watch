import React from 'react';
import { oneOf, string } from 'prop-types';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import { Lens } from '@material-ui/icons';

const propTypes = {
  humanLevel: oneOf(['clear', 'moderate', 'critical']).isRequired,
  size: string,
  className: string,
};

const defaultProps = {
  size: 'small',
  className: null,
};

const useStyles = makeStyles(theme => ({
  clear: {
    color: theme.palette.level.clear.main,
  },
  moderate: {
    color: theme.palette.level.moderate.main,
  },
  critical: {
    color: theme.palette.level.critical.main,
  },
}));

const LegendPoint = ({ humanLevel, size, className }) => {
  const classes = useStyles();

  return (
    <Lens className={clsx(classes[humanLevel], className)} fontSize={size} />
  );
};

export default LegendPoint;

LegendPoint.propTypes = propTypes;
LegendPoint.defaultProps = defaultProps;
