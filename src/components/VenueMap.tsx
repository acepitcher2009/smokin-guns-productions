import { useEffect, useState } from 'react';

import { hasConsent, recordConsent } from './consent';

import { venues } from '../data/venues';

// Privacy-respecting, lazy, consent-gated map of the primary venue (Snook Rodeo
// Arena) from venues.ts (PRD §4.6/§5/§6/§7, story 30). The embedded Google Maps
// iframe sets third-party cookies, so it renders ONLY after the visitor has
// accepted the consent notice — read via the shared hasConsent() signal that
// ConsentNotice persists (see ./consent, key 'sgp-consent'). Fail-safe: until
// consent is detected we show a privacy placeholder + a "Show map" action.
// The address renders as text in every state, and a static "Get directions"
// link-out (no cookies, no script) is always available — so the location is
// readable even when the map is gated/unloaded. CLS-safe: the iframe reserves
// space via an aspect-ratio wrapper (NEVER an arbitrary h-[…px] value — token
// discipline). LCP-safe: loading="lazy", no render-blocking third-party script.

function mapSrcFor(address: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
}

function directionsLinkFor(address: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

export function VenueMap() {
  const snook = venues.snook;
  const address = `${snook.name}, ${snook.streetAddress}, ${snook.city}, ${snook.state} ${snook.zip}`;

  // Start gated; reveal the cookie-setting embed only after a mount-time read of
  // the shared consent signal (so a prior acceptance is honored without a flash).
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    setConsented(hasConsent());
  }, []);

  function showMap() {
    recordConsent();
    setConsented(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="font-sans text-base text-ink">{address}</p>

      {consented ? (
        <div className="aspect-[4/3] w-full overflow-hidden rounded-md shadow-card">
          <iframe
            src={mapSrcFor(address)}
            title={`Map to ${snook.name}`}
            loading="lazy"
            className="h-full w-full border-0"
          />
        </div>
      ) : (
        <div className="flex aspect-[4/3] w-full flex-col items-start justify-center gap-4 rounded-md bg-cream-deep p-6">
          <p className="font-sans text-base text-ink">
            The map loads after you accept our privacy notice (it sets third-party cookies).
          </p>
          <button
            type="button"
            onClick={showMap}
            className="font-sans text-base text-brand-red underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-dark focus-visible:ring-offset-2"
          >
            Show map
          </button>
        </div>
      )}

      <a
        href={directionsLinkFor(address)}
        target="_blank"
        rel="noopener noreferrer"
        className="font-sans text-base text-brand-red underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-dark focus-visible:ring-offset-2"
      >
        Get directions to {snook.name}
      </a>
    </div>
  );
}
