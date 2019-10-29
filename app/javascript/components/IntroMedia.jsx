import React from 'react';

import { makeStyles } from '@material-ui/styles';
import { Link } from '@material-ui/core';
import { LaunchRounded } from '@material-ui/icons';

import Sargassum from '../images/beach-covered-by-sargassum.jpg';

const useStyles = makeStyles(theme => ({
  root: {
    height: 160,
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    backgroundImage: `linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.1)), url('${Sargassum}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  credit: {
    color: theme.palette.common.white,
    padding: theme.spacing(1),
    fontSize: 12,
  },
}));

const sourceUrl =
  'https://www.flickr.com/photos/theactionitems/6363488127/in/photostream/';

const IntroMedia = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.credit}>
        <Link
          target="_blank"
          rel="nofollow noopener"
          href={sourceUrl}
          color="inherit"
          underline="none"
        >
          <LaunchRounded fontSize="inherit" color="inherit" />
        </Link>
      </div>
    </div>
  );
};

export default IntroMedia;
