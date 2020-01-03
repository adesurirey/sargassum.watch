import React, { useEffect, memo } from 'react';
import { oneOfType, string, number, bool, func } from 'prop-types';

import useModalView from '../hooks/useModalView';
import Popup from './Popup';
import PointPopupPhoto from './PointPopupPhoto';
import PointPopupLegend from './PointPopupLegend';

const propTypes = {
  id: oneOfType([number, string]).isRequired,
  humanLevel: string.isRequired,
  name: string.isRequired,
  source: string,
  photo: string,
  updatedAt: string.isRequired,
  canUpdate: bool,
  onUpdate: func,
};

const defaultProps = {
  photo: null,
  source: null,
  canUpdate: false,
  onUpdate: undefined,
};

const PointPopup = ({
  id,
  humanLevel,
  name,
  photo,
  source,
  updatedAt,
  canUpdate,
  onUpdate,
  ...popupProps
}) => {
  const createModalView = useModalView(`/reports/${id}`);

  useEffect(createModalView, [id]);

  const handlePhotoChange = photo => {
    onUpdate({ id, photo });
  };

  const hasPhoto = !!photo || canUpdate;

  return (
    <Popup {...popupProps} title={name}>
      {hasPhoto && (
        <PointPopupPhoto photo={photo} onChange={handlePhotoChange} />
      )}
      <PointPopupLegend
        humanLevel={humanLevel}
        source={source}
        updatedAt={updatedAt}
        absolute={hasPhoto}
      />
    </Popup>
  );
};

export default memo(PointPopup);

PointPopup.propTypes = propTypes;
PointPopup.defaultProps = defaultProps;
