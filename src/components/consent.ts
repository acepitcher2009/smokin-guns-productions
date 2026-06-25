// Single source of truth for the consent contract. Lives in its own .ts module
// (not the component file) so ConsentNotice.tsx only exports a component
// (react-refresh/only-export-components), and so VenueMap (story 28) can import
// hasConsent() to gate its cookie-setting map embed behind the same stored truth.

export const CONSENT_KEY = 'sgp-consent';

const CONSENT_VALUE = 'dismissed';

/**
 * True once the visitor has accepted/dismissed the notice. Reads the same
 * localStorage key the notice writes. Safe if localStorage is unavailable
 * (SSR / privacy mode): on any error it returns false ("not yet consented").
 */
export function hasConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === CONSENT_VALUE;
  } catch {
    return false;
  }
}

/** Persists the visitor's dismissal. Ignores storage failures (hide for the session only). */
export function recordConsent(): void {
  try {
    localStorage.setItem(CONSENT_KEY, CONSENT_VALUE);
  } catch {
    // Ignore storage failures; the caller still hides the notice for this session.
  }
}
