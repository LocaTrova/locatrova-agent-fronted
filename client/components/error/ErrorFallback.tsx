import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '../ui/button';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

/**
 * Error types for different scenarios
 */
export type ErrorType = 'network' | 'validation' | 'permission' | 'notFound' | 'generic';

/**
 * Props for ErrorFallback component
 */
interface ErrorFallbackProps {
  type?: ErrorType;
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  showDetails?: boolean;
  error?: Error;
}

/**
 * Reusable Error Fallback Component
 * Follows Single Responsibility Principle - only displays error states
 * Supports different error types with appropriate messaging and actions
 */
export function ErrorFallback({
  type = 'generic',
  title,
  message,
  onRetry,
  onGoHome,
  showDetails = false,
  error,
}: ErrorFallbackProps) {
  const errorConfig = getErrorConfig(type);
  const finalTitle = title || errorConfig.title;
  const finalMessage = message || errorConfig.message;

  return (
    <div className="flex min-h-[300px] w-full items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="flex items-center gap-2">
            {errorConfig.icon}
            {finalTitle}
          </AlertTitle>
          <AlertDescription>{finalMessage}</AlertDescription>
        </Alert>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="default"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}
          {onGoHome && (
            <Button
              onClick={onGoHome}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          )}
        </div>

        {showDetails && error && process.env.NODE_ENV === 'development' && (
          <details className="text-sm">
            <summary className="cursor-pointer font-medium text-gray-600 hover:text-gray-800">
              <Bug className="inline h-4 w-4 mr-1" />
              Error Details (Development)
            </summary>
            <div className="mt-2 rounded-md bg-gray-100 p-3">
              <pre className="text-xs text-red-600 whitespace-pre-wrap">
                {error.toString()}
              </pre>
              {error.stack && (
                <pre className="mt-2 text-xs text-gray-600 whitespace-pre-wrap">
                  {error.stack}
                </pre>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

/**
 * Configuration for different error types
 * Follows DRY principle - centralized error messaging
 */
function getErrorConfig(type: ErrorType) {
  const configs = {
    network: {
      icon: '🌐',
      title: 'Connection Error',
      message: 'Unable to connect to the server. Please check your internet connection and try again.',
    },
    validation: {
      icon: '⚠️',
      title: 'Validation Error',
      message: 'The information provided is invalid. Please check your input and try again.',
    },
    permission: {
      icon: '🔒',
      title: 'Access Denied',
      message: 'You don\'t have permission to access this resource.',
    },
    notFound: {
      icon: '🔍',
      title: 'Not Found',
      message: 'The requested resource could not be found.',
    },
    generic: {
      icon: '❌',
      title: 'Something Went Wrong',
      message: 'An unexpected error occurred. Please try again later.',
    },
  };

  return configs[type] || configs.generic;
}

/**
 * Lightweight error component for inline errors
 */
interface InlineErrorProps {
  message: string;
  onDismiss?: () => void;
}

export function InlineError({ message, onDismiss }: InlineErrorProps) {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        {message}
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-auto p-1"
          >
            ✕
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}