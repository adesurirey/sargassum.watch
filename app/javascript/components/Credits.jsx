import React, { memo } from 'react';

import { makeStyles } from '@material-ui/styles';
import { Link, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  hiddenXXS: {
    '@media only screen and (max-width: 374px)': {
      display: 'none',
    },
  },
});

const Credits = () => {
  const classes = useStyles();
  const date = new Date();

  return (
    <div>
      <Link
        className={classes.hiddenXXS}
        variant="caption"
        color="textSecondary"
        href="https://www.sargassum.watch"
        rel="me"
      >
        sargassum.watch
      </Link>
      <Typography variant="caption" color="textSecondary">
        {` © ${date.getFullYear()}`}
      </Typography>
    </div>
  );
};

export default memo(Credits);
