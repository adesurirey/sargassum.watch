import React from 'react';
import { arrayOf, shape, number, string } from 'prop-types';
import { ResponsiveContainer, AreaChart, Area, YAxis } from 'recharts';

import { useTheme } from '@material-ui/styles';

const propTypes = {
  data: arrayOf(
    shape({
      time: string.isRequired,
      clear: number.isRequired,
      moderate: number.isRequired,
      critical: number.isRequired,
    }),
  ).isRequired,
};

const TinyChart = ({ data, ...containerProps }) => {
  const theme = useTheme();

  return (
    <ResponsiveContainer {...containerProps}>
      <AreaChart data={data} margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
        <YAxis domain={[0, 'dataMax']} hide />
        {['clear', 'moderate', 'critical'].map(humanLevel => (
          <Area
            key={humanLevel}
            type="linear"
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

export default TinyChart;

TinyChart.propTypes = propTypes;
