import React, { useState, memo } from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/styles';
import { Link, Popover, Typography } from '@material-ui/core';

import useModalView from '../hooks/useModalView';

const useStyles = makeStyles(theme => ({
  popover: {
    maxWidth: 320,
    padding: theme.spacing(2, 2, 0),
    '@media only screen and (max-width: 351px)': {
      maxWidth: 288,
    },
  },
}));

const { contact } = gon;

const About = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const createModalView = useModalView('/about');
  const { t } = useTranslation();
  const classes = useStyles();

  const onClick = ({ currentTarget }) => {
    setAnchorEl(currentTarget);
    createModalView();
  };

  const onClose = () => setAnchorEl(null);

  return (
    <div>
      <Link
        aria-controls="about"
        aria-haspopup="true"
        variant="caption"
        color="textSecondary"
        component="button"
        onClick={onClick}
      >
        {t('About')}
      </Link>

      <Popover
        id="about"
        classes={{ paper: classes.popover }}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={onClose}
      >
        <Typography paragraph variant="caption">
          {t('about us')}
        </Typography>
        <Typography paragraph variant="caption">
          {t('about sargassum')}
        </Typography>
        <Typography paragraph variant="caption" gutterBottom={false}>
          {t('about data')}
        </Typography>
        <Typography paragraph variant="caption" gutterBottom={false}>
          {t('contact')}
          <Link
            variant="caption"
            color="inherit"
            underline="always"
            href={`mailto:${contact}`}
            rel="contact"
          >
            {contact}
          </Link>
        </Typography>
      </Popover>
    </div>
  );
};

export default memo(About);
