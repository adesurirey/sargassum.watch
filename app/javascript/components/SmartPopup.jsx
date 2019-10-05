import React from 'react';
import { oneOf, number, func } from 'prop-types';

import PointPopup from './PointPopup';
import WebcamPopup from './WebcamPopup';
import ReportPopup from './ReportPopup';
import TextPopup from './TextPopup';

const propTypes = {
  variant: oneOf(['text', 'point', 'webcam', 'report']),
  latitude: number.isRequired,
  longitude: number.isRequired,
  onClose: func.isRequired,
};

const defaultProps = {
  variant: 'text',
};

const SmartPopup = ({ variant, ...popupProps }) => {
  switch (variant) {
    case 'point':
      return <PointPopup {...popupProps} />;
    case 'webcam':
      return <WebcamPopup {...popupProps} />;
    case 'report':
      return <ReportPopup {...popupProps} />;
    default:
      return <TextPopup {...popupProps} />;
  }
};

export default SmartPopup;

SmartPopup.propTypes = propTypes;
SmartPopup.defaultProps = defaultProps;
