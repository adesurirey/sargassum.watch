import React from 'react';

import { makeStyles } from '@material-ui/styles';
import { Lens } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    width: 16,
    height: 16,
    marginRight: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.primary.main,
  },

  fixed: {
    position: 'absolute',
    fontSize: 10,
  },

  pulsating: {
    fontSize: 16,
    animation: '$pulsating 2000ms ease-in-out infinite',
  },

  '@keyframes pulsating': {
    '0%': { opacity: 0 },
    '50%': { opacity: 0.2 },
    '100%': { opacity: 0 },
  },
}));

const LiveIcon = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Lens className={classes.pulsating} fontSize="inherit" color="inherit" />
      <Lens className={classes.fixed} fontSize="inherit" color="inherit" />
    </div>
  );
};

export default LiveIcon;
