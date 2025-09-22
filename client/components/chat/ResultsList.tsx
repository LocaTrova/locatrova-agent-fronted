import React from "react";
import ResultCard from "./ResultCard";
import type { LocationResult } from "../../../shared/api";
import { STYLES } from "../../constants/styles";
import { MESSAGES } from "../../constants";
import MapSection from "@/components/location/MapSection";

interface ResultsListProps {
  results: LocationResult[];
  mapView: boolean;
  loading?: boolean;
  addressSeed?: string;
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
  addressSeed,
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
      <div className={`${STYLES.SCROLL.AREA} ${STYLES.SPACING.PADDING_MEDIUM}`}>
        <MapSection
          address={
            addressSeed && addressSeed.trim() ? addressSeed : "Roma, Italia"
          }
          markers={[]}
        />
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
      className={`${STYLES.SCROLL.AREA} ${STYLES.SPACING.PADDING_MEDIUM} ${STYLES.SPACING.CONTENT_GAP}`}
    >
      {results.map((result, index) => {
        const slug = (s: string) =>
          s
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
        const base = result.title ? slug(result.title) : "location";
        const href = `/location/${encodeURIComponent(`${base}-${index}`)}`;
        return (
          <ResultCard
            key={(result.title || "location") + index}
            {...result}
            href={href}
          />
        );
      })}
    </div>
  );
}
