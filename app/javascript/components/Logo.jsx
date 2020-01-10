import React, { memo } from 'react';
import { bool, func } from 'prop-types';

import { makeStyles } from '@material-ui/styles';
import { ButtonBase } from '@material-ui/core';

import Image from '../images/sargassum-watch-logo.svg';

const propTypes = {
  loaded: bool.isRequired,
  onClick: func.isRequired,
};

const defaultProps = {
  loaded: false,
};

const useStyles = makeStyles(theme => ({
  image: {
    display: 'block',
    width: theme.spacing(4),
  },
}));

const Logo = ({ loaded, onClick }) => {
  const classes = useStyles();

  return (
    <ButtonBase onClick={onClick} disabled={!loaded}>
      <img src={Image} alt="Sargassum Watch" className={classes.image} />
    </ButtonBase>
  );
};

export default memo(Logo);

Logo.propTypes = propTypes;
Logo.defaultProps = defaultProps;
