import React from 'react';
import { string } from 'prop-types';
import { Popup } from 'react-map-gl';

import { makeStyles } from '@material-ui/styles';
import { Typography, Grid } from '@material-ui/core';
import { AccessTime } from '@material-ui/icons';

import PopupContainer from './PopupContainer';
import LegendPoint from './LegendPoint';
import SmartTimeAgo from './SmartTimeAgo';

const useStyles = makeStyles(theme => ({
  gutterBottom: {
    marginBottom: '0.35em',
  },
  icon: {
    marginRight: theme.spacing(1),
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
        <Typography variant="h3" gutterBottom>
          {name}
        </Typography>

        <Grid container alignItems="center" className={classes.gutterBottom}>
          <LegendPoint humanLevel={humanLevel} className={classes.icon} />
          <Typography variant="caption">{humanLevel}</Typography>
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
