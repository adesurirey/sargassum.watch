import React, { useState, useEffect } from 'react';
import { func } from 'prop-types';
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

import Logo from './Logo';

const { quickLooks } = gon;
const places = Object.keys(quickLooks);

const propTypes = {
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

const QuickLook = ({ onViewportChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);

  const { t } = useTranslation();
  const classes = useStyles();

  useEffect(() => setVisible(true), []);

  const onMouseEnter = () => setHover(true);
  const onMouseLeave = () => setHover(false);

  const animate = () => {
    const timeoutIn = setTimeout(() => onMouseEnter(), 4000);
    const timeoutOut = setTimeout(() => onMouseLeave(), 5500);

    return () => {
      clearTimeout(timeoutIn);
      clearTimeout(timeoutOut);
    };
  };

  useEffect(animate, [visible]);

  const onClick = ({ currentTarget }) => setAnchorEl(currentTarget);
  const onClose = () => setAnchorEl(null);

  const onSelect = place => {
    onViewportChange({
      ...quickLooks[place],
      transitionInterpolator: new FlyToInterpolator(),
      transitionDuration: 2000,
    });

    onClose();
  };

  const title = t('Quick look');

  return (
    <>
      <Zoom in={visible}>
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
            <Logo className={clsx({ [classes.flip]: hover })} />
          </ButtonBase>
        </Tooltip>
      </Zoom>

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
