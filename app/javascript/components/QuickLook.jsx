import React, { useState } from 'react';
import { bool, func } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { FlyToInterpolator } from 'react-map-gl';

import { makeStyles } from '@material-ui/styles';
import {
  Tooltip,
  Zoom,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core';
import { MenuRounded, ZoomOutMapRounded } from '@material-ui/icons';

import useModalView from '../hooks/useModalView';
import useEvent from '../hooks/useEvent';

const { quickLooks } = gon;
const places = Object.keys(quickLooks);

const propTypes = {
  loaded: bool.isRequired,
  onViewportChange: func.isRequired,
};

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(1),
  },
}));

const QuickLook = ({ loaded, onViewportChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const createModalView = useModalView('/quicklooks');
  const createEvent = useEvent();
  const { t } = useTranslation();
  const classes = useStyles();

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
      action: `Clicked quick look`,
      label: `${place} quick look`,
    });
  };

  const title = t('Quick look');

  return (
    <>
      <Tooltip title={title} TransitionComponent={Zoom} enterDelay={700}>
        <IconButton
          aria-label={title}
          aria-controls="quick-look-menu"
          aria-haspopup="true"
          disableTouchRipple
          onClick={onClick}
        >
          <MenuRounded />
        </IconButton>
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
