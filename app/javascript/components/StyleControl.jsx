import React, { memo } from 'react';
import { string, func } from 'prop-types';
import { useTranslation } from 'react-i18next';

import { Grid } from '@material-ui/core';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';

import useEvent from '../hooks/useEvent';

const propTypes = {
  style: string.isRequired,
  onChange: func.isRequired,
};

const StyleControl = ({ style, onChange }) => {
  const { t } = useTranslation();
  const createEvent = useEvent();

  const handleChange = (_e, newStyle) => {
    onChange(newStyle);

    createEvent({
      category: 'Settings',
      action: 'Changed map style',
      label: newStyle,
    });
  };

  return (
    <Grid item xs={12}>
      <ToggleButtonGroup
        aria-label={t('map style')}
        size="small"
        value={style}
        exclusive
        onChange={handleChange}
      >
        <ToggleButton value="map">{t('Map')}</ToggleButton>
        <ToggleButton value="satellite">{t('Satellite')}</ToggleButton>
      </ToggleButtonGroup>
    </Grid>
  );
};

export default memo(StyleControl);

StyleControl.propTypes = propTypes;
