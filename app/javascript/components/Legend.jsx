import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core';
import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';

import LegendPoint from './LegendPoint';
import LegendHelp from './LegendHelp';

const { levels } = gon;

const useStyles = makeStyles(theme => ({
  gutters: {
    paddingLeft: 0,
    paddingRight: 0,
  },

  icon: {
    minWidth: 'unset',
    marginRight: theme.spacing(1),
  },

  text: {
    margin: 0,
  },

  na: {
    color: theme.palette.text.secondary,
  },
}));

const Legend = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Grid item xs={12}>
      <List dense disablePadding>
        {levels.map(({ label }) => (
          <ListItem key={label} classes={{ gutters: classes.gutters }}>
            <ListItemIcon classes={{ root: classes.icon }}>
              <LegendPoint size="inherit" humanLevel={label} />
            </ListItemIcon>
            <ListItemText
              classes={{
                root: clsx(classes.text, classes[label]),
              }}
              primary={t(`${label} detailed`)}
            />
            <LegendHelp humanLevel={label} />
          </ListItem>
        ))}
      </List>
    </Grid>
  );
};

export default memo(Legend);
