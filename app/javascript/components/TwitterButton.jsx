import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/styles';
import { Tooltip, Zoom, Link, IconButton } from '@material-ui/core';
import { Twitter } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.text.secondary,
  },
}));

const TwitterButton = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div>
      <Tooltip title={t('Follow us on twitter')} TransitionComponent={Zoom}>
        <Link
          component={IconButton}
          classes={{ root: classes.root }}
          size="small"
          href="https://twitter.com/sargassum_watch"
          target="_blank"
          rel="me nofollow noopener"
        >
          <Twitter fontSize="inherit" />
        </Link>
      </Tooltip>
    </div>
  );
};

export default memo(TwitterButton);
