import { container } from './container';
import { GeminiService } from '../geminiService';
import { LocationService } from '../implementations/locationServiceImpl';
import { MockLocationRepository } from '../repositories/mockLocationRepository';
import { ApiLocationRepository } from '../apiLocationRepository';
import { 
  GlobalErrorHandler, 
  ConsoleErrorLoggingService, 
  MockErrorReportingService 
} from '../error/errorHandlingService';
import { getServiceConfig } from '../config';
import { SERVICE_TOKENS } from './ServiceContainer';

/**
 * Service registration configuration
 * Sets up all application services with proper dependency injection
 * Follows Dependency Inversion Principle
 */
export function configureServices() {
  const config = getServiceConfig();

  // Clear any existing services (useful for testing)
  container.clear();

  // Register error handling services first
  container.registerSingleton(
    SERVICE_TOKENS.ERROR_LOGGING_SERVICE,
    () => new ConsoleErrorLoggingService()
  );

  container.registerSingleton(
    SERVICE_TOKENS.ERROR_REPORTING_SERVICE,
    () => new MockErrorReportingService(
      container.resolve(SERVICE_TOKENS.ERROR_LOGGING_SERVICE)
    )
  );

  container.registerSingleton(
    SERVICE_TOKENS.GLOBAL_ERROR_HANDLER,
    () => new GlobalErrorHandler(
      container.resolve(SERVICE_TOKENS.ERROR_REPORTING_SERVICE),
      container.resolve(SERVICE_TOKENS.ERROR_LOGGING_SERVICE)
    )
  );

  // Register repositories based on configuration
  if (config.useMockData) {
    container.registerSingleton(
      SERVICE_TOKENS.LOCATION_REPOSITORY,
      () => new MockLocationRepository()
    );
  } else {
    container.registerSingleton(
      SERVICE_TOKENS.LOCATION_REPOSITORY,
      () => new ApiLocationRepository()
    );
  }

  // Register services with their dependencies
  container.registerSingleton(
    SERVICE_TOKENS.LOCATION_SERVICE,
    () => new LocationService(
      container.resolve(SERVICE_TOKENS.LOCATION_REPOSITORY)
    )
  );

  container.registerSingleton(
    SERVICE_TOKENS.GEMINI_SERVICE,
    () => new GeminiService()
  );

  return container;
}

/**
 * Initialize all services for the application
 * Call this once at app startup
 */
export function initializeServices() {
  return configureServices();
}