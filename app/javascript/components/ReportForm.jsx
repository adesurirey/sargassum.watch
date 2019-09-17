import React, { useState } from 'react';
import { func } from 'prop-types';

import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

import LevelSubmit from './LevelSubmit';

const { levels } = gon;

const propTypes = {
  onSubmit: func.isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
}));

const ReportForm = ({ onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  const handleClick = value => {
    setLoading(true);
    onSubmit(value);
  };

  return (
    <Grid role="group" className={classes.root} container spacing={3}>
      {levels.map(level => (
        <LevelSubmit
          key={level.value}
          {...level}
          onClick={handleClick}
          disabled={loading}
        />
      ))}
    </Grid>
  );
};

export default ReportForm;

ReportForm.propTypes = propTypes;
