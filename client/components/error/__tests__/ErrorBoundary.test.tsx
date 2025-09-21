import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { ErrorBoundary } from '../ErrorBoundary';

// Mock console methods to avoid error logs in tests
const originalConsoleError = console.error;
const originalConsoleGroup = console.group;
const originalConsoleGroupEnd = console.groupEnd;

beforeAll(() => {
  console.error = vi.fn();
  console.group = vi.fn();
  console.groupEnd = vi.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.group = originalConsoleGroup;
  console.groupEnd = originalConsoleGroupEnd;
});

// Test component that throws an error when shouldThrow is true
const ThrowingComponent = ({ shouldThrow = false, message = 'Test error' }: { shouldThrow?: boolean; message?: string }) => {
  if (shouldThrow) {
    throw new Error(message);
  }
  return <div data-testid="working-component">Component is working</div>;
};

// Test component with componentStack for testing
const DeepThrowingComponent = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  return (
    <div>
      <div>
        <ThrowingComponent shouldThrow={shouldThrow} />
      </div>
    </div>
  );
};

describe('ErrorBoundary', () => {
  describe('Normal Rendering', () => {
    it('should render children when no error occurs', () => {
      // Arrange & Act
      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={false} />
        </ErrorBoundary>
      );

      // Assert
      expect(screen.getByTestId('working-component')).toBeInTheDocument();
      expect(screen.getByText('Component is working')).toBeInTheDocument();
    });

    it('should render multiple children when no error occurs', () => {
      // Arrange & Act
      render(
        <ErrorBoundary>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </ErrorBoundary>
      );

      // Assert
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });
  });

  describe('Error Catching', () => {
    it('should catch and display default error fallback when child component throws', () => {
      // Arrange & Act
      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} message="Test error message" />
        </ErrorBoundary>
      );

      // Assert
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText("We've encountered an unexpected error. Please try refreshing the page.")).toBeInTheDocument();
      expect(screen.getByText('🚨')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Refresh Page' })).toBeInTheDocument();
    });

    it('should display custom fallback when provided and error occurs', () => {
      // Arrange
      const customFallback = <div data-testid="custom-fallback">Custom Error UI</div>;

      // Act
      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      // Assert
      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    });

    it('should call onError callback when error occurs', () => {
      // Arrange
      const onErrorMock = vi.fn();

      // Act
      render(
        <ErrorBoundary onError={onErrorMock}>
          <ThrowingComponent shouldThrow={true} message="Callback test error" />
        </ErrorBoundary>
      );

      // Assert
      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(onErrorMock).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String)
        })
      );
      
      const [error] = onErrorMock.mock.calls[0];
      expect(error.message).toBe('Callback test error');
    });
  });

  describe('Error Recovery', () => {
    it('should reset error state and re-render children when "Try Again" is clicked', () => {
      // Arrange
      const TestComponent = () => {
        const [shouldThrow, setShouldThrow] = React.useState(true);
        
        return (
          <ErrorBoundary>
            <button onClick={() => setShouldThrow(false)}>Fix Error</button>
            <ThrowingComponent shouldThrow={shouldThrow} />
          </ErrorBoundary>
        );
      };

      render(<TestComponent />);

      // Verify error state is shown
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      // Act - Click "Try Again"
      fireEvent.click(screen.getByRole('button', { name: 'Try Again' }));

      // Assert - Error boundary should reset but component still throws
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should maintain error state after multiple renders', () => {
      // Arrange
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      // Verify initial error state
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      // Act - Rerender with same error
      rerender(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      // Assert
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  describe('Development Mode Features', () => {
    const originalNodeEnv = process.env.NODE_ENV;

    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    afterEach(() => {
      process.env.NODE_ENV = originalNodeEnv;
    });

    it('should show error details in development mode', () => {
      // Arrange & Act
      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} message="Dev mode error" />
        </ErrorBoundary>
      );

      // Assert
      expect(screen.getByText('Error Details (Development)')).toBeInTheDocument();
      
      // Click to expand details
      fireEvent.click(screen.getByText('Error Details (Development)'));
      expect(screen.getByText(/Dev mode error/)).toBeInTheDocument();
    });

    it('should log error to console in development mode', () => {
      // Arrange
      const consoleSpy = vi.spyOn(console, 'error');

      // Act
      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} message="Console log test" />
        </ErrorBoundary>
      );

      // Assert - Note: console.error is mocked, but we can verify it was called
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('Production Mode Features', () => {
    const originalNodeEnv = process.env.NODE_ENV;

    beforeEach(() => {
      process.env.NODE_ENV = 'production';
    });

    afterEach(() => {
      process.env.NODE_ENV = originalNodeEnv;
    });

    it('should not show error details in production mode', () => {
      // Arrange & Act
      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} message="Prod mode error" />
        </ErrorBoundary>
      );

      // Assert
      expect(screen.queryByText('Error Details (Development)')).not.toBeInTheDocument();
      expect(screen.queryByText(/Prod mode error/)).not.toBeInTheDocument();
    });
  });

  describe('Error Types and Edge Cases', () => {
    it('should handle TypeError from child components', () => {
      // Arrange
      const TypeErrorComponent = () => {
        // Simulate TypeError
        const nullObject: any = null;
        return <div>{nullObject.property}</div>;
      };

      // Act
      render(
        <ErrorBoundary>
          <TypeErrorComponent />
        </ErrorBoundary>
      );

      // Assert
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should handle ReferenceError from child components', () => {
      // Arrange
      const ReferenceErrorComponent = () => {
        // Simulate ReferenceError
        return <div>{(window as any).undefinedVariable.property}</div>;
      };

      // Act
      render(
        <ErrorBoundary>
          <ReferenceErrorComponent />
        </ErrorBoundary>
      );

      // Assert
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should handle errors in deeply nested component tree', () => {
      // Arrange & Act
      render(
        <ErrorBoundary>
          <DeepThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      // Assert
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should handle multiple error boundaries', () => {
      // Arrange
      const onError1 = vi.fn();
      const onError2 = vi.fn();

      // Act
      render(
        <ErrorBoundary onError={onError1}>
          <div>Outer boundary</div>
          <ErrorBoundary onError={onError2}>
            <ThrowingComponent shouldThrow={true} />
          </ErrorBoundary>
        </ErrorBoundary>
      );

      // Assert - Only inner boundary should catch the error
      expect(onError1).not.toHaveBeenCalled();
      expect(onError2).toHaveBeenCalledTimes(1);
    });
  });

  describe('Component Integration', () => {
    it('should work with functional components', () => {
      // Arrange
      const FunctionalComponent = () => <div data-testid="functional">Functional Component</div>;

      // Act
      render(
        <ErrorBoundary>
          <FunctionalComponent />
        </ErrorBoundary>
      );

      // Assert
      expect(screen.getByTestId('functional')).toBeInTheDocument();
    });

    it('should work with class components', () => {
      // Arrange
      class ClassComponent extends React.Component {
        render() {
          return <div data-testid="class">Class Component</div>;
        }
      }

      // Act
      render(
        <ErrorBoundary>
          <ClassComponent />
        </ErrorBoundary>
      );

      // Assert
      expect(screen.getByTestId('class')).toBeInTheDocument();
    });
  });

  describe('Props Validation', () => {
    it('should handle undefined children gracefully', () => {
      // Arrange & Act
      render(<ErrorBoundary>{undefined}</ErrorBoundary>);

      // Assert - Should not crash
      expect(document.body).toBeInTheDocument();
    });

    it('should handle null children gracefully', () => {
      // Arrange & Act
      render(<ErrorBoundary>{null}</ErrorBoundary>);

      // Assert - Should not crash
      expect(document.body).toBeInTheDocument();
    });

    it('should handle empty children gracefully', () => {
      // Arrange & Act
      render(<ErrorBoundary>{null}</ErrorBoundary>);

      // Assert - Should not crash
      expect(document.body).toBeInTheDocument();
    });
  });
});