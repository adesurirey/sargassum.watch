import React, { memo } from 'react';
import { bool, func } from 'prop-types';
import clsx from 'clsx';

import { useTheme, makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Zoom, Fab } from '@material-ui/core';
import { MyLocationRounded } from '@material-ui/icons';

const propTypes = {
  visible: bool,
  loading: bool,
  onClick: func.isRequired,
};

const defaultProps = {
  visible: false,
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

const ReportButton = ({ visible, loading, onClick }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const title = 'Report situation';
  const variant = isSmallScreen ? 'round' : 'extended';
  const label = isSmallScreen ? null : title;

  const handleClick = () => {
    if (!loading) {
      onClick();
    }
  };

  return (
    <Zoom
      in={visible}
      style={{
        transitionDelay: theme.transitions.duration.enteringScreen + 100,
      }}
    >
      <Fab
        classes={{ root: classes.root }}
        variant={variant}
        color="primary"
        size="medium"
        aria-label={title}
        onClickCapture={handleClick}
        disabled={!navigator.geolocation}
      >
        {label}
        <MyLocationRounded
          className={clsx(classes.icon, loading && classes.rotating)}
          fontSize="small"
        />
      </Fab>
    </Zoom>
  );
};

export default memo(ReportButton);

ReportButton.propTypes = propTypes;
ReportButton.defaultProps = defaultProps;
