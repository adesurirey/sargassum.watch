import React, { useState, useEffect, memo } from 'react';
import { string, func } from 'prop-types';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { CardMedia, IconButton, LinearProgress } from '@material-ui/core';
import { AddAPhotoRounded } from '@material-ui/icons';

const propTypes = {
  photo: string,
  onChange: func,
};

const defaultProps = {
  photo: null,
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
    borderRadius: 0,
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

const PointPopupPhoto = ({ photo, onChange }) => {
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

  const classes = useStyles();
  const { t } = useTranslation();

  const handleChange = event => {
    const file = event.target.files[0];

    setSending(true);
    setSource(URL.createObjectURL(file));
    onChange(file);
  };

  return (
    <CardMedia
      className={clsx(classes.root, classes.fullHeight)}
      image={source}
    >
      {!source && (
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
              }}
              aria-label={t('Add a photo')}
            >
              <AddAPhotoRounded />
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
