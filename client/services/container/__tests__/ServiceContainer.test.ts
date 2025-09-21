import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ServiceContainer, SERVICE_TOKENS } from '../ServiceContainer';

describe('ServiceContainer', () => {
  let container: ServiceContainer;
  
  beforeEach(() => {
    // Get a fresh instance for each test
    container = ServiceContainer.getInstance();
    container.clear();
  });

  describe('Singleton behavior', () => {
    it('should return the same instance when getInstance is called multiple times', () => {
      const instance1 = ServiceContainer.getInstance();
      const instance2 = ServiceContainer.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });

  describe('Service Registration', () => {
    it('should register and resolve a transient service', () => {
      // Arrange
      const mockService = { value: 'test' };
      const factory = vi.fn(() => mockService);
      
      // Act
      container.register('testService', factory);
      const resolved1 = container.resolve('testService');
      const resolved2 = container.resolve('testService');
      
      // Assert
      expect(resolved1).toEqual(mockService);
      expect(resolved2).toEqual(mockService);
      expect(factory).toHaveBeenCalledTimes(2); // Called twice for transient
    });

    it('should register and resolve a singleton service', () => {
      // Arrange
      const mockService = { value: 'test' };
      const factory = vi.fn(() => mockService);
      
      // Act
      container.registerSingleton('testService', factory);
      const resolved1 = container.resolve('testService');
      const resolved2 = container.resolve('testService');
      
      // Assert
      expect(resolved1).toBe(resolved2); // Same instance
      expect(factory).toHaveBeenCalledTimes(1); // Called only once for singleton
    });

    it('should register and resolve a class-based service', () => {
      // Arrange
      class TestClass {
        value = 'test';
      }
      
      // Act
      container.registerClass('testService', TestClass);
      const resolved = container.resolve<TestClass>('testService');
      
      // Assert
      expect(resolved).toBeInstanceOf(TestClass);
      expect(resolved.value).toBe('test');
    });
  });

  describe('Service Resolution', () => {
    it('should throw an error when resolving a non-existent service', () => {
      // Act & Assert
      expect(() => container.resolve('nonExistentService')).toThrow(
        "Service 'nonExistentService' not found. Make sure it's registered."
      );
    });

    it('should return correct type with TypeScript generics', () => {
      // Arrange
      interface TestService {
        getValue(): string;
      }
      
      const mockService: TestService = {
        getValue: () => 'test'
      };
      
      // Act
      container.register('testService', () => mockService);
      const resolved = container.resolve<TestService>('testService');
      
      // Assert
      expect(resolved.getValue()).toBe('test');
    });
  });

  describe('Service Existence Check', () => {
    it('should return true for registered services', () => {
      // Arrange
      container.register('testService', () => ({ value: 'test' }));
      
      // Act & Assert
      expect(container.has('testService')).toBe(true);
    });

    it('should return false for non-registered services', () => {
      // Act & Assert
      expect(container.has('nonExistentService')).toBe(false);
    });
  });

  describe('Service Clearing', () => {
    it('should clear all services when clear() is called', () => {
      // Arrange
      container.register('service1', () => ({ value: 'test1' }));
      container.registerSingleton('service2', () => ({ value: 'test2' }));
      
      // Act
      container.clear();
      
      // Assert
      expect(container.has('service1')).toBe(false);
      expect(container.has('service2')).toBe(false);
    });

    it('should allow re-registration after clearing', () => {
      // Arrange
      container.register('testService', () => ({ value: 'original' }));
      container.clear();
      
      // Act
      container.register('testService', () => ({ value: 'new' }));
      const resolved = container.resolve<{ value: string }>('testService');
      
      // Assert
      expect(resolved.value).toBe('new');
    });
  });

  describe('Dependency Injection', () => {
    it('should handle circular dependencies gracefully', () => {
      // This test checks that we don't get into infinite loops
      // when services depend on each other
      
      const serviceA = () => ({
        name: 'A',
        getB: () => container.resolve('serviceB')
      });
      
      const serviceB = () => ({
        name: 'B', 
        getA: () => container.resolve('serviceA')
      });
      
      container.register('serviceA', serviceA);
      container.register('serviceB', serviceB);
      
      // This should not cause infinite recursion during registration
      expect(() => {
        const a = container.resolve<{ name: string }>('serviceA');
        expect(a.name).toBe('A');
      }).not.toThrow();
    });

    it('should maintain singleton instances even with complex dependencies', () => {
      // Arrange
      let serviceACreationCount = 0;
      let serviceBCreationCount = 0;
      
      const serviceA = () => {
        serviceACreationCount++;
        return { name: 'A', id: serviceACreationCount };
      };
      
      const serviceB = () => {
        serviceBCreationCount++;
        return { 
          name: 'B', 
          id: serviceBCreationCount,
          serviceA: container.resolve('serviceA')
        };
      };
      
      container.registerSingleton('serviceA', serviceA);
      container.registerSingleton('serviceB', serviceB);
      
      // Act
      const b1 = container.resolve<{ name: string; id: number; serviceA: unknown }>('serviceB');
      const b2 = container.resolve<{ name: string; id: number; serviceA: unknown }>('serviceB');
      const a1 = container.resolve('serviceA');
      
      // Assert
      expect(serviceACreationCount).toBe(1);
      expect(serviceBCreationCount).toBe(1);
      expect(b1).toBe(b2); // Same instance
      expect(b1.serviceA).toBe(a1); // Same serviceA instance
    });
  });

  describe('SERVICE_TOKENS', () => {
    it('should have all required service tokens defined', () => {
      expect(SERVICE_TOKENS.LOCATION_SERVICE).toBe('locationService');
      expect(SERVICE_TOKENS.LOCATION_REPOSITORY).toBe('locationRepository');
      expect(SERVICE_TOKENS.GEMINI_SERVICE).toBe('geminiService');
      expect(SERVICE_TOKENS.ERROR_REPORTING_SERVICE).toBe('errorReportingService');
      expect(SERVICE_TOKENS.ERROR_LOGGING_SERVICE).toBe('errorLoggingService');
      expect(SERVICE_TOKENS.GLOBAL_ERROR_HANDLER).toBe('globalErrorHandler');
    });
  });
});