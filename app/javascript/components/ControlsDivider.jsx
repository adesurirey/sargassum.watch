import React from 'react';

import { Grid, Divider } from '@material-ui/core';

const ControlsDivider = ({ ...dividerProps }) => (
  <Grid item xs={12}>
    <Divider light {...dividerProps} />
  </Grid>
);

export default ControlsDivider;
