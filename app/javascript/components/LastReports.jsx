import React, { Fragment, memo } from 'react';
import { bool, arrayOf, object } from 'prop-types';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@material-ui/core';

import { interval } from '../utils/propTypes';
import ControlsPanel from './ControlsPanel';
import Spinner from './Spinner';
import LegendPoint from './LegendPoint';
import SmartTimeAgo from './SmartTimeAgo';

const propTypes = {
  loaded: bool.isRequired,
  interval,
  features: arrayOf(object).isRequired,
};

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    maxHeight: 382,
  },
  list: {},
  gutters: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  inset: {
    marginLeft: 56,
  },
}));

const LastReports = ({ loaded, interval, features }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const latestReports = features
    .filter(({ properties }) => properties.humanLevel !== 'clear')
    .slice(0, 5);

  return (
    <ControlsPanel
      className={classes.container}
      title={t('Last reported strandings')}
      titleProps={{ variant: 'h2' }}
    >
      {!loaded && <Spinner delay={200} size={16} />}

      <Grid item xs={12}>
        <List dense disablePadding className={classes.list}>
          {latestReports.map(
            ({ properties: { id, updatedAt, name, humanLevel } }, index) => (
              <Fragment key={id}>
                {index !== 0 && (
                  <Divider variant="inset" classes={{ inset: classes.inset }} />
                )}
                <ListItem classes={{ gutters: classes.gutters }}>
                  <ListItemIcon>
                    <LegendPoint size="large" humanLevel={humanLevel} />
                  </ListItemIcon>
                  <ListItemText
                    primary={name}
                    secondary={<SmartTimeAgo date={updatedAt} />}
                    primaryTypographyProps={{ display: 'block', noWrap: true }}
                  />
                </ListItem>
              </Fragment>
            ),
          )}
        </List>
      </Grid>
    </ControlsPanel>
  );
};

const isEqual = (
  { loaded: prevLoaded, interval: prevInterval, features: prevFeatures },
  { loaded: nextLoaded, interval: nextInterval, features: nextFeatures },
) => {
  if (
    prevLoaded === nextLoaded &&
    prevInterval.id === nextInterval.id &&
    // Shallow comparing features would be too expansive
    prevFeatures.length === nextFeatures.length
  ) {
    return true;
  }
  return false;
};

export default memo(LastReports, isEqual);

LastReports.propTypes = propTypes;
