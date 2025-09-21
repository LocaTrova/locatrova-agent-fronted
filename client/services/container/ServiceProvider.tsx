import React, { createContext, useContext, ReactNode } from 'react';
import { ServiceContainer, IServiceContainer } from './ServiceContainer';

/**
 * React Context for Service Container
 * Enables dependency injection in React components
 * Follows Provider pattern
 */
const ServiceContext = createContext<IServiceContainer | null>(null);

interface ServiceProviderProps {
  children: ReactNode;
  container?: IServiceContainer;
}

/**
 * Service Provider Component
 * Provides service container to all child components
 */
export function ServiceProvider({ children, container }: ServiceProviderProps) {
  const serviceContainer = container || ServiceContainer.getInstance();

  return (
    <ServiceContext.Provider value={serviceContainer}>
      {children}
    </ServiceContext.Provider>
  );
}

/**
 * Hook to access service container
 * Throws error if used outside ServiceProvider
 */
export function useServiceContainer(): IServiceContainer {
  const container = useContext(ServiceContext);
  if (!container) {
    throw new Error('useServiceContainer must be used within a ServiceProvider');
  }
  return container;
}

/**
 * Hook to resolve a specific service
 * Type-safe service resolution
 */
export function useService<T>(token: string): T {
  const container = useServiceContainer();
  return container.resolve<T>(token);
}

/**
 * Higher-order component for injecting services as props
 * Useful for class components or when you need props-based injection
 */
export function withServices<T extends Record<string, any>>(
  serviceMap: Record<keyof T, string>
) {
  return function <P extends object>(
    Component: React.ComponentType<P & T>
  ): React.ComponentType<P> {
    return function WithServicesComponent(props: P) {
      const container = useServiceContainer();
      
      const services = Object.entries(serviceMap).reduce(
        (acc, [propName, serviceToken]) => ({
          ...acc,
          [propName]: container.resolve(serviceToken),
        }),
        {} as T
      );

      return <Component {...props} {...services} />;
    };
  };
}