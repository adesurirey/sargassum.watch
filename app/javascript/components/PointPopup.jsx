import React, { memo } from 'react';
import { string } from 'prop-types';
import { Popup } from 'react-map-gl';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/styles';
import { Typography, Grid, Link } from '@material-ui/core';
import { AccessTime, LinkRounded } from '@material-ui/icons';

import Tooltip from './Tooltip';
import LegendPoint from './LegendPoint';
import SmartTimeAgo from './SmartTimeAgo';

const propTypes = {
  humanLevel: string.isRequired,
  name: string.isRequired,
  updatedAt: string.isRequired,
  source: string,
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

const sourceName = source =>
  source.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i)[1];

const PointPopup = ({ humanLevel, name, updatedAt, source, ...popupProps }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Popup {...popupProps} closeButton={false} closeOnClick={false}>
      <Tooltip className={classes.root} title={name}>
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
        {source && (
          <Grid className={classes.source} container alignItems="center">
            <LinkRounded
              className={classes.icon}
              fontSize="inherit"
              color="inherit"
            />
            <Link
              color="inherit"
              variant="caption"
              noWrap
              rel="nofollow"
              href={source}
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
