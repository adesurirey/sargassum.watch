import React, { lazy, useState, useEffect } from 'react';
import { bool, func } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { FlyToInterpolator } from 'react-map-gl';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import {
  Tooltip,
  Zoom,
  ButtonBase,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core';
import { ZoomOutMapRounded } from '@material-ui/icons';

import useModalView from '../hooks/useModalView';
import useEvent from '../hooks/useEvent';

const Logo = lazy(() => import('./Logo'));

const { quickLooks } = gon;
const places = Object.keys(quickLooks);

const propTypes = {
  loaded: bool.isRequired,
  onViewportChange: func.isRequired,
};

const useStyles = makeStyles(theme => ({
  button: {
    width: '100%',
    height: 34,
  },

  flip: {
    transform: 'rotateY(180deg)',
  },

  icon: {
    marginRight: theme.spacing(1),
  },
}));

const QuickLook = ({ loaded, onViewportChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [hover, setHover] = useState(false);
  const [animated, setAnimated] = useState(false);
  const createModalView = useModalView('/quicklooks');
  const createEvent = useEvent();
  const { t } = useTranslation();
  const classes = useStyles();

  const onMouseEnter = () => setHover(true);
  const onMouseLeave = () => setHover(false);

  const animate = () => {
    if (!loaded) return;

    const timeoutIn = setTimeout(() => setAnimated(true), 4000);
    const timeoutOut = setTimeout(() => setAnimated(false), 5000);

    return () => {
      clearTimeout(timeoutIn);
      clearTimeout(timeoutOut);
    };
  };

  useEffect(animate, [loaded]);

  const onClick = ({ currentTarget }) => {
    setAnchorEl(currentTarget);
    createModalView();
  };

  const onClose = () => setAnchorEl(null);

  const onSelect = place => {
    onViewportChange({
      ...quickLooks[place],
      transitionInterpolator: new FlyToInterpolator(),
      transitionDuration: 2000,
    });

    onClose();
    createEvent({
      category: 'Navigation',
      action: `Clicked ${place} quick look`,
      label: `${place} quick look`,
    });
  };

  const title = t('Quick look');

  return (
    <>
      <Tooltip
        title={title}
        TransitionComponent={Zoom}
        open={hover}
        onOpen={onMouseEnter}
        onClose={onMouseLeave}
      >
        <ButtonBase
          aria-label={title}
          aria-controls="quick-look-menu"
          aria-haspopup="true"
          className={classes.button}
          disableTouchRipple
          onClick={onClick}
        >
          <Logo className={clsx({ [classes.flip]: hover || animated })} />
        </ButtonBase>
      </Tooltip>

      <Menu
        id="quick-look-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={onClose}
      >
        <MenuItem disabled>{t('Jump to…')}</MenuItem>
        {places.map(place => (
          <MenuItem key={place} onClick={() => onSelect(place)}>
            {place === 'all' && (
              <ZoomOutMapRounded className={classes.icon} fontSize="small" />
            )}
            <Typography noWrap>{t(place)}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default QuickLook;

QuickLook.propTypes = propTypes;
