import React from 'react';
import { bool, func } from 'prop-types';
import { useTranslation } from 'react-i18next';

import { Tooltip, IconButton } from '@material-ui/core';
import { Fullscreen, FullscreenExit } from '@material-ui/icons';

const propTypes = {
  toggled: bool,
  onToggle: func.isRequired,
};

const defaultProps = {
  toggled: false,
};

const FullscreenControl = ({ toggled, onToggle, ...iconButtonProps }) => {
  const { t } = useTranslation();

  const [title, Icon] = toggled
    ? [t('Exit fullscreen'), FullscreenExit]
    : [t('Fullscreen'), Fullscreen];

  const handleClick = () => {
    onToggle(!toggled);
  };

  return (
    <Tooltip title={title} placement="top" enterDelay={700}>
      <IconButton {...iconButtonProps} onClick={handleClick}>
        <Icon />
      </IconButton>
    </Tooltip>
  );
};

export default FullscreenControl;

FullscreenControl.propTypes = propTypes;
FullscreenControl.defaultProps = defaultProps;
