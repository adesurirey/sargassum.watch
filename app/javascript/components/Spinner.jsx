import React from 'react';
import { bool } from 'prop-types';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const propTypes = {
  fullscreen: bool,
};

const defaultProps = {
  fullscreen: false,
};

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.palette.grey[300],
  },

  fullscreen: {
    width: '100vw',
    height: '100vh',
  },
}));

const Spinner = ({ fullscreen }) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, fullscreen && classes.fullscreen)}>
      <CircularProgress color="inherit" />
    </div>
  );
};

export default Spinner;

Spinner.propTypes = propTypes;
Spinner.defaultProps = defaultProps;
