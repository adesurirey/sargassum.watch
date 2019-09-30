import React from 'react';
import { oneOf, string } from 'prop-types';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import { Lens } from '@material-ui/icons';

import { arrayToObject } from '../utils/root';

const { levels } = gon;

const propTypes = {
  humanLevel: oneOf(['clear', 'moderate', 'na', 'critical']).isRequired,
  size: string,
  className: string,
};

const defaultProps = {
  size: 'small',
  className: null,
};

const useStyles = makeStyles(theme => {
  const colors = arrayToObject(levels, (obj, level) => {
    obj[level.label] = {
      color: theme.palette.level[level.label].main,
    };
  });

  return colors;
});

const LegendPoint = ({ humanLevel, size, className }) => {
  const classes = useStyles();

  return (
    <Lens className={clsx(classes[humanLevel], className)} fontSize={size} />
  );
};

export default LegendPoint;

LegendPoint.propTypes = propTypes;
LegendPoint.defaultProps = defaultProps;
