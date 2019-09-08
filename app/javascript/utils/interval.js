const getFeatureDate = feature => new Date(feature.properties.updatedAt);

const getFirstDayOfMonth = feature => {
  const updatedAt = getFeatureDate(feature);
  const firstDay = new Date(updatedAt.getFullYear(), updatedAt.getMonth(), 1);

  return firstDay.getTime();
};

const getFirstMinuteOfDay = feature => {
  const updatedAt = getFeatureDate(feature);

  const firstMinute = new Date(
    updatedAt.getFullYear(),
    updatedAt.getMonth(),
    updatedAt.getDate(),
  );

  return firstMinute.getTime();
};

const intervalStartTime = ({ value, unit }) => {
  const date = new Date();

  if (unit === 'day') {
    date.setDate(date.getDate() - value);
  } else if (unit === 'month') {
    date.setMonth(date.getMonth() - value);
  }

  return date.getTime();
};

export const intervals = [
  { id: 1, value: 7, unit: 'day' },
  { id: 2, value: 30, unit: 'day' },
  { id: 3, value: 12, unit: 'month' },
];

export const getIteratee = interval => {
  if (interval.unit === 'day') {
    return getFirstMinuteOfDay;
  }
  return getFirstDayOfMonth;
};

export const featuresInInterval = (features, interval) => {
  const startTime = intervalStartTime(interval);

  return features.filter(({ properties: { updatedAt } }) => {
    const featureDate = new Date(updatedAt);
    return featureDate.getTime() >= startTime;
  });
};

export const toString = ({ value, unit }) =>
  `${value} ${unit}${value > 1 && 's'}`;
