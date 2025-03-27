/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';
import { afterEach, beforeAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Automatically unmount React trees and clean up after each test
afterEach(() => {
  cleanup();
});

// Mock console methods to suppress expected React DOM warnings and other console noise during tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

console.error = (...args: any[]) => {
  if (
    /Warning.*not wrapped in act/i.test(args[0]) ||
    /Warning.*React.createFactory/i.test(args[0]) ||
    /Warning: validateDOMNesting/i.test(args[0]) ||
    /Warning: ReactDOM.render/i.test(args[0])
  ) {
    return;
  }
  originalConsoleError(...args);
};

console.warn = (...args: any[]) => {
  if (
    /Warning.*not wrapped in act/i.test(args[0]) ||
    /Warning: ReactDOM.render/i.test(args[0])
  ) {
    return;
  }
  originalConsoleWarn(...args);
};

console.log = (...args: any[]) => {
  // Comment this out for debugging
  // originalConsoleLog(...args);
};

// Restore original console methods after tests
afterEach(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
  console.log = originalConsoleLog;
});

// Polyfill for globals in test environment
declare global {
  var localStorage: Storage;
  var fetch: typeof fetch;
  var ResizeObserver: typeof ResizeObserver;
}

// Mock browser APIs and globals
beforeAll(() => {
  // Mock localStorage
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    key: vi.fn(),
    length: 0
  };
  
  window.localStorage = localStorageMock as unknown as Storage;
  
  // Mock fetch API
  window.fetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({}),
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
    } as Response)
  );
  
  // Mock ResizeObserver (often needed for UI components)
  window.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })) as unknown as typeof ResizeObserver;
  
  // Mock location
  Object.defineProperty(window, 'location', {
    value: {
      href: 'http://localhost:3000/',
      origin: 'http://localhost:3000',
      protocol: 'http:',
      host: 'localhost:3000',
      hostname: 'localhost',
      port: '3000',
      pathname: '/',
      search: '',
      hash: '',
      assign: vi.fn(),
      replace: vi.fn(),
      reload: vi.fn(),
    },
    writable: true,
  });
}); 