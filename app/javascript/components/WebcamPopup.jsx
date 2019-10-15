import React, { useEffect, memo } from 'react';
import { string, func } from 'prop-types';
import { Popup } from 'react-map-gl';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/styles';

import useModalView from '../hooks/useModalView';
import Tooltip from './Tooltip';
import LiveIcon from './LiveIcon';
import YoutubeVideo from './YoutubeVideo';
import LiveImage from './LiveImage';

const propTypes = {
  youtubeId: string,
  liveImageUrl: string,
  onClose: func.isRequired,
};

const defaultProps = {
  youtubeId: undefined,
  liveImageUrl: undefined,
};

const useStyles = makeStyles(theme => ({
  root: {
    width: 320,
    [theme.breakpoints.down('sm')]: {
      width: `calc(100vw - ${theme.spacing(4)}px)`,
    },
  },

  title: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const WebcamPopup = ({ youtubeId, liveImageUrl, ...popupProps }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const id = youtubeId || liveImageUrl.split('/')[3];
  const createModalView = useModalView(`/webcams/${id}`);

  useEffect(createModalView, [id]);

  return (
    <Popup {...popupProps} offsetTop={100} tipSize={0}>
      <Tooltip
        className={classes.root}
        title={
          <div className={classes.title}>
            <LiveIcon />
            {t('Live')}
          </div>
        }
        compact
        onClose={popupProps.onClose}
      >
        {youtubeId && <YoutubeVideo id={youtubeId} />}
        {liveImageUrl && <LiveImage url={liveImageUrl} />}
      </Tooltip>
    </Popup>
  );
};

export default memo(WebcamPopup);

WebcamPopup.propTypes = propTypes;
WebcamPopup.defaultProps = defaultProps;
