import React, { memo } from 'react';

import { makeStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  caption: {
    color: theme.palette.text.disabled,
  },
}));

const Credits = () => {
  const classes = useStyles();
  const date = new Date();

  return (
    <Grid item>
      <Typography
        classes={{ caption: classes.caption }}
        variant="caption"
        color="textSecondary"
      >
        sargassum.watch © {date.getFullYear()}
      </Typography>
    </Grid>
  );
};

export default memo(Credits);
