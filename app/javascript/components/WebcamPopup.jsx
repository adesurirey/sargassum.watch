import React, { useEffect, memo } from 'react';
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

const WebcamPopup = ({ id, youtubeId, liveImageUrl, ...popupProps }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const createModalView = useModalView(`/webcams/${id}`);

  useEffect(createModalView, [id]);

  return (
    <Popup
      {...popupProps}
      title={
        <div className={classes.title}>
          <LiveIcon />
          {t('Live')}
        </div>
      }
    >
      {youtubeId && <YoutubeVideo id={youtubeId} />}
      {liveImageUrl && <LiveImage url={liveImageUrl} />}
    </Popup>
  );
};

export default memo(WebcamPopup);

WebcamPopup.propTypes = propTypes;
WebcamPopup.defaultProps = defaultProps;
