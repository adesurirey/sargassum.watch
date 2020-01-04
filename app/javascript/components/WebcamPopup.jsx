import React, { useState, useEffect, memo } from 'react';
import { number, string } from 'prop-types';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/styles';

import useModalView from '../hooks/useModalView';
import Popup from './Popup';
import LiveIcon from './LiveIcon';
import YoutubeVideo from './YoutubeVideo';
import LiveImage from './LiveImage';

const propTypes = {
  id: number.isRequired,
  youtubeId: string,
  liveImageUrl: string,
};

const defaultProps = {
  youtubeId: undefined,
  liveImageUrl: undefined,
};

const useStyles = makeStyles(theme => ({
  title: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const WebcamTitle = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.title}>
      <LiveIcon />
      {t('Live')}
    </div>
  );
};

const WebcamPopup = ({ id, youtubeId, liveImageUrl, ...popupProps }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const createModalView = useModalView(`/webcams/${id}`);
  useEffect(createModalView, [id]);

  let media;
  if (youtubeId) {
    media = <YoutubeVideo id={youtubeId} />;
  } else if (liveImageUrl) {
    media = (
      <LiveImage
        url={liveImageUrl}
        isFullScreen={isFullScreen}
        onFullScreen={setIsFullScreen}
      />
    );
  } else {
    throw new Error(`Webcam ${id} has no valid source`);
  }

  const handleExitFullScreen = () => {
    setIsFullScreen(false);
  };

  return (
    <Popup
      {...popupProps}
      isFullHeight
      isFullScreen={isFullScreen}
      onExitFullScreen={handleExitFullScreen}
      title={<WebcamTitle />}
    >
      {media}
    </Popup>
  );
};

export default memo(WebcamPopup);

WebcamPopup.propTypes = propTypes;
WebcamPopup.defaultProps = defaultProps;
