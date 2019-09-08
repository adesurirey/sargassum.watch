import React from 'react';
import { ResponsiveContainer, AreaChart, Area, YAxis } from 'recharts';

import { useTheme } from '@material-ui/styles';
import { makeStyles } from '@material-ui/styles';

import { data } from '../utils/propTypes';

const propTypes = {
  data,
};

const useStyles = makeStyles(theme => ({
  placeholder: {
    height: '100%',
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.grey[300],
  },
}));

const TinyChart = ({ data, ...containerProps }) => {
  const theme = useTheme();
  const classes = useStyles();

  if (!data.length) {
    return (
      <div
        className={classes.placeholder}
        style={{ height: containerProps.height }}
      />
    );
  }

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
