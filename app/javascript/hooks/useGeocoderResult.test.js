import { renderHook } from '@testing-library/react-hooks';

import useGeocoderResult from './useGeocoderResult';

const getMap = jest.fn().mockImplementationOnce(() => ({
  getContainer: jest.fn().mockImplementationOnce(() => ({
    getBoundingClientRect: jest.fn().mockImplementationOnce(() => ({
      width: 900,
      height: 720,
    })),
  })),
}));

const feature = {
  text: 'Mexico',
  center: [-81.32, 27.28],
  bbox: [19.66064, 41.151416, 190.10042, 81.2504],
  properties: {
    short_code: 'mex',
  },
};

test('returns viewport config for a given geocoder result', () => {
  const { result } = renderHook(() => useGeocoderResult(getMap));

  const { longitude, latitude, zoom } = result.current(feature);

  expect(longitude).toBe(-81.32);
  expect(latitude).toBe(27.28);
  expect(Math.round(zoom)).toBe(2);
});
