import React from 'react';
import { func } from 'prop-types';

import { makeStyles } from '@material-ui/styles';
import { Drawer, ButtonBase, Grid, Typography } from '@material-ui/core';
import { ExpandLess } from '@material-ui/icons';

const propTypes = {
  onOpen: func.isRequired,
};

const height = 40;

const useStyles = makeStyles(theme => ({
  root: {
    height,
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
      PaperProps={{ elevation: 16 }}
      variant="permanent"
      anchor="bottom"
    >
      <ButtonBase className={classes.paper} disableTouchRipple onClick={onOpen}>
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
      </ButtonBase>
    </Drawer>
  );
};

export default BottomDrawerToggler;

BottomDrawerToggler.propTypes = propTypes;
