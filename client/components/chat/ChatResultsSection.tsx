import React from "react";
import type {
  LocationResult,
  ResultFilter,
  LocationFilterType,
  AttributeFilterType,
} from "../../../shared/api";
import FilterControls from "./FilterControls";
import ResultsList from "./ResultsList";

interface ChatResultsSectionProps {
  filteredResults: LocationResult[];
  filters: ResultFilter;
  hasActiveFilters: boolean;
  mapView: boolean;
  loading: boolean;
  addressSeed?: string;
  onLocationFilterChange: (filter: LocationFilterType) => void;
  onAttributeFiltersChange: (filters: AttributeFilterType[]) => void;
  onClearFilters: () => void;
  onMapViewChange: (view: boolean) => void;
}

/**
 * Component responsible only for displaying chat results section
 * Follows Single Responsibility Principle - only handles results UI
 */
export function ChatResultsSection({
  filteredResults,
  filters,
  hasActiveFilters,
  mapView,
  loading,
  addressSeed,
  onLocationFilterChange,
  onAttributeFiltersChange,
  onClearFilters,
  onMapViewChange,
}: ChatResultsSectionProps) {
  return (
    <>
      <FilterControls
        filters={filters}
        resultCount={filteredResults.length}
        hasActiveFilters={hasActiveFilters}
        mapView={mapView}
        onLocationFilterChange={onLocationFilterChange}
        onAttributeFiltersChange={onAttributeFiltersChange}
        onClearFilters={onClearFilters}
        onMapViewChange={onMapViewChange}
      />
      <ResultsList
        results={filteredResults}
        loading={loading}
        mapView={mapView}
        addressSeed={addressSeed}
      />
    </>
  );
}
