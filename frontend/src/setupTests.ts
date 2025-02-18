import '@testing-library/jest-dom';

// Force override `window.matchMedia` so tests don't fail
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false, // Light mode by default
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

// Mock `@react-spectrum/provider` to prevent issues
jest.mock('@react-spectrum/provider', () => ({
  Provider: ({ children }: { children: React.ReactNode }) => children,
  defaultTheme: {},
  useProviderProps: (props: any) => props,
}));