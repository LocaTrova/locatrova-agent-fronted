import type { LocationResult, LocationFilterType, LocationAttributes } from "../../../shared/api";
import type { ILocationRepository } from "../interfaces/locationInterfaces";

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
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400&auto=format&fit=crop",
    badge: "urban",
    tags: ["urban", "outdoor"],
    attributes: { indoor: false, outdoor: true, permit: true },
  },
  {
    title: "Industrial Loft Studio",
    description:
      "Raw concrete and exposed brick with dramatic lighting options.",
    imageUrl:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400&auto=format&fit=crop",
    badge: "commercial",
    tags: ["commercial", "indoor"],
    attributes: { indoor: true, outdoor: false, permit: true },
  },
  {
    title: "Historic Art Deco Theater",
    description:
      "1920s theater with original fixtures and red velvet seats.",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=400&auto=format&fit=crop",
    badge: "historic",
    tags: ["historic", "indoor"],
    attributes: { indoor: true, outdoor: false, permit: true },
  },
  {
    title: "Sunlit Botanical Greenhouse",
    description:
      "Glass dome filled with tropical plants and natural lighting.",
    imageUrl:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=400&auto=format&fit=crop",
    badge: "nature",
    tags: ["nature", "indoor"],
    attributes: { indoor: true, outdoor: false, permit: false },
  },
  {
    title: "Mountain Peak Overlook",
    description:
      "Scenic mountain vista with rugged terrain and dramatic sunrises.",
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
 * Follows Repository pattern for data access abstraction
 */
export class MockLocationRepository implements ILocationRepository {
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
