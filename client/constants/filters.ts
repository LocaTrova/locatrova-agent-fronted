/**
 * Filter configuration constants
 * Single source of truth for all filter options
 */

import type { LocationFilterType, AttributeFilterType } from "../../shared/api";

export const LOCATION_FILTERS: Record<LocationFilterType, string> = {
  any: "Any",
  urban: "Urban",
  coastal: "Coastal",
  industrial: "Industrial",
  residential: "Residential",
  nature: "Nature",
} as const;

export const ATTRIBUTE_FILTERS: Record<
  AttributeFilterType,
  {
    label: string;
    ariaLabel: string;
  }
> = {
  indoor: {
    label: "Indoor",
    ariaLabel: "Indoor locations",
  },
  outdoor: {
    label: "Outdoor",
    ariaLabel: "Outdoor locations",
  },
  permit: {
    label: "Permit",
    ariaLabel: "Permit required",
  },
} as const;

export const FILTER_CONFIG = {
  DEFAULT_LOCATION: "any" as LocationFilterType,
  DEFAULT_ATTRIBUTES: [] as AttributeFilterType[],
  TOGGLE_GROUP_CLASS: "gap-1",
  TOGGLE_ITEM_CLASS: "h-8 px-2 text-xs",
  SELECT_TRIGGER_CLASS: "h-9 w-[170px] text-xs sm:text-sm",
} as const;
