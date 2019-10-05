import React, { useState, memo } from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/styles';
import { Grid, FormControlLabel, Switch } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  label: {
    fontSize: theme.typography.fontSize,
  },
}));

const WebcamsToggle = ({ onToggle }) => {
  const [checked, setChecked] = useState(true);
  const { t } = useTranslation();
  const classes = useStyles();

  const handleChange = ({ target: { checked } }) => {
    setChecked(checked);
    onToggle(checked ? 'visible' : 'none');
  };

  return (
    <Grid item>
      <FormControlLabel
        classes={{ label: classes.label }}
        control={
          <Switch
            checked={checked}
            onChange={handleChange}
            value="visible"
            size="small"
            color="default"
          />
        }
        label={t('Show webcams')}
      />
    </Grid>
  );
};

export default memo(WebcamsToggle);
