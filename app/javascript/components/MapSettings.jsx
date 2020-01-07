import React, { useState, memo } from 'react';
import { bool, func, string } from 'prop-types';
import { useTranslation } from 'react-i18next';

import { makeStyles, useTheme } from '@material-ui/styles';
import {
  Zoom,
  Tooltip,
  Fab,
  Popover,
  Typography,
  Grid,
} from '@material-ui/core';
import { LayersRounded } from '@material-ui/icons';

import ControlsDivider from './ControlsDivider';
import StyleControl from './StyleControl';
import WebcamsControl from './WebcamsControl';
import { WIDTH as LEFT_DRAWER_WIDTH } from './LeftDrawer';

const propTypes = {
  loaded: bool.isRequired,
  style: string.isRequired,
  onStyleChange: func.isRequired,
  onWebcamsToggle: func.isRequired,
};

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'absolute',
    top: 0,
    left: LEFT_DRAWER_WIDTH,
    margin: theme.spacing(2),
    zIndex: 1,
    boxShadow: theme.shadows[4],
    [theme.breakpoints.down('sm')]: {
      top: 56,
      right: 0,
      left: 'auto',
    },
  },

  container: {
    width: '100%',
    maxWidth: 260,
    margin: 0,
    paddingTop: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },

  title: {
    paddingBottom: theme.spacing(2),
  },

  divider: {
    marginTop: theme.spacing(2),
    marginRight: -theme.spacing(2),
    marginLeft: -theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
}));

const MapSettings = ({ loaded, style, onStyleChange, onWebcamsToggle }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();

  const onClick = ({ currentTarget }) => setAnchorEl(currentTarget);
  const onClose = () => setAnchorEl(null);

  const title = t('Map settings');

  return (
    <>
      <Zoom
        in={loaded}
        exit={false}
        style={{
          transitionDelay: theme.transitions.duration.enteringScreen + 250,
        }}
      >
        <Tooltip title={title} TransitionComponent={Zoom}>
          <Fab
            aria-label={title}
            aria-controls="map-settings"
            aria-haspopup="true"
            classes={{ root: classes.fab }}
            color="secondary"
            size="small"
            onClick={onClick}
          >
            <LayersRounded fontSize="small" color="inherit" />
          </Fab>
        </Tooltip>
      </Zoom>

      <Popover
        id="map-settings"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={onClose}
      >
        <Grid classes={{ container: classes.container }} container>
          <Grid item xs={12} className={classes.title}>
            <Typography variant="h2">{title}</Typography>
          </Grid>
          <StyleControl style={style} onChange={onStyleChange} />
          <ControlsDivider classes={{ root: classes.divider }} />
          <WebcamsControl onToggle={onWebcamsToggle} />
        </Grid>
      </Popover>
    </>
  );
};

export default memo(MapSettings);

MapSettings.propTypes = propTypes;
