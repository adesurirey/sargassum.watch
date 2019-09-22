import React, { memo } from 'react';
import { string } from 'prop-types';
import { Popup } from 'react-map-gl';

import { makeStyles } from '@material-ui/styles';
import { Typography, Grid } from '@material-ui/core';
import { AccessTime } from '@material-ui/icons';

import Tooltip from './Tooltip';
import SmartTimeAgo from './SmartTimeAgo';

const propTypes = {
  name: string.isRequired,
  updatedAt: string.isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 200,
    cursor: 'default',
  },
  gutterBottom: {
    marginBottom: '0.35em',
  },
  icon: {
    marginRight: theme.spacing(1),
  },
}));

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
          <Typography variant="caption" noWrap>
            <SmartTimeAgo date={updatedAt} />
          </Typography>
        </Grid>
      </Tooltip>
    </Popup>
  );
};

export default memo(PointPopup);

PointPopup.propTypes = propTypes;
