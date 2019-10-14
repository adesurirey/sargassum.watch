import React, { useState } from 'react';
import { func } from 'prop-types';

import { Grid } from '@material-ui/core';

import useEvent from '../hooks/useEvent';
import LevelSubmit from './LevelSubmit';

const levels = gon.levels.filter(level => level.label !== 'na');

const propTypes = {
  onSubmit: func.isRequired,
};

const ReportForm = ({ onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const createEvent = useEvent();

  const handleClick = value => {
    setLoading(true);
    onSubmit(value);

    createEvent({
      category: 'Reporting',
      action: 'Reported beach status',
      label: 'Beach status report',
    });
  };

  return (
    <Grid container justify="center" spacing={3}>
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
