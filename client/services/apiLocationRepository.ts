import type {
  LocationResult,
  LocationFilterType,
  LocationAttributes,
} from "../../shared/api";
import type { ILocationRepository } from "./locationService";
import { getServiceConfig } from "./config";

/**
 * API-based implementation of location repository
 * Ready for future integration with backend API
 */
export class ApiLocationRepository implements ILocationRepository {
  private baseUrl: string;
  private timeout: number;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheConfig: { enabled: boolean; ttl: number };

  constructor() {
    const config = getServiceConfig();
    this.baseUrl = `${config.apiBaseUrl}/locations`;
    this.timeout = config.timeout;
    this.cacheConfig = config.cache;
  }

  /**
   * Generic fetch wrapper with error handling and caching
   */
  private async fetchWithCache<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    const cacheKey = `${endpoint}${JSON.stringify(options?.body || {})}`;

    // Check cache first
    if (this.cacheConfig.enabled) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheConfig.ttl) {
        return cached.data as T;
      }
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Cache the result
      if (this.cacheConfig.enabled) {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
        });
      }

      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error("Request timeout exceeded");
        }
        throw error;
      }
      throw new Error("Unknown error occurred");
    }
  }

  /**
   * Get all locations from API
   */
  async getLocations(): Promise<LocationResult[]> {
    return this.fetchWithCache<LocationResult[]>("");
  }

  /**
   * Search locations via API
   */
  async searchLocations(query: string): Promise<LocationResult[]> {
    const params = new URLSearchParams({ q: query });
    return this.fetchWithCache<LocationResult[]>(`/search?${params}`);
  }

  /**
   * Get locations by filter from API
   */
  async getLocationsByFilter(
    filter: LocationFilterType,
  ): Promise<LocationResult[]> {
    if (filter === "any") {
      return this.getLocations();
    }

    const params = new URLSearchParams({ filter });
    return this.fetchWithCache<LocationResult[]>(`/filter?${params}`);
  }

  /**
   * Get locations by attributes from API
   */
  async getLocationsByAttributes(
    attributes: Partial<LocationAttributes>,
  ): Promise<LocationResult[]> {
    return this.fetchWithCache<LocationResult[]>("/attributes", {
      method: "POST",
      body: JSON.stringify({ attributes }),
    });
  }

  /**
   * Get location by ID from API
   */
  async getLocationById(id: string): Promise<LocationResult | null> {
    try {
      return await this.fetchWithCache<LocationResult>(`/${id}`);
    } catch (error) {
      // Return null if location not found
      if (error instanceof Error && error.message.includes("404")) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Clear cache manually if needed
   */
  clearCache(): void {
    this.cache.clear();
  }
}
