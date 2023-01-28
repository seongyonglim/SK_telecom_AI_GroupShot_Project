import { useCallback, useEffect, useRef, useState } from 'react';
import { getPostsByLocation } from '../api/post';

const usePostsByLocation = (location) => {
  const [data, setData] = useState([]);

  const lastRef = useRef(null);
  const isLoadingRef = useRef(false);

  const locationRef = useRef('');

  const fetchNextPage = useCallback(async () => {
    if (!isLoadingRef.current) {
      isLoadingRef.current = true;
      const { list, last } = await getPostsByLocation({
        after: lastRef.current,
        location,
      });
      const photos = list.map((item) => item.photos).flat();
      // [['...', '...'], ['...', '...']]
      // () => ['...', '...', '...', '...']
      setData((prev) => (lastRef.current ? [...prev, ...photos] : photos));
      lastRef.current = last;
      isLoadingRef.current = false;
      locationRef.current = location;
    }
  }, [location]);

  useEffect(() => {
    if (locationRef.current !== location) {
      lastRef.current = null;
    }
    fetchNextPage();
  }, [fetchNextPage, location]);

  return { data, fetchNextPage };
};

export default usePostsByLocation;
