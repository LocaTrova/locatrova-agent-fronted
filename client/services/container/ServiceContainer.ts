/**
 * Service Container for Dependency Injection
 * Implements Dependency Inversion Principle by providing abstraction layer
 * Follows Singleton pattern for global service management
 */

export type ServiceFactory<T> = () => T;
export type ServiceConstructor<T> = new (...args: any[]) => T;

export interface IServiceContainer {
  register<T>(token: string, factory: ServiceFactory<T>): void;
  registerSingleton<T>(token: string, factory: ServiceFactory<T>): void;
  registerClass<T>(token: string, constructor: ServiceConstructor<T>): void;
  resolve<T>(token: string): T;
  has(token: string): boolean;
  clear(): void;
}

/**
 * Implementation of service container with support for:
 * - Transient services (new instance each time)
 * - Singleton services (same instance)
 * - Class-based registration
 */
export class ServiceContainer implements IServiceContainer {
  private services = new Map<string, ServiceFactory<any>>();
  private singletons = new Map<string, any>();

  constructor() {}

  /**
   * Register a transient service (new instance each time)
   */
  public register<T>(token: string, factory: ServiceFactory<T>): void {
    this.services.set(token, factory);
  }

  /**
   * Register a singleton service (same instance always)
   */
  public registerSingleton<T>(token: string, factory: ServiceFactory<T>): void {
    this.services.set(token, () => {
      if (!this.singletons.has(token)) {
        this.singletons.set(token, factory());
      }
      return this.singletons.get(token);
    });
  }

  /**
   * Register a class-based service
   */
  public registerClass<T>(token: string, constructor: ServiceConstructor<T>): void {
    this.register(token, () => new constructor());
  }

  /**
   * Resolve a service by token
   */
  public resolve<T>(token: string): T {
    const factory = this.services.get(token);
    if (!factory) {
      throw new Error(`Service '${token}' not found. Make sure it's registered.`);
    }
    return factory();
  }

  /**
   * Check if service is registered
   */
  public has(token: string): boolean {
    return this.services.has(token);
  }

  /**
   * Clear all services (useful for testing)
   */
  public clear(): void {
    for (const token of this.services.keys()) {
      const instance = this.singletons.get(token);
      if (instance && typeof instance.teardown === 'function') {
        instance.teardown();
      }
    }
    this.services.clear();
    this.singletons.clear();
  }
}

// Service tokens for type-safe service resolution
export const SERVICE_TOKENS = {
  LOCATION_SERVICE: 'locationService',
  LOCATION_REPOSITORY: 'locationRepository',
  GEMINI_SERVICE: 'geminiService',
  API_CLIENT: 'apiClient',
  ERROR_REPORTING_SERVICE: 'errorReportingService',
  ERROR_LOGGING_SERVICE: 'errorLoggingService',
  GLOBAL_ERROR_HANDLER: 'globalErrorHandler',
} as const;

export type ServiceToken = typeof SERVICE_TOKENS[keyof typeof SERVICE_TOKENS];