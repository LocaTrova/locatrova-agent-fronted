import { useCallback } from 'react';
import { useService, SERVICE_TOKENS } from '../services/container';
import { useErrorHandler, type ErrorSeverity } from './useErrorHandler';
import type { GlobalErrorHandler } from '../services/error/errorHandlingService';

/**
 * Enhanced error handler hook that integrates with global error handling
 * Follows Single Responsibility Principle - handles application-level error coordination
 * Uses Dependency Inversion - depends on abstractions via service container
 */
export function useGlobalErrorHandler() {
  const globalErrorHandler = useService<GlobalErrorHandler>(SERVICE_TOKENS.GLOBAL_ERROR_HANDLER);
  const { handleError: handleLocalError, ...localErrorState } = useErrorHandler();

  const handleError = useCallback(
    async (
      error: Error | string,
      options: {
        severity?: ErrorSeverity;
        context?: Record<string, any>;
        showToast?: boolean;
        reportGlobally?: boolean;
      } = {}
    ) => {
      const {
        severity = 'error',
        context,
        showToast = true,
        reportGlobally = true,
      } = options;

      const errorObj = error instanceof Error ? error : new Error(error);

      // Handle locally (shows toast, logs to console, updates local state)
      const appError = handleLocalError(errorObj, {
        severity,
        showToast,
        logToConsole: true,
      });

      // Report to global error handler if requested
      if (reportGlobally) {
        try {
          await globalErrorHandler.handleError(errorObj, severity, context);
        } catch (globalError) {
          console.error('Failed to report error globally:', globalError);
        }
      }

      return appError;
    },
    [globalErrorHandler, handleLocalError]
  );

  const handleUserFeedback = useCallback(
    async (feedback: string, context?: Record<string, any>) => {
      try {
        await globalErrorHandler.handleUserFeedback(feedback, context);
        return true;
      } catch (error) {
        handleError(error instanceof Error ? error : new Error(String(error)), {
          severity: 'warning',
          reportGlobally: false,
        });
        return false;
      }
    },
    [globalErrorHandler, handleError]
  );

  const handleNetworkError = useCallback(
    (error: Error, context?: Record<string, any>) => {
      return handleError(error, {
        severity: 'error',
        context: { type: 'network', ...context },
        showToast: true,
        reportGlobally: true,
      });
    },
    [handleError]
  );

  const handleValidationError = useCallback(
    (error: Error | string, context?: Record<string, any>) => {
      return handleError(error, {
        severity: 'warning',
        context: { type: 'validation', ...context },
        showToast: true,
        reportGlobally: false, // Don't report validation errors globally
      });
    },
    [handleError]
  );

  const handleCriticalError = useCallback(
    (error: Error, context?: Record<string, any>) => {
      return handleError(error, {
        severity: 'critical',
        context: { type: 'critical', ...context },
        showToast: true,
        reportGlobally: true,
      });
    },
    [handleError]
  );

  return {
    // Error handling methods
    handleError,
    handleNetworkError,
    handleValidationError,
    handleCriticalError,
    handleUserFeedback,
    
    // Local error state
    ...localErrorState,
  };
}