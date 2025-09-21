import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useAsyncOperation } from '../useAsyncOperation';

describe('useAsyncOperation - Basic Functionality', () => {
  describe('Initial State', () => {
    it('should initialize with correct default state', () => {
      // Arrange
      const asyncFn = vi.fn(() => Promise.resolve('test-data'));

      // Act
      const { result } = renderHook(() => useAsyncOperation(asyncFn));

      // Assert
      expect(result.current.data).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    it('should initialize with provided initial data', () => {
      // Arrange
      const asyncFn = vi.fn(() => Promise.resolve('new-data'));
      const initialData = 'initial-data';

      // Act
      const { result } = renderHook(() => 
        useAsyncOperation(asyncFn, { initialData })
      );

      // Assert
      expect(result.current.data).toBe(initialData);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.isSuccess).toBe(true); // Because data is not null
      expect(result.current.isError).toBe(false);
    });
  });

  describe('Successful Operations', () => {
    it('should handle successful async operation', async () => {
      // Arrange
      const asyncFn = vi.fn(() => Promise.resolve('success-data'));
      const { result } = renderHook(() => useAsyncOperation(asyncFn));

      // Act
      act(() => {
        result.current.execute();
      });

      // Assert - Loading state
      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();

      // Wait for completion
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBe('success-data');
      expect(result.current.error).toBeNull();
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isError).toBe(false);
    });

    it('should call onSuccess callback when operation succeeds', async () => {
      // Arrange
      const asyncFn = vi.fn(() => Promise.resolve('callback-data'));
      const onSuccess = vi.fn();
      const { result } = renderHook(() => 
        useAsyncOperation(asyncFn, { onSuccess })
      );

      // Act
      act(() => {
        result.current.execute();
      });

      // Assert
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledWith('callback-data');
    });
  });

  describe('Error Handling', () => {
    it('should handle failing async operation', async () => {
      // Arrange
      const asyncFn = vi.fn(() => Promise.reject(new Error('Test error message')));
      const { result } = renderHook(() => useAsyncOperation(asyncFn));

      // Suppress console errors for this test
      const originalConsoleError = console.error;
      console.error = vi.fn();

      try {
        // Act
        act(() => {
          result.current.execute().catch(() => {
            // Expected to fail, suppress unhandled promise rejection
          });
        });

        // Assert - Loading state
        expect(result.current.loading).toBe(true);
        expect(result.current.error).toBeNull();

        // Wait for completion
        await waitFor(() => {
          expect(result.current.loading).toBe(false);
        });

        expect(result.current.data).toBeNull();
        expect(result.current.error).toBe('Test error message');
        expect(result.current.isSuccess).toBe(false);
        expect(result.current.isError).toBe(true);
      } finally {
        console.error = originalConsoleError;
      }
    });

    it('should call onError callback when operation fails', async () => {
      // Arrange
      const asyncFn = vi.fn(() => Promise.reject(new Error('Callback error')));
      const onError = vi.fn();
      const { result } = renderHook(() => 
        useAsyncOperation(asyncFn, { onError })
      );

      // Suppress console errors for this test
      const originalConsoleError = console.error;
      console.error = vi.fn();

      try {
        // Act
        act(() => {
          result.current.execute().catch(() => {
            // Expected to fail, suppress unhandled promise rejection
          });
        });

        // Assert
        await waitFor(() => {
          expect(result.current.loading).toBe(false);
        });

        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith('Callback error');
      } finally {
        console.error = originalConsoleError;
      }
    });

    it('should handle non-Error objects thrown from async function', async () => {
      // Arrange
      const asyncFn = vi.fn(() => Promise.reject('String error'));
      const { result } = renderHook(() => useAsyncOperation(asyncFn));

      // Suppress console errors for this test
      const originalConsoleError = console.error;
      console.error = vi.fn();

      try {
        // Act
        act(() => {
          result.current.execute().catch(() => {
            // Expected to fail, suppress unhandled promise rejection
          });
        });

        // Assert
        await waitFor(() => {
          expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBe('An error occurred');
        expect(result.current.isError).toBe(true);
      } finally {
        console.error = originalConsoleError;
      }
    });
  });

  describe('Reset Functionality', () => {
    it('should reset state to initial values', async () => {
      // Arrange
      const asyncFn = vi.fn(() => Promise.resolve('data-to-reset'));
      const { result } = renderHook(() => useAsyncOperation(asyncFn));

      // Execute operation first
      act(() => {
        result.current.execute();
      });

      await waitFor(() => {
        expect(result.current.data).toBe('data-to-reset');
      });

      // Act - Reset
      act(() => {
        result.current.reset();
      });

      // Assert
      expect(result.current.data).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
    });
  });

  describe('Immediate Execution', () => {
    it('should execute immediately when immediate option is true', async () => {
      // Arrange
      const asyncFn = vi.fn(() => Promise.resolve('immediate-data'));

      // Act
      const { result } = renderHook(() => 
        useAsyncOperation(asyncFn, { immediate: true })
      );

      // Assert - Should start loading immediately
      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();

      // Wait for completion
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBe('immediate-data');
      expect(result.current.isSuccess).toBe(true);
    });
  });

  describe('Return Values from Execute', () => {
    it('should return result from execute method', async () => {
      // Arrange
      const asyncFn = vi.fn(() => Promise.resolve('return-value'));
      const { result } = renderHook(() => useAsyncOperation(asyncFn));

      // Act & Assert
      const promise = result.current.execute();
      await expect(promise).resolves.toBe('return-value');
    });

    it('should throw error from execute method when async function fails', async () => {
      // Arrange
      const asyncFn = vi.fn(() => Promise.reject(new Error('Execute error')));
      const { result } = renderHook(() => useAsyncOperation(asyncFn));

      // Act & Assert
      const promise = result.current.execute();
      await expect(promise).rejects.toThrow('Execute error');
    });
  });
});