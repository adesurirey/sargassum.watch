import React, { memo } from 'react';
import { bool, arrayOf, number, func } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { FlyToInterpolator } from 'react-map-gl';

import { makeStyles } from '@material-ui/styles';
import { Autocomplete } from '@material-ui/lab';
import { TextField, Typography } from '@material-ui/core';
import { ExpandMoreRounded } from '@material-ui/icons';

import { currentLanguage } from '../utils/i18n';
import useGeocoder from '../hooks/useGeocoder';
import useGeocoderResult from '../hooks/useGeocoderResult';
import useEvent from '../hooks/useEvent';
import { WIDTH as LEFT_DRAWER_WIDTH } from './LeftDrawer';
import Logo from './Logo';

const propTypes = {
  loaded: bool,
  center: arrayOf(number.isRequired).isRequired,
  getMap: func.isRequired,
  onViewportChange: func.isRequired,
};

const defaultProps = {
  loaded: false,
};

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: theme.zIndex.drawer + 1,
    display: 'flex',
    alignItems: 'center',
    background: theme.palette.background.paper,
    [theme.breakpoints.up('md')]: {
      height: 72,
      width: LEFT_DRAWER_WIDTH,
      padding: theme.spacing(2),
      borderBottomStyle: 'solid',
      borderBottomWidth: 1,
      borderBottomColor: theme.palette.grey[200],
    },
    [theme.breakpoints.down('sm')]: {
      width: `calc(100% - ${theme.spacing(2)}px)`,
      margin: theme.spacing(1),
      padding: theme.spacing(1),
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[4],
    },
  },
  logoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    paddingLeft: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    zIndex: theme.zIndex.drawer + 2,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(1),
    },
  },
  autocomplete: {
    width: '100%',
  },
  input: {
    paddingLeft: theme.spacing(6),
  },
  paper: {
    maxHeight: '50vh',
    boxShadow: theme.shadows[4],
    margin: theme.spacing(1.25, 0),
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(2, -1),
    },
    '& > ul': {
      maxHeight: '50vh',
    },
  },
  listbox: {
    padding: 0,
  },
  result: {
    width: '100%',
  },
  text: {
    fontWeight: theme.typography.fontWeightBold,
  },
}));

const TRANSITION_PROPS = {
  transitionInterpolator: new FlyToInterpolator(),
  transitionDuration: 3000,
};

const {
  center: [initialLongitude, initialLatitude],
  zoom: initialZoom,
} = gon.quickLooks._all;

const initialPosition = {
  longitude: initialLongitude,
  latitude: initialLatitude,
  zoom: initialZoom,
};

const Geocoder = ({ loaded, center, getMap, onViewportChange }) => {
  const { i18n, t } = useTranslation();
  const language = currentLanguage(i18n);

  const { loading, inputValue, onInputChange, options } = useGeocoder({
    language,
    center,
  });
  const getViewport = useGeocoderResult(getMap);

  const createEvent = useEvent();

  const handleResult = (_event, result) => {
    if (!result) return;

    onViewportChange({
      ...getViewport(result),
      ...TRANSITION_PROPS,
    });

    createEvent({
      category: 'Navigation',
      action: 'Searched a place',
      label: `Searched ${result.place_name}`,
    });
  };

  const handleLogoClick = event => {
    onInputChange(event, '');

    onViewportChange({
      ...initialPosition,
      ...TRANSITION_PROPS,
    });

    createEvent({
      category: 'Navigation',
      action: 'Clicked logo',
      label: 'Logo click',
    });
  };

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.logoContainer}>
        <Logo loaded={loaded} onClick={handleLogoClick} />
      </div>

      <Autocomplete
        id="search"
        classes={{
          root: classes.autocomplete,
          inputRoot: classes.input,
          paper: classes.paper,
          listbox: classes.listbox,
        }}
        disabled={!loaded}
        loading={loading}
        loadingText={t('Loading...')}
        popupIcon={<ExpandMoreRounded />}
        autoComplete
        autoHighlight
        includeInputInList
        clearOnEscape
        clearText={t('Clear')}
        closeText={t('Close')}
        openText={t('Open')}
        noOptionsText={t('No options')}
        inputValue={inputValue}
        renderInput={params => (
          <TextField
            {...params}
            aria-label={t('Search...')}
            placeholder={t('Search...')}
            InputProps={{
              ...params.InputProps,
              disableUnderline: true,
            }}
            fullWidth
          />
        )}
        options={options}
        filterOptions={x => x}
        getOptionLabel={option =>
          typeof option === 'string' ? option : option.text
        }
        renderOption={option => (
          <div className={classes.result}>
            <Typography className={classes.text} noWrap>
              {option.text}
            </Typography>
            {option.place_name && option.place_name !== option.text && (
              <Typography noWrap variant="body2">
                {option.place_name}
              </Typography>
            )}
          </div>
        )}
        groupBy={option => (!!option.zoom ? t('Popular search') : null)}
        onInputChange={onInputChange}
        onChange={handleResult}
      />
    </div>
  );
};

export default memo(Geocoder);

Geocoder.propTypes = propTypes;
Geocoder.defaultProps = defaultProps;
