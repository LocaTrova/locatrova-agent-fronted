import type {
  LocationResult,
  LocationFilterType,
  AttributeFilterType,
  LocationAttributes,
} from "../../shared/api";
import { ApiLocationRepository } from "./apiLocationRepository";
import { getServiceConfig } from "./config";

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

/**
 * Mock location data - will be replaced with API calls in production
 * Following Open/Closed Principle - data structure is closed for modification
 * but open for extension through the repository pattern
 */
const mockLocationData: LocationResult[] = [
  {
    title: "Rooftop Terrace – City Skyline",
    description:
      "Golden-hour friendly rooftop with clear skyline view and elevator access.",
    imageUrl:
      "https://images.unsplash.com/photo-1523759711518-c4a2b5a8e7d3?q=80&w=400&auto=format&fit=crop",
    badge: "sunset",
    tags: ["urban", "outdoor"],
    attributes: { indoor: false, outdoor: true, permit: true },
  },
  {
    title: "Industrial Warehouse",
    description:
      "Raw textures, high ceilings, east-facing windows; controllable light.",
    imageUrl:
      "https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?q=80&w=400&auto=format&fit=crop",
    badge: "moody",
    tags: ["industrial", "urban", "indoor"],
    attributes: { indoor: true, outdoor: false, permit: true },
  },
  {
    title: "Modern Office Lobby",
    description:
      "Neutral palette, natural wood, large glass facade, great for corporate scenes.",
    imageUrl:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&auto=format&fit=crop",
    badge: "corporate",
    tags: ["residential", "indoor"],
    attributes: { indoor: true, outdoor: false, permit: false },
  },
  {
    title: "Coastal Beach Path",
    description:
      "Natural lighting, sandy textures, ocean backdrop. Best during golden hour.",
    imageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop",
    badge: "natural",
    tags: ["coastal", "outdoor", "nature"],
    attributes: { indoor: false, outdoor: true, permit: false },
  },
  {
    title: "Urban Street Corner",
    description:
      "Busy intersection with neon signs, graffiti walls, authentic city atmosphere.",
    imageUrl:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=400&auto=format&fit=crop",
    badge: "street",
    tags: ["urban", "outdoor"],
    attributes: { indoor: false, outdoor: true, permit: true },
  },
  {
    title: "Forest Trail",
    description:
      "Shaded natural path with filtered sunlight, perfect for outdoor scenes.",
    imageUrl:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400&auto=format&fit=crop",
    badge: "nature",
    tags: ["nature", "outdoor"],
    attributes: { indoor: false, outdoor: true, permit: false },
  },
];

/**
 * Mock implementation of location repository
 * Simulates async API calls with setTimeout for realistic behavior
 */
class MockLocationRepository implements ILocationRepository {
  private locations: LocationResult[] = mockLocationData;
  private delay: number = 0; // Can be adjusted to simulate network latency

  /**
   * Simulates async operation for consistency with future API implementation
   */
  private async simulateAsync<T>(data: T): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data), this.delay);
    });
  }

  /**
   * Retrieves all available locations
   */
  async getLocations(): Promise<LocationResult[]> {
    return this.simulateAsync([...this.locations]);
  }

  /**
   * Searches locations by matching query against title and description
   * @param query - Search term to match
   */
  async searchLocations(query: string): Promise<LocationResult[]> {
    const searchTerm = query.toLowerCase();
    const filtered = this.locations.filter(
      (location) =>
        location.title.toLowerCase().includes(searchTerm) ||
        location.description.toLowerCase().includes(searchTerm) ||
        location.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
    );
    return this.simulateAsync(filtered);
  }

  /**
   * Filters locations by location type
   * @param filter - Location type filter
   */
  async getLocationsByFilter(
    filter: LocationFilterType,
  ): Promise<LocationResult[]> {
    if (filter === "any") {
      return this.getLocations();
    }

    const filtered = this.locations.filter((location) =>
      location.tags.includes(filter),
    );
    return this.simulateAsync(filtered);
  }

  /**
   * Filters locations by attributes (indoor/outdoor/permit)
   * @param attributes - Partial attributes to match
   */
  async getLocationsByAttributes(
    attributes: Partial<LocationAttributes>,
  ): Promise<LocationResult[]> {
    const filtered = this.locations.filter((location) => {
      return Object.entries(attributes).every(([key, value]) => {
        return location.attributes[key as keyof LocationAttributes] === value;
      });
    });
    return this.simulateAsync(filtered);
  }

  /**
   * Gets a specific location by ID (using title as ID for now)
   * @param id - Location identifier
   */
  async getLocationById(id: string): Promise<LocationResult | null> {
    const location = this.locations.find((loc) => loc.title === id) || null;
    return this.simulateAsync(location);
  }
}

/**
 * Location service implementation
 * Handles business logic and orchestrates repository operations
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

/**
 * Factory function to create location service instance
 * Following Dependency Injection pattern for testability and flexibility
 * @param useApi - Whether to use API (future) or mock data
 */
export function createLocationService(useApi?: boolean): ILocationService {
  const config = getServiceConfig();
  const shouldUseApi = useApi ?? !config.useMockData;

  const repository: ILocationRepository = shouldUseApi
    ? new ApiLocationRepository()
    : new MockLocationRepository();

  return new LocationService(repository);
}

/**
 * Default singleton instance for convenience
 * Can be overridden by creating a new instance with createLocationService
 */
export const locationService = createLocationService();

// Export repository for testing purposes
export { MockLocationRepository };
