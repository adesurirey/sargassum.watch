import React from 'react';
import { string } from 'prop-types';
import { Popup } from 'react-map-gl';

import { makeStyles } from '@material-ui/styles';
import { Typography, Grid } from '@material-ui/core';
import { AccessTime } from '@material-ui/icons';

import Tooltip from './Tooltip';
import SmartTimeAgo from './SmartTimeAgo';

const useStyles = makeStyles(theme => ({
  root: {
    width: 160,
  },
  gutterBottom: {
    marginBottom: '0.35em',
  },
  icon: {
    marginRight: theme.spacing(1),
  },
}));

const propTypes = {
  name: string.isRequired,
  updatedAt: string.isRequired,
};

const PointPopup = ({ name, updatedAt, ...popupProps }) => {
  const classes = useStyles();

  return (
    <Popup {...popupProps} closeButton={false} closeOnClick>
      <Tooltip className={classes.root} title={name}>
        <Grid container alignItems="center">
          <AccessTime
            className={classes.icon}
            fontSize="small"
            color="disabled"
          />
          <Typography variant="caption">
            <SmartTimeAgo date={updatedAt} />
          </Typography>
        </Grid>
      </Tooltip>
    </Popup>
  );
};

export default PointPopup;

PointPopup.propTypes = propTypes;
