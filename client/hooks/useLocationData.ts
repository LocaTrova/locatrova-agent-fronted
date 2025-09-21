import { useCallback } from 'react';
import { useService, SERVICE_TOKENS } from '../services/container';
import { useAsyncOperation } from './useAsyncOperation';
import { useGlobalErrorHandler } from './useGlobalErrorHandler';
import type { ILocationService } from '../services/interfaces/locationInterfaces';

/**
 * Custom hook for location data management
 * Separates data loading concerns from UI components (Single Responsibility)
 * Uses dependency injection to resolve services (Dependency Inversion)
 */
export function useLocationData() {
  const locationService = useService<ILocationService>(SERVICE_TOKENS.LOCATION_SERVICE);
  const { handleNetworkError } = useGlobalErrorHandler();

  // Memoize error handlers to prevent infinite loops
  const handleLoadError = useCallback((error: string) => {
    handleNetworkError(new Error(error), { context: 'loadLocations' });
  }, [handleNetworkError]);

  const handleSearchError = useCallback((error: string) => {
    handleNetworkError(new Error(error), { context: 'searchLocations' });
  }, [handleNetworkError]);

  // Memoize the async function to prevent infinite loops
  const loadLocationsAsync = useCallback(() => {
    return locationService.getAllLocations();
  }, [locationService]);

  // Load all locations
  const {
    data: locations,
    loading: locationsLoading,
    error: locationsError,
    execute: loadLocations,
    reset: resetLocations,
  } = useAsyncOperation(
    loadLocationsAsync,
    {
      immediate: true,
      onError: handleLoadError,
    }
  );

  // Search locations
  const {
    data: searchResults,
    loading: searchLoading,
    error: searchError,
    // execute: searchLocations, // Available for future use
    reset: resetSearch,
  } = useAsyncOperation(
    () => Promise.resolve([]), // Will be called with parameter
    {
      onError: handleSearchError,
    }
  );

  const performSearch = useCallback(
    async (searchTerm: string) => {
      if (!searchTerm.trim()) {
        resetSearch();
        return;
      }
      
      try {
        const results = await locationService.searchLocations(searchTerm);
        // Manually update search results since we can't pass parameters to useAsyncOperation
        return results;
      } catch (error) {
        handleNetworkError(error instanceof Error ? error : new Error(String(error)), {
          context: 'performSearch',
          searchTerm,
        });
        throw error;
      }
    },
    [locationService, handleNetworkError, resetSearch]
  );

  const getLocationsByTag = useCallback(
    async (tag: string) => {
      try {
        return await locationService.getLocationsByTag(tag);
      } catch (error) {
        handleNetworkError(error instanceof Error ? error : new Error(String(error)), {
          context: 'getLocationsByTag',
          tag,
        });
        throw error;
      }
    },
    [locationService, handleNetworkError]
  );

  const getLocationsByBadge = useCallback(
    async (badge: string) => {
      try {
        return await locationService.getLocationsByBadge(badge);
      } catch (error) {
        handleNetworkError(error instanceof Error ? error : new Error(String(error)), {
          context: 'getLocationsByBadge',
          badge,
        });
        throw error;
      }
    },
    [locationService, handleNetworkError]
  );

  const refreshLocations = useCallback(async () => {
    try {
      await loadLocations();
    } catch {
      // Error is already handled by useAsyncOperation
    }
  }, [loadLocations]);

  return {
    // Data
    locations: locations || [],
    searchResults: searchResults || [],
    
    // Loading states
    locationsLoading,
    searchLoading,
    isLoading: locationsLoading || searchLoading,
    
    // Error states
    locationsError,
    searchError,
    hasError: !!locationsError || !!searchError,
    
    // Actions
    loadLocations,
    performSearch,
    getLocationsByTag,
    getLocationsByBadge,
    refreshLocations,
    
    // Reset functions
    resetLocations,
    resetSearch,
  };
}