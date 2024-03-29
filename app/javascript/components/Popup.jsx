import React, { forwardRef } from 'react';
import { oneOfType, string, node, bool, func } from 'prop-types';
import Draggable from 'react-draggable';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, makeStyles } from '@material-ui/styles';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Paper,
  Typography,
} from '@material-ui/core';

import PopupCloseButton from './PopupCloseButton';

const propTypes = {
  title: oneOfType([string, node]),
  children: node.isRequired,
  isFullHeight: bool,
  isFullScreen: bool,
  onExitFullScreen: func,
  onClose: func.isRequired,
};

const defaultProps = {
  title: null,
  isFullHeight: false,
  isFullScreen: false,
  onExitFullScreen: undefined,
};

export const [MAX_WIDTH, MAX_HEIGHT, HEADER_MAX_HEIGHT] = [320, 216, 36];

const useStyles = makeStyles(theme => ({
  root: {
    pointerEvents: 'none', // Allows clicking through the backdrop
  },
  scrollPaper: {
    alignItems: 'flex-end',
  },
  paper: {
    width: '100%',
    maxWidth: MAX_WIDTH,
    height: ({ isFullHeight }) => (isFullHeight ? '100%' : 'auto'),
    maxHeight: MAX_HEIGHT,
    [theme.breakpoints.down('sm')]: {
      width: `calc(100vw - ${theme.spacing(4)}px)`,
      margin: theme.spacing(2),
    },
    pointerEvents: 'all',
    transition: theme.transitions.create(['max-width', 'max-height']),
  },
  paperFullscreen: {
    width: '100%',
    [theme.breakpoints.up('md')]: {
      maxWidth: MAX_WIDTH * 3,
      height: [[`calc(100% - ${theme.spacing(6)}px)`], '!important'],
      maxHeight: MAX_HEIGHT * 3,
      margin: theme.spacing(3),
      borderRadius: theme.shape.borderRadius,
    },
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100vw',
      height: '100%',
      maxHeight: '100vh',
      margin: 0,
    },
    transform: [['none'], '!important'], // Cancel dragged position
  },
  header: {
    maxHeight: HEADER_MAX_HEIGHT,
    margin: 0,
    padding: theme.spacing(1, 1, 1, 2),
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    [theme.breakpoints.up('md')]: {
      // No dragging on fullscreen
      cursor: ({ isFullScreen }) => (isFullScreen ? 'default' : 'move'),
    },
  },
  title: {
    paddingRight: theme.spacing(1),
  },
  content: {
    position: 'relative', // For absolute positioning inside
    height: ({ isFullHeight }) => (isFullHeight ? '100%' : 'auto'),
    padding: [[0], '!important'],
  },
}));

const Transition = forwardRef((props, ref) => (
  <Slide ref={ref} direction="up" {...props} />
));

const DraggablePaper = props => (
  <Draggable cancel={'[class*="MuiDialogContent-root"]'}>
    <Paper {...props} />
  </Draggable>
);

const Popup = ({
  title,
  children,
  isFullHeight,
  isFullScreen,
  onExitFullScreen,
  onClose,
}) => {
  const theme = useTheme();
  const isWideScreen = useMediaQuery(theme.breakpoints.up('md'));
  const classes = useStyles({ isFullHeight, isFullScreen });

  const handleEscapeKeyDown = () => {
    if (isFullScreen && onExitFullScreen) {
      onExitFullScreen();
    }
  };

  return (
    <Dialog
      open
      TransitionComponent={Transition}
      fullScreen={isFullScreen}
      PaperComponent={isWideScreen ? DraggablePaper : undefined}
      disableEscapeKeyDown={isFullScreen}
      onEscapeKeyDown={handleEscapeKeyDown}
      keepMounted
      hideBackdrop
      disableBackdropClick
      disableRestoreFocus
      disableScrollLock
      disableEnforceFocus
      classes={{
        root: classes.root,
        scrollPaper: classes.scrollPaper,
        paper: classes.paper,
        paperFullScreen: classes.paperFullscreen,
      }}
      onClose={onClose}
      aria-labelledby="popup-title"
    >
      {title && (
        <DialogTitle disableTypography className={classes.header}>
          <Typography
            variant="h2"
            classes={{ root: classes.title }}
            noWrap
            id="popup-title"
          >
            {title}
          </Typography>
          <PopupCloseButton onClose={onClose} />
        </DialogTitle>
      )}
      <DialogContent classes={{ root: classes.content }}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Popup;

Popup.propTypes = propTypes;
Popup.defaultProps = defaultProps;
