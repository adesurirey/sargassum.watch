import React from 'react';
import { func, shape } from 'prop-types';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/styles';
import { Drawer, ButtonBase, Grid, Typography } from '@material-ui/core';

import Chart from './Chart';
import { toString } from '../utils/interval';
import { interval } from '../utils/propTypes';

const propTypes = {
  onOpen: func.isRequired,
  chartProps: shape({ interval }).isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
    border: 0,
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

const BottomDrawerToggler = ({
  onOpen,
  chartProps,
  chartProps: { interval },
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const text = t(`Last ${toString(interval)} beaches status`);

  return (
    <Drawer
      classes={{ paper: classes.root }}
      PaperProps={{ elevation: 16 }}
      variant="permanent"
      anchor="bottom"
    >
      <ButtonBase className={classes.paper} disableTouchRipple onClick={onOpen}>
        <Grid container spacing={2}>
          <Grid item xs={2} sm={1}>
            <Chart tiny height={20} {...chartProps} />
          </Grid>
          <Grid item>
            <Typography color="textSecondary" variant="caption" noWrap>
              {text}
            </Typography>
          </Grid>
        </Grid>
      </ButtonBase>
    </Drawer>
  );
};

export default BottomDrawerToggler;

BottomDrawerToggler.propTypes = propTypes;
