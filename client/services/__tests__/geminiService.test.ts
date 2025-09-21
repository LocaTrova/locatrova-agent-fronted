import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { geminiService } from '../geminiService';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('GeminiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    geminiService.abort();
  });

  describe('checkHealth', () => {
    it('should return true when service is healthy', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          data: {
            geminiService: 'healthy',
          },
        }),
      });

      const result = await geminiService.checkHealth();
      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/health');
    });

    it('should return false when service is unhealthy', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({
          success: false,
          data: {
            geminiService: 'unhealthy',
          },
        }),
      });

      const result = await geminiService.checkHealth();
      expect(result).toBe(false);
    });

    it('should return false when request fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await geminiService.checkHealth();
      expect(result).toBe(false);
    });
  });

  describe('getServiceInfo', () => {
    it('should return service information', async () => {
      const mockServiceInfo = {
        service: 'Loca Agent Backend',
        version: '1.0.0',
        endpoints: {
          '/': 'Service information',
          '/health': 'Health check',
          '/api/ask': 'Stream AI responses',
        },
      };

      mockFetch.mockResolvedValueOnce({
        json: async () => mockServiceInfo,
      });

      const result = await geminiService.getServiceInfo();
      expect(result).toEqual(mockServiceInfo);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/');
    });

    it('should throw error when request fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(geminiService.getServiceInfo()).rejects.toThrow(
        'Failed to get service information'
      );
    });
  });

  describe('streamResponse', () => {
    it('should stream response data chunks', async () => {
      const chunks = ['Hello', ' ', 'World'];
      const onData = vi.fn();
      const onError = vi.fn();
      const onComplete = vi.fn();

      // Create a mock readable stream
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          chunks.forEach(chunk => {
            controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
          });
          controller.enqueue(encoder.encode('event: done\ndata: 0\n\n'));
          controller.close();
        },
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        body: stream,
      });

      await geminiService.streamResponse(
        { prompt: 'Test prompt' },
        { onData, onError, onComplete }
      );

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/ask',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: 'Test prompt' }),
        })
      );

      expect(onData).toHaveBeenCalledTimes(3);
      expect(onData).toHaveBeenNthCalledWith(1, 'Hello');
      expect(onData).toHaveBeenNthCalledWith(2, ' ');
      expect(onData).toHaveBeenNthCalledWith(3, 'World');
      expect(onComplete).toHaveBeenCalledTimes(1);
      expect(onError).not.toHaveBeenCalled();
    });

    it('should handle error events in stream', async () => {
      const onData = vi.fn();
      const onError = vi.fn();
      const onComplete = vi.fn();

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode('event: error\ndata: Test error\n\n'));
          controller.close();
        },
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        body: stream,
      });

      await geminiService.streamResponse(
        { prompt: 'Test prompt' },
        { onData, onError, onComplete }
      );

      expect(onError).toHaveBeenCalledWith('Test error');
    });

    it('should handle HTTP errors', async () => {
      const onData = vi.fn();
      const onError = vi.fn();
      const onComplete = vi.fn();

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Bad request' }),
      });

      await geminiService.streamResponse(
        { prompt: 'Test prompt' },
        { onData, onError, onComplete }
      );

      expect(onError).toHaveBeenCalledWith('Bad request');
      expect(onData).not.toHaveBeenCalled();
      expect(onComplete).not.toHaveBeenCalled();
    });

    it('should handle network errors', async () => {
      const onData = vi.fn();
      const onError = vi.fn();
      const onComplete = vi.fn();

      mockFetch.mockRejectedValueOnce(new Error('Network failure'));

      await geminiService.streamResponse(
        { prompt: 'Test prompt' },
        { onData, onError, onComplete }
      );

      expect(onError).toHaveBeenCalledWith('Network failure');
      expect(onData).not.toHaveBeenCalled();
      expect(onComplete).not.toHaveBeenCalled();
    });

    it('should abort previous request when starting new one', async () => {
      const onData1 = vi.fn();
      const onError1 = vi.fn();
      const onComplete1 = vi.fn();

      const onData2 = vi.fn();
      const onError2 = vi.fn();
      const onComplete2 = vi.fn();

      // Create controlled streams
      const encoder = new TextEncoder();
      let controller1: ReadableStreamDefaultController;
      const stream1 = new ReadableStream({
        start(controller) {
          controller1 = controller;
          // Don't close immediately - let it be aborted
        },
      });

      const stream2 = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode('data: Second\n\n'));
          controller.enqueue(encoder.encode('event: done\ndata: 0\n\n'));
          controller.close();
        },
      });

      mockFetch
        .mockResolvedValueOnce({ ok: true, body: stream1 })
        .mockResolvedValueOnce({ ok: true, body: stream2 });

      // Start first request
      const promise1 = geminiService.streamResponse(
        { prompt: 'First prompt' },
        { onData: onData1, onError: onError1, onComplete: onComplete1 }
      );

      // Give first request a moment to start
      await new Promise(resolve => setTimeout(resolve, 10));

      // Start second request (should abort the first)
      const promise2 = geminiService.streamResponse(
        { prompt: 'Second prompt' },
        { onData: onData2, onError: onError2, onComplete: onComplete2 }
      );

      // Close the first stream after it's been aborted
      controller1!.close();

      await Promise.all([promise1, promise2]);

      // Second request should complete normally
      expect(onData2).toHaveBeenCalledWith('Second');
      expect(onComplete2).toHaveBeenCalled();

      // First request should have been aborted (no callbacks)
      expect(onData1).not.toHaveBeenCalled();
      expect(onComplete1).not.toHaveBeenCalled();
    }, 10000);

    it('should support JSON format parameter', async () => {
      const onData = vi.fn();
      const onError = vi.fn();
      const onComplete = vi.fn();

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode('data: {"result": "test"}\n\n'));
          controller.enqueue(encoder.encode('event: done\ndata: 0\n\n'));
          controller.close();
        },
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        body: stream,
      });

      await geminiService.streamResponse(
        { prompt: 'Test prompt', format: 'json' },
        { onData, onError, onComplete }
      );

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/ask',
        expect.objectContaining({
          body: JSON.stringify({ prompt: 'Test prompt', format: 'json' }),
        })
      );

      expect(onData).toHaveBeenCalledWith('{"result": "test"}');
      expect(onComplete).toHaveBeenCalled();
    });
  });

  describe('abort', () => {
    it('should abort ongoing request', async () => {
      const onData = vi.fn();
      const onError = vi.fn();
      const onComplete = vi.fn();

      // Create a stream that we can control
      let controller: ReadableStreamDefaultController;
      const stream = new ReadableStream({
        start(ctrl) {
          controller = ctrl;
          // Don't close the stream immediately
        },
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        body: stream,
      });

      const promise = geminiService.streamResponse(
        { prompt: 'Test prompt' },
        { onData, onError, onComplete }
      );

      // Give it a moment to start processing
      await new Promise(resolve => setTimeout(resolve, 10));

      // Abort the request
      geminiService.abort();

      // Close the stream after abort
      controller!.close();

      await promise;

      // No callbacks should be triggered after abort
      expect(onData).not.toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
      expect(onComplete).not.toHaveBeenCalled();
    }, 10000);

    it('should handle multiple abort calls safely', () => {
      expect(() => {
        geminiService.abort();
        geminiService.abort();
      }).not.toThrow();
    });
  });
});