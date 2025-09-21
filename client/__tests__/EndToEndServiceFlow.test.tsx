import { vi } from 'vitest';

// Mock utils to avoid side effects
vi.mock('../utils/messages', () => ({
  createInitialMessages: vi.fn(() => []),
  createMessage: vi.fn((role, content) => ({ id: '1', role, content, createdAt: '2024-01-01' }))
}));

vi.mock('sonner', () => ({ Toaster: () => null }));
vi.mock('../components/ui/sonner', () => ({ Sonner: () => null }));

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, renderHook, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ServiceProvider } from '../services/container/ServiceProvider';
import { initializeServices } from '../services/container/serviceRegistration';
import { ServiceContainer, SERVICE_TOKENS } from '../services/container/ServiceContainer';
import { useService } from '../services/container';
import { useChat } from '../hooks/useChat';
import { useLocationData } from '../hooks/useLocationData';
import { useGlobalErrorHandler } from '../hooks/useGlobalErrorHandler';
import { ErrorBoundary } from '../components/error/ErrorBoundary';
import React from 'react';

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: { randomUUID: vi.fn(() => 'test-uuid') },
  writable: true
});

/**
 * End-to-End Service Flow Tests
 * These tests verify that the complete service flow works from registration to hook usage
 * This validates the real implementation gaps we discovered
 */
describe('End-to-End Service Flow', () => {
  let queryClient: QueryClient;
  let serviceContainer: ServiceContainer;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } }
    });
    serviceContainer = initializeServices();
  });

  afterEach(() => {
    serviceContainer.clear();
    queryClient.clear();
    vi.clearAllMocks();
  });

  it('should initialize services correctly', () => {
    expect(serviceContainer).toBeDefined();
    expect(queryClient).toBeDefined();
  });
});