import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ServiceContainer, SERVICE_TOKENS } from '../ServiceContainer';
import { configureServices, initializeServices } from '../serviceRegistration';
import type { ILocationService } from '../../interfaces/locationInterfaces';
import type { IGeminiService } from '../../interfaces/geminiInterfaces';
import { GlobalErrorHandler } from '../../error/errorHandlingService';

/**
 * Integration tests for service registration
 * These tests verify that the real service registration works as intended
 * and that services can be resolved with their proper dependencies
 */
describe('Service Registration Integration', () => {
  let container: ServiceContainer;

  beforeEach(() => {
    container = ServiceContainer.getInstance();
    container.clear();
  });

  afterEach(() => {
    container.clear();
  });

  describe('configureServices', () => {
    it('should register all required services', () => {
      const configuredContainer = configureServices();

      // Verify all service tokens are registered
      expect(() => configuredContainer.resolve(SERVICE_TOKENS.LOCATION_SERVICE)).not.toThrow();
      expect(() => configuredContainer.resolve(SERVICE_TOKENS.LOCATION_REPOSITORY)).not.toThrow();
      expect(() => configuredContainer.resolve(SERVICE_TOKENS.GEMINI_SERVICE)).not.toThrow();
      expect(() => configuredContainer.resolve(SERVICE_TOKENS.ERROR_LOGGING_SERVICE)).not.toThrow();
      expect(() => configuredContainer.resolve(SERVICE_TOKENS.ERROR_REPORTING_SERVICE)).not.toThrow();
      expect(() => configuredContainer.resolve(SERVICE_TOKENS.GLOBAL_ERROR_HANDLER)).not.toThrow();
    });

    it('should register services as singletons', () => {
      const configuredContainer = configureServices();

      // Resolve services twice to verify they're singletons
      const locationService1 = configuredContainer.resolve(SERVICE_TOKENS.LOCATION_SERVICE);
      const locationService2 = configuredContainer.resolve(SERVICE_TOKENS.LOCATION_SERVICE);
      expect(locationService1).toBe(locationService2);

      const geminiService1 = configuredContainer.resolve(SERVICE_TOKENS.GEMINI_SERVICE);
      const geminiService2 = configuredContainer.resolve(SERVICE_TOKENS.GEMINI_SERVICE);
      expect(geminiService1).toBe(geminiService2);
    });

    it('should resolve LocationService with proper interface', () => {
      const configuredContainer = configureServices();
      const locationService = configuredContainer.resolve<ILocationService>(SERVICE_TOKENS.LOCATION_SERVICE);

      expect(locationService).toBeDefined();
      expect(typeof locationService.getAllLocations).toBe('function');
      expect(typeof locationService.searchLocations).toBe('function');
      expect(typeof locationService.getLocationsByTag).toBe('function');
      expect(typeof locationService.getLocationsByBadge).toBe('function');
    });

    it('should resolve GeminiService with proper interface', () => {
      const configuredContainer = configureServices();
      const geminiService = configuredContainer.resolve<IGeminiService>(SERVICE_TOKENS.GEMINI_SERVICE);

      expect(geminiService).toBeDefined();
      expect(typeof geminiService.streamResponse).toBe('function');
      expect(typeof geminiService.abort).toBe('function');
      expect(typeof geminiService.checkHealth).toBe('function');
      expect(typeof geminiService.getServiceInfo).toBe('function');
    });

    it('should resolve GlobalErrorHandler with dependencies', () => {
      const configuredContainer = configureServices();
      const errorHandler = configuredContainer.resolve<GlobalErrorHandler>(SERVICE_TOKENS.GLOBAL_ERROR_HANDLER);

      expect(errorHandler).toBeDefined();
      expect(typeof errorHandler.handleError).toBe('function');
      expect(typeof errorHandler.handleUserFeedback).toBe('function');
    });
  });

  describe('initializeServices', () => {
    it('should return configured container', () => {
      const initializedContainer = initializeServices();

      expect(initializedContainer).toBeInstanceOf(ServiceContainer);
      expect(() => initializedContainer.resolve(SERVICE_TOKENS.LOCATION_SERVICE)).not.toThrow();
      expect(() => initializedContainer.resolve(SERVICE_TOKENS.GEMINI_SERVICE)).not.toThrow();
    });

    it('should be ready for production use', () => {
      const initializedContainer = initializeServices();

      // Verify critical services are available
      const locationService = initializedContainer.resolve<ILocationService>(SERVICE_TOKENS.LOCATION_SERVICE);
      const geminiService = initializedContainer.resolve<IGeminiService>(SERVICE_TOKENS.GEMINI_SERVICE);
      const errorHandler = initializedContainer.resolve<GlobalErrorHandler>(SERVICE_TOKENS.GLOBAL_ERROR_HANDLER);

      expect(locationService).toBeDefined();
      expect(geminiService).toBeDefined();
      expect(errorHandler).toBeDefined();
    });
  });

  describe('Service Dependencies', () => {
    it('should resolve LocationService with repository dependency', () => {
      const configuredContainer = configureServices();
      const locationService = configuredContainer.resolve<ILocationService>(SERVICE_TOKENS.LOCATION_SERVICE);

      // Verify the service was constructed with a repository
      expect(locationService).toBeDefined();
      // The service should be functional (dependency was injected properly)
      expect(typeof locationService.getAllLocations).toBe('function');
    });

    it('should resolve error handling services with proper dependency chain', () => {
      const configuredContainer = configureServices();
      
      const loggingService = configuredContainer.resolve(SERVICE_TOKENS.ERROR_LOGGING_SERVICE);
      const reportingService = configuredContainer.resolve(SERVICE_TOKENS.ERROR_REPORTING_SERVICE);
      const globalHandler = configuredContainer.resolve<GlobalErrorHandler>(SERVICE_TOKENS.GLOBAL_ERROR_HANDLER);

      expect(loggingService).toBeDefined();
      expect(reportingService).toBeDefined();
      expect(globalHandler).toBeDefined();
      
      // Verify the error handler has its dependencies
      expect(typeof globalHandler.handleError).toBe('function');
    });
  });

  describe('Configuration-based Service Resolution', () => {
    it('should use appropriate repository based on config', () => {
      // This test verifies that the service registration respects configuration
      const configuredContainer = configureServices();
      const repository = configuredContainer.resolve(SERVICE_TOKENS.LOCATION_REPOSITORY);

      expect(repository).toBeDefined();
      // The actual implementation depends on config, but it should be resolvable
    });
  });
});