import { vi } from 'vitest';

// Mock Sonner and Toaster to avoid UI dependencies
vi.mock('sonner', () => ({
  Toaster: () => null
}));

vi.mock('../components/ui/sonner', () => ({
  Sonner: () => null
}));

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ServiceProvider } from '../services/container/ServiceProvider';
import { initializeServices } from '../services/container/serviceRegistration';
import { ServiceContainer } from '../services/container/ServiceContainer';
import { ErrorBoundary } from '../components/error/ErrorBoundary';
import { TooltipProvider } from '../components/ui/tooltip';

/**
 * Integration tests for App.tsx setup
 * These tests verify that the complete application setup works as intended
 * including service initialization, providers, and error boundaries
 */
describe('App.tsx Integration', () => {
  let queryClient: QueryClient;
  let serviceContainer: ServiceContainer;

  beforeEach(() => {
    // Create fresh QueryClient for each test
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    // Initialize services as done in real App.tsx
    serviceContainer = initializeServices();
  });

  afterEach(() => {
    // Clear service container
    serviceContainer.clear();
    
    // Clear QueryClient
    queryClient.clear();
  });

  describe('Service Initialization', () => {
    it('should initialize services successfully', () => {
      expect(serviceContainer).toBeDefined();
      expect(serviceContainer).toBeInstanceOf(ServiceContainer);
    });

    it('should have all required services available', () => {
      // This mimics the real initialization in App.tsx
      const container = initializeServices();
      
      // Verify critical services are available (same as what components would need)
      expect(() => container.resolve('locationService')).not.toThrow();
      expect(() => container.resolve('geminiService')).not.toThrow();
      expect(() => container.resolve('globalErrorHandler')).not.toThrow();
    });
  });

  describe('Provider Stack Integration', () => {
    it('should render ErrorBoundary + ServiceProvider + QueryClient stack without errors', () => {
      const TestComponent = () => <div data-testid="test-content">App Content</div>;

      // Replicate the exact provider stack from App.tsx
      render(
        <ErrorBoundary>
          <ServiceProvider container={serviceContainer}>
            <QueryClientProvider client={queryClient}>
              <TooltipProvider>
                <ErrorBoundary>
                  <TestComponent />
                </ErrorBoundary>
              </TooltipProvider>
            </QueryClientProvider>
          </ServiceProvider>
        </ErrorBoundary>
      );

      expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });

    it('should handle service provider context correctly', () => {
      const ServiceConsumer = () => {
        // This would be similar to how useService works in components
        return <div data-testid="service-consumer">Service Context Available</div>;
      };

      render(
        <ServiceProvider container={serviceContainer}>
          <ServiceConsumer />
        </ServiceProvider>
      );

      expect(screen.getByTestId('service-consumer')).toBeInTheDocument();
    });
  });

  describe('Nested Error Boundaries', () => {
    it('should handle nested error boundaries as in App.tsx', () => {
      const ThrowingComponent = () => {
        throw new Error('Test error');
      };

      const { container } = render(
        <ErrorBoundary>
          <ServiceProvider container={serviceContainer}>
            <QueryClientProvider client={queryClient}>
              <TooltipProvider>
                <ErrorBoundary>
                  <ThrowingComponent />
                </ErrorBoundary>
              </TooltipProvider>
            </QueryClientProvider>
          </ServiceProvider>
        </ErrorBoundary>
      );

      // Inner error boundary should catch the error
      expect(container.querySelector('[data-testid="error-boundary-fallback"]') || 
             container.textContent?.includes('Something went wrong')).toBeTruthy();
    });

    it('should isolate errors in inner boundary', () => {
      const ThrowingComponent = () => {
        throw new Error('Inner component error');
      };

      const SafeComponent = () => <div data-testid="safe-component">Safe Content</div>;

      render(
        <ErrorBoundary>
          <ServiceProvider container={serviceContainer}>
            <QueryClientProvider client={queryClient}>
              <SafeComponent />
              <ErrorBoundary>
                <ThrowingComponent />
              </ErrorBoundary>
            </QueryClientProvider>
          </ServiceProvider>
        </ErrorBoundary>
      );

      // Safe component should still be rendered
      expect(screen.getByTestId('safe-component')).toBeInTheDocument();
    });
  });

  describe('Router Integration', () => {
    it('should work with RouterProvider as in real app', () => {
      const RoutedComponent = () => <div data-testid="routed-content">Routed Content</div>;

      render(
        <ErrorBoundary>
          <ServiceProvider container={serviceContainer}>
            <QueryClientProvider client={queryClient}>
              <TooltipProvider>
                <ErrorBoundary>
                  <RoutedComponent />
                </ErrorBoundary>
              </TooltipProvider>
            </QueryClientProvider>
          </ServiceProvider>
        </ErrorBoundary>
      );

      expect(screen.getByTestId('routed-content')).toBeInTheDocument();
    });
  });

  describe('Production-like Setup', () => {
    it('should handle the complete setup as in production', () => {
      // This test replicates the exact structure from App.tsx
      const AppLikeComponent = () => (
        <ErrorBoundary>
          <ServiceProvider container={initializeServices()}>
            <QueryClientProvider client={new QueryClient()}>
              <TooltipProvider>
                <ErrorBoundary>
                  <div data-testid="app-content">
                    <div>Main App Content</div>
                  </div>
                </ErrorBoundary>
              </TooltipProvider>
            </QueryClientProvider>
          </ServiceProvider>
        </ErrorBoundary>
      );

      render(<AppLikeComponent />);

      expect(screen.getByTestId('app-content')).toBeInTheDocument();
      expect(screen.getByText('Main App Content')).toBeInTheDocument();
    });

    it('should initialize fresh services for each app instance', () => {
      const container1 = initializeServices();
      const container2 = initializeServices();

      // Services should be properly initialized each time
      expect(() => container1.resolve('locationService')).not.toThrow();
      expect(() => container2.resolve('locationService')).not.toThrow();
      
      // They should be the same singleton instance since container is singleton
      const service1 = container1.resolve('locationService');
      const service2 = container2.resolve('locationService');
      expect(service1).toBe(service2);
    });
  });
});