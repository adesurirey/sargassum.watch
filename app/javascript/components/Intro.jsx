import React, { useState, useEffect, memo } from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/styles';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  List,
  Typography,
} from '@material-ui/core';

import useEvent from '../hooks/useEvent';
import IntroListItem from './IntroListItem';
import IntroMedia from './IntroMedia';

const useStyles = makeStyles(theme => ({
  paper: {
    maxWidth: 400,
    margin: theme.spacing(3),
  },
  content: {
    padding: theme.spacing(2, 2, 0),
  },
  h2: {
    fontWeight: theme.typography.fontWeightRegular,
    lineHeight: 'unset',
  },
}));

const { firstVisit } = gon;

const itemsFactory = t => [
  {
    emoji: '🔍',
    text: t('Zoom on the map to reveal clean beaches'),
  },
  {
    emoji: '👀',
    text: t('Click on the eyes to watch live beach webcams'),
  },
  {
    emoji: '✋',
    text: t('Report the presence of sargasses at your position'),
  },
];

const Intro = () => {
  const [isOpen, setOpen] = useState(false);
  const { t } = useTranslation();
  const classes = useStyles();
  const createEvent = useEvent();

  const onClose = () => setOpen(false);

  useEffect(() => {
    if (firstVisit) {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      createEvent({
        category: 'Onboarding',
        action: 'Displayed intro modal',
        label: 'Map intro modal',
        nonInteraction: true,
      });
    }
  }, [isOpen, createEvent]);

  const items = itemsFactory(t);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-label={t('welcome')}
      maxWidth="xs"
      classes={{ paper: classes.paper }}
    >
      <IntroMedia />
      <DialogContent classes={{ root: classes.content }}>
        <Typography variant="h2" classes={{ h2: classes.h2 }}>
          {t('Welcome')}
        </Typography>
        <List>
          {items.map((item, index) => (
            <IntroListItem
              key={index}
              {...item}
              divided={index < items.length - 1}
            />
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus>
          {t('OK')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(Intro);
