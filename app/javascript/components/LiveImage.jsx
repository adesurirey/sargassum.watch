import React, { useState, useEffect } from 'react';
import { string, bool, func } from 'prop-types';

import { makeStyles } from '@material-ui/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { CardMedia } from '@material-ui/core';

import useException from '../hooks/useException';
import Spinner from './Spinner';
import FullscreenControl from './FullscreenControl';

const propTypes = {
  url: string.isRequired,
  isFullScreen: bool,
  onFullScreen: func.isRequired,
};

const defaultProps = {
  isFullScreen: false,
};

const useStyles = makeStyles(theme => ({
  media: {
    display: ({ loaded }) => (loaded ? 'block' : 'none'),
  },

  control: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    margin: ({ isFullScreen }) =>
      isFullScreen ? theme.spacing(2) : theme.spacing(1),
    transition: theme.transitions.create(['margin']),
    color: theme.palette.common.white,
    zIndex: 1,
    '&:hover': {
      backgroundColor: fade(
        theme.palette.common.white,
        theme.palette.action.hoverOpacity,
      ),
    },
  },
}));

const LiveImage = ({ url, isFullScreen, onFullScreen }) => {
  const [timestamp, setTimestamp] = useState(Date.now());
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const logException = useException();

  const classes = useStyles({ loaded, isFullScreen });

  const tick = () => {
    setTimestamp(Date.now());
  };

  useEffect(() => {
    const interval = setInterval(tick, 2000);
    return () => clearInterval(interval);
  }, []);

  const onLoad = () => {
    setLoaded(true);
  };

  const onError = () => {
    setLoaded(false);

    if (!hasError) {
      // Only log not-found-errors once per image.
      logException('Live image not found', [['live_image_url', url]]);
      setHasError(true);
    }
  };

  return (
    <>
      {!loaded && (
        <Spinner
          variant="medium"
          delay={225}
          containerClassName={classes.spinner}
        />
      )}

      <CardMedia
        className={classes.media}
        component="img"
        height="100%"
        src={`${url}?d=${timestamp}`}
        onLoad={onLoad}
        onError={onError}
      />

      <FullscreenControl
        className={classes.control}
        size={isFullScreen ? 'medium' : 'small'}
        toggled={isFullScreen}
        onToggle={onFullScreen}
      />
    </>
  );
};

export default LiveImage;

LiveImage.propTypes = propTypes;
LiveImage.defaultProps = defaultProps;
