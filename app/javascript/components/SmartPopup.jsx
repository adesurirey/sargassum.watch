import React from 'react';
import { oneOf, func } from 'prop-types';

import PointPopup from './PointPopup';
import WebcamPopup from './WebcamPopup';
import ReportPopup from './ReportPopup';
import TextPopup from './TextPopup';

import popupTypes from '../config/popupTypes';

const propTypes = {
  variant: oneOf(Object.values(popupTypes)),
  onClose: func.isRequired,
};

const defaultProps = {
  variant: 'text',
};

const SmartPopup = ({ variant, ...popupProps }) => {
  switch (variant) {
    case popupTypes.point:
      return <PointPopup {...popupProps} />;
    case popupTypes.webcam:
      return <WebcamPopup {...popupProps} />;
    case popupTypes.report:
      return <ReportPopup {...popupProps} />;
    default:
      return <TextPopup {...popupProps} />;
  }
};

export default SmartPopup;

SmartPopup.propTypes = propTypes;
SmartPopup.defaultProps = defaultProps;
