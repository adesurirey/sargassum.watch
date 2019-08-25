import React from 'react';
import { node } from 'prop-types';

import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 250,
    paddingTop: 6, // mapbox-popup-content: 10px
    paddingLeft: 6, // mapbox-popup-content: 10px
    paddingRight: 6, // mapbox-popup-content: 10px
    paddingBottom: 1, // mapbox-popup-content: 15px
  },
}));

const propTypes = {
  children: node.isRequired,
};

const PopupContainer = ({ children }) => {
  const classes = useStyles();

  return <div className={classes.root}>{children}</div>;
};

export default PopupContainer;

PopupContainer.propTypes = propTypes;
