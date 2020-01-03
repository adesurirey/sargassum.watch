import React, { useState } from 'react';
import { func } from 'prop-types';

import { makeStyles } from '@material-ui/styles';

import useEvent from '../hooks/useEvent';
import LevelSubmit from './LevelSubmit';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1, 0, 2, 0),
    display: 'flex',
    justifyContent: 'space-evenly',
  },
}));

const levels = gon.levels.filter(level => level.label !== 'na');

const propTypes = {
  onSubmit: func.isRequired,
};

const ReportForm = ({ onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const createEvent = useEvent();
  const classes = useStyles();

  const handleClick = value => {
    setLoading(true);
    onSubmit(value);

    createEvent({
      category: 'Reporting',
      action: 'Reported beach status',
      label: `${value} beach report`,
    });
  };

  return (
    <div className={classes.root}>
      {levels.map(level => (
        <LevelSubmit
          key={level.value}
          {...level}
          onClick={handleClick}
          disabled={loading}
        />
      ))}
    </div>
  );
};

export default ReportForm;

ReportForm.propTypes = propTypes;
