import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Map as MapIcon, List, X } from "lucide-react";
import type {
  LocationFilterType,
  AttributeFilterType,
  ResultFilter,
} from "../../../shared/api";
import {
  LOCATION_FILTERS,
  ATTRIBUTE_FILTERS,
  FILTER_CONFIG,
} from "../../constants/filters";
import { UI_TEXT, DIMENSIONS } from "../../constants";
import { STYLES } from "../../constants/styles";

interface FilterControlsProps {
  filters: ResultFilter;
  resultCount: number;
  mapView: boolean;
  onMapViewChange: (value: boolean) => void;
  onLocationFilterChange: (value: LocationFilterType) => void;
  onAttributeFiltersChange: (values: AttributeFilterType[]) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

/**
 * Filter controls component for location results
 * Single Responsibility: Manages filter UI only
 */
export default function FilterControls({
  filters,
  resultCount,
  mapView,
  onMapViewChange,
  onLocationFilterChange,
  onAttributeFiltersChange,
  onClearFilters,
  hasActiveFilters,
}: FilterControlsProps) {
  const appliedFilterCount =
    filters.activeFilters.length + (filters.locationFilter !== "any" ? 1 : 0);
  const filterSummary =
    appliedFilterCount > 0
      ? `${appliedFilterCount} active ${
          appliedFilterCount === 1 ? "filter" : "filters"
        }`
      : "Showing all curated picks";
  const baseToggleItem =
    "rounded-[18px] px-3 py-1.5 text-xs font-medium data-[state=on]:shadow-sm transition";
  const listItemClass = `${baseToggleItem} ${!mapView ? "bg-white/80 text-slate-800 ring-1 ring-white/50" : "text-slate-600"}`;
  const mapItemClass = `${baseToggleItem} ${mapView ? "bg-orange-100/80 text-orange-800 ring-1 ring-orange-400/40 shadow-[0_0_0_2px_rgba(255,152,59,0.25),0_8px_24px_rgba(255,68,0,0.15)]" : "text-slate-600"}`;
  const activeFilterLabels = [
    filters.locationFilter !== "any"
      ? LOCATION_FILTERS[filters.locationFilter]
      : null,
    ...filters.activeFilters.map((f) => ATTRIBUTE_FILTERS[f].label),
  ].filter(Boolean);
  const filterAnnouncement =
    activeFilterLabels.length > 0
      ? `Filters active: ${activeFilterLabels.join(", ")}`
      : "No filters applied";
  return (
    <div className={STYLES.STICKY.TOP}>
      <div className="flex flex-col gap-3 px-3 sm:px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <h2 className="font-semibold text-slate-900 whitespace-nowrap text-[clamp(14px,2.8vw,16px)]">
              {UI_TEXT.LABELS.CURATED_RESULTS}
            </h2>
            <span
              className="inline-flex items-center rounded-full bg-orange-100/70 text-orange-800 px-2 py-0.5 text-[10px] font-medium ring-1 ring-orange-300/40"
              aria-live="polite"
            >
              {resultCount} found
            </span>
          </div>
          {(filters.locationFilter !== "any" ||
            filters.activeFilters.length > 0) && (
            <div className="flex flex-wrap items-center gap-1 min-w-0">
              {filters.locationFilter !== "any" && (
                <button
                  className="ui-chip border-orange-200/70 text-orange-800 hover:bg-orange-50"
                  onClick={() => onLocationFilterChange("any")}
                  aria-label="Clear location filter"
                  title="Clear location filter"
                >
                  <span className="truncate max-w-[140px]">
                    {LOCATION_FILTERS[filters.locationFilter]}
                  </span>
                  <X className="ml-2 h-3 w-3" />
                </button>
              )}
              {filters.activeFilters.map((f) => (
                <button
                  key={f}
                  className="ui-chip border-slate-200/80 hover:bg-slate-50"
                  onClick={() =>
                    onAttributeFiltersChange(
                      filters.activeFilters.filter((v) => v !== f),
                    )
                  }
                  aria-label={`Remove ${ATTRIBUTE_FILTERS[f].label}`}
                  title={`Remove ${ATTRIBUTE_FILTERS[f].label}`}
                >
                  <span>{ATTRIBUTE_FILTERS[f].label}</span>
                  <X className="ml-2 h-3 w-3" />
                </button>
              ))}
            </div>
          )}
          <p className="text-xs text-slate-500" aria-live="polite">
            {filterSummary}
          </p>
          <span className="sr-only" aria-live="polite">
            {filterAnnouncement}
          </span>
        </div>
        <ToggleGroup
          type="single"
          value={mapView ? "map" : "list"}
          onValueChange={(v) => v && onMapViewChange(v === "map")}
          className="h-9 rounded-2xl bg-white/60 ring-1 ring-white/20 backdrop-blur-md shadow-sm p-0.5"
          aria-label="Toggle between list and map views"
        >
          <ToggleGroupItem
            value="list"
            aria-label="List view"
            className={listItemClass}
          >
            <List className={`${DIMENSIONS.ICON.SMALL} text-slate-600`} />
            <span className="hidden sm:inline text-xs ml-1">List</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="map"
            aria-label="Map view"
            className={mapItemClass}
          >
            <MapIcon
              className={`${DIMENSIONS.ICON.SMALL} ${mapView ? "text-orange-700" : "text-slate-600"}`}
            />
            <span className="hidden sm:inline text-xs ml-1">Map</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex flex-wrap items-center gap-2 px-3 sm:px-4 pb-3 pt-2 border-t border-white/20">
        <Select
          value={filters.locationFilter}
          onValueChange={onLocationFilterChange}
        >
          <SelectTrigger
            className={`${FILTER_CONFIG.SELECT_TRIGGER_CLASS} min-w-[150px] sm:min-w-[180px]`}
            aria-label="Filter by location type"
          >
            <SelectValue placeholder={UI_TEXT.LABELS.LOCATION} />
          </SelectTrigger>
          <SelectContent align="start">
            {Object.entries(LOCATION_FILTERS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1">
          <span className="text-xs text-slate-500">
            {UI_TEXT.LABELS.CURATE_BY}
          </span>
          <ToggleGroup
            type="multiple"
            value={filters.activeFilters}
            onValueChange={onAttributeFiltersChange}
            className={FILTER_CONFIG.TOGGLE_GROUP_CLASS}
          >
            {Object.entries(ATTRIBUTE_FILTERS).map(([value, config]) => (
              <ToggleGroupItem
                key={value}
                value={value}
                aria-label={config.ariaLabel}
                className={FILTER_CONFIG.TOGGLE_ITEM_CLASS}
              >
                {config.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="ml-auto">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className={STYLES.BUTTON.GHOST}
              onClick={onClearFilters}
            >
              {UI_TEXT.BUTTONS.CLEAR}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
