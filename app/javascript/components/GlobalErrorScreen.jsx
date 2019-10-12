import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/styles';
import {
  DialogContent,
  DialogActions,
  Paper,
  Typography,
  Link,
  Button,
} from '@material-ui/core';

import Background from '../../assets/images/sargassum.watch-map.png';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
    width: '100vw',
    margin: 0,
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `url(${Background})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundColor: theme.palette.background.default,
    backgroundBlendMode:
      theme.palette.type === 'dark' ? 'difference' : 'exclusion',
  },
  paper: {
    maxWidth: 440,
  },
}));

const GlobalErrorScreen = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper classes={{ root: classes.paper }} elevation={4}>
        <DialogContent>
          <Typography variant="h1" paragraph>
            {t('Oops… something went wrong.')}
          </Typography>
          <Typography paragraph variant="body2">
            {t("We're now aware of your issue...")}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Link component={Button} href="/" underline="none">
            {t('RELOAD PAGE')}
          </Link>
        </DialogActions>
      </Paper>
    </div>
  );
};

export default GlobalErrorScreen;
