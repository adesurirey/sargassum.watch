import React, { memo } from 'react';
import { bool, func } from 'prop-types';
import { useTranslation } from 'react-i18next';
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
    zIndex: theme.zIndex.drawer + 1,
    [theme.breakpoints.down('sm')]: {
      bottom: 36,
    },
  },
  tiny: {
    position: 'fixed',
    right: 0,
    bottom: 376,
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
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClick = () => !loading && onClick();

  const label = t('Report your beach status');

  let variant = {
    transitionDelay: theme.transitions.duration.enteringScreen + 100,
    size: 'medium',
    variant: 'extended',
    label,
    classes: {
      root: classes.regular,
      icon: classes.icon,
    },
  };

  const mobileVariant = {
    ...variant,
    variant: 'round',
    label: null,
  };

  const tinyVariant = {
    ...variant,
    transitionDelay: theme.transitions.duration.shortest,
    size: 'small',
    classes: {
      root: classes.tiny,
      icon: classes.iconTiny,
    },
  };

  if (tiny) {
    variant = tinyVariant;
  } else if (isMobile) {
    variant = mobileVariant;
  }

  return (
    <Zoom in={visible} style={{ transitionDelay: variant.transitionDelay }}>
      <Fab
        color="primary"
        classes={{ root: variant.classes.root }}
        variant={variant.variant}
        size={variant.size}
        aria-label={label}
        onClickCapture={handleClick}
        disabled={!navigator.geolocation}
      >
        {variant.label}
        <MyLocationRounded
          fontSize="small"
          classes={{
            root: clsx(variant.classes.icon, {
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
