import React, { memo } from 'react';
import { string } from 'prop-types';

import { makeStyles } from '@material-ui/styles';

import useScript from '../hooks/useScript';

const propTypes = {
  url: string.isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
    '& iframe': {
      display: 'block',
    },
  },
}));

const script = 'https://api.lookr.com/embed/script/player.js';

const LookrVideo = ({ url }) => {
  const classes = useStyles();

  useScript(script);

  // return (
  //   <div className={classes.root}>
  //     <iframe src={url} frameborder="0" />
  //   </div>
  // );

  return (
    <div className={classes.root}>
      <a
        name="lkr-timelapse-player"
        data-id="1259795801"
        data-play="day"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        Loading...
      </a>
    </div>
  );
};

export default memo(LookrVideo);

LookrVideo.propTypes = propTypes;
