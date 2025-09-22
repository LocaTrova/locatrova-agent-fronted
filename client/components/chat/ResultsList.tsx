import React from "react";
import ResultCard from "./ResultCard";
import type { LocationResult } from "../../../shared/api";
import { STYLES } from "../../constants/styles";
import { MESSAGES } from "../../constants";

interface ResultsListProps {
  results: LocationResult[];
  mapView: boolean;
  loading?: boolean;
}

/**
 * Results list component
 * Single Responsibility: Manages display of location results
 * Open/Closed: Extensible for different view modes (list, grid, map)
 */
export default function ResultsList({
  results,
  mapView,
  loading = false,
}: ResultsListProps) {
  if (loading) {
    return (
      <div className="flex-1 min-h-0 grid place-items-center p-6">
        <div className="text-center text-slate-500">
          <div className="text-sm">Loading locations...</div>
        </div>
      </div>
    );
  }

  if (mapView) {
    return (
      <div className="flex-1 min-h-0 grid place-items-center p-6 text-slate-600">
        <div className="text-center">
          <div className="mb-1 text-sm font-medium">Map view</div>
          <p className="text-sm">{MESSAGES.PLACEHOLDERS.MAP_VIEW_COMING}</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex-1 min-h-0 grid place-items-center p-6">
        <div className="text-center text-slate-500">
          <div className="text-sm font-medium mb-1">No locations found</div>
          <p className="text-sm">
            Try adjusting your filters or search criteria
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${STYLES.SCROLL.AREA} ${STYLES.SPACING.PADDING_SMALL} ${STYLES.SPACING.CONTENT_GAP}`}
    >
      {results.map((result, index) => (
        <ResultCard key={result.title + index} {...result} />
      ))}
    </div>
  );
}
