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
  closeButton: {
    margin: theme.spacing(-0.5, -0.5, -0.5),
    padding: theme.spacing(0.5),
    color: theme.palette.grey[500],
  },
}));

const PopupCloseButton = ({ onClose }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <IconButton
      aria-label={t('close')}
      size="small"
      classes={{ root: classes.closeButton }}
      onClick={onClose}
    >
      <CloseRounded fontSize="inherit" />
    </IconButton>
  );
};

export default PopupCloseButton;

PopupCloseButton.propTypes = propTypes;
