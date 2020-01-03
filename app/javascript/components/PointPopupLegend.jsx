import React from 'react';
import { string, bool } from 'prop-types';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { Typography, Grid, Link } from '@material-ui/core';
import { AccessTime, LinkRounded } from '@material-ui/icons';

import LegendPoint from './LegendPoint';
import SmartTimeAgo from './SmartTimeAgo';

const propTypes = {
  humanLevel: string.isRequired,
  source: string,
  updatedAt: string.isRequired,
  absolute: bool,
};

const defaultProps = {
  source: null,
  absolute: false,
};

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0, 2, 2, 2),
    fontSize: theme.typography.caption.fontSize,
  },
  absolute: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: `calc(100% - ${theme.spacing(2)}px)`,
    margin: theme.spacing(1),
    padding: theme.spacing(1, 2),
    borderRadius: theme.spacing(0.5),
    backgroundColor: fade(theme.palette.background.paper, 0.8),
  },
  icon: {
    marginRight: theme.spacing(1),
  },
}));

const sourceName = source => source.replace(/^https?:\/\/(www.)?/, '');

const PointPopupLegend = ({ humanLevel, source, updatedAt, absolute }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, absolute && classes.absolute)}>
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
  );
};

export default PointPopupLegend;

PointPopupLegend.propTypes = propTypes;
PointPopupLegend.defaultProps = defaultProps;
