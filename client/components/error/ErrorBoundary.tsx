import React, { Component, ErrorInfo, ReactNode, useCallback } from 'react';

/**
 * Props interface for ErrorBoundary component
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  isolate?: boolean; // If true, only catches errors from direct children
}

/**
 * State interface for ErrorBoundary component
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Follows Single Responsibility Principle - only handles React error boundaries
 * Implements error isolation and recovery patterns
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Static method to update state when an error occurs
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Handle component errors and report them
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      errorInfo,
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error for development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }
  }

  /**
   * Reset error state to allow retry
   */
  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Props for ErrorFallback component
 */
interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onReset: () => void;
}

/**
 * Default Error Fallback Component
 * Provides user-friendly error display with recovery options
 */
function ErrorFallback({ error, errorInfo, onReset }: ErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Memoize the reload handler to prevent re-creation on every render
  const handleReload = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
      <div className="max-w-md space-y-4">
        <div className="text-6xl">🚨</div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Something went wrong
        </h2>
        <p className="text-gray-600">
          We&apos;ve encountered an unexpected error. Please try refreshing the page.
        </p>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            onClick={onReset}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Try Again
          </button>
          <button
            onClick={handleReload}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Refresh Page
          </button>
        </div>

        {isDevelopment && error && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm font-medium text-gray-500">
              Error Details (Development)
            </summary>
            <div className="mt-2 rounded-lg bg-gray-100 p-4 text-xs">
              <pre className="whitespace-pre-wrap text-red-600">
                {error.toString()}
              </pre>
              {errorInfo && (
                <pre className="mt-2 whitespace-pre-wrap text-gray-600">
                  {errorInfo.componentStack}
                </pre>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}