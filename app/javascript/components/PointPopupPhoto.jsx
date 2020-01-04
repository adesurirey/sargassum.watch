import React, { useState, useEffect, memo } from 'react';
import { string, bool, func } from 'prop-types';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { CardMedia, IconButton, LinearProgress } from '@material-ui/core';
import { AddAPhotoRounded, EditRounded } from '@material-ui/icons';

import useEvent from '../hooks/useEvent';

const propTypes = {
  photo: string,
  canUpdate: bool,
  onChange: func,
};

const defaultProps = {
  photo: null,
  canUpdate: false,
  onChange: undefined,
};

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
  },
  fullHeight: {
    height: '100%',
  },
  button: {
    width: '100%',
    padding: 0,
    borderRadius: 0,
    opacity: ({ hasSource }) => (hasSource ? 0 : 1),
    transition: theme.transitions.create(['opacity']),
    '&:hover': {
      opacity: 1,
    },
  },
  buttonColor: ({ hasSource }) =>
    hasSource && {
      color: theme.palette.common.white,
      '&:hover': {
        backgroundColor: fade(
          theme.palette.common.white,
          theme.palette.action.hoverOpacity,
        ),
      },
    },
  icon: {
    paddingBottom: 58, // Lengend is 54px height + 4px margin
  },
  progress: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: fade(theme.palette.primary.light, 0.38),
  },
  progressBar: {
    backgroundColor: theme.palette.primary.main,
  },
}));

const PointPopupPhoto = ({ photo, canUpdate, onChange }) => {
  const [source, setSource] = useState(photo);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setSent(true);
    const timer = setTimeout(() => {
      setSending(false);
      setSent(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [photo]);

  const classes = useStyles({ hasSource: !!source });
  const { t } = useTranslation();

  const ActionIcon = !source ? AddAPhotoRounded : EditRounded;

  const createEvent = useEvent();

  const handleChange = event => {
    const file = event.target.files[0];

    setSending(true);
    setSource(URL.createObjectURL(file));
    onChange(file);

    createEvent({
      category: 'Reporting',
      action: 'Uploaded a photo',
      label: 'Report photo upload',
    });
  };

  return (
    <CardMedia
      className={clsx(classes.root, classes.fullHeight)}
      image={source}
    >
      {canUpdate && !sending && (
        <div className={classes.fullHeight}>
          <input
            id="add-a-photo"
            type="file"
            accept="image/*"
            onChange={handleChange}
            hidden
          />
          <label htmlFor="add-a-photo" className={classes.fullHeight}>
            <IconButton
              component="div"
              color="primary"
              centerRipple={false}
              classes={{
                root: clsx(classes.button, classes.fullHeight),
                label: classes.icon,
                colorPrimary: classes.buttonColor,
              }}
              aria-label={t('Add a photo')}
            >
              <ActionIcon />
            </IconButton>
          </label>
        </div>
      )}

      {sending && (
        <LinearProgress
          variant={sent ? 'determinate' : 'indeterminate'}
          value={sent ? 100 : undefined}
          classes={{ root: classes.progress, bar: classes.progressBar }}
        />
      )}
    </CardMedia>
  );
};

export default memo(PointPopupPhoto);

PointPopupPhoto.propTypes = propTypes;
PointPopupPhoto.defaultProps = defaultProps;
