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
      <div className="relative w-full h-full">
        <div className={`${STYLES.GRID.CHAT_LAYOUT} w-full`}>
          {/* Left: Chat */}
          <ChatSection messages={messages} onSendMessage={sendMessage} />

          {/* Right: Curated results */}
          <section
            aria-label="Location results"
            className={`${STYLES.CONTAINER.SECTION} w-full border border-slate-300/40 ring-1 ring-slate-300/20 shadow-[0_8px_30px_rgba(0,0,0,0.06)]`}
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
  );
}
