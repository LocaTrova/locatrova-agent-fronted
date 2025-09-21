/**
 * Service for interacting with the Gemini AI backend
 * Implements streaming responses using Server-Sent Events
 */

import type { IGeminiService, GeminiRequest, StreamCallbacks } from './interfaces/geminiInterfaces';

export class GeminiService implements IGeminiService {
  private baseUrl: string;
  private abortController: AbortController | null = null;
  private currentRequestId: string | null = null;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  }

  /**
   * Stream a response from the Gemini API
   */
  async streamResponse(request: GeminiRequest, callbacks: StreamCallbacks): Promise<void> {
    // Create unique request ID for this request
    const requestId = Math.random().toString(36).substring(7);
    
    try {
      // Abort any existing request
      this.abort();

      // Create new abort controller and set current request ID
      this.abortController = new AbortController();
      this.currentRequestId = requestId;

      const response = await fetch(`${this.baseUrl}/api/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: this.abortController.signal,
      });

      // Check if this request was aborted before proceeding
      if (this.currentRequestId !== requestId) {
        return; // Request was aborted
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get response from API');
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        // Check if this request was aborted before each read
        if (this.currentRequestId !== requestId) {
          reader.cancel();
          return; // Request was aborted
        }

        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        // Keep the last line in buffer if it's incomplete
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === '') continue;

          // Check if request was aborted before calling callbacks
          if (this.currentRequestId !== requestId) {
            return; // Request was aborted
          }

          if (line.startsWith('data: ')) {
            const data = line.substring(6);
            callbacks.onData(data);
          } else if (line.startsWith('event: error')) {
            // Next line should contain the error data
            const nextLine = lines[lines.indexOf(line) + 1];
            if (nextLine && nextLine.startsWith('data: ')) {
              callbacks.onError(nextLine.substring(6));
            }
          } else if (line.startsWith('event: done')) {
            callbacks.onComplete();
            return;
          }
        }
      }

      // Process any remaining buffer and complete callback (only if not aborted)
      if (this.currentRequestId === requestId) {
        if (buffer.trim()) {
          if (buffer.startsWith('data: ')) {
            callbacks.onData(buffer.substring(6));
          }
        }
        callbacks.onComplete();
      }
    } catch (error) {
      // Only call error callback if request wasn't aborted
      if (this.currentRequestId === requestId) {
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            // Request was aborted, don't call error callback
            return;
          }
          callbacks.onError(error.message);
        } else {
          callbacks.onError('An unknown error occurred');
        }
      }
    } finally {
      // Only clear if this is still the current request
      if (this.currentRequestId === requestId) {
        this.abortController = null;
        this.currentRequestId = null;
      }
    }
  }

  /**
   * Abort the current request if any
   */
  abort(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    // Clear current request ID to prevent callbacks
    this.currentRequestId = null;
  }

  /**
   * Check health status of the backend service
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      const data = await response.json();
      return data.success && data.data.geminiService === 'healthy';
    } catch {
      return false;
    }
  }

  /**
   * Get service information
   */
  async getServiceInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/`);
      return await response.json();
    } catch {
      throw new Error('Failed to get service information');
    }
  }
}

// Export singleton instance
export const geminiService = new GeminiService();