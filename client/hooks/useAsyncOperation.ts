import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Async operation state interface
 */
interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Options for async operations
 */
interface AsyncOptions<T> {
  initialData?: T;
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

/**
 * Custom hook for handling async operations with loading, error, and data states
 * Eliminates DRY violations by providing consistent async state management
 * Follows Single Responsibility Principle - only handles async operation state
 */
export function useAsyncOperation<T>(
  asyncFunction: () => Promise<T>,
  options: AsyncOptions<T> = {}
) {
  const {
    initialData = null,
    immediate = false,
    onSuccess,
    onError,
  } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await asyncFunction();
      setState({ data: result, loading: false, error: null });
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      
      if (onError) {
        onError(errorMessage);
      }
      
      throw error;
    }
  }, [asyncFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null,
    });
  }, [initialData]);

  // Execute immediately if requested
  // Use a ref to ensure we only execute once on mount when immediate is true
  const hasExecutedRef = useRef(false);
  useEffect(() => {
    if (immediate && !hasExecutedRef.current) {
      hasExecutedRef.current = true;
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps intentionally to run only on mount

  return {
    ...state,
    execute,
    reset,
    isSuccess: state.data !== null && !state.loading && !state.error,
    isError: !!state.error,
  };
}

/**
 * Hook for handling multiple async operations
 * Useful when you need to track multiple loading states
 */
export function useMultipleAsyncOperations<T extends Record<string, any>>(
  operations: Record<keyof T, () => Promise<T[keyof T]>>
) {
  const [states, setStates] = useState<Record<keyof T, AsyncState<T[keyof T]>>>(
    Object.keys(operations).reduce(
      (acc, key) => ({
        ...acc,
        [key]: { data: null, loading: false, error: null },
      }),
      {} as Record<keyof T, AsyncState<T[keyof T]>>
    )
  );

  const execute = useCallback(
    async (operationKey: keyof T) => {
      const operation = operations[operationKey];
      if (!operation) return;

      setStates(prev => ({
        ...prev,
        [operationKey]: { ...prev[operationKey], loading: true, error: null },
      }));

      try {
        const result = await operation();
        setStates(prev => ({
          ...prev,
          [operationKey]: { data: result, loading: false, error: null },
        }));
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        setStates(prev => ({
          ...prev,
          [operationKey]: { ...prev[operationKey], loading: false, error: errorMessage },
        }));
        throw error;
      }
    },
    [operations]
  );

  const executeAll = useCallback(async () => {
    const promises = Object.keys(operations).map(key => execute(key as keyof T));
    return Promise.allSettled(promises);
  }, [execute, operations]);

  const reset = useCallback((operationKey?: keyof T) => {
    if (operationKey) {
      setStates(prev => ({
        ...prev,
        [operationKey]: { data: null, loading: false, error: null },
      }));
    } else {
      setStates(
        Object.keys(operations).reduce(
          (acc, key) => ({
            ...acc,
            [key]: { data: null, loading: false, error: null },
          }),
          {} as Record<keyof T, AsyncState<T[keyof T]>>
        )
      );
    }
  }, [operations]);

  const isAnyLoading = Object.values(states).some(state => state.loading);
  const hasAnyError = Object.values(states).some(state => state.error);

  return {
    states,
    execute,
    executeAll,
    reset,
    isAnyLoading,
    hasAnyError,
  };
}