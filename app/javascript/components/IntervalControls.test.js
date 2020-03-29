import '@testing-library/jest-dom';

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';

import { intervals, toString } from '../utils/interval';
import IntervalControls from './IntervalControls';

const selectedInterval = intervals[0];
const onChange = jest.fn().mockName('onChange');

test('displays nothing when not loaded', () => {
  render(
    <IntervalControls
      loaded={false}
      selectedInterval={selectedInterval}
      onChange={onChange}
    />,
  );

  expect(screen.queryByText(toString(selectedInterval))).not.toBeVisible();
  expect(screen.queryByText(toString(intervals[1]))).not.toBeVisible();
  expect(screen.queryByText(toString(intervals[2]))).not.toBeVisible();
});

test('calls back with new selected interval', () => {
  const target = intervals[1];

  render(
    <IntervalControls
      loaded
      selectedInterval={selectedInterval}
      onChange={onChange}
    />,
  );

  expect(screen.queryByText(toString(selectedInterval))).toBeVisible();
  expect(screen.queryByText(toString(intervals[1]))).toBeVisible();
  expect(screen.queryByText(toString(intervals[2]))).toBeVisible();

  fireEvent.click(screen.getByText(toString(target)));

  expect(onChange).toHaveBeenCalledWith(target);
});
