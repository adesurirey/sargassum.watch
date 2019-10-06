import React, { useState, memo } from 'react';
import { func } from 'prop-types';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button, Menu, MenuItem } from '@material-ui/core';
import { TranslateRounded, KeyboardArrowDownRounded } from '@material-ui/icons';

import {
  currentLanguage,
  languageVariants,
  languagePaths,
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
  iconRight: {
    marginLeft: theme.spacing(1) / 2,
  },
}));

const LanguageSwitch = ({ navigate }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { t, i18n } = useTranslation();
  const classes = useStyles();

  const paths = languagePaths(i18n);

  const onClick = ({ currentTarget }) => setAnchorEl(currentTarget);
  const onClose = () => setAnchorEl(null);

  const onSelect = variant => {
    onClose();

    i18n.changeLanguage(variant, () =>
      navigate(paths[variant] + window.location.search + window.location.hash, {
        replace: true,
      }),
    );
  };

  const language = currentLanguage(i18n);
  const variants = languageVariants(i18n, language);

  const id = t('languages');

  return (
    <Grid item>
      <Button
        classes={{ root: classes.button }}
        aria-controls={id}
        aria-haspopup="true"
        onClick={onClick}
      >
        <TranslateRounded
          className={classes.iconLeft}
          fontSize="small"
          color="inherit"
        />
        {t(language)}
        <KeyboardArrowDownRounded
          className={classes.iconRight}
          fontSize="small"
          color="inherit"
        />
      </Button>
      <Menu
        id={id}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={onClose}
      >
        {variants.map(variant => (
          <MenuItem key={variant} onClick={() => onSelect(variant)}>
            {t(variant)}
          </MenuItem>
        ))}
      </Menu>
    </Grid>
  );
};

export default memo(LanguageSwitch);

LanguageSwitch.propTypes = propTypes;
