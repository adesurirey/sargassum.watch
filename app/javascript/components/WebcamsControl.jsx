import React, { useState, memo } from 'react';
import { func } from 'prop-types';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { Grid, FormControlLabel, Switch } from '@material-ui/core';

import useEvent from '../hooks/useEvent';

const propTypes = {
  onToggle: func.isRequired,
};

const useStyles = makeStyles(theme => ({
  label: {
    fontSize: theme.typography.fontSize,
  },
  labelPlacementStart: {
    marginLeft: 0,
    width: '100%',
    justifyContent: 'space-between',
  },

  switchRoot: {
    marginRight: -theme.spacing(1),
    paddingTop: 8,
    paddingRight: 9,
    paddingLeft: 8,
    paddingBottom: 8,
  },
  switchBase: {
    '&$checked + $track': {
      backgroundColor: theme.palette.primary.light,
      opacity: 1,
    },
  },
  checked: {
    '&:hover': {
      backgroundColor: fade(
        theme.palette.primary.light,
        theme.palette.action.hoverOpacity,
      ),
    },
  },
  track: {
    borderRadius: 11,
  },
}));

const WebcamsControl = ({ onToggle }) => {
  const [checked, setChecked] = useState(true);
  const { t } = useTranslation();
  const classes = useStyles();
  const createEvent = useEvent();

  const handleChange = ({ target: { checked } }) => {
    const value = checked ? 'visible' : 'none';
    setChecked(checked);

    onToggle(value);

    createEvent({
      category: 'Settings',
      action: 'Toggled webcams',
      label: `${value} webcams`,
    });
  };

  return (
    <Grid item xs={12}>
      <FormControlLabel
        classes={{
          label: classes.label,
          labelPlacementStart: classes.labelPlacementStart,
        }}
        control={
          <Switch
            classes={{
              root: classes.switchRoot,
              switchBase: classes.switchBase,
              thumb: classes.thumb,
              checked: classes.checked,
              track: classes.track,
            }}
            checked={checked}
            onChange={handleChange}
            value="visible"
            color="default"
          />
        }
        label={t('Show beach webcams')}
        labelPlacement="start"
      />
    </Grid>
  );
};

export default memo(WebcamsControl);

WebcamsControl.propTypes = propTypes;
