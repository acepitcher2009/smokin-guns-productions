import { Link } from 'react-router-dom';

import { RegistrationForm } from '../components/RegistrationForm';
import { SectionBand } from '../components/SectionBand';
import { Seo } from '../components/Seo';

// Register page — the event-entry flow, separate from general contact (/contact).
// The RegistrationForm pre-selects the race from ?event=<id> when arriving from
// an EventCard "Register" CTA. Exactly one <h1>. `now` is injectable for
// deterministic tests; production uses the real current date.
export function Register({ now }: { now?: Date } = {}) {
  return (
    <>
      <Seo pageKey="register" />

      <SectionBand tone="cream">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-6">
            <h1 className="font-display text-5xl uppercase tracking-wide text-ink">
              Register for an Event
            </h1>
            <p className="max-w-2xl font-sans text-base text-ink">
              Enter an upcoming barrel racing or pole bending race below. Pick your race, add your
              details, and we&rsquo;ll be in touch to confirm your entry. Have a general question
              instead? Head to the{' '}
              <Link to="/contact" className="text-brand-red underline">
                Contact page
              </Link>
              .
            </p>
          </div>

          <div className="md:max-w-2xl">
            <RegistrationForm now={now} />
          </div>
        </div>
      </SectionBand>
    </>
  );
}
