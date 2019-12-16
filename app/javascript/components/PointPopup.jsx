import React, { useEffect, memo } from 'react';
import { oneOfType, string, number, bool, func } from 'prop-types';
import { Popup } from 'react-map-gl';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/styles';
import { Typography, Grid, Link } from '@material-ui/core';
import { AccessTime, LinkRounded } from '@material-ui/icons';

import useModalView from '../hooks/useModalView';
import Tooltip from './Tooltip';
import LegendPoint from './LegendPoint';
import SmartTimeAgo from './SmartTimeAgo';

const propTypes = {
  id: oneOfType([number, string]).isRequired,
  humanLevel: string.isRequired,
  name: string.isRequired,
  source: string,
  photo: string,
  updatedAt: string.isRequired,
  canUpdate: bool,
  onUpdate: func,
  onClose: func.isRequired,
};

const defaultProps = {
  photo: null,
  source: null,
  canUpdate: false,
  onUpdate: undefined,
};

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 200,
    cursor: 'default',
  },
  gutterBottom: {
    marginBottom: '0.35em',
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  source: {
    color: theme.palette.action.disabled,
  },
}));

const sourceName = source => source.replace(/^https?:\/\/(www.)?/, '');

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
  const { t } = useTranslation();
  const classes = useStyles();
  const createModalView = useModalView(`/reports/${id}`);

  useEffect(createModalView, [id]);

  const onFileUpload = event => {
    onUpdate({ id, photo: event.target.files[0] });
  };

  return (
    <Popup {...popupProps}>
      <Tooltip
        className={classes.root}
        title={name}
        onClose={popupProps.onClose}
      >
        <Grid container alignItems="center">
          {(!!photo || canUpdate) && (
            <div
              style={{
                width: '100%',
                height: 100,
                backgroundImage: !!photo ? `url(${photo})` : 'unset',
                backgroundSize: 'cover',
                backgroundPostion: 'center',
              }}
            >
              {!photo && canUpdate && (
                <input type="file" onChange={onFileUpload} />
              )}
            </div>
          )}
          <LegendPoint
            humanLevel={humanLevel}
            className={classes.icon}
            size="inherit"
          />
          <Typography variant="caption" noWrap>
            {t(humanLevel)}
          </Typography>
        </Grid>
        <Grid container alignItems="center">
          <AccessTime
            className={classes.icon}
            fontSize="inherit"
            color="action"
          />
          <Typography variant="caption" noWrap>
            <SmartTimeAgo date={updatedAt} />
          </Typography>
        </Grid>
        {!!source && (
          <Grid className={classes.source} container alignItems="center">
            <LinkRounded
              className={classes.icon}
              fontSize="inherit"
              color="inherit"
            />
            <Link
              target="_blank"
              rel="nofollow noopener"
              href={source}
              color="inherit"
              variant="caption"
              noWrap
            >
              {sourceName(source)}
            </Link>
          </Grid>
        )}
      </Tooltip>
    </Popup>
  );
};

export default memo(PointPopup);

PointPopup.propTypes = propTypes;
PointPopup.defaultProps = defaultProps;
