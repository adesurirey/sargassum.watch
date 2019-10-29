import React from 'react';
import { string, object, oneOfType, arrayOf, node } from 'prop-types';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import { Grid, Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    '&:last-of-type': {
      paddingBottom: 0,
    },
  },

  paper: {
    position: 'relative',
    height: '100%',
    padding: theme.spacing(2),
    borderTopStyle: 'solid',
    borderBottomStyle: 'solid',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: theme.palette.grey[200],
    borderBottomColor: theme.palette.grey[200],
  },
}));

const propTypes = {
  className: string,
  title: string,
  titleProps: object,
  children: oneOfType([node, arrayOf(node)]).isRequired,
};

const defaultProps = {
  className: {},
  title: null,
  titleProps: {},
};

const ControlsPanel = ({
  className,
  title,
  titleProps,
  children,
  ...gridProps
}) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)}>
      <Paper classes={{ root: classes.paper }} square elevation={0}>
        <Grid
          container
          alignItems="center"
          justify="space-between"
          spacing={2}
          {...gridProps}
        >
          {title && (
            <Grid item xs={12}>
              <Typography variant="h1" align="center" {...titleProps}>
                {title}
              </Typography>
            </Grid>
          )}

          {children}
        </Grid>
      </Paper>
    </div>
  );
};

export default ControlsPanel;

ControlsPanel.propTypes = propTypes;
ControlsPanel.defaultProps = defaultProps;
