import React, { useState, useEffect, memo } from 'react';
import { string } from 'prop-types';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/styles';
import {
  CardMedia,
  Tooltip,
  IconButton,
  Modal,
  Backdrop,
} from '@material-ui/core';
import { Fullscreen, FullscreenExit } from '@material-ui/icons';

import useException from '../hooks/useException';
import Spinner from './Spinner';

const propTypes = {
  url: string.isRequired,
};

const HEIGHT = 180;

const useStyles = makeStyles(theme => ({
  media: {
    display: loaded => (loaded ? 'block' : 'none'),
  },

  spinner: {
    position: 'relative',
    height: HEIGHT,
  },

  button: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },

  modal: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.common.black,
    '&:focus': {
      outline: 'none',
    },
  },

  fullscreen: {
    position: 'relative',
  },

  backdrop: {
    backgroundColor: theme.palette.common.black,
  },
}));

const LiveImage = ({ url }) => {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [isFullscreen, setFullscreen] = useState(false);

  const { t } = useTranslation();
  const classes = useStyles(loaded);
  const logException = useException();

  const tick = () => setTimestamp(Date.now());

  const goFullscreen = () => setFullscreen(true);
  const exitFullscreen = () => setFullscreen(false);

  useEffect(() => {
    const interval = setInterval(tick, 2000);
    return () => clearInterval(interval);
  }, []);

  const onLoad = () => setLoaded(true);

  const onError = () => {
    setLoaded(false);

    if (!hasError) {
      // Only log not found errors once per image.
      logException('Live image not found', [['live_image_url', url]]);
      setHasError(true);
    }
  };

  const spinner = (
    <div className={classes.spinner}>
      <Spinner variant="small" delay={225} />
    </div>
  );

  const image = (
    <>
      <CardMedia
        className={classes.media}
        component="img"
        height={isFullscreen ? '100%' : HEIGHT}
        src={`${url}?d=${timestamp}`}
        title={t('Live')}
        onLoad={onLoad}
        onError={onError}
      />
      {!loaded && spinner}
    </>
  );

  return (
    <>
      {image}
      {loaded && (
        <Tooltip title={t('Fullscreen')} placement="top" enterDelay={700}>
          <IconButton className={classes.button} onClick={goFullscreen}>
            <Fullscreen />
          </IconButton>
        </Tooltip>
      )}

      <Modal
        aria-label={t('Fullscreen')}
        open={isFullscreen}
        onClose={exitFullscreen}
        BackdropComponent={Backdrop}
        BackdropProps={{ classes: { root: classes.backdrop } }}
        keepMounted
      >
        <div className={classes.modal}>
          <div className={classes.fullscreen}>
            {image}
            <Tooltip
              title={t('Exit fullscreen')}
              placement="top"
              enterDelay={700}
            >
              <IconButton className={classes.button} onClick={exitFullscreen}>
                <FullscreenExit fontSize="large" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default memo(LiveImage);

LiveImage.propTypes = propTypes;
