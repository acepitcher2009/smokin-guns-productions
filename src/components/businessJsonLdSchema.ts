import { businessInfo } from '../data/businessInfo';
import { venues } from '../data/venues';

/**
 * Builds the business + primary-venue JSON-LD object from the data files.
 * Kept in its own module (not the component file) so the component file only
 * exports a component (react-refresh) and so the contract — valid, correctly
 * shaped JSON-LD — is unit-testable independent of how react-helmet-async
 * injects the <script> into the head. All values come from src/data/.
 */
export function buildBusinessJsonLd(fallbackToLocalBusiness = false): Record<string, unknown> {
  const snook = venues.snook;

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': fallbackToLocalBusiness ? 'LocalBusiness' : 'SportsActivityLocation',
    name: businessInfo.legalName,
    url: businessInfo.url,
    telephone: businessInfo.phone,
    email: businessInfo.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: businessInfo.streetAddress,
      addressLocality: businessInfo.city, // 'Somerville' — authoritative locality (PRD §7 gate)
      addressRegion: businessInfo.state,
      postalCode: businessInfo.zip,
      addressCountry: 'US',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00',
      },
    ],
    // No priceRange — entry-fee process unconfirmed (PRD §7 / §10 item 8).
  };

  // Emit geo only when coordinates are known (PRD §10 item 7).
  if (snook.geo) {
    jsonLd.geo = {
      '@type': 'GeoCoordinates',
      latitude: snook.geo.lat,
      longitude: snook.geo.lng,
    };
  }

  return jsonLd;
}
