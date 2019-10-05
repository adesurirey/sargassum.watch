import React, { memo } from 'react';
import { string } from 'prop-types';
import YouTube from 'react-youtube';

import { makeStyles } from '@material-ui/styles';

const propTypes = {
  id: string.isRequired,
};

const useStyles = makeStyles(theme => ({
  container: {
    position: 'relative',
    display: 'block',
    width: '100%',
    padding: 0,
    overflow: 'hidden',
    paddingTop: '56.25%',
    '&::before': {
      display: 'block',
      content: '',
    },
  },

  iframe: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 0,
  },
}));

const options = {
  playerVars: {
    color: 'white',
    controls: 2,
    iv_load_policy: 3,
    modestbranding: 1,
    rel: 0,
    autoplay: 1,
  },
};

const YoutubeVideo = ({ id }) => {
  const classes = useStyles();

  return (
    <YouTube
      videoId={id}
      containerClassName={classes.container}
      className={classes.iframe}
      opts={options}
    />
  );
};

export default memo(YoutubeVideo);

YoutubeVideo.propTypes = propTypes;
