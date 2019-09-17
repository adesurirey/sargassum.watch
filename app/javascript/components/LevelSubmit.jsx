import React from 'react';
import { number, string, func, bool } from 'prop-types';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import { Typography, Grid, Fab } from '@material-ui/core';

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
      backgroundColor: theme.palette.level[level.label].main,
      '&:hover': {
        backgroundColor: theme.palette.level[level.label].dark,
      },
    };
  });

  return {
    root: {
      boxShadow: 'none',
    },
    ...colors,
  };
});

const LevelSubmit = ({ value, label, onClick, disabled }) => {
  const classes = useStyles();

  const handleClick = () => {
    if (!disabled) {
      onClick(value);
    }
  };

  return (
    <Grid item>
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <Fab
            classes={{ root: clsx(classes.root, classes[label]) }}
            color="inherit"
            size="small"
            type="submit"
            aria-label={label}
            onClickCapture={handleClick}
          >
            {' '}
          </Fab>
        </Grid>
        <Grid item>
          <Typography variant="caption">{label}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LevelSubmit;

LevelSubmit.propTypes = propTypes;
