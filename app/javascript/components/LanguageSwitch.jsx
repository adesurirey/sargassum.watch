import React, { useState, memo } from 'react';
import { func } from 'prop-types';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button, Menu, MenuItem } from '@material-ui/core';
import { TranslateRounded } from '@material-ui/icons';

import {
  currentLanguage,
  languagePaths,
  availableLanguages,
} from '../utils/i18n';

const propTypes = {
  navigate: func.isRequired,
};

const useStyles = makeStyles(theme => ({
  button: {
    color: theme.palette.text.secondary,
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
}));

const LanguageSwitch = ({ navigate }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { t, i18n } = useTranslation();
  const classes = useStyles();

  const paths = languagePaths(i18n);

  const onClick = ({ currentTarget }) => setAnchorEl(currentTarget);
  const onClose = () => setAnchorEl(null);

  const onSelect = lang => {
    onClose();
    i18n.changeLanguage(lang, () =>
      navigate(paths[lang] + window.location.search + window.location.hash, {
        replace: true,
      }),
    );
  };

  const current = currentLanguage(i18n);
  const availables = availableLanguages(i18n);

  const id = t('languages');

  return (
    <Grid item>
      <Button
        aria-controls={id}
        aria-haspopup="true"
        classes={{ root: classes.button }}
        size="small"
        onClick={onClick}
      >
        <TranslateRounded
          className={classes.iconLeft}
          fontSize="small"
          color="inherit"
        />
        {t(current)}
      </Button>
      <Menu
        id={id}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={onClose}
      >
        {availables.map(lang => (
          <MenuItem
            key={lang}
            onClick={() => onSelect(lang)}
            selected={lang === current}
          >
            {t(lang)}
          </MenuItem>
        ))}
      </Menu>
    </Grid>
  );
};

export default memo(LanguageSwitch);

LanguageSwitch.propTypes = propTypes;
