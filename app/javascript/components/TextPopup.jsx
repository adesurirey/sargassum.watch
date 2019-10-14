import React from 'react';
import { string } from 'prop-types';
import { Popup } from 'react-map-gl';

import { Typography } from '@material-ui/core';

import Tooltip from './Tooltip';

const propTypes = {
  text: string.isRequired,
  title: string,
};

const defaultProps = {
  text: string.isRequired,
  title: null,
};

const TextPopup = ({ title, text, ...popupProps }) => (
  <Popup {...popupProps}>
    <Tooltip title={title}>
      <Typography variant="body2">{text}</Typography>
    </Tooltip>
  </Popup>
);

export default TextPopup;

TextPopup.propTypes = propTypes;
TextPopup.defaultProps = defaultProps;
