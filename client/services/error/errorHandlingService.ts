import type { ErrorSeverity } from '../../hooks/useErrorHandler';

/**
 * Interface for error reporting service
 * Follows Interface Segregation Principle
 */
export interface IErrorReportingService {
  reportError(error: Error, context?: Record<string, any>): Promise<void>;
  reportUserFeedback(feedback: string, context?: Record<string, any>): Promise<void>;
}

/**
 * Interface for error logging service
 */
export interface IErrorLoggingService {
  log(level: ErrorSeverity, message: string, data?: Record<string, any>): void;
  error(message: string, error?: Error, data?: Record<string, any>): void;
  warn(message: string, data?: Record<string, any>): void;
  info(message: string, data?: Record<string, any>): void;
}

/**
 * Console-based error logging implementation
 * Simple implementation for development and fallback
 */
export class ConsoleErrorLoggingService implements IErrorLoggingService {
  log(level: ErrorSeverity, message: string, data?: Record<string, any>): void {
    const timestamp = new Date().toISOString();
    const logData = { timestamp, level, message, ...data };

    switch (level) {
      case 'critical':
      case 'error':
        console.error(`[${timestamp}] ERROR:`, message, logData);
        break;
      case 'warning':
        console.warn(`[${timestamp}] WARN:`, message, logData);
        break;
      case 'info':
        console.info(`[${timestamp}] INFO:`, message, logData);
        break;
      default:
        console.log(`[${timestamp}] ${String(level).toUpperCase()}:`, message, logData);
    }
  }

  error(message: string, error?: Error, data?: Record<string, any>): void {
    this.log('error', message, { error: error?.toString(), stack: error?.stack, ...data });
  }

  warn(message: string, data?: Record<string, any>): void {
    this.log('warning', message, data);
  }

  info(message: string, data?: Record<string, any>): void {
    this.log('info', message, data);
  }
}

/**
 * Mock error reporting service for development
 * Can be replaced with real service (Sentry, LogRocket, etc.)
 */
export class MockErrorReportingService implements IErrorReportingService {
  private logger: IErrorLoggingService;

  constructor(logger: IErrorLoggingService) {
    this.logger = logger;
  }

  async reportError(error: Error, context?: Record<string, any>): Promise<void> {
    // In production, this would send to error reporting service
    this.logger.error('Error reported', error, context);
    
    // Simulate async operation
    return new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
  }

  async reportUserFeedback(feedback: string, context?: Record<string, any>): Promise<void> {
    // In production, this would send to feedback service
    this.logger.info('User feedback received', { feedback, ...context });
    
    // Simulate async operation
    return new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
  }
}

/**
 * Global error handler service
 * Follows Single Responsibility Principle - coordinates error handling
 */
export class GlobalErrorHandler {
  private errorReporting: IErrorReportingService;
  private logger: IErrorLoggingService;
  private unhandledRejectionHandler: ((event: PromiseRejectionEvent) => void) | null = null;
  private errorHandler: ((event: ErrorEvent) => void) | null = null;

  constructor(
    errorReporting: IErrorReportingService,
    logger: IErrorLoggingService
  ) {
    this.errorReporting = errorReporting;
    this.logger = logger;
    this.setupGlobalHandlers();
  }

  /**
   * Setup global error handlers for unhandled errors
   */
  private setupGlobalHandlers(): void {
    this.unhandledRejectionHandler = (event) => {
      this.logger.error('Unhandled promise rejection', event.reason);
      this.errorReporting.reportError(
        new Error(event.reason?.toString() || 'Unhandled promise rejection'),
        { type: 'unhandledrejection', reason: event.reason }
      );
    };
    window.addEventListener('unhandledrejection', this.unhandledRejectionHandler);

    this.errorHandler = (event) => {
      this.logger.error('Global JavaScript error', event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
      
      if (event.error) {
        this.errorReporting.reportError(event.error, {
          type: 'javascript',
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        });
      }
    };
    window.addEventListener('error', this.errorHandler);
  }

  /**
   * Teardown global error handlers
   */
  public teardown(): void {
    if (this.unhandledRejectionHandler) {
      window.removeEventListener('unhandledrejection', this.unhandledRejectionHandler);
      this.unhandledRejectionHandler = null;
    }
    if (this.errorHandler) {
      window.removeEventListener('error', this.errorHandler);
      this.errorHandler = null;
    }
  }

  /**
   * Handle application errors with context
   */
  async handleError(
    error: Error,
    severity: ErrorSeverity = 'error',
    context?: Record<string, any>
  ): Promise<void> {
    this.logger.log(severity, error.message, { error: error.toString(), ...context });

    // Report critical and error level issues
    if (severity === 'critical' || severity === 'error') {
      try {
        await this.errorReporting.reportError(error, { severity, ...context });
      } catch (reportingError) {
        this.logger.error('Failed to report error', reportingError);
      }
    }
  }

  /**
   * Handle user feedback
   */
  async handleUserFeedback(feedback: string, context?: Record<string, any>): Promise<void> {
    try {
      await this.errorReporting.reportUserFeedback(feedback, context);
      this.logger.info('User feedback submitted successfully');
    } catch (error) {
      this.logger.error('Failed to submit user feedback', error instanceof Error ? error : new Error(String(error)));
    }
  }
}