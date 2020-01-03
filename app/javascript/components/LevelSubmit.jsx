import React from 'react';
import { number, string, func, bool } from 'prop-types';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import { useTranslation } from 'react-i18next';
import { Grid, Tooltip, Zoom, Fab } from '@material-ui/core';
import {
  SentimentSatisfiedRounded,
  SentimentDissatisfiedRounded,
} from '@material-ui/icons';

import SentimentNeutral from '../icons/SentimentNeutral';

import { arrayToObject } from '../utils/root';

const { levels } = gon;

const propTypes = {
  value: number.isRequired,
  label: string.isRequired,
  onClick: func.isRequired,
  disabled: bool.isRequired,
};

const useStyles = makeStyles(theme => {
  const colors = arrayToObject(levels, (obj, level) => {
    obj[level.label] = {
      boxShadow: '0 -2px 0 rgba(0,0,0,0.08) inset',
      backgroundColor: theme.palette.level[level.label].main,
      '&:hover': {
        backgroundColor: theme.palette.level[level.label].dark,
      },
    };
  });

  return {
    fab: {
      boxShadow: 'none',
    },
    label: {
      color: theme.palette.common.white,
    },
    ...colors,
  };
});

const icons = {
  clear: SentimentSatisfiedRounded,
  moderate: SentimentNeutral,
  critical: SentimentDissatisfiedRounded,
};

const LevelSubmit = ({ value, label, onClick, disabled }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const handleClick = () => {
    if (!disabled) {
      onClick(value);
    }
  };

  const Icon = icons[label];

  return (
    <Grid item>
      <Tooltip
        title={t(`${label} detailed`)}
        TransitionComponent={Zoom}
        enterDelay={225}
      >
        <Fab
          classes={{
            root: clsx(classes.fab, classes[label]),
            label: classes.label,
          }}
          color="inherit"
          type="submit"
          aria-label={label}
          onClickCapture={handleClick}
        >
          <Icon fontSize="large" />
        </Fab>
      </Tooltip>
    </Grid>
  );
};

export default LevelSubmit;

LevelSubmit.propTypes = propTypes;
