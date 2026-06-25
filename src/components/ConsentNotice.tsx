import { useEffect, useState } from 'react';

import { Button } from './Button';
import { hasConsent, recordConsent } from './consent';

// Owned, minimal, dismissible bottom consent notice. Replaces the old persistent
// GoDaddy cookie banner + boilerplate Google policy links (PRD §5, discard item 3)
// with the business's OWN privacy statement and a single brand-red dismiss CTA.
// Dismissal persists in localStorage (see ./consent) so it does not reappear, and
// hasConsent() exposes the same truth for the VenueMap map-embed gate (story 28).
export function ConsentNotice() {
  // Start hidden; reveal only after the mount-time read so a prior dismissal never flashes.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasConsent()) {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    recordConsent();
    setVisible(false);
  }

  if (!visible) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Privacy notice"
      className="fixed inset-x-0 bottom-0 z-40 bg-ink text-white shadow-card motion-safe:transition-transform motion-reduce:transition-none"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between">
        {/* TODO(owner-confirm): replace with the business's own privacy statement (PRD §10 item 14). */}
        <p className="font-sans text-sm text-white">
          We use minimal cookies to keep this site working and to embed a venue map. We don&apos;t
          sell your data.
        </p>
        <Button onClick={dismiss}>Got it</Button>
      </div>
    </div>
  );
}
