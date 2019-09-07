import React, { memo } from 'react';
import { arrayOf, shape, number, string, oneOf } from 'prop-types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import _groupBy from 'lodash/groupBy';
import _countBy from 'lodash/countBy';
import _sortBy from 'lodash/sortBy';

import { useTheme } from '@material-ui/styles';

const propTypes = {
  features: arrayOf(
    shape({
      properties: shape({
        humanLevel: string.isRequired,
        updatedAt: string.isRequired,
      }).isRequired,
    }),
  ).isRequired,
  interval: shape({
    unit: oneOf(['day', 'month']).isRequired,
    value: number.isRequired,
  }),
};

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

const getIteratee = interval => {
  if (interval.unit === 'day') {
    return getFirstMinuteOfDay;
  }
  return getFirstDayOfMonth;
};

const Chart = ({ features, interval }) => {
  const theme = useTheme();

  const iteratee = getIteratee(interval);
  const groupedFeatures = _groupBy(features, iteratee);

  const data = Object.entries(groupedFeatures).map(([time, features]) => ({
    time,
    ..._countBy(features, 'properties.humanLevel'),
  }));

  const chronologicalData = _sortBy(data, 'time');

  const today = new Date();

  const timeFormatter = time => {
    const date = new Date(parseInt(time));

    if (interval.unit === 'month') {
      return date.toLocaleDateString('default', { month: 'short' });
    }
    return date.toLocaleDateString('default', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <ResponsiveContainer height={200}>
      <AreaChart data={chronologicalData}>
        <XAxis
          dataKey="time"
          type="number"
          domain={['dataMin', today.getTime()]}
          tickFormatter={timeFormatter}
        />
        <YAxis />
        <Tooltip labelFormatter={timeFormatter} />
        {['clear', 'moderate', 'critical'].map(humanLevel => (
          <Area
            key={humanLevel}
            type="monotone"
            dataKey={humanLevel}
            stackId="1"
            stroke={theme.palette.level[humanLevel].main}
            fill={theme.palette.level[humanLevel].main}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};

const featuresUnchanged = (
  { features: prevFeatures },
  { features: nextFeatures },
) => {
  if (prevFeatures.length > 0 && nextFeatures.length > 0) {
    return prevFeatures[0].properties.id === nextFeatures[0].properties.id;
  }

  return prevFeatures.length === nextFeatures.length;
};

// New interval prop is received before new features prop,
// don't update unless rendered features has change.
export default memo(Chart, featuresUnchanged);

Chart.propTypes = propTypes;
