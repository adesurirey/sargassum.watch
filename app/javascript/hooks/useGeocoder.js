import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import throttle from 'lodash/throttle';

const apiURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
const { mapboxApiAccessToken } = gon;

const useGeocoder = ({ language, center = [] }) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const proximity = useRef(null);

  // Avoid mutating fetch function when center changes,
  // that would lead to performance issues.
  proximity.current = center.join(',');

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
      setOptions([]);
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
  }, [inputValue, fetch]);

  return {
    options,
    onInputChange: handleInputChange,
  };
};

export default useGeocoder;
