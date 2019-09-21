import React, { useState, useEffect } from 'react';
import { node, object } from 'prop-types';

import { makeStyles } from '@material-ui/styles';
import { SwipeableDrawer, Grid } from '@material-ui/core';
import { MaximizeRounded } from '@material-ui/icons';

import BottomDrawerToggler from './BottomDrawerToggler';

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

const propTypes = {
  children: node.isRequired,
  chartProps: object.isRequired,
  reportButton: node.isRequired,
};

const useStyles = makeStyles(theme => ({
  paper: {
    background: theme.palette.grey[50],
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  iconContainer: {
    marginBottom: -theme.spacing(2),
    zIndex: 2,
    background: theme.palette.common.white,
    textAlign: 'center',
  },

  icon: {
    marginBottom: -theme.spacing(3),
  },

  container: {
    height: '100%',
    marginTop: 0,
    marginBottom: 0,
  },
}));

const BottomDrawer = ({
  children,
  chartProps,
  reportButton,
  reportButton: {
    props: { loading },
  },
}) => {
  const classes = useStyles();
  const [isOpen, setOpen] = useState(false);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(onClose, 2000);
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  return (
    <>
      <BottomDrawerToggler onOpen={onOpen} chartProps={chartProps} />

      <SwipeableDrawer
        classes={{
          paper: classes.paper,
        }}
        anchor="bottom"
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        ModalProps={{
          BackdropProps: {
            invisible: true,
          },
        }}
        PaperProps={{ square: false }}
        open={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      >
        {reportButton}

        <Grid classes={{ container: classes.container }} container spacing={1}>
          <Grid className={classes.iconContainer} item xs={12}>
            <MaximizeRounded
              className={classes.icon}
              color="disabled"
              fontSize="large"
            />
          </Grid>
          <Grid
            classes={{ container: classes.container }}
            container
            spacing={1}
          >
            {children}
          </Grid>
        </Grid>
      </SwipeableDrawer>
    </>
  );
};

export default BottomDrawer;

BottomDrawer.propTypes = propTypes;
