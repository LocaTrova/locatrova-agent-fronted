import React from "react";
import ResultCard from "./ResultCard";
import type { LocationResult } from "../../../shared/api";
import { STYLES } from "../../constants/styles";
import { MESSAGES } from "../../constants";
import MapSection from "@/components/location/MapSection";
import { slugify } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

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
      <div
        className={`${STYLES.SCROLL.AREA} ${STYLES.SPACING.PADDING_MEDIUM} ${STYLES.SPACING.CONTENT_GAP}`}
        aria-busy
        aria-live="polite"
      >
        {[...Array(4).keys()].map((index) => (
          <div
            key={`skeleton-${index}`}
            className="ui-card bg-white/70 p-3 sm:p-4 backdrop-blur-md"
          >
            <div className="flex gap-3 sm:gap-4">
              <Skeleton className="h-20 w-20 rounded-lg sm:h-24 sm:w-24" />
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-1/2" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-12 rounded-full" />
                </div>
                <div className="flex justify-end gap-2">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <Skeleton className="h-9 w-9 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (mapView) {
    return (
      <div
        className={`${STYLES.SCROLL.AREA} ${STYLES.SPACING.PADDING_MEDIUM} space-y-4`}
      >
        <div className="rounded-xl border border-white/30 bg-white/70 px-4 py-3 text-xs text-slate-600">
          Viewing map for "
          {addressSeed && addressSeed.trim() ? addressSeed : "Roma, Italia"}".
          Toggle back to list view to explore curated cards.
        </div>
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
        const base = result.title ? slugify(result.title) : "location";
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
