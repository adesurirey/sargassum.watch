import React, { useState, memo } from 'react';
import { func } from 'prop-types';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button, Menu, MenuItem } from '@material-ui/core';
import { TranslateRounded, ArrowDropDownRounded } from '@material-ui/icons';

import { currentLanguage, languageVariants, variantPath } from '../utils/i18n';

const propTypes = {
  navigate: func.isRequired,
};

const useStyles = makeStyles(theme => ({
  button: {
    color: theme.palette.text.secondary,
    fontWeight: 600,
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
  iconRight: {
    marginLeft: theme.spacing(1),
  },
}));

const LanguageSwitch = ({ navigate }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { t, i18n } = useTranslation();
  const classes = useStyles();

  const onClick = ({ currentTarget }) => setAnchorEl(currentTarget);
  const onClose = () => setAnchorEl(null);

  const onChange = variant => {
    i18n.changeLanguage(variant);
    return navigate(variantPath(variant), { replace: true });
  };

  const language = currentLanguage(i18n);
  const variants = languageVariants(i18n, language);

  const id = t('languages');

  return (
    <Grid item xs={12}>
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
        <ArrowDropDownRounded
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
          <MenuItem key={variant} onClick={() => onChange(variant)}>
            {t(variant)}
          </MenuItem>
        ))}
      </Menu>
    </Grid>
  );
};

export default memo(LanguageSwitch);

LanguageSwitch.propTypes = propTypes;
