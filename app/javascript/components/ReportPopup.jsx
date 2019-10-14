import React, { memo } from 'react';
import { func } from 'prop-types';
import { Popup } from 'react-map-gl';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/styles';

import useModalView from '../hooks/useModalView';
import Tooltip from './Tooltip';
import ReportForm from './ReportForm';

const propTypes = {
  onSubmit: func.isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
    cursor: 'default',
  },
}));

const ReportPopup = ({ onSubmit, ...popupProps }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  useModalView('/reports/new');

  const title = t('How is the beach here?');

  return (
    <Popup {...popupProps} closeOnClick={false} closeButton captureClick>
      <Tooltip className={classes.root} title={title}>
        <ReportForm onSubmit={onSubmit} />
      </Tooltip>
    </Popup>
  );
};

export default memo(ReportPopup);

ReportForm.propTypes = propTypes;
