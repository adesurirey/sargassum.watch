import React, { useState, useEffect, memo } from 'react';
import { string } from 'prop-types';
import { useTranslation } from 'react-i18next';

const propTypes = {
  url: string.isRequired,
};

const LiveImage = ({ url }) => {
  const [timestamp, setTimestamp] = useState(Date.now());
  const { t } = useTranslation();

  const tick = () => setTimestamp(Date.now());

  useEffect(() => {
    const interval = setInterval(tick, 2000);
    return () => clearInterval(interval);
  }, []);

  const src = `${url}?d=${timestamp}`;

  return (
    <img
      src={src}
      width="100%"
      height="auto"
      style={{ display: 'block' }}
      alt={t('Live is off')}
    />
  );
};

export default memo(LiveImage);

LiveImage.propTypes = propTypes;
