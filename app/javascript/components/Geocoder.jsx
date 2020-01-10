import React, { memo } from 'react';
import { bool, arrayOf, number, func } from 'prop-types';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/styles';
import { TextField, Typography } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { currentLanguage } from '../utils/i18n';
import useGeocoder from '../hooks/useGeocoder';
import useGeocoderResult from '../hooks/useGeocoderResult';
import useEvent from '../hooks/useEvent';
import QuickLook from './QuickLook';

const propTypes = {
  loaded: bool,
  center: arrayOf(number.isRequired).isRequired,
  getMap: func.isRequired,
  onChange: func.isRequired,
};

const defaultProps = {
  loaded: false,
};

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
  },

  quickLookContainer: {
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

const Geocoder = ({ loaded, center, getMap, onChange }) => {
  const { i18n, t } = useTranslation();
  const language = currentLanguage(i18n);

  const { options, onInputChange } = useGeocoder({ language, center });
  const getViewport = useGeocoderResult(getMap);

  const createEvent = useEvent();

  const handleResult = (_event, result) => {
    if (!result) return;

    onChange(getViewport(result));

    createEvent({
      category: 'Navigation',
      action: 'Searched a place',
      label: `Searched ${result.place_name}`,
    });
  };

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.quickLookContainer}>
        <QuickLook loaded={loaded} onViewportChange={onChange} />
      </div>
      <Autocomplete
        id="search"
        style={{ width: '100%' }}
        disabled={!loaded}
        getOptionLabel={option =>
          typeof option === 'string' ? option : option.text
        }
        filterOptions={x => x}
        options={options}
        autoComplete
        autoHighlight
        includeInputInList
        freeSolo
        disableOpenOnFocus
        clearOnEscape
        renderInput={params => (
          <TextField {...params} label={t('Search...')} fullWidth />
        )}
        renderOption={option => (
          <div>
            <Typography>{option.text}</Typography>
            {option.place_name && option.place_name !== option.text && (
              <Typography variant="body2">{option.place_name}</Typography>
            )}
          </div>
        )}
        onInputChange={onInputChange}
        onChange={handleResult}
      />
    </div>
  );
};

export default memo(Geocoder);

Geocoder.propTypes = propTypes;
Geocoder.defaultProps = defaultProps;
