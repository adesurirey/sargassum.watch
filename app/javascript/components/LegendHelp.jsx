import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/styles';
import { IconButton, Popover, Typography } from '@material-ui/core';
import { HelpOutlineRounded } from '@material-ui/icons';

import { humanLevel } from '../utils/propTypes';

const propTypes = {
  humanLevel,
};

const useStyles = makeStyles(theme => ({
  button: {
    fontSize: 'inherit',
  },
  popover: {
    maxWidth: 220,
    padding: theme.spacing(1, 2),
  },
}));

const LegendHelp = ({ humanLevel }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { t } = useTranslation();
  const classes = useStyles();

  const onClick = ({ currentTarget }) => setAnchorEl(currentTarget);
  const onClose = () => setAnchorEl(null);

  const helpText = t(`${humanLevel} help`);

  return (
    <>
      <IconButton
        aria-label={t('help')}
        aria-controls={humanLevel}
        aria-haspopup="true"
        classes={{ sizeSmall: classes.button }}
        size="small"
        color="inherit"
        onClick={onClick}
      >
        <HelpOutlineRounded fontSize="inherit" />
      </IconButton>

      <Popover
        id={humanLevel}
        classes={{ paper: classes.popover }}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={onClose}
      >
        <Typography variant="caption">{helpText}</Typography>
      </Popover>
    </>
  );
};

export default LegendHelp;

LegendHelp.propTypes = propTypes;
