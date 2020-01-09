import React, { useState, memo } from 'react';
import { string, bool, func } from 'prop-types';
import { useUpdateEffect } from 'react-use';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { CardMedia, IconButton } from '@material-ui/core';
import { AddAPhotoRounded, EditRounded } from '@material-ui/icons';

import useEvent from '../hooks/useEvent';

import Spinner from './Spinner';

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
    filter: ({ sending }) => (sending ? 'opacity(0.5)' : 'none'),
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
  spinner: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  padded: {
    paddingBottom: 62, // Lengend is 54px height + 2 * 4px margin
  },
}));

const PointPopupPhoto = ({ photo, canUpdate, onChange }) => {
  const [source, setSource] = useState(photo);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);

  useUpdateEffect(() => {
    // Uploaded photo variant received:
    // When the browser hits the variant URL, Active Storage will lazily transform the
    // original blob into the specified format and redirect to its new service location,
    // this could take some time. Here we set the component as loading to hold sending
    // state UI until the hoto is received and fully loaded.
    setLoading(true);
  }, [photo]);

  const classes = useStyles({ hasSource: !!source, sending });
  const { t } = useTranslation();

  const ActionIcon = !source ? AddAPhotoRounded : EditRounded;

  const createEvent = useEvent();
  const createPhotoUploadEvent = () => {
    createEvent({
      category: 'Reporting',
      action: 'Uploaded a photo',
      label: 'Report photo upload',
    });
  };

  const handleChange = event => {
    const file = event.target.files[0];

    setSource(URL.createObjectURL(file));
    setSending(true);

    onChange(file);

    createPhotoUploadEvent();
  };

  // Original blob transformation and loading completed, can show upload success.
  const handleUploadedPhotoLoad = () => {
    // Release preview object URL
    URL.revokeObjectURL(source);
    // Display uploaded photo variant
    setSource(photo);

    // Reset UI
    setSending(false);
    setLoading(false);
  };

  return (
    <>
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
                  label: classes.padded,
                  colorPrimary: classes.buttonColor,
                }}
                aria-label={t('Add a photo')}
              >
                <ActionIcon />
              </IconButton>
            </label>
          </div>
        )}
      </CardMedia>

      {sending && (
        <Spinner
          variant="medium"
          delay={100}
          containerClassName={clsx(classes.spinner, classes.padded)}
        />
      )}

      {loading && (
        <img
          hidden
          alt=""
          src={photo}
          importance="high"
          onLoad={handleUploadedPhotoLoad}
        />
      )}
    </>
  );
};

export default memo(PointPopupPhoto);

PointPopupPhoto.propTypes = propTypes;
PointPopupPhoto.defaultProps = defaultProps;
