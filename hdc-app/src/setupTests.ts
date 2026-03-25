import '@testing-library/jest-dom/vitest';
import { beforeEach, vi } from 'vitest';

const createJsonResponse = (body: unknown): Response => {
  return {
    ok: true,
    status: 200,
    json: async () => body,
    headers: {
      get: () => 'application/json'
    }
  } as unknown as Response;
};

const mockFetchImplementation = async (input: RequestInfo | URL): Promise<Response> => {
  const requestUrl =
    typeof input === 'string'
      ? input
      : input instanceof URL
      ? input.toString()
      : input.url;

  if (requestUrl.includes('/map-names')) {
    return createJsonResponse(['1-1']);
  }
  if (requestUrl.includes('/map-positions')) {
    return createJsonResponse(['A-1']);
  }
  if (requestUrl.includes('/enemy-names')) {
    return createJsonResponse({ enemy: [{ id: 1, name: '駆逐イ級' }] });
  }
  if (requestUrl.includes('/final-attack')) {
    return createJsonResponse({ value: 50 });
  }

  return createJsonResponse({});
};

const mockFetch = vi.fn<[RequestInfo | URL], Promise<Response>>(mockFetchImplementation);

const mockedFetch = mockFetch as unknown as typeof fetch;

Object.defineProperty(globalThis, 'fetch', {
  configurable: true,
  writable: true,
  value: mockedFetch
});

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'fetch', {
    configurable: true,
    writable: true,
    value: mockedFetch
  });
}

beforeEach(() => {
  mockFetch.mockReset();
  mockFetch.mockImplementation(mockFetchImplementation);
});
