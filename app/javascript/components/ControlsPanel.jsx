import React from 'react';
import { string, oneOfType, arrayOf, node } from 'prop-types';

import { makeStyles } from '@material-ui/styles';
import { Grid, Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
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
  title: string.isRequired,
  children: oneOfType([node, arrayOf(node)]).isRequired,
};

const ControlsPanel = ({ title, children }) => {
  const classes = useStyles();

  return (
    <Grid item xs={12}>
      <Paper className={classes.paper} square elevation={0}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h1" align="center">
              {title}
            </Typography>
          </Grid>

          {children}
        </Grid>
      </Paper>
    </Grid>
  );
};

export default ControlsPanel;

ControlsPanel.propTypes = propTypes;
