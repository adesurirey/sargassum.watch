import React from 'react';
import { oneOfType, string, node } from 'prop-types';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { Card, CardContent, Typography } from '@material-ui/core';

const propTypes = {
  title: oneOfType([string, node]),
  children: node.isRequired,
  className: string,
};

const defaultProps = {
  title: null,
  className: null,
};

const useStyles = makeStyles(theme => ({
  root: {
    background: fade(theme.palette.common.white, 0.9),
  },
  content: {
    padding: theme.spacing(1),
    '&:last-child': {
      paddingBottom: theme.spacing(1),
    },
  },
  header: {
    background: theme.palette.action.hover,
  },
}));

const Tooltip = ({ title, children, className }) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)}>
      {title && (
        <CardContent className={clsx(classes.content, classes.header)}>
          <Typography variant="h3">{title}</Typography>
        </CardContent>
      )}

      <CardContent className={classes.content}>{children}</CardContent>
    </Card>
  );
};

export default Tooltip;

Tooltip.propTypes = propTypes;
Tooltip.defaultProps = defaultProps;
