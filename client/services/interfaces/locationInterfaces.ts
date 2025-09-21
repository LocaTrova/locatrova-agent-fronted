import type {
  LocationResult,
  LocationFilterType,
  AttributeFilterType,
  LocationAttributes,
} from "../../../shared/api";

/**
 * Interface for location data repository (Repository Pattern)
 * Following Interface Segregation Principle - focused on location operations
 */
export interface ILocationRepository {
  getLocations(): Promise<LocationResult[]>;
  searchLocations(query: string): Promise<LocationResult[]>;
  getLocationsByFilter(filter: LocationFilterType): Promise<LocationResult[]>;
  getLocationsByAttributes(
    attributes: Partial<LocationAttributes>,
  ): Promise<LocationResult[]>;
  getLocationById(id: string): Promise<LocationResult | null>;
}

/**
 * Interface for location service operations
 * Following Single Responsibility Principle - handles business logic for locations
 */
export interface ILocationService {
  getAllLocations(): Promise<LocationResult[]>;
  searchLocations(searchTerm: string): Promise<LocationResult[]>;
  filterLocations(
    locations: LocationResult[],
    locationFilter: LocationFilterType,
    attributeFilters: AttributeFilterType[],
  ): LocationResult[];
  getLocationsByTag(tag: string): Promise<LocationResult[]>;
  getLocationsByBadge(badge: string): Promise<LocationResult[]>;
}