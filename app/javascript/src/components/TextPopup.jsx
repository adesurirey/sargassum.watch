import React from 'react';
import { string } from 'prop-types';
import { Popup } from 'react-map-gl';

import { Typography } from '@material-ui/core';

import PopupContainer from './PopupContainer';

const propTypes = {
  text: string.isRequired,
};

const TextPopup = ({ text, ...popupProps }) => (
  <Popup {...popupProps}>
    <PopupContainer>
      <Typography>{text}</Typography>
    </PopupContainer>
  </Popup>
);

export default TextPopup;

TextPopup.propTypes = propTypes;
