import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Map } from "lucide-react";
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
  return (
    <div className={STYLES.STICKY.TOP}>
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-900">
            {UI_TEXT.LABELS.CURATED_RESULTS}
          </h2>
          <span className="text-xs text-slate-500">{resultCount} found</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Map className={`${DIMENSIONS.ICON.SMALL} text-slate-500`} />
            <span className="text-xs text-slate-600">{UI_TEXT.LABELS.MAP}</span>
            <Switch checked={mapView} onCheckedChange={onMapViewChange} />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 px-3 sm:px-4 pb-3">
        <Select
          value={filters.locationFilter}
          onValueChange={onLocationFilterChange}
        >
          <SelectTrigger className={FILTER_CONFIG.SELECT_TRIGGER_CLASS}>
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
  );
}
