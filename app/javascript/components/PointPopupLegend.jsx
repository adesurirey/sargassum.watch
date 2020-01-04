import React from 'react';
import { string, bool, func } from 'prop-types';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { Typography, Grid, Link } from '@material-ui/core';
import { AccessTime, LinkRounded } from '@material-ui/icons';

import LegendPoint from './LegendPoint';
import SmartTimeAgo from './SmartTimeAgo';
import FullscreenControl from './FullscreenControl';

const propTypes = {
  humanLevel: string.isRequired,
  source: string,
  updatedAt: string.isRequired,
  hasPhoto: bool,
  isFullScreen: bool,
  onFullScreen: func.isRequired,
};

const defaultProps = {
  source: null,
  hasPhoto: false,
  isFullScreen: false,
};

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0, 2, 2, 2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    fontSize: theme.typography.caption.fontSize,
  },
  hasPhoto: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    margin: `${theme.spacing(1)}px auto`,
    width: 320 - theme.spacing(2),
    padding: theme.spacing(1, 2),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.background.paper, 0.8),
  },
  isFullScreen: {
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(3),
    },
  },
  icon: {
    marginRight: theme.spacing(1),
  },
}));

const sourceName = source => source.replace(/^https?:\/\/(www.)?/, '');

const PointPopupLegend = ({
  humanLevel,
  source,
  updatedAt,
  hasPhoto,
  isFullScreen,
  onFullScreen,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.root, {
        [classes.hasPhoto]: hasPhoto,
        [classes.isFullScreen]: isFullScreen,
      })}
    >
      <div className={classes.left}>
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
          <Grid container alignItems="center">
            <LinkRounded
              className={classes.icon}
              fontSize="inherit"
              color="action"
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
      </div>

      {hasPhoto && (
        <FullscreenControl
          size="small"
          toggled={isFullScreen}
          onToggle={onFullScreen}
        />
      )}
    </div>
  );
};

export default PointPopupLegend;

PointPopupLegend.propTypes = propTypes;
PointPopupLegend.defaultProps = defaultProps;
