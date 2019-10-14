import React from 'react';
import { func } from 'prop-types';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/styles';
import { IconButton } from '@material-ui/core';
import { CloseRounded } from '@material-ui/icons';

const propTypes = {
  onClose: func.isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    borderRadius: '0 4px 0 0',
  },

  sizeSmall: {
    fontSize: theme.typography.fontSize,
    padding: theme.spacing(1),
  },
}));

const TooltipCloseButton = ({ onClose }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <IconButton
      aria-label={t('close')}
      classes={{ root: classes.root, sizeSmall: classes.sizeSmall }}
      onClick={onClose}
      size="small"
    >
      <CloseRounded fontSize="inherit" />
    </IconButton>
  );
};

export default TooltipCloseButton;

TooltipCloseButton.propTypes = propTypes;
