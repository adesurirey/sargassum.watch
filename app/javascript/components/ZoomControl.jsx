import React from 'react';
import { NavigationControl } from 'react-map-gl';

import { makeStyles } from '@material-ui/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import MinusIconLight from '../images/minus-light.svg';
import MinusIconDark from '../images/minus-dark.svg';
import PlusIconLight from '../images/plus-light.svg';
import PlusIconDark from '../images/plus-dark.svg';

const buttonStyle = {
  padding: 9,
  '&:focus': {
    boxShadow: 'none',
    borderRadius: 'unset',
  },
};

const backgroundStyle = {
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundOrigin: 'content-box',
  backgroundRepeat: 'no-repeat',
};

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),

    '& .mapboxgl-ctrl-group': {
      backgroundColor: theme.palette.secondary.main,
      boxShadow: [[theme.shadows[4]], '!important'],
      borderRadius: theme.shape.borderRadius,
      overflow: 'hidden',
      '& > button': {
        transition: theme.transitions.create('background-color', {
          duration: theme.transitions.duration.shortest,
        }),
      },
      '& > button:hover': {
        backgroundColor: [[theme.palette.secondary.dark], '!important'],
      },
      '& > button + button': {
        borderTop: `1px solid ${theme.palette.secondary.dark}`,
      },
      '& .mapboxgl-ctrl-zoom-in': {
        ...buttonStyle,
        '& .mapboxgl-ctrl-icon': {
          ...backgroundStyle,
          backgroundImage:
            theme.palette.type === 'light'
              ? [[`url(${PlusIconLight})`], '!important']
              : [[`url(${PlusIconDark})`], '!important'],
        },
      },
      '& .mapboxgl-ctrl-zoom-out': {
        ...buttonStyle,
        '& .mapboxgl-ctrl-icon': {
          ...backgroundStyle,
          backgroundImage:
            theme.palette.type === 'light'
              ? [[`url(${MinusIconLight})`], '!important']
              : [[`url(${MinusIconDark})`], '!important'],
        },
      },
    },
  },
}));

const ZoomControl = () => {
  const theme = useTheme();
  const isWideScreen = useMediaQuery(theme.breakpoints.up('md'));
  const classes = useStyles();

  return (
    isWideScreen && (
      <div className={classes.root}>
        <NavigationControl showCompass={false} />
      </div>
    )
  );
};

export default ZoomControl;
