import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useAsyncOperation, useMultipleAsyncOperations } from '../useAsyncOperation';

describe('useAsyncOperation', () => {
  // Mock async function that resolves successfully
  const createSuccessfulAsyncFunction = <T>(value: T) => 
    vi.fn(() => Promise.resolve(value));

  // Mock async function that rejects
  const createFailingAsyncFunction = (error: string) =>
    vi.fn(() => Promise.reject(new Error(error)));

  afterEach(() => {
    
  });

  describe('Initial State', () => {
    it('should initialize with correct default state', () => {
      // Arrange
      const asyncFn = createSuccessfulAsyncFunction('test-data');

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
      const asyncFn = createSuccessfulAsyncFunction('new-data');
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

    it('should execute immediately when immediate option is true', async () => {
      // Arrange
      const asyncFn = createSuccessfulAsyncFunction('immediate-data');

      // Act
      const { result } = renderHook(() => 
        useAsyncOperation(asyncFn, { immediate: true })
      );

      // Assert
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.data).toBe('immediate-data');
        expect(result.current.isSuccess).toBe(true);
      });
    });
  });

  describe('Manual Execution', () => {
    it('should handle successful async operation', async () => {
      // Arrange
      const asyncFn = createSuccessfulAsyncFunction('success-data');
      const { result } = renderHook(() => useAsyncOperation(asyncFn));

      // Act
      await act(async () => {
        await result.current.execute();
      });

      // Assert
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.data).toBe('success-data');
        expect(result.current.error).toBeNull();
        expect(result.current.isSuccess).toBe(true);
        expect(result.current.isError).toBe(false);
      });
    });

    it('should handle failing async operation', async () => {
      // Arrange
      const asyncFn = createFailingAsyncFunction('Test error message');
      const { result } = renderHook(() => useAsyncOperation(asyncFn));

      // Act
      await act(async () => {
        try {
          await result.current.execute();
        } catch (error) {
          // ignore
        }
      });

      // Assert
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.data).toBeNull();
        expect(result.current.error).toBe('Test error message');
        expect(result.current.isSuccess).toBe(false);
        expect(result.current.isError).toBe(true);
      });
    });

    it('should return result from execute method', async () => {
      // Arrange
      const asyncFn = createSuccessfulAsyncFunction('return-value');
      const { result } = renderHook(() => useAsyncOperation(asyncFn));

      // Act
      const promise = result.current.execute();

      // Assert
      await expect(promise).resolves.toBe('return-value');
    });

    it('should throw error from execute method when async function fails', async () => {
      // Arrange
      const asyncFn = createFailingAsyncFunction('Execute error');
      const { result } = renderHook(() => useAsyncOperation(asyncFn));

      // Act & Assert
      await expect(result.current.execute()).rejects.toThrow('Execute error');
    });
  });

  describe('Callbacks', () => {
    it('should call onSuccess callback when operation succeeds', async () => {
      // Arrange
      const asyncFn = createSuccessfulAsyncFunction('callback-data');
      const onSuccess = vi.fn();
      const { result } = renderHook(() => 
        useAsyncOperation(asyncFn, { onSuccess })
      );

      // Act
      await act(async () => {
        await result.current.execute();
      });

      // Assert
      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledWith('callback-data');
    });

    it('should call onError callback when operation fails', async () => {
      // Arrange
      const asyncFn = createFailingAsyncFunction('Callback error');
      const onError = vi.fn();
      const { result } = renderHook(() => 
        useAsyncOperation(asyncFn, { onError })
      );

      // Act
      await act(async () => {
        try {
          await result.current.execute();
        } catch (error) {
          // ignore
        }
      });

      // Assert
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith('Callback error');
    });
  });

  describe('Reset Functionality', () => {
    it('should reset state to initial values', async () => {
      // Arrange
      const asyncFn = createSuccessfulAsyncFunction('data-to-reset');
      const { result } = renderHook(() => useAsyncOperation(asyncFn));

      // Execute operation first
      await act(async () => {
        await result.current.execute();
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

    it('should reset to initial data when provided', async () => {
      // Arrange
      const asyncFn = createSuccessfulAsyncFunction('new-data');
      const initialData = 'initial-value';
      const { result } = renderHook(() => 
        useAsyncOperation(asyncFn, { initialData })
      );

      // Execute operation first
      await act(async () => {
        await result.current.execute();
      });

      // Act - Reset
      act(() => {
        result.current.reset();
      });

      // Assert
      expect(result.current.data).toBe(initialData);
      expect(result.current.isSuccess).toBe(true);
    });
  });

  describe('State Transitions', () => {
    it('should clear error when new operation starts', async () => {
      // Arrange
      const failingFn = createFailingAsyncFunction('First error');
      const successFn = createSuccessfulAsyncFunction('Success data');
      const { result, rerender } = renderHook(
        ({ asyncFn }) => useAsyncOperation(asyncFn),
        { initialProps: { asyncFn: failingFn } }
      );

      // First operation fails
      await act(async () => {
        try {
          await result.current.execute();
        } catch (e) {
          // ignore
        }
      });

      // Rerender with successful function
      rerender({ asyncFn: successFn });

      // Act - Execute new operation
      await act(async () => {
        await result.current.execute();
      });

      // Assert
      expect(result.current.data).toBe('Success data');
      expect(result.current.error).toBeNull();
    });

    it('should handle multiple rapid executions correctly', async () => {
      // Arrange
      const asyncFn = createSuccessfulAsyncFunction('rapid-data');
      const { result } = renderHook(() => useAsyncOperation(asyncFn));

      // Act - Execute multiple times rapidly
      await act(async () => {
        await result.current.execute(); // First call
        await result.current.execute(); // Second call (should override first)
      });

      // Assert
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBe('rapid-data');

      // Should have been called twice
      expect(asyncFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('Error Handling', () => {
    it('should handle non-Error objects thrown from async function', async () => {
      // Arrange
      const asyncFn = vi.fn(() => Promise.reject('String error'));
      const { result } = renderHook(() => useAsyncOperation(asyncFn));

      // Act
      await act(async () => {
        try {
          await result.current.execute();
        } catch (e) {
          // ignore
        }
      });

      // Assert
      expect(result.current.error).toBe('An error occurred');
      expect(result.current.isError).toBe(true);
    });

    it('should handle undefined thrown from async function', async () => {
      // Arrange
      const asyncFn = vi.fn(() => Promise.reject(undefined));
      const { result } = renderHook(() => useAsyncOperation(asyncFn));

      // Act
      await act(async () => {
        try {
          await result.current.execute();
        } catch (e) {
          // ignore
        }
      });

      // Assert
      expect(result.current.error).toBe('An error occurred');
    });
  });
});

describe('useMultipleAsyncOperations', () => {
  beforeEach(() => {
    
  });

  afterEach(() => {
    
  });

  const createOperations = () => ({
    operation1: vi.fn(() => Promise.resolve('result1')),
    operation2: vi.fn(() => Promise.resolve('result2')),
    operation3: vi.fn(() => Promise.reject(new Error('operation3 failed'))),
  });

  describe('Initial State', () => {
    it('should initialize all operations with default state', () => {
      // Arrange
      const operations = createOperations();

      // Act
      const { result } = renderHook(() => useMultipleAsyncOperations(operations));

      // Assert
      expect(result.current.states.operation1).toEqual({
        data: null,
        loading: false,
        error: null,
      });
      expect(result.current.states.operation2).toEqual({
        data: null,
        loading: false,
        error: null,
      });
      expect(result.current.states.operation3).toEqual({
        data: null,
        loading: false,
        error: null,
      });
      expect(result.current.isAnyLoading).toBe(false);
      expect(result.current.hasAnyError).toBe(false);
    });
  });

  describe('Individual Operation Execution', () => {
    it('should execute single operation successfully', async () => {
      // Arrange
      const operations = createOperations();
      const { result } = renderHook(() => useMultipleAsyncOperations(operations));

      // Act
      await act(async () => {
        await result.current.execute('operation1');
      });

      // Assert
      expect(result.current.states.operation1.data).toBe('result1');
      expect(result.current.states.operation1.loading).toBe(false);
      expect(result.current.isAnyLoading).toBe(false);
    });

    it('should handle individual operation failure', async () => {
      // Arrange
      const operations = createOperations();
      const { result } = renderHook(() => useMultipleAsyncOperations(operations));

      // Act
      await act(async () => {
        try {
          await result.current.execute('operation3');
        } catch (e) {
          // ignore
        }
      });

      // Assert
      expect(result.current.states.operation3.error).toBe('operation3 failed');
      expect(result.current.states.operation3.loading).toBe(false);
      expect(result.current.hasAnyError).toBe(true);
    });

    it('should return result from individual execution', async () => {
      // Arrange
      const operations = createOperations();
      const { result } = renderHook(() => useMultipleAsyncOperations(operations));

      // Act
      const promise = result.current.execute('operation1');

      // Assert
      await expect(promise).resolves.toBe('result1');
    });
  });

  describe('Execute All Operations', () => {
    it('should execute all operations and handle mixed results', async () => {
      // Arrange
      const operations = createOperations();
      const { result } = renderHook(() => useMultipleAsyncOperations(operations));

      // Act
      await act(async () => {
        await result.current.executeAll();
      });

      // Assert
      await waitFor(() => {
        expect(result.current.states.operation1.data).toBe('result1');
        expect(result.current.states.operation2.data).toBe('result2');
        expect(result.current.states.operation3.error).toBe('operation3 failed');
      });
    });

    it('should track loading state during executeAll', async () => {
      // Arrange
      const operations = {
        slow: vi.fn(() => new Promise(resolve => setTimeout(() => resolve('slow-result'), 300))),
        fast: vi.fn(() => new Promise(resolve => setTimeout(() => resolve('fast-result'), 100))),
      };
      const { result } = renderHook(() => useMultipleAsyncOperations(operations));

      // Act
      act(() => {
        result.current.executeAll();
      });

      // Assert - Should be loading
      expect(result.current.isAnyLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isAnyLoading).toBe(false);
      });
    });
  });

  describe('Reset Functionality', () => {
    it('should reset individual operation', async () => {
      // Arrange
      const operations = createOperations();
      const { result } = renderHook(() => useMultipleAsyncOperations(operations));

      // Execute operation first
      await act(async () => {
        await result.current.execute('operation1');
      });

      // Act - Reset individual operation
      act(() => {
        result.current.reset('operation1');
      });

      // Assert
      expect(result.current.states.operation1).toEqual({
        data: null,
        loading: false,
        error: null,
      });
      // Other operations should be unchanged
      expect(result.current.states.operation2.data).toBeNull();
    });

    it('should reset all operations when no key provided', async () => {
      // Arrange
      const operations = createOperations();
      const { result } = renderHook(() => useMultipleAsyncOperations(operations));

      // Execute operations first
      await act(async () => {
        await result.current.execute('operation1');
        try {
          await result.current.execute('operation3'); // This will fail
        } catch (e) {
          // ignore
        }
      });

      // Act - Reset all
      act(() => {
        result.current.reset();
      });

      // Assert
      expect(result.current.states.operation1).toEqual({
        data: null,
        loading: false,
        error: null,
      });
      expect(result.current.states.operation3).toEqual({
        data: null,
        loading: false,
        error: null,
      });
      expect(result.current.isAnyLoading).toBe(false);
      expect(result.current.hasAnyError).toBe(false);
    });
  });

  describe('Aggregate State Tracking', () => {
    it('should correctly track isAnyLoading across multiple operations', async () => {
      // Arrange
      const operations = {
        fast: vi.fn(() => new Promise(resolve => setTimeout(() => resolve('fast'), 100))),
        slow: vi.fn(() => new Promise(resolve => setTimeout(() => resolve('slow'), 300))),
      };
      const { result } = renderHook(() => useMultipleAsyncOperations(operations));

      // Act - Start both operations
      act(() => {
        result.current.execute('fast');
        result.current.execute('slow');
      });

      // Assert - Both loading
      expect(result.current.isAnyLoading).toBe(true);

      // Fast-forward to complete fast operation
      await waitFor(() => {
        expect(result.current.states.fast.loading).toBe(false);
      });

      // Should still be loading because slow operation is still running
      expect(result.current.isAnyLoading).toBe(true);

      // Complete slow operation
      await waitFor(() => {
        expect(result.current.isAnyLoading).toBe(false);
      }, { timeout: 1000 });
    });

    it('should correctly track hasAnyError across multiple operations', async () => {
      // Arrange
      const operations = createOperations();
      const { result } = renderHook(() => useMultipleAsyncOperations(operations));

      // Initially no errors
      expect(result.current.hasAnyError).toBe(false);

      // Execute failing operation
      await act(async () => {
        try {
          await result.current.execute('operation3');
        } catch (e) {
          // ignore
        }
      });

      // Should have error
      expect(result.current.hasAnyError).toBe(true);

      // Reset the failing operation
      act(() => {
        result.current.reset('operation3');
      });

      // Should no longer have error
      expect(result.current.hasAnyError).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle execution of non-existent operation key gracefully', async () => {
      // Arrange
      const operations = createOperations();
      const { result } = renderHook(() => useMultipleAsyncOperations(operations));

      // Act & Assert - Should not crash
      const promise = result.current.execute('nonExistent' as any);
      
      await expect(promise).resolves.toBeUndefined();
    });

    it('should handle empty operations object', () => {
      // Arrange & Act
      const { result } = renderHook(() => useMultipleAsyncOperations({}));

      // Assert
      expect(result.current.states).toEqual({});
      expect(result.current.isAnyLoading).toBe(false);
      expect(result.current.hasAnyError).toBe(false);
    });
  });
});