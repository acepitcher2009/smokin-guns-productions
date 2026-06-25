# Site Analysis — Template

> Template for the analysis subagents' output, saved to `prd-output/<business-name>/<business-name>-analysis.md`. Two different subagents write against this template depending on the mode set by `prd-builder`:
> - **`site-analyzer`** (improve-existing) — fills the per-page sections from a crawl + screenshots.
> - **`business-profiler`** (create-from-scratch) — fills the provenance + inferred-IA sections from business data.
>
> Both modes feed the same `prd-writer`. This template has shared sections plus mode-specific sections; fill the ones for your mode. Sections marked **required (mode)** are non-negotiable for that mode. The analysis is the contract the PRD is built from, so capture enough that nothing real is lost and every later improvement traces to evidence here.

---

## Document Metadata (required, both modes)
- Mode: `<improve-existing | create-from-scratch>`
- Business / site name: `<exact name>`  ← transcribed exactly; titles the checklist, names the folder
- Business-type profile: `<local-service | contractor | general-local>`
- Source: `<URL>` (improve) or `<"business data provided"|GBP paste|typed details>` (scratch)
- Date: `<YYYY-MM-DD>`

---

# SHARED SECTIONS (both modes)

## A. Business Identity & NAP (required, both modes)

The facts a site and its SEO depend on. Transcribe **exactly** from the source — never alter a name, address, phone, or hours.

- **Name** (exact): `<...>`
- **Address** (NAP): `<...>`
- **Phone** (NAP): `<...>`
- **Hours**: `<...>`
- **Category / business type**: `<...>`
- **Rating / review count** (if present): `<...>`
- **Existing web/social presence** (if any): `<...>`

## B. SEO Inputs (required, both modes)

Everything the PRD's mandatory SEO section will need:

- **Exact NAP** for `LocalBusiness` (or subtype) schema — as above, character-for-character
- **Geo / city** for location keywords (e.g. "shoe repair Bryan TX")
- **Schema subtype** appropriate to the business type (`LocalBusiness`, `HomeAndConstructionBusiness`, etc.)
- **(improve only)** Existing SEO state — current meta tags, any existing schema, sitemap/robots, how the site does or doesn't align with the Google Business Profile
- **(contractor only)** Service-area × service-type matrix — the towns served × the services offered (each cell is an SEO target)

---

# IMPROVE-EXISTING SECTIONS (site-analyzer)

## C. Per-Page Analysis (required, improve)

One subsection PER confirmed page. For each page:

### Page: `<name / path>`
- **Screenshot coverage**: desktop ✓/✗ · mobile ✓/✗ (if neither, mark visual assessment limited-to-HTML)
- **Content inventory** — the real content a visitor needs, captured in enough detail to preserve it verbatim where it matters (copy, contact info, events, hours, links, CTAs). This is what the rebuild must not lose.
- **Structure & IA** — sections on the page, heading hierarchy, how it links to other pages
- **Template/builder artifacts** — duplicated content, empty placeholders, stub elements, builder branding ("Powered by ..."), broken pieces — the discard list for the rebuild
- **Technical & quality signals** — builder/generator (from meta tags), detected fonts/colors, metadata state
- **Visual assessment** — FROM SCREENSHOTS where present: actual colors, typography, spacing, layout quality, mobile behavior, and an evidence-anchored read of where the design looks dated/unprofessional. If no screenshot, state "limited to HTML signals" and assess only what the markup shows.

## D. Cross-Page IA (required, improve)

How the pages relate — the nav structure, the overall site map, page-to-page flow.

## E. Content-vs-Artifact Catalog (required, improve)

Two explicit lists for the whole site:
- **Real content to preserve** — every substantive item (this becomes the content-preservation contract the PRD is checked against)
- **Artifacts to discard** — every template/builder leftover

---

# CREATE-FROM-SCRATCH SECTIONS (business-profiler)

## F. Provenance-Tagged Fact Sheet (required, scratch)

Every fact about the business, tagged by provenance:

- **VERIFIED** — directly from the data, transcribed exactly (NAP, hours, category, ratings). List each.
- These are used freely and exactly in the PRD.

## G. Derived Services / Offerings (required, scratch)

The services/offerings inferred from evidence, each marked **DERIVED** with the evidence that supports it:

- `<service>` — DERIVED from `<evidence: stated category / review topic / etc.>`

Example: "Heel repair — DERIVED from review topics mentioning 'heel repair' (3 reviews)." Do not list services with no supporting evidence.

## H. Inferred Information Architecture (required, scratch)

The site structure for this business, following the business-type profile's ideal IA and conversion goal. List the pages/sections and the primary conversion action (call / visit / quote request).

## I. Draft Content Opportunities (required, scratch)

Content the PRD will need to DRAFT (it doesn't exist yet), listed as draft-needed — tagline, about-narrative, service descriptions. Note explicitly: **drafted copy must assert no unverifiable facts** (no invented prices, tenure, certifications, guarantees). These flow to the confirmation checklist.

## J. Reviews Handling (required, scratch — if reviews present)

Confirm rights-aware treatment: review **topics** may be used as DERIVED evidence (section G); review **text** is NOT to be scraped onto the site. Note the recommended testimonial approach (owned testimonials, or an embedded reviews widget with attribution).

---

## K. Verification (required, both modes)

Confirm before declaring done:

- [ ] Name and NAP transcribed exactly from the source
- [ ] SEO inputs captured (exact NAP, geo/keywords, schema subtype; contractor matrix if applicable)
- [ ] **improve:** every confirmed page has a per-page section; visual assessment anchored to screenshots where present, marked HTML-only otherwise; content-vs-artifact catalog complete
- [ ] **scratch:** VERIFIED facts transcribed exactly; DERIVED services each carry evidence; inferred IA matches the business-type profile; draft opportunities listed with the no-unverifiable-facts note
- [ ] Reviews handled rights-aware (topics-as-evidence, no verbatim-scrape plan)
