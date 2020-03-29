import { renderHook, act } from '@testing-library/react-hooks';
import mockAxios from 'axios';

import useGeocoder, { API_URL } from './useGeocoder';

const defaultOptions = [global.gon.quickLooks.florida];
const language = 'en';
const center = [1, 2];
const features = [
  {
    text: 'Playa Carmen',
    place_name: 'Playa Carmen, Quintana Roo, Mexico',
    center: [-81.32, 27.28],
  },
];

const renderDefault = () => renderHook(() => useGeocoder({ language }));
const mockGeocoder = () =>
  mockAxios.get.mockImplementationOnce(() =>
    Promise.resolve({
      data: { features },
    }),
  );

test('initial values', () => {
  const { result } = renderDefault();
  const { loading, inputValue, onInputChange, options } = result.current;

  expect(loading).toBe(false);
  expect(inputValue).toBe('');
  expect(onInputChange).toBeInstanceOf(Function);
  expect(options).toEqual(defaultOptions);
});

test('does not fetch before min input length', () => {
  const input = 'a';
  const { result } = renderDefault();

  act(() => {
    result.current.onInputChange({}, input);
  });

  const { loading, inputValue, options } = result.current;
  expect(loading).toBe(false);
  expect(inputValue).toBe(input);
  expect(options).toEqual(defaultOptions);
});

test('fetch geocoder api with relevant params', async () => {
  const { result } = renderHook(() => useGeocoder({ language, center }));
  const input = 'playa carmen';

  await act(async () => {
    result.current.onInputChange({}, input);
  });

  expect(mockAxios.get).toHaveBeenCalledTimes(1);
  expect(mockAxios.get).toHaveBeenCalledWith(`${API_URL}/${input}.json`, {
    params: {
      access_token: global.gon.mapboxApiAccessToken,
      proximity: center.join(','),
      language,
    },
  });
});

test('returns geocoder features as results', async () => {
  mockGeocoder();

  const { result } = renderHook(() => useGeocoder({ language, center }));
  const input = 'playa carmen';

  await act(async () => {
    result.current.onInputChange({}, input);
  });

  const { loading, inputValue, options } = result.current;
  expect(loading).toBe(false);
  expect(inputValue).toBe(input);
  expect(options).toEqual(features);
});

test('returns default options when input is cleared', async () => {
  mockGeocoder();

  const { result } = renderHook(() => useGeocoder({ language, center }));

  await act(async () => {
    result.current.onInputChange({}, 'playa carmen');
  });

  expect(result.current.options).toEqual(features);

  await act(async () => {
    result.current.onInputChange({}, '');
  });

  expect(result.current.options).toEqual(defaultOptions);
});
