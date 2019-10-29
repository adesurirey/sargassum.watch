import { useState, useRef, useEffect } from 'react';

const useDelayedLoading = delay => {
  const [loading, setLoading] = useState(false);
  const timerRef = useRef();

  useEffect(
    () => () => {
      clearTimeout(timerRef.current);
    },
    [],
  );

  timerRef.current = setTimeout(() => {
    setLoading(true);
  }, delay);

  return loading;
};

export default useDelayedLoading;
