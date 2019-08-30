import React from 'react';
import { string } from 'prop-types';
import { Popup } from 'react-map-gl';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import { Typography, Grid } from '@material-ui/core';
import { AccessTime, Lens } from '@material-ui/icons';

import PopupContainer from './PopupContainer';
import SmartTimeAgo from './SmartTimeAgo';

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(1),
  },
  clear: {
    color: theme.palette.level.clear.main,
  },
  moderate: {
    color: theme.palette.level.moderate.main,
  },
  critical: {
    color: theme.palette.level.critical.main,
  },
}));

const propTypes = {
  name: string.isRequired,
  humanLevel: string.isRequired,
  updatedAt: string.isRequired,
};

const PointPopup = ({ name, updatedAt, humanLevel, ...popupProps }) => {
  const classes = useStyles();

  return (
    <Popup {...popupProps}>
      <PopupContainer>
        <Typography variant="h2" gutterBottom>
          {name}
        </Typography>

        <Grid container alignItems="center">
          <Lens
            className={clsx(classes.icon, classes[humanLevel])}
            fontSize="small"
          />
          <Typography variant="caption" gutterBottom>
            {humanLevel}
          </Typography>
        </Grid>

        <Grid container alignItems="center">
          <AccessTime
            className={classes.icon}
            fontSize="small"
            color="disabled"
          />
          <SmartTimeAgo date={updatedAt} />
        </Grid>
      </PopupContainer>
    </Popup>
  );
};

export default PointPopup;

PointPopup.propTypes = propTypes;
