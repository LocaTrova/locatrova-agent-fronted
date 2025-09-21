/**
 * Interface for Gemini AI service
 * Defines the contract for AI chat functionality
 */

export interface GeminiRequest {
  prompt: string;
  format?: 'json' | 'text';
}

export interface StreamCallbacks {
  onData: (chunk: string) => void;
  onError: (error: string) => void;
  onComplete: () => void;
}

export interface IGeminiService {
  /**
   * Stream a response from the Gemini AI service
   */
  streamResponse(request: GeminiRequest, callbacks: StreamCallbacks): Promise<void>;

  /**
   * Abort the current request if any
   */
  abort(): void;

  /**
   * Check health status of the backend service
   */
  checkHealth(): Promise<boolean>;

  /**
   * Get service information
   */
  getServiceInfo(): Promise<any>;
}