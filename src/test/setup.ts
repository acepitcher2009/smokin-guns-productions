import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// jsdom does not implement window.scrollTo; stub it so ScrollToTop runs quietly.
vi.stubGlobal('scrollTo', vi.fn());

// Globals are off (tests use explicit imports), so Testing Library's automatic
// afterEach cleanup is not auto-registered — register it explicitly here.
afterEach(() => {
  cleanup();
});
