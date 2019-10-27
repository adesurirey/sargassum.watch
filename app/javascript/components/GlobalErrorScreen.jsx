import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/styles';
import { Typography, Link, Button } from '@material-ui/core';

import Logo from '../images/sargassum-watch-logo.svg';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
    width: '100vw',
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    maxWidth: 440,
    padding: theme.spacing(3),
    textAlign: 'center',
  },
  h1: {
    fontSize: '1.5rem',
  },
  button: {
    marginTop: theme.spacing(1),
  },
}));

const GlobalErrorScreen = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <img src={Logo} alt="sargassum.watch logo" width={80} />
      <div className={classes.content}>
        <Typography variant="h1" paragraph classes={{ h1: classes.h1 }}>
          {t('Oops… something went wrong.')}
        </Typography>
        <Typography paragraph variant="body2">
          {t("We're now aware of your issue...")}
        </Typography>
        <Link
          component={Button}
          href="/"
          underline="none"
          className={classes.button}
        >
          {t('RELOAD PAGE')}
        </Link>
      </div>
    </div>
  );
};

export default GlobalErrorScreen;
