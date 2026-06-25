import { BusinessJsonLd } from '../components/BusinessJsonLd';
import { ContactForm } from '../components/ContactForm';
import { ContactInfo } from '../components/ContactInfo';
import { SectionBand } from '../components/SectionBand';
import { Seo } from '../components/Seo';

// Contact page — getting in touch with the organization. Event registration is a
// separate task on its own page (/register). Events run at multiple venues, so
// there is no single-venue map or street address here — each event card carries
// its own venue address instead.
export function Contact() {
  return (
    <>
      <Seo pageKey="contact" />
      <BusinessJsonLd />

      <SectionBand tone="cream">
        <div className="flex flex-col gap-12">
          <h1 className="font-display text-5xl uppercase tracking-wide text-ink">Contact</h1>

          <div className="grid gap-12 md:grid-cols-2">
            <ContactInfo />
            <div className="flex flex-col gap-6">
              <h2 className="font-display text-3xl uppercase tracking-wide text-ink">
                Drop us a line
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </SectionBand>
    </>
  );
}
