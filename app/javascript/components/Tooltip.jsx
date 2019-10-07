import React from 'react';
import { oneOfType, string, node, bool } from 'prop-types';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { Card, CardContent, Typography } from '@material-ui/core';

const propTypes = {
  title: oneOfType([string, node]),
  children: node.isRequired,
  className: string,
  compact: bool,
};

const defaultProps = {
  title: null,
  className: null,
  compact: false,
};

const useStyles = makeStyles(theme => ({
  root: {
    background: fade(theme.palette.background.paper, 0.9),
  },
  content: {
    padding: compact => (compact ? 0 : theme.spacing(1)),
    '&:last-child': {
      paddingBottom: compact => (compact ? 0 : theme.spacing(1)),
    },
  },
  header: {
    padding: theme.spacing(1),
    background: theme.palette.action.hover,
  },
}));

const Tooltip = ({ title, children, className, compact }) => {
  const classes = useStyles(compact);

  return (
    <Card className={clsx(classes.root, className)}>
      {title && (
        <CardContent className={classes.header}>
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
