import type { LocationResult, ResultFilter } from "../../shared/api";

/**
 * Filter location results based on filter criteria
 * Single Responsibility: Only handles filtering logic
 */
export function filterLocationResults(
  results: LocationResult[],
  filters: ResultFilter,
): LocationResult[] {
  const { locationFilter, activeFilters } = filters;

  return results.filter((result) => {
    // Check location type filter
    const locationMatches =
      locationFilter === "any" || result.tags?.includes(locationFilter);

    // Check attribute filters
    const attributeFilters = new Set(activeFilters);
    const attributesMatch =
      (!attributeFilters.has("indoor") || result.attributes?.indoor) &&
      (!attributeFilters.has("outdoor") || result.attributes?.outdoor) &&
      (!attributeFilters.has("permit") || result.attributes?.permit);

    return locationMatches && attributesMatch;
  });
}

/**
 * Check if any filters are active
 */
export function hasActiveFilters(filters: ResultFilter): boolean {
  return filters.locationFilter !== "any" || filters.activeFilters.length > 0;
}

/**
 * Reset all filters to default state
 */
export function getDefaultFilters(): ResultFilter {
  return {
    locationFilter: "any",
    activeFilters: [],
  };
}
