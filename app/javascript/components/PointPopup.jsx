import React, { useState, useEffect, memo } from 'react';
import { oneOfType, string, number, func } from 'prop-types';

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
  canUpdateUntil: string,
  onUpdate: func,
};

const defaultProps = {
  photo: null,
  source: null,
  canUpdateUntil: null,
  onUpdate: undefined,
};

const isUpdatable = canUpdateUntil =>
  !!canUpdateUntil && new Date(canUpdateUntil).getTime() > Date.now();

const PointPopup = ({
  id,
  humanLevel,
  name,
  photo,
  source,
  updatedAt,
  canUpdateUntil,
  onUpdate,
  ...popupProps
}) => {
  const [canUpdate, setCanUpdate] = useState(isUpdatable(canUpdateUntil));
  const [isFullScreen, setIsFullScreen] = useState(false);

  const createModalView = useModalView(`/reports/${id}`);
  useEffect(createModalView, [id]);

  useEffect(() => {
    if (!canUpdate) return;

    const timer = setInterval(() => {
      setCanUpdate(isUpdatable(canUpdateUntil));
    }, 1000);

    return () => clearInterval(timer);
  }, [canUpdate, canUpdateUntil]);

  const handlePhotoChange = photo => {
    onUpdate({ id, photo });
  };

  const handleExitFullScreen = () => {
    setIsFullScreen(false);
  };

  const showPhoto = !!photo || canUpdate;

  return (
    <Popup
      {...popupProps}
      title={name}
      isFullHeight={showPhoto}
      isFullScreen={isFullScreen}
      onExitFullScreen={handleExitFullScreen}
    >
      {showPhoto && (
        <PointPopupPhoto
          photo={photo}
          canUpdate={canUpdate}
          onChange={handlePhotoChange}
        />
      )}
      <PointPopupLegend
        humanLevel={humanLevel}
        source={source}
        updatedAt={updatedAt}
        hasPhoto={showPhoto}
        isFullScreen={isFullScreen}
        onFullScreen={setIsFullScreen}
      />
    </Popup>
  );
};

export default memo(PointPopup);

PointPopup.propTypes = propTypes;
PointPopup.defaultProps = defaultProps;
