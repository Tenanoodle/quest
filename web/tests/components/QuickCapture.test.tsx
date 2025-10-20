import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import QuickCapture from '../../src/components/QuickCapture';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { openQuickCapture } from '../../src/hooks/useQuickCapture';

vi.mock('../../src/api/client', () => ({
  inboxApi: {
    create: vi.fn(() => Promise.resolve({ id: '1', text: 'Test', createdAt: new Date().toISOString() }))
  }
}));

const createWrapper = () => {
  const queryClient = new QueryClient();
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { Wrapper };
};

describe('QuickCapture', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal when opened', async () => {
    const { Wrapper } = createWrapper();
    render(
      <Wrapper>
        <QuickCapture />
      </Wrapper>
    );

    openQuickCapture();

    expect(await screen.findByText('Quick Capture')).toBeInTheDocument();
  });
});
