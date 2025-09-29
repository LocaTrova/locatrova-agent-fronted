import React, { useState, useCallback } from "react";
import { useSearchParams } from "react-router";
import { useLocationData } from "../../hooks/useLocationData";
import { useLocationFilter } from "../../hooks/useLocationFilter";
import { useChat } from "../../hooks/useChat";
import ChatSection from "./ChatSection";
import { ChatResultsSection } from "./ChatResultsSection";
import { STYLES } from "../../constants/styles";

/**
 * Container component for Chat page
 * Follows Container/Presenter pattern and Single Responsibility Principle
 * Orchestrates data flow between different chat components
 */
export function ChatContainer() {
  const [params] = useSearchParams();
  const seed = params.get("q")?.trim();

  // Chat functionality
  const { messages, sendMessage } = useChat(seed);

  // Location data management
  const { locations, locationsLoading } = useLocationData();

  // Filter functionality
  const {
    filters,
    filteredResults,
    hasActiveFilters,
    setLocationFilter,
    setActiveFilters,
    clearFilters,
  } = useLocationFilter(locations);

  // Local UI state
  const [mapView, setMapView] = useState<boolean>(false);

  // Memoize the callback to prevent infinite loops with React Router v7's startTransition
  const handleMapViewChange = useCallback((value: boolean) => {
    setMapView(value);
  }, []);

  return (
    <div className={STYLES.CONTAINER.PAGE}>
      <div
        aria-hidden
        className={`${STYLES.DECORATIVE.GRADIENT_CIRCLE} pointer-events-none top-[-6rem] left-[-4rem] h-60 w-60 from-orange-200/70 via-orange-100/20 to-transparent`}
      />
      <div
        aria-hidden
        className={`${STYLES.DECORATIVE.GRADIENT_CIRCLE} pointer-events-none bottom-[-8rem] right-[-6rem] h-72 w-72 from-orange-100/60 via-white/10 to-transparent`}
      />
      <div className={`${STYLES.CONTAINER.PAGE_INNER} relative z-10`}>
        <div className="relative h-full w-full">
          <div className={`${STYLES.GRID.CHAT_LAYOUT} w-full`}>
            {/* Left: Chat */}
            <ChatSection messages={messages} onSendMessage={sendMessage} />

            {/* Right: Curated results */}
            <section
              aria-label="Location results"
              className={`${STYLES.CONTAINER.SECTION} w-full rounded-[26px] overflow-hidden border border-slate-300/40 ring-1 ring-slate-300/20 shadow-[0_12px_32px_rgba(0,0,0,0.06)]`}
            >
              <ChatResultsSection
                filteredResults={filteredResults}
                filters={filters}
                hasActiveFilters={hasActiveFilters}
                mapView={mapView}
                loading={locationsLoading}
                addressSeed={seed ?? undefined}
                onLocationFilterChange={setLocationFilter}
                onAttributeFiltersChange={setActiveFilters}
                onClearFilters={clearFilters}
                onMapViewChange={handleMapViewChange}
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
