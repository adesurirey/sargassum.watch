import React from 'react';
import { string } from 'prop-types';
import { Popup } from 'react-map-gl';

import { Typography } from '@material-ui/core';

import Tooltip from './Tooltip';

const propTypes = {
  text: string.isRequired,
  title: string,
  cursor: 'default',
};

const defaultProps = {
  text: string.isRequired,
  title: null,
};

const TextPopup = ({ title, text, ...popupProps }) => (
  <Popup {...popupProps} closeButton={false} closeOnClick={false}>
    <Tooltip title={title}>
      <Typography variant="caption">{text}</Typography>
    </Tooltip>
  </Popup>
);

export default TextPopup;

TextPopup.propTypes = propTypes;
TextPopup.defaultProps = defaultProps;
