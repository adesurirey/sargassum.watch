import React from 'react';
import { string } from 'prop-types';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import { Lens } from '@material-ui/icons';

import { humanLevel } from '../utils/propTypes';
import { getLevelStyles } from '../utils/level';

const propTypes = {
  humanLevel,
  size: string,
  className: string,
};

const defaultProps = {
  size: 'small',
  className: null,
};

const useStyles = makeStyles(theme => getLevelStyles(theme, 'color'));

const LegendPoint = ({ humanLevel, size, className }) => {
  const classes = useStyles();

  return (
    <Lens className={clsx(classes[humanLevel], className)} fontSize={size} />
  );
};

export default LegendPoint;

LegendPoint.propTypes = propTypes;
LegendPoint.defaultProps = defaultProps;
