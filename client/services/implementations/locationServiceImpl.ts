import type { LocationResult, LocationFilterType, AttributeFilterType } from "../../../shared/api";
import type { ILocationService, ILocationRepository } from "../interfaces/locationInterfaces";

/**
 * Location service implementation
 * Handles business logic and orchestrates repository operations
 * Follows Single Responsibility Principle - only handles business logic
 */
export class LocationService implements ILocationService {
  constructor(private repository: ILocationRepository) {}

  /**
   * Gets all available locations
   */
  async getAllLocations(): Promise<LocationResult[]> {
    return this.repository.getLocations();
  }

  /**
   * Searches locations based on search term
   * @param searchTerm - Term to search for
   */
  async searchLocations(searchTerm: string): Promise<LocationResult[]> {
    if (!searchTerm || searchTerm.trim() === "") {
      return this.getAllLocations();
    }
    return this.repository.searchLocations(searchTerm);
  }

  /**
   * Filters locations based on location type and attributes
   * This is a synchronous operation on already-fetched data
   * @param locations - Array of locations to filter
   * @param locationFilter - Location type filter
   * @param attributeFilters - Array of attribute filters
   */
  filterLocations(
    locations: LocationResult[],
    locationFilter: LocationFilterType,
    attributeFilters: AttributeFilterType[],
  ): LocationResult[] {
    let filtered = [...locations];

    // Apply location type filter
    if (locationFilter !== "any") {
      filtered = filtered.filter((location) =>
        location.tags.includes(locationFilter),
      );
    }

    // Apply attribute filters
    if (attributeFilters.length > 0) {
      filtered = filtered.filter((location) =>
        attributeFilters.every(
          (filter) => location.attributes[filter] === true,
        ),
      );
    }

    return filtered;
  }

  /**
   * Gets locations by specific tag
   * @param tag - Tag to filter by
   */
  async getLocationsByTag(tag: string): Promise<LocationResult[]> {
    const locations = await this.repository.getLocations();
    return locations.filter((location) => location.tags.includes(tag));
  }

  /**
   * Gets locations by badge type
   * @param badge - Badge to filter by
   */
  async getLocationsByBadge(badge: string): Promise<LocationResult[]> {
    const locations = await this.repository.getLocations();
    return locations.filter((location) => location.badge === badge);
  }
}