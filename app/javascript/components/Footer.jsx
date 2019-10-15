import React, { memo } from 'react';
import { func } from 'prop-types';

import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

import LanguageSwitch from './LanguageSwitch';
import About from './About';
import TwitterButton from './TwitterButton';
import Credits from './Credits';

const propTypes = {
  navigate: func.isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

const Footer = ({ navigate }) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} className={classes.root}>
      <LanguageSwitch navigate={navigate} />
      <About />
      <TwitterButton />
      <Credits />
    </Grid>
  );
};

export default memo(Footer);

Footer.propTypes = propTypes;
