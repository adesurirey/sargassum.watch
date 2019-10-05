import React, { memo } from 'react';
import { string } from 'prop-types';
import { Popup } from 'react-map-gl';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/styles';

import Tooltip from './Tooltip';
import YoutubeVideo from './YoutubeVideo';
import LiveImage from './LiveImage';

const propTypes = {
  youtubeId: string,
  liveImageUrl: string,
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
}));

const WebcamPopup = ({ youtubeId, liveImageUrl, ...popupProps }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Popup
      {...popupProps}
      offsetTop={100}
      tipSize={0}
      closeButton={false}
      closeOnClick={false}
    >
      <Tooltip className={classes.root} title={t('Live')}>
        {youtubeId && <YoutubeVideo id={youtubeId} />}
        {liveImageUrl && <LiveImage url={liveImageUrl} />}
      </Tooltip>
    </Popup>
  );
};

export default memo(WebcamPopup);

WebcamPopup.propTypes = propTypes;
WebcamPopup.defaultProps = defaultProps;
