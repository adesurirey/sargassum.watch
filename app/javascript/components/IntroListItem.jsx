import React from 'react';
import { string, bool } from 'prop-types';

import { makeStyles } from '@material-ui/styles';
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Divider,
} from '@material-ui/core';

const propTypes = {
  emoji: string.isRequired,
  text: string.isRequired,
  divided: bool,
};

const defaultProps = {
  divided: false,
};

const useStyles = makeStyles(theme => ({
  divider: {
    marginRight: -theme.spacing(2),
  },
  emoji: {
    fontSize: 20,
    color: theme.palette.common.black,
  },
}));

const IntroListItem = ({ emoji, text, divided }) => {
  const classes = useStyles();

  return (
    <>
      <ListItem>
        <ListItemAvatar>
          <Typography
            component="span"
            role="img"
            classes={{ root: classes.emoji }}
          >
            {emoji}
          </Typography>
        </ListItemAvatar>
        <ListItemText
          secondaryTypographyProps={{ variant: 'body2' }}
          secondary={text}
        />
      </ListItem>

      {divided && (
        <Divider
          variant="inset"
          component="li"
          classes={{ inset: classes.divider }}
        />
      )}
    </>
  );
};

export default IntroListItem;

IntroListItem.propTypes = propTypes;
IntroListItem.defaultProps = defaultProps;
