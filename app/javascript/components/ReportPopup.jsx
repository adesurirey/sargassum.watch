import React, { useEffect, memo } from 'react';
import { func } from 'prop-types';
import { useTranslation } from 'react-i18next';

import useModalView from '../hooks/useModalView';
import Popup from './Popup';
import ReportForm from './ReportForm';

const propTypes = {
  onSubmit: func.isRequired,
};

const ReportPopup = ({ onSubmit, ...popupProps }) => {
  const { t } = useTranslation();
  const createModalView = useModalView('/reports/new');

  useEffect(createModalView, []);

  return (
    <Popup {...popupProps} title={t('How is the beach here?')}>
      <ReportForm onSubmit={onSubmit} />
    </Popup>
  );
};

export default memo(ReportPopup);

ReportPopup.propTypes = propTypes;
