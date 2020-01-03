import React, { useEffect, memo } from 'react';
import { oneOfType, string, number, bool, func } from 'prop-types';

import useModalView from '../hooks/useModalView';
import Popup from './Popup';
import PointPopupLegend from './PointPopupLegend';

const propTypes = {
  id: oneOfType([number, string]).isRequired,
  humanLevel: string.isRequired,
  name: string.isRequired,
  source: string,
  updatedAt: string.isRequired,
};

const defaultProps = {
  source: null,
};

const PointPopup = ({
  id,
  humanLevel,
  name,
  source,
  updatedAt,
  ...popupProps
}) => {
  const createModalView = useModalView(`/reports/${id}`);

  useEffect(createModalView, [id]);

  return (
    <Popup {...popupProps} title={name}>
      <PointPopupLegend
        humanLevel={humanLevel}
        source={source}
        updatedAt={updatedAt}
      />
    </Popup>
  );
};

export default memo(PointPopup);

PointPopup.propTypes = propTypes;
PointPopup.defaultProps = defaultProps;
