import React, { forwardRef, memo } from 'react';

import { makeStyles } from '@material-ui/styles';

import QuickLook from './QuickLook';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 72,
    width: 380,
    zIndex: theme.zIndex.drawer + 1,
    padding: theme.spacing(2),
    display: 'flex',
    background: theme.palette.background.paper,
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.grey[200],
    [theme.breakpoints.down('sm')]: {
      height: theme.spacing(8),
      width: '100%',
      padding: theme.spacing(1),
      background: 'transparent',
      borderBottomWidth: 0,
    },

    '& .mapboxgl-ctrl-geocoder': {
      position: 'relative',
      flex: 1,
      width: 'auto',
      maxWidth: 'none',
      zIndex: 1,
      fontSize: theme.typography.h1.fontSize,
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[4],
      outline: 'none',
      backgroundColor: theme.palette.background.paper,
      [theme.breakpoints.up('md')]: {
        boxShadow: 'none',
      },
      '&--input': {
        height: '100%',
        paddingLeft: theme.spacing(6),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        paddingRight: theme.spacing(5),
        color: [[theme.palette.text.primary], '!important'],
        lineHeight: [['24px'], '!important'],
        [theme.breakpoints.down('sm')]: {
          paddingTop: theme.spacing(2),
          paddingBottom: theme.spacing(2),
          paddingRight: theme.spacing(6),
        },
      },
      '&--icon, &--pin-right > *': {
        top: [[0], '!important'],
        height: '100%',
        backgroundColor: theme.palette.background.paper,
      },
      '&--icon-search, &--icon-loading': {
        display: [['none'], '!important'],
      },
      '&--icon-close': {
        margin: 0,
        fill: theme.palette.grey[500],
        [theme.breakpoints.down('sm')]: {
          paddingRight: 3,
        },
      },
      '&--button:focus': {
        outline: 'none',
      },
      '&--button:hover .mapboxgl-ctrl-geocoder--icon-close': {
        fill: theme.palette.text.primary,
      },
      '& .suggestions': {
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[4],
        fontSize: theme.typography.fontSize,
        lineHeight: theme.typography.body1.lineHeight,
        backgroundColor: theme.palette.background.paper,
        [theme.breakpoints.up('md')]: {
          boxShadow: theme.shadows[8],
        },
        '& li a': {
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          minHeight: theme.spacing(6),
          paddingLeft: theme.spacing(2),
          paddingRight: theme.spacing(2),
          paddingTop: theme.spacing(0.5),
          paddingBottom: theme.spacing(0.5),
          color: [[theme.palette.text.primary], '!important'],
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        },
        '& > .active > a, & > .active > a:hover': {
          backgroundColor: theme.palette.action.selected,
        },
      },
      '&--suggestion': {
        display: 'block',
        width: '100%',
        textOverflow: 'ellipsis',
      },
    },
  },

  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    paddingLeft: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    zIndex: theme.zIndex.drawer + 2,
  },
}));

const GeocoderContainer = forwardRef((quickLookProps, ref) => {
  const classes = useStyles();

  return (
    <div ref={ref} className={classes.root}>
      <div className={classes.menuContainer}>
        <QuickLook {...quickLookProps} />
      </div>
    </div>
  );
});

export default memo(GeocoderContainer);
