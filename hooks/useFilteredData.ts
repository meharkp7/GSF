import { useMemo } from 'react';

export function useFilteredData<T>(
  data: T[],
  searchQuery: string,
  filterFunctions: ((item: T, query: string) => boolean)[]
) {
  return useMemo(() => {
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase().trim();
    return data.filter(item =>
      filterFunctions.some(filterFn => filterFn(item, query))
    );
  }, [data, searchQuery, filterFunctions]);
}

export function useFilteredDataWithFilters<T>(
  data: T[],
  searchQuery: string,
  filters: Record<string, (item: T) => boolean>,
  searchFilterFunctions: ((item: T, query: string) => boolean)[]
) {
  return useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(item =>
        searchFilterFunctions.some(filterFn => filterFn(item, query))
      );
    }

    // Apply additional filters
    Object.values(filters).forEach(filterFn => {
      filtered = filtered.filter(filterFn);
    });

    return filtered;
  }, [data, searchQuery, filters, searchFilterFunctions]);
}