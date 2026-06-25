# Product Requirements Document — Template

> The standard PRD format for this pipeline. The `prd-writer` produces a PRD against this template; the `builder` agent and its subagents consume it. Because this template is the contract that couples the two halves of the pipeline, its section set is fixed — every PRD has all of these sections so the downstream `designer`, `decomposer`, and `component-writer` always find what they expect.
>
> The PRD serves both modes (improve-existing and create-from-scratch) and all business types. Sections marked **required** appear in every PRD. The SEO Requirements section is **mandatory in every PRD** — it is the pipeline's core differentiator.

---

## Title (required)
`# <Business / Site Name>` — the exact business name as the document title at the top.

## 0. Document Metadata (required)
- Source: `<URL>` (improve) or `<business data>` (scratch)
- Mode: `<improve-existing | create-from-scratch>`
- Business-type profile: `<local-service | contractor | general-local>`
- Analysis source: `prd-output/<business>/<business>-analysis.md`
- Date: `<YYYY-MM-DD>`

---

## 1. Project Overview (required)
- **Purpose** — what this site is for
- **About the business** — who they are (from VERIFIED facts / the analysis)
- **Goals** — what the site must achieve (the conversion goal leads here)
- **Non-goals** — what's explicitly out of scope for v1

## 2. Brand & Visual Direction (required)
The design system the `designer` will tokenize. Provide concrete values:
- **Color palette** — named colors with hex values
- **Typography** — display + body font families, and a type scale
- **Spacing / radii / shadows** — the scales, if specified beyond defaults
- **Visual devices** — texture, imagery direction, motion
- **Provenance of the direction:**
  - **improve** — anchored to evidence in the analysis (detected colors/fonts, the screenshot-based read of what to keep vs. modernize). State *why* each change is recommended.
  - **scratch** — derived from the business type and brand best practices (no existing design to anchor to). State the reasoning.

Every brand recommendation traces to evidence (improve) or stated reasoning (scratch) — no free-floating aesthetic claims.

## 3. Information Architecture (required)
The site structure, following the business-type profile's ideal IA. Navigation, page/section order, the primary conversion path. Single-page vs multi-page stated.

## 4. Per-Page / Per-Section Requirements (required)
One subsection per page (improve: per analyzed page; scratch: per inferred-IA page). For each:
- Purpose and the conversion role it plays
- The content it contains:
  - **improve** — the real content to preserve (from the analysis's preserve list), plus the improved/restructured version
  - **scratch** — VERIFIED content used exactly; DERIVED content (with its basis); DRAFTED content written as real first-pass copy but tagged **DRAFT — confirm before launch** and asserting no unverifiable facts
- Layout/behavior requirements
- Acceptance criteria for the section (specific, testable)

## 5. UX & Interaction (required)
Navigation behavior, scroll, forms, animation (with reduced-motion), loading, mobile interactions, cookie/consent if applicable.

## 6. Technical Requirements (required)
Stack (React + TypeScript + Tailwind, static build via Vite), data-files-for-content approach, performance targets, responsive breakpoints, the form backend if applicable (e.g. EmailJS with keys in `VITE_*` env vars).

## 7. SEO Requirements (required — MANDATORY, never omitted)
The pipeline's core differentiator. Two parts:

**Universal (every PRD):**
- Semantic HTML and correct heading hierarchy
- Unique meta title + description per page
- Open Graph + Twitter cards
- `sitemap.xml` + `robots.txt`
- Descriptive alt text, descriptive link text
- Canonical URLs
- Performance / Core Web Vitals targets

**Local-SEO block (for local businesses — all current profiles are local):**
- Exact, consistent **NAP** across the site (from the analysis, character-for-character)
- `LocalBusiness` (or the type-appropriate subtype, e.g. `HomeAndConstructionBusiness`) **JSON-LD** with address, geo coordinates, opening hours, phone, price range
- **Google Business Profile alignment** — site NAP matches the GBP exactly
- **Location keywords** in titles/headings/content (e.g. "shoe repair Bryan TX")
- **Embedded map**
- **Review / aggregate-rating schema** where the business has ratings
- **(contractor)** per-service-area location targeting (the service-area × service-type matrix)

The SEO section must be concrete (specific schema subtype, the exact NAP, real location keywords), and its criteria appear in Acceptance Criteria (section 9).

## 8. Content Plan / Migration (required)
- **improve** — **Content Migration Checklist**: every real-content item to preserve (the preserve list) + every artifact to discard.
- **scratch** — **Content Plan**: VERIFIED content (use exactly), DERIVED content (with basis), DRAFTED content (real first-pass copy, each tagged DRAFT — confirm before launch, no unverifiable facts).
- **Reviews** (both modes): testimonial section for owned/embedded reviews with attribution — never scraped verbatim text.

## 9. Acceptance Criteria (required)
A checkable list covering the whole site, **including the SEO criteria** (schema present and valid, NAP consistent, meta per page, etc.), responsive behavior, accessibility to the stated standard, and the per-section criteria. Specific and testable.

## 10. Open Items for the Client (required)
What the client must supply or confirm: logo, photos, credentials (contractor), and — for scratch — confirmation of every DERIVED and DRAFTED item (these populate the confirmation checklist).

---

## Verification (the prd-writer confirms before saving)
- [ ] Title is the exact business name
- [ ] All sections 0–10 present
- [ ] **SEO Requirements section present and local-aware** (concrete schema subtype, exact NAP, real keywords); SEO criteria in Acceptance Criteria
- [ ] Per-page sections match the business-type profile's IA
- [ ] **improve:** every preserve-list item from the analysis appears in the PRD (content-preservation cross-check); artifacts listed for discard; improvements cite evidence
- [ ] **scratch:** VERIFIED content exact; DERIVED carries basis; DRAFTED tagged and free of unverifiable claims
- [ ] Reviews handled rights-aware
- [ ] Format matches this template so it feeds the scaffold + builder without translation
