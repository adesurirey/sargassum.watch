import React, { memo } from 'react';
import { string, func } from 'prop-types';
import { useTranslation } from 'react-i18next';

import { Grid } from '@material-ui/core';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';

const propTypes = {
  style: string.isRequired,
  onChange: func.isRequired,
};

const StyleControl = ({ style, onChange }) => {
  const { t } = useTranslation();

  const handleChange = (_e, newStyle) => onChange(newStyle);

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
