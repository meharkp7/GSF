import { useState, useEffect } from 'react';

export function useDebouncedSearch(initialValue = '', delay = 300) {
  const [search, setSearch] = useState(initialValue);
  const [debouncedSearch, setDebouncedSearch] = useState(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [search, delay]);

  const clearSearch = () => setSearch('');

  return {
    search,
    setSearch,
    debouncedSearch,
    clearSearch,
  };
}