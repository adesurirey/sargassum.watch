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
  tiny: bool,
  onClick: func.isRequired,
};

const defaultProps = {
  visible: false,
  loading: false,
  tiny: false,
};

const useStyles = makeStyles(theme => ({
  regular: {
    position: 'absolute',
    right: 0,
    margin: theme.spacing(2),
    fontWeight: 600,
    [theme.breakpoints.down('sm')]: {
      bottom: 36,
    },
  },
  tiny: {
    position: 'fixed',
    right: 0,
    bottom: 400,
    height: '25px !important',
    margin: theme.spacing(1),
    boxShadow: theme.shadows[3],
    fontSize: theme.typography.caption.fontSize,
    zIndex: 9999,
  },

  icon: {
    marginLeft: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
    },
  },
  iconTiny: {
    marginLeft: theme.spacing(1) / 2,
    fontSize: theme.typography.fontSize,
  },
  rotating: {
    animation: '$rotating 1500ms linear infinite',
  },

  '@keyframes rotating': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
}));

const ReportButton = ({ visible, tiny, loading, onClick }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClick = () => !loading && onClick();

  const title = 'Report situation';

  const size = tiny ? 'small' : 'medium';
  const variant = isSmallScreen && !tiny ? 'round' : 'extended';

  const label = variant === 'extended' ? title : null;

  const transitionDelay = tiny
    ? theme.transitions.duration.shortest
    : theme.transitions.duration.enteringScreen + 100;

  return (
    <Zoom in={visible} style={{ transitionDelay }} mountOnEnter>
      <Fab
        color="primary"
        classes={{ root: tiny ? classes.tiny : classes.regular }}
        variant={variant}
        size={size}
        aria-label={title}
        onClickCapture={handleClick}
        disabled={!navigator.geolocation}
      >
        {label}
        <MyLocationRounded
          fontSize="small"
          classes={{
            root: clsx(tiny ? classes.iconTiny : classes.icon, {
              [classes.rotating]: loading,
            }),
          }}
        />
      </Fab>
    </Zoom>
  );
};

export default memo(ReportButton);

ReportButton.propTypes = propTypes;
ReportButton.defaultProps = defaultProps;
