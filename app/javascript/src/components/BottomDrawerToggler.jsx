import React from 'react';
import { func } from 'prop-types';

import { makeStyles } from '@material-ui/styles';
import { Drawer, Grid, Typography } from '@material-ui/core';
import { ExpandLess } from '@material-ui/icons';

const propTypes = {
  onOpen: func.isRequired,
};

const height = 40;

const useStyles = makeStyles(theme => ({
  root: {
    height,
    cursor: 'pointer',
  },
  paper: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    border: 0,
  },
}));

const BottomDrawerToggler = ({ onOpen }) => {
  const classes = useStyles();

  return (
    <Drawer
      className={classes.root}
      classes={{ paper: classes.paper }}
      PaperProps={{ elevation: 16 }}
      variant="permanent"
      anchor="bottom"
      onClick={onOpen}
    >
      <Grid container spacing={2}>
        <Grid item>
          <ExpandLess color="action" fontSize="small" />
        </Grid>
        <Grid item>
          <Typography color="textSecondary" variant="caption" noWrap>
            Press to display filters
          </Typography>
        </Grid>
      </Grid>
    </Drawer>
  );
};

export default BottomDrawerToggler;

BottomDrawerToggler.propTypes = propTypes;
