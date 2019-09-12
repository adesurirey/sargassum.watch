import React, { memo } from 'react';
import { bool, func } from 'prop-types';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Fab } from '@material-ui/core';
import { MyLocationRounded } from '@material-ui/icons';

const propTypes = {
  onClick: func.isRequired,
  loading: bool,
};

const defaultProps = {
  loading: false,
};

const useStyles = makeStyles(theme => ({
  '@keyframes rotating': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
  root: {
    position: 'absolute',
    right: 0,
    [theme.breakpoints.down('sm')]: {
      bottom: 36,
    },
    margin: theme.spacing(2),
  },
  icon: {
    marginLeft: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
    },
  },
  rotating: {
    animation: '$rotating 1500ms linear infinite',
  },
}));

const ReportButton = ({ onClick, loading }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const title = 'Report situation';
  const variant = isSmallScreen ? 'round' : 'extended';
  const label = isSmallScreen ? null : title;

  return (
    <Fab
      classes={{ root: classes.root }}
      variant={variant}
      color="primary"
      size="medium"
      aria-label={title}
      onClick={onClick}
      disabled={!navigator.geolocation}
    >
      {label}
      <MyLocationRounded
        className={clsx(classes.icon, loading && classes.rotating)}
        fontSize="small"
      />
    </Fab>
  );
};

export default memo(ReportButton);

ReportButton.propTypes = propTypes;
ReportButton.defaultProps = defaultProps;