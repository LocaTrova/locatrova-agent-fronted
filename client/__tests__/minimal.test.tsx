import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ServiceProvider } from '../services/container/ServiceProvider';
import { initializeServices } from '../services/container/serviceRegistration';
import React from 'react';

describe('Minimal Test', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    initializeServices();
  });

  afterEach(() => {
    queryClient.clear();
  });

  it('should render without crashing', () => {
    render(
      <ServiceProvider container={initializeServices()}>
        <QueryClientProvider client={queryClient}>
          <div>Hello</div>
        </QueryClientProvider>
      </ServiceProvider>
    );
    expect(true).toBe(true);
  });
});