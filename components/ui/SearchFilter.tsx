"use client";

import React from "react";
import { Search, X, ChevronDown } from "lucide-react";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";

interface FilterOption {
  value: string;
  label: string;
}

interface SearchFilterProps {
  placeholder?: string;
  filters?: {
    [key: string]: {
      options: FilterOption[];
      value: string;
      onChange: (value: string) => void;
      label?: string;
    };
  };
  onSearchChange?: (search: string) => void;
  className?: string;
}

export default function SearchFilter({
  placeholder = "Search...",
  filters = {},
  onSearchChange,
  className = "",
}: SearchFilterProps) {
  const { search, setSearch, debouncedSearch, clearSearch } = useDebouncedSearch();

  // Call onSearchChange when debounced search changes
  React.useEffect(() => {
    onSearchChange?.(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  const hasFilters = Object.keys(filters).length > 0;

  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: "var(--text-muted)" }} />
        <input
          className="input pl-9 pr-9 w-full"
          placeholder={placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Clear search"
          >
            <X className="size-3" style={{ color: "var(--text-muted)" }} />
          </button>
        )}
      </div>

      {/* Filters */}
      {hasFilters && (
        <div className="flex gap-2 flex-wrap">
          {Object.entries(filters).map(([key, filter]) => (
            <div key={key} className="relative">
              {filter.label && (
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>
                  {filter.label}
                </label>
              )}
              <select
                className="input pr-8 pl-3 py-2 text-sm appearance-none cursor-pointer"
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
              >
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3.5 pointer-events-none" style={{ color: "var(--text-muted)" }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}