import { renderHook, act } from '@testing-library/react-hooks';

import useDelayedLoading from './useDelayedLoading';

jest.useFakeTimers();

test('returns false during a defined delay', () => {
  const delay = 200;
  const { result } = renderHook(() => useDelayedLoading(delay));

  expect(setTimeout).toHaveBeenCalled();
  expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), delay);
  expect(result.current).toBe(false);

  act(() => {
    jest.runAllTimers();
  });

  expect(result.current).toBe(true);
});
