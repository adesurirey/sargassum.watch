import React from 'react';
import { string, func } from 'prop-types';

import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

import Popup from './Popup';
import PopupCloseButton from './PopupCloseButton';

const propTypes = {
  text: string.isRequired,
  onClose: func.isRequired,
};

const defaultProps = {
  text: string.isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1, 1, 1, 2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  typography: {
    paddingRight: theme.spacing(1),
  },
}));

const TextPopup = ({ text, ...popupProps }) => {
  const classes = useStyles();

  return (
    <Popup {...popupProps}>
      <div className={classes.root}>
        <Typography variant="body2" classes={{ root: classes.typography }}>
          {text}
        </Typography>
        <PopupCloseButton onClose={popupProps.onClose} />
      </div>
    </Popup>
  );
};

export default TextPopup;

TextPopup.propTypes = propTypes;
TextPopup.defaultProps = defaultProps;
