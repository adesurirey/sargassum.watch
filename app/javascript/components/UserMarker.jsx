import React from 'react';
import { Marker } from 'react-map-gl';

import { makeStyles } from '@material-ui/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { Lens } from '@material-ui/icons';

const size = 60;

const useStyles = makeStyles(theme => ({
  root: {
    height: size,
    width: size,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: fade(theme.palette.primary.main, 0.1),
    borderRadius: '50%',
    lineHeight: 0,
  },
}));

const UserMarker = props => {
  const classes = useStyles();

  return (
    <Marker offsetLeft={-size / 2} offsetTop={-size / 2} {...props}>
      <div className={classes.root}>
        <Lens color="primary" fontSize="small" />
      </div>
    </Marker>
  );
};

export default UserMarker;
