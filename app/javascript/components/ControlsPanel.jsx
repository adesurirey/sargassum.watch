import React from 'react';
import { string, oneOfType, arrayOf, node } from 'prop-types';

import { makeStyles } from '@material-ui/styles';
import { Grid, Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  item: {
    '&:last-of-type': {
      paddingBottom: 0,
      alignSelf: 'flex-end',
    },
  },

  paper: {
    padding: theme.spacing(2),
    borderTopStyle: 'solid',
    borderBottomStyle: 'solid',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: theme.palette.grey[100],
    borderBottomColor: theme.palette.grey[100],
  },
}));

const propTypes = {
  title: string,
  children: oneOfType([node, arrayOf(node)]).isRequired,
};

const defaultProps = {
  title: null,
};

const ControlsPanel = ({ title, children }) => {
  const classes = useStyles();

  return (
    <Grid item classes={{ item: classes.item }} xs={12}>
      <Paper classes={{ root: classes.paper }} square elevation={0}>
        <Grid container spacing={2}>
          {title && (
            <Grid item xs={12}>
              <Typography variant="h1" align="center">
                {title}
              </Typography>
            </Grid>
          )}

          {children}
        </Grid>
      </Paper>
    </Grid>
  );
};

export default ControlsPanel;

ControlsPanel.propTypes = propTypes;
ControlsPanel.defaultProps = defaultProps;
