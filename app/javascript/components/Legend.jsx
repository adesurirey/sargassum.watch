import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core';
import { Grid, Typography } from '@material-ui/core';

import { getLevelStyles } from '../utils/level';
// import LegendPoint from './LegendPoint';
import LegendHelp from './LegendHelp';

const { levels } = gon;

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    display: 'flex',
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
  },
  bar: {
    height: theme.spacing(2),
    flex: 1,
    color: theme.palette.common.white,
    textAlign: 'center',
  },
  ...getLevelStyles(theme, 'backgroundColor'),
  caption: {
    lineHeight: `${theme.spacing(2)}px`,
  },
  // container: {
  //   paddingTop: '0 !important',
  // },

  // gutters: {
  //   paddingLeft: 0,
  //   paddingRight: 0,
  // },
  //
  // icon: {
  //   minWidth: 'unset',
  //   marginRight: theme.spacing(1),
  // },
  //
  // text: {
  //   margin: 0,
  // },
  //
  // na: {
  //   color: theme.palette.text.disabled,
  // },
}));

const Legend = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Grid item xs={12}>
      <div className={classes.container}>
        <div className={classes.container}>
          {levels.map(({ label }) => (
            <div
              key={`bar-${label}`}
              className={clsx(classes.bar, classes[label])}
            >
              <Typography
                variant="caption"
                display="block"
                color="inherit"
                classes={{ caption: classes.caption }}
                noWrap
              >
                {t(label)}
                {label === 'na' && <LegendHelp humanLevel={label} />}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </Grid>
  );
};

// {levels.map(({ label }) => (
//   <ListItem key={label} classes={{ gutters: classes.gutters }}>
//     <ListItemIcon classes={{ root: classes.icon }}>
//       <LegendPoint size="inherit" humanLevel={label} />
//     </ListItemIcon>
//     <ListItemText
//       classes={{
//         root: clsx(classes.text, classes[label]),
//       }}
//       primary={t(`${label} detailed`)}
//       primaryTypographyProps={{ display: 'block', noWrap: true }}
//     />
//     {label === 'na' && <LegendHelp humanLevel={label} />}
//   </ListItem>
// ))}

export default memo(Legend);
