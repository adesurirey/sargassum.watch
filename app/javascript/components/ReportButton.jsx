import React, { memo } from 'react';
import { bool, func } from 'prop-types';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { useTheme, makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Zoom, Tooltip, Fab } from '@material-ui/core';
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

const insetShadow = '0 -2px 0 rgba(0, 0, 0, 0.08) inset';

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'absolute',
    right: 0,
    margin: theme.spacing(2),
    boxShadow: `${insetShadow}, ${theme.shadows[4]}`,
    zIndex: theme.zIndex.drawer + 1,
    [theme.breakpoints.down('sm')]: {
      bottom: 36,
    },
  },

  marginLeft: {
    marginLeft: theme.spacing(1),
  },

  rotating: {
    animation: '$rotating 1500ms linear infinite',
  },

  '@keyframes rotating': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
}));

const ReportButton = ({ visible, loading, onClick }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClick = () => !loading && onClick();

  const label = t('Report your beach status');

  return (
    <Zoom
      in={visible}
      exit={false}
      style={{
        transitionDelay: theme.transitions.duration.enteringScreen + 500,
      }}
    >
      <Tooltip
        title={label}
        TransitionComponent={Zoom}
        disableHoverListener
        PopperProps={{ keepMounted: true }}
      >
        <Fab
          color="primary"
          classes={{ root: classes.fab }}
          variant={isMobile ? 'round' : 'extended'}
          size="medium"
          aria-label={label}
          onClickCapture={handleClick}
          disabled={!navigator.geolocation}
        >
          {!isMobile && label}
          <MyLocationRounded
            fontSize="small"
            classes={{
              root: clsx({
                [classes.marginLeft]: !isMobile,
                [classes.rotating]: loading,
              }),
            }}
          />
        </Fab>
      </Tooltip>
    </Zoom>
  );
};

export default memo(ReportButton);

ReportButton.propTypes = propTypes;
ReportButton.defaultProps = defaultProps;
