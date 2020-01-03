import React from 'react';
import { string, func } from 'prop-types';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { CardMedia, IconButton } from '@material-ui/core';
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
    height: 180,
  },
  control: {
    height: '100%',
  },
  label: {
    height: '100%',
  },
  button: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
    backgroundColor: theme.palette.grey[100],
    '&:hover': {
      backgroundColor: fade(
        theme.palette.action.active,
        theme.palette.action.hoverOpacity,
      ),
    },
  },
  icon: {
    paddingBottom: 58, // Lengend is 54px height + 4px margin
  },
}));

const PointPopupPhoto = ({ photo, onChange }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const handleChange = event => {
    onChange(event.target.files[0]);
  };

  return (
    <CardMedia className={classes.root} image={photo}>
      {!photo && (
        <div className={classes.control}>
          <input
            id="add-a-photo"
            type="file"
            accept="image/*"
            onChange={handleChange}
            hidden
          />
          <label htmlFor="add-a-photo" className={classes.label}>
            <IconButton
              component="div"
              centerRipple={false}
              classes={{
                root: classes.button,
                label: classes.icon,
              }}
              aria-label={t('Add a photo')}
            >
              <AddAPhotoRounded />
            </IconButton>
          </label>
        </div>
      )}
    </CardMedia>
  );
};

export default PointPopupPhoto;

PointPopupPhoto.propTypes = propTypes;
PointPopupPhoto.defaultProps = defaultProps;
