import { useState, useMemo, useCallback } from "react";
import type {
  LocationResult,
  ResultFilter,
  LocationFilterType,
  AttributeFilterType,
} from "../../shared/api";
import {
  filterLocationResults,
  hasActiveFilters,
  getDefaultFilters,
} from "../utils/filters";

/**
 * Custom hook for location filtering
 * Encapsulates filter state and logic
 */
export function useLocationFilter(results: LocationResult[]) {
  const [filters, setFilters] = useState<ResultFilter>(getDefaultFilters());

  const filteredResults = useMemo(
    () => filterLocationResults(results, filters),
    [results, filters],
  );

  const setLocationFilter = useCallback((locationFilter: LocationFilterType) => {
    setFilters((prev) => ({ ...prev, locationFilter }));
  }, []);

  const setActiveFilters = useCallback((activeFilters: AttributeFilterType[]) => {
    setFilters((prev) => ({ ...prev, activeFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(getDefaultFilters());
  }, []);

  return {
    filters,
    filteredResults,
    hasActiveFilters: hasActiveFilters(filters),
    setLocationFilter,
    setActiveFilters,
    clearFilters,
  };
}
