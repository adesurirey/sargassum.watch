import React, { forwardRef } from 'react';
import { oneOfType, string, node, func } from 'prop-types';
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
  onClose: func,
};

const defaultProps = {
  title: null,
  onClose: () => {},
};

const useStyles = makeStyles(theme => ({
  root: {
    pointerEvents: 'none',
  },
  scrollPaper: {
    alignItems: 'flex-end',
  },
  paper: {
    width: '100%',
    maxWidth: 320,
    [theme.breakpoints.down('sm')]: {
      width: `calc(100vw - ${theme.spacing(4)}px)`,
      margin: theme.spacing(2),
    },
    pointerEvents: 'all',
  },
  header: {
    margin: 0,
    padding: theme.spacing(1, 1, 1, 2),
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    cursor: 'move',
  },
  title: {
    paddingRight: theme.spacing(1),
  },
  content: {
    padding: '0 !important',
  },
}));

const Transition = forwardRef((props, ref) => (
  <Slide ref={ref} direction="up" {...props} />
));

const PaperComponent = props => (
  <Draggable cancel={'[class*="MuiDialogContent-root"]'}>
    <Paper {...props} />
  </Draggable>
);

const Popup = ({ title, children, onClose }) => {
  const theme = useTheme();
  const isWideScreen = useMediaQuery(theme.breakpoints.up('md'));
  const classes = useStyles();

  return (
    <Dialog
      open
      TransitionComponent={Transition}
      PaperComponent={isWideScreen ? PaperComponent : undefined}
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
      }}
      onClose={onClose}
      aria-labelledby="popup-title"
    >
      {title && (
        <DialogTitle disableTypography className={classes.header}>
          <Typography
            variant="h2"
            classes={{ root: classes.title }}
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
