import React from 'react';
import { oneOfType, string, number, shape, oneOf } from 'prop-types';
import { useTranslation } from 'react-i18next';
import TimeAgo from 'react-timeago';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';

import en from 'react-timeago/lib/language-strings/en';
import es from 'react-timeago/lib/language-strings/es';
import fr from 'react-timeago/lib/language-strings/fr';

const locales = { en, es, fr };

const propTypes = {
  date: oneOfType([string, number]).isRequired,
  dateOptions: shape({
    weekday: oneOf(['long', 'short', 'narrow']),
    day: oneOf(['numeric', '2-digit']),
    hour: oneOf(['numeric', '2-digit']),
    minute: oneOf(['numeric', '2-digit']),
    second: oneOf(['numeric', '2-digit']),
    year: oneOf(['numeric', '2-digit']),
    month: oneOf(['long', 'short', 'narrow', 'numeric', '2-digit']),
  }),
};

const defaultProps = {
  dateOptions: { day: 'numeric', month: 'long', year: 'numeric' },
};

const getNow = () => Date.now();

const SmartTimeAgo = ({ date: time, dateOptions, ...typographyProps }) => {
  const { t, i18n } = useTranslation();

  const date = new Date(time);
  const options = { ...dateOptions };

  const language = i18n.languages[0];
  const locale = locales[language];

  const defaultFormatter = buildFormatter(locale);

  const formatter = (value, unit, suffix, epochSeconds, nextFormatter) => {
    switch (unit) {
      case 'second':
        return t('right now');
      case 'minute':
      case 'hour':
        return defaultFormatter(
          value,
          unit,
          suffix,
          epochSeconds,
          nextFormatter,
          getNow,
        );
      default:
        return date.toLocaleDateString(language, options);
    }
  };

  return <TimeAgo date={date} formatter={formatter} />;
};

export default SmartTimeAgo;

SmartTimeAgo.propTypes = propTypes;
SmartTimeAgo.defaultProps = defaultProps;
