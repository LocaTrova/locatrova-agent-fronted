import { useState, useCallback } from 'react';
import { useToast } from './use-toast';

/**
 * Error severity levels
 */
export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

/**
 * Error interface with additional context
 */
export interface AppError {
  message: string;
  severity: ErrorSeverity;
  code?: string;
  details?: Record<string, any>;
  timestamp: Date;
  recoverable: boolean;
}

/**
 * Error handler options
 */
interface ErrorHandlerOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  severity?: ErrorSeverity;
  recoverable?: boolean;
}

/**
 * Custom hook for consistent error handling across the application
 * Eliminates DRY violations in error management
 * Follows Single Responsibility Principle - only handles error state and reporting
 */
export function useErrorHandler() {
  const [errors, setErrors] = useState<AppError[]>([]);
  const { toast } = useToast();

  const handleError = useCallback(
    (
      error: Error | string,
      options: ErrorHandlerOptions = {}
    ): AppError => {
      const {
        showToast = true,
        logToConsole = true,
        severity = 'error',
        recoverable = true,
      } = options;

      const message = error instanceof Error ? error.message : error;
      const code = error instanceof Error && 'code' in error ? (error as any).code : undefined;

      const appError: AppError = {
        message,
        severity,
        code,
        timestamp: new Date(),
        recoverable,
      };

      // Add to errors array
      setErrors(prev => [appError, ...prev].slice(0, 50)); // Keep only last 50 errors

      // Show toast notification
      if (showToast) {
        toast({
          title: getErrorTitle(severity),
          description: message,
          variant: getToastVariant(severity),
        });
      }

      // Log to console
      if (logToConsole) {
        const logMethod = getLogMethod(severity);
        console[logMethod](`[${severity.toUpperCase()}]`, message, {
          code,
          timestamp: appError.timestamp,
          recoverable,
        });
      }

      return appError;
    },
    [toast]
  );

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const clearError = useCallback((timestamp: Date) => {
    setErrors(prev => prev.filter(error => error.timestamp !== timestamp));
  }, []);

  const hasErrors = errors.length > 0;
  const hasUnrecoverableErrors = errors.some(error => !error.recoverable);
  const latestError = errors[0] || null;

  return {
    errors,
    handleError,
    clearErrors,
    clearError,
    hasErrors,
    hasUnrecoverableErrors,
    latestError,
  };
}

/**
 * Utility functions for error handling
 */
function getErrorTitle(severity: ErrorSeverity): string {
  switch (severity) {
    case 'info':
      return 'Information';
    case 'warning':
      return 'Warning';
    case 'error':
      return 'Error';
    case 'critical':
      return 'Critical Error';
    default:
      return 'Error';
  }
}

function getToastVariant(severity: ErrorSeverity) {
  switch (severity) {
    case 'info':
      return 'default';
    case 'warning':
      return 'default';
    case 'error':
    case 'critical':
      return 'destructive';
    default:
      return 'destructive';
  }
}

function getLogMethod(severity: ErrorSeverity): 'log' | 'warn' | 'error' {
  switch (severity) {
    case 'info':
      return 'log';
    case 'warning':
      return 'warn';
    case 'error':
    case 'critical':
      return 'error';
    default:
      return 'error';
  }
}

/**
 * Error boundary hook for handling React errors
 */
export function useErrorBoundary() {
  const { handleError } = useErrorHandler();

  const resetError = useCallback(() => {
    // This would be used in conjunction with an error boundary component
    window.location.reload();
  }, []);

  const reportError = useCallback(
    (error: Error, _errorInfo?: any) => {
      handleError(error, {
        severity: 'critical',
        recoverable: false,
        showToast: true,
        logToConsole: true,
      });
    },
    [handleError]
  );

  return {
    resetError,
    reportError,
  };
}