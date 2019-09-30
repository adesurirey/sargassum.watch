import React from 'react';
import { oneOf } from 'prop-types';
import { useTranslation } from 'react-i18next';

import { Tooltip, Zoom, IconButton } from '@material-ui/core';
import { HelpOutlineRounded } from '@material-ui/icons';

const propTypes = {
  humanLevel: oneOf(['clear', 'moderate', 'na', 'critical']).isRequired,
};

const LegendHelp = ({ humanLevel }) => {
  const { t } = useTranslation();

  if (humanLevel !== 'na') {
    return null;
  }

  return (
    <Tooltip
      title={t(`${humanLevel} help`)}
      TransitionComponent={Zoom}
      disableFocusListener
    >
      <IconButton size="small">
        <HelpOutlineRounded fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
};

export default LegendHelp;

LegendHelp.propTypes = propTypes;
