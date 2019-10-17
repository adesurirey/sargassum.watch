import React, { useEffect, memo } from 'react';
import { oneOfType, string, number, func } from 'prop-types';
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
  updatedAt: string.isRequired,
  source: string,
  onClose: func.isRequired,
};

const defaultProps = {
  source: null,
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
  updatedAt,
  source,
  ...popupProps
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const createModalView = useModalView(`/reports/${id}`);

  useEffect(createModalView, [id]);

  return (
    <Popup {...popupProps}>
      <Tooltip
        className={classes.root}
        title={name}
        onClose={popupProps.onClose}
      >
        <Grid container alignItems="center">
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
