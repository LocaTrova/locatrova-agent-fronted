import React, { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { useLocationData } from '../../hooks/useLocationData';
import { useLocationFilter } from '../../hooks/useLocationFilter';
import { useChat } from '../../hooks/useChat';
import ChatSection from './ChatSection';
import { ChatResultsSection } from './ChatResultsSection';
import { STYLES } from '../../constants/styles';

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
  const {
    locations,
    locationsLoading,
  } = useLocationData();

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
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(312deg, rgb(160,165,194) 27.0662%, rgb(206,221,228) 100%)",
          }}
        />
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://static.wixstatic.com/media/343a2a_5c066484f7904623adfe3ee51e4634a8~mv2.jpg/v1/fill/w_2880,h_1527,al_c,q_90,enc_avif,quality_auto/Hero-bg-base-new.jpg"
            alt="Hero background"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
            style={{ maskSize: "100% 100%", maskRepeat: "no-repeat", maskPosition: "50% 50%" }}
          />
        </div>
      </div>
      <div className="relative w-full h-full">
        <div className={`${STYLES.GRID.CHAT_LAYOUT} w-full`}>
          {/* Left: Chat */}
          <ChatSection
            messages={messages}
            onSendMessage={sendMessage}
          />

          {/* Right: Curated results */}
          <section aria-label="Location results" className={`${STYLES.CONTAINER.SECTION} w-full`}>
            <ChatResultsSection
              filteredResults={filteredResults}
              filters={filters}
              hasActiveFilters={hasActiveFilters}
              mapView={mapView}
              loading={locationsLoading}
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
