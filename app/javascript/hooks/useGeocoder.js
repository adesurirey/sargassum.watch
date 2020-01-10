import { useState, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';
import throttle from 'lodash/throttle';
import omit from 'lodash/omit';
import { useTranslation } from 'react-i18next';

const apiURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
const { mapboxApiAccessToken, quickLooks } = gon;
const popularResults = omit(quickLooks, ['_all']);

const useGeocoder = ({ language, center = [] }) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const proximity = useRef(null);

  // Avoid mutating fetch function when center changes,
  // that would lead to performance issues.
  proximity.current = center.join(',');

  const { t } = useTranslation();
  const defaultOptions = useMemo(
    () =>
      Object.values(popularResults).map(option => ({
        ...option,
        text: t(option.text),
        place_name: t(option.place_name),
      })),
    [t],
  );

  const handleInputChange = (_event, value) => {
    setInputValue(value);
  };

  const fetch = useMemo(
    () =>
      throttle((input, callback) => {
        axios
          .get(`${apiURL}/${input}.json`, {
            params: {
              access_token: mapboxApiAccessToken,
              language,
              proximity: proximity.current,
            },
          })
          .then(({ data }) => callback(data.features));
      }, 200),
    [language],
  );

  useEffect(() => {
    let active = true;

    // Input was reset
    if (inputValue === '') {
      setOptions(defaultOptions);
      return;
    }

    // Don't fetch before min input length
    if (inputValue.length < 3) {
      return;
    }

    fetch(inputValue, results => {
      active && setOptions(results || []);
    });

    return () => {
      active = false;
    };
  }, [inputValue, fetch, defaultOptions]);

  return {
    inputValue,
    options,
    onInputChange: handleInputChange,
  };
};

export default useGeocoder;
