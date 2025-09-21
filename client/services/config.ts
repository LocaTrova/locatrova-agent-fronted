/**
 * Service layer configuration
 * Centralized configuration for all services
 */

export interface ServiceConfig {
  /**
   * Base URL for API endpoints
   */
  apiBaseUrl: string;

  /**
   * Request timeout in milliseconds
   */
  timeout: number;

  /**
   * Whether to use mock data or real API
   */
  useMockData: boolean;

  /**
   * Retry configuration
   */
  retry: {
    attempts: number;
    delay: number;
    backoffMultiplier: number;
  };

  /**
   * Cache configuration
   */
  cache: {
    enabled: boolean;
    ttl: number; // Time to live in milliseconds
  };
}

/**
 * Default service configuration
 */
export const defaultServiceConfig: ServiceConfig = {
  apiBaseUrl: import.meta.env.VITE_API_URL || "/api",
  timeout: 30000,
  useMockData: import.meta.env.MODE === "development",
  retry: {
    attempts: 3,
    delay: 1000,
    backoffMultiplier: 2,
  },
  cache: {
    enabled: true,
    ttl: 5 * 60 * 1000, // 5 minutes
  },
};

/**
 * Get current service configuration
 * Can be overridden by environment variables
 */
export function getServiceConfig(): ServiceConfig {
  return {
    ...defaultServiceConfig,
    // Override with environment-specific settings if needed
  };
}
