/**
 * Service layer exports
 * Central export point for all services
 */

/**
 * Service layer exports
 * Central export point for all services
 */

// Interfaces
export type { ILocationRepository, ILocationService } from './interfaces/locationInterfaces';
export type { 
  IErrorReportingService, 
  IErrorLoggingService 
} from './error/errorHandlingService';

// Implementations
export { LocationService } from './implementations/locationServiceImpl';
export { MockLocationRepository } from './repositories/mockLocationRepository';
export { 
  GlobalErrorHandler, 
  ConsoleErrorLoggingService, 
  MockErrorReportingService 
} from './error/errorHandlingService';

// Container and DI
export * from './container';

// Other services
export { GeminiService } from './geminiService';
export { ApiLocationRepository } from './apiLocationRepository';
export { getServiceConfig } from './config';
