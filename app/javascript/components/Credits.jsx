import React, { memo } from 'react';

import { Grid, Link, Typography } from '@material-ui/core';

const Credits = () => {
  const date = new Date();

  return (
    <Grid item>
      <Link
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
    </Grid>
  );
};

export default memo(Credits);
