import { BusinessJsonLd } from '../components/BusinessJsonLd';
import { ContactForm } from '../components/ContactForm';
import { ContactInfo } from '../components/ContactInfo';
import { SectionBand } from '../components/SectionBand';
import { Seo } from '../components/Seo';
import { VenueMap } from '../components/VenueMap';

// Contact page — getting in touch with the organization. Event registration is a
// separate task on its own page (/register), so this carries a general contact
// form, the NAP/hours, and the venue map only.
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

          <VenueMap />
        </div>
      </SectionBand>
    </>
  );
}
