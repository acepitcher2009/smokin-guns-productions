# Smokin' Guns Productions LLC

## 0. Document Metadata
- **Source:** https://smokingunsproductions.com/ (improve-existing)
- **Mode:** improve-existing (rebuild-and-improve)
- **Business-type profile:** `general-local` (fallback) — layered with event-producer / equestrian-sports needs. Events (Calendar) and Results & Standings are first-class pages.
- **Analysis source:** `prd-output/smokin-guns-productions/smokin-guns-productions-analysis.md`
- **Date:** 2026-06-24 (PRD); re-anchored 2026-06-25
- **Visual anchoring:** **Screenshot-anchored** — re-anchored from **23 screenshots** (12 mobile top→bottom, 11 desktop top→bottom), 2026-06-25. The original PRD was written from an HTML-only analysis; the analysis's "CORRECTIONS FROM SCREENSHOT REVIEW" pass invalidated several conclusions (palette, sponsors, event count) and surfaced a large body of real content locked inside flyer images. The Brand & Visual Direction, Events, IA, Sponsors, Content Migration, SEO, and Open Items sections below have been corrected accordingly.

---

## 1. Project Overview

### Purpose
Rebuild the existing single-page GoDaddy Website Builder site into a deliberate, multi-page React site that preserves every piece of real content, discards the builder artifacts, and elevates the business's actual product — barrel racing and pole bending events — into first-class, machine-readable, SEO-rich pages. The current site stacks all content on one URL with a dead "More" menu and no structured data; the rebuild gives the business real navigation, a true events calendar, a branded results/standings view, and a real registration path.

### About the business
Smokin' Guns Productions LLC is a barrel racing and pole bending event-production business (equestrian speed events) operating across multiple venues in the Bryan / College Station area (Brazos Valley, Burleson County) — primarily Snook Rodeo Arena (Somerville, TX), plus Magnolia Cowboy Church (Magnolia, TX) and the Waller Co. Fairgrounds. It runs a **full 2026 season** spanning multiple event types: the **Snook Summer Buckle Series / Jackpot** (with A.M. and P.M. races per date), a monthly run of **Day Shows** at Magnolia and Snook, the **Waller Co. Fairgrounds Shootout Qualifier & Finals**, the **Pick Your Poison Playday**, and three **Magnolia Cowboy Church Playdays**. Its mission (verbatim from the live site): *"At Smokin' Guns Productions, we are dedicated to promoting barrel racing and pole bending events with good ground, great payout and a upbeat professional attitude. Our goal is to provide a fun and competitive environment for all levels of equine enthusiasts."* The brand voice is rodeo/Western ("Smokin' Guns," "WELCOME TO THE HOUSE OF SMOKIN' RUNS!", "RUN WHERE THE MONEY IS AT," buckle series).

### Goals
- **Primary conversion goal:** contact / event registration. Replace the raw `mailto:`-only path with an explicit registration/entry flow.
- Present the **full 2026 season** as a real, scannable, multi-venue calendar with exact times preserved (including the two distinct morning schedules on the Snook series cards), re-authoring all flyer-locked schedule/class/pricing content as real, accessible HTML text.
- Make every dated event across the season machine-readable via `schema.org/Event` JSON-LD — the headline SEO win, since the business is literally events.
- Establish a deliberate Western/equestrian brand identity replacing the stock GoDaddy template look.
- Provide a branded/embedded Results & Standings view replacing the opaque tinyurl.
- Local-SEO foundation: exact NAP, `SportsActivityLocation` (or `LocalBusiness`) schema, embedded map, location keywords, per-page meta.

### Non-goals (v1)
- No online payment processing or ticketing platform integration (entry fees/payouts are out of scope until the owner confirms the process — see Open Items).
- No user accounts, login, or live timing/scoring system (results remain external in the Rodeo Results App, surfaced via a branded link/embed).
- No e-commerce / merchandise store.
- No blog/news system (can be a future phase).
- A **Sponsors** page **is** in scope for v1 — the site already has a real, populated three-tier sponsorship program and ≥8 named sponsors (screenshot-confirmed). See §4.5. (Open Items only cover obscured values and high-fidelity logo assets/permission, not whether to build the page.)

---

## 2. Brand & Visual Direction

> **Provenance (read this first):** This visual direction is **anchored to 23 supplied screenshots** (12 mobile, 11 desktop, read 2026-06-25) — **not inferred from category**. The earlier HTML-only read saw only `#e31914` red and `#121212` near-black and concluded "no developed brand palette"; the screenshots show a deliberate, recurring **four-color brand system**: red, teal/turquoise, pink/magenta, and warm cream. The previously invented "leather / dust / denim / steel / gold" Western neutrals are **removed** — the analysis flags them as unevidenced (Discard item 12: "each flyer/sponsor logo its own palette… replace with one coherent brand system — red + teal + pink on warm cream"). The direction below preserves the real observed palette and keeps a deliberate Western/equestrian *type* direction, but grounds the type choice in what is observed (stock serif display in wide-tracked caps) rather than inventing tokens. The stock GoDaddy fonts (Abril Fatface / Chunkfive / Poppins / Muli — Discard item 9) are still replaced with a chosen self-hosted system.

### Color palette — the real four-color brand system (observed, 23 screenshots)
Anchored to the recurring colors seen across the rendered site, not derived from category. Red and teal are **co-primaries** (teal owns the entire sponsor program); pink is a real recurring accent; warm cream is the connective background that softens the page (the "white" sections are actually warm cream).

| Token | Hex (approx, observed) | Role | Provenance |
|---|---|---|---|
| `brand-red` | `#E31914` | **Primary.** Hero & footer bands, Series Points band, CTA buttons/outlines, phone number, "Upcoming Events" heading | **Observed** — recurring across hero, footer, CTAs, Series Points band; existing `theme-color` |
| `brand-red-dark` | `#B5120E` | CTA hover / pressed | Derived (darkened primary) for AA contrast |
| `teal` | `#2EB8A8` | **Co-primary / secondary.** The entire Sponsorship Opportunities + 2026 Sponsors program backgrounds; the crossed-pistols logo sits on teal | **Observed** — owns the whole sponsor program (the color the HTML pass missed entirely) |
| `teal-deep` | `#239A8D` | Teal hover / pressed, teal-section accents | Derived (darkened teal) for AA contrast |
| `pink` | `#E5398E` | **Accent.** "Hay Girl" sponsor script; pink panels in the schedule flyer; sparing accent highlights | **Observed** — recurring brand accent on teal and in schedule flyer |
| `cream` | `#F3EBDD` | **Connective background.** Dominant background of the schedule/events/buckle-series/playday bands and the band before Contact | **Observed** — the warm paper tone behind most content (NOT stark white) |
| `cream-deep` | `#E8DCC2` | Warmer cream variant — section dividers / nested panels | **Observed** — second sand tone in the same family |
| `ink` | `#121212` | Headings & body text on light; text color only (not a brand identity) | **Observed/Detected** — near-black body/heading text |
| `white` | `#FFFFFF` | Form fields, cards on red/teal | Base |

- **CTA discipline:** `brand-red` is the **single** CTA color site-wide (solid, high-contrast — replacing the weak ghost/outline buttons the screenshots show on the hero, Series Points, and SEND — Discard/visual note). `pink` is an **accent only** (never a button); `teal` is a **section/background** color (sponsor program), not a CTA.
- **Why these roles:** red and teal must read as co-equal because the screenshots show teal carrying an entire program (sponsorship), not a one-off accent. Cream — not white — is the connective ground in every observed content band; using stark white would lose the site's actual warmth.
- **Contrast:** body `ink` on `cream`/`white` must meet WCAG AA. White text on `brand-red` and on `teal` must meet AA (verify; deepen to `brand-red-dark`/`teal-deep` if needed). Pink on teal (the "Hay Girl" treatment) is decorative/logo only — do not use pink-on-teal for body text.

### Typography
Replace the stock GoDaddy stack with a deliberate, self-hosted system that **echoes the observed look** — wide-tracked all-caps serif display headings (seen across "EXPERIENCE THRILLING SPEED EVENTS!", "CONTACT US", "2026 SCHEDULE") plus a clean sans for the dense event/time/class content. Use open-license families the build self-hosts (no external CDN — see Technical).

- **Display (headings, hero):** a strong **serif/slab display** in wide-tracked uppercase, matching the observed rodeo-poster treatment — recommended a sturdy slab such as **"Roboto Slab"** or a Western-leaning display; keep the all-caps tracking that the rendered lockups already use ("RUN WHERE THE MONEY IS AT", "WELCOME TO THE HOUSE OF SMOKIN' RUNS!").
- **Body:** a clean, highly readable sans — recommended **"Inter"** or **"Source Sans 3"** for legibility across event tables, class/pricing lists, and times.
- **Type scale (rem):** 3.0 / 2.25 / 1.75 / 1.375 / 1.125 / 1.0 / 0.875. Hero display may exceed scale top on desktop.
- **Why the change:** the existing fonts are GoDaddy template defaults, and — critically — the flyers each use their own clashing clip-art fonts (Discard items 9, 12). One deliberate display+sans system, applied to the re-authored (text) schedule/classes/sponsor content, replaces the per-flyer inconsistency with a single coherent voice while keeping the observed wide-tracked-caps display character.

### Spacing / radii / shadows
- **Spacing scale:** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 px.
- **Radii:** `sm` 4px, `md` 8px (cards), `lg` 16px (hero media). Keep modest — a rugged brand, not a soft one.
- **Shadows:** subtle elevation on event/standings cards only (`0 2px 8px rgba(18,18,18,0.08)`); avoid heavy drop shadows.

### Visual devices
- **Imagery direction:** the one genuine barrel-racing **action photo** under the hero is the site's only strong image (observed) — lean on it. Preserve the "Experience Thrilling Speed Events!" framing (preserve item 5/19). Owner to supply higher-fidelity photos (Open Items). Replace the clashing clip-art flyer art with the re-authored text content on `cream` bands; a flyer image may persist only as a small decorative/supporting visual with alt text.
- **Section banding:** echo the observed alternating full-bleed bands but with the coherent palette — red (hero/footer/Series Points), teal (sponsor program), cream (events/schedule/contact). No per-section palette drift.
- **Motion:** restrained — subtle fade/slide on scroll for event cards; honor `prefers-reduced-motion` (see UX). No autoplay video.
- **Logo:** the observed logo is a **monochrome black-and-white crossed-pistols emblem** in a white box reading "SMOKIN' GUNS PRODUCTIONS" (low-fidelity line art, reused on red and teal) — re-source/recreate at higher fidelity (preserve item 18); avoid the low-res `wsimg.com` asset. It must read cleanly on both `brand-red` and `teal` grounds.

---

## 3. Information Architecture

**Multi-page** site with real navigation, replacing the single-page stack and the dead "More" menu (Discard items 2). Structure follows the `general-local` fallback IA with event-producer layering — **Events (Calendar)** and **Results & Standings** are first-class pages, not bolt-ons.

**Primary nav (left-to-right):**
`Home` · `Events` · `Results & Standings` · `About` · `Sponsors` · `Contact / Location`

**Sponsors** is a first-class v1 page — the site has a real, populated three-tier sponsorship program and ≥8 named sponsors (screenshot-confirmed; §4.5).

- **Site type:** multi-page (Vite multi-route static build).
- **Events is multi-venue.** The Events/Calendar page spans the full 2026 season across **three venues** — Snook Rodeo Arena (Somerville, TX), Magnolia Cowboy Church (Magnolia, TX), and Waller Co. Fairgrounds (Waller, TX) — each event tied to its correct venue NAP (see §4.2, §7).
- **Primary conversion path:** Home (next-event highlight + CTA) → Events (race details) → **Contact / Location (registration/entry path)**. Secondary paths: Home → Results & Standings (return-visit driver); Sponsors → Contact (the "Become a 2026 sponsor" CTA, tying to the contact copy "Ask about our 2026 Sponsorship Opportunity").
- **Persistent header:** logo (links Home), nav, and a persistent primary CTA button ("Register" / "Enter a Race") in `brand-red`.
- **Footer:** NAP, hours, phone/email, nav repeat, dynamic copyright year, owned consent/policy link. No GoDaddy branding.

---

## 4. Per-Page Requirements

> Every one of the 28 preserved content items (the original 18 + 10 flyer-locked items surfaced by the screenshot review) is mapped to a destination page below (full cross-check in §8). Times, NAP, prices, and class names are preserved **exactly**; flyer-locked content is re-authored as real, accessible HTML text.

### 4.1 Home
- **Purpose / conversion role:** orient + drive to the next event and the registration path. Top of the primary conversion funnel.
- **Content (preserve → improved):**
  - Hero CTA line **"RUN WHERE THE MONEY IS AT"** (preserve item 3) as the hero headline, now linked to the **Register/Contact** flow (not a raw mailto — Discard item 7).
  - Tagline **"WELCOME TO THE HOUSE OF SMOKIN' RUNS!"** (preserve item 2) as hero sub-headline / brand statement (also reused for OG description, §7).
  - Mission snippet (excerpt of preserve item 4) with a "Read more" link to About.
  - **"Experience Thrilling Speed Events"** framing + barrel-racing hero imagery (preserve item 5).
  - **Next-event highlight** card: the soonest upcoming race from the Events data, with date, A.M./P.M. race times, venue, and a "View all events" + "Register" CTA. (New — addresses analysis gap: events are the core but were buried.)
- **Layout/behavior:** full-width hero with action photo + dark overlay (`ink`), red CTA; below, a 2–3 block row (mission snippet, next-event card, results teaser).
- **Acceptance criteria:**
  - Hero shows the exact preserved CTA line and tagline.
  - Primary CTA routes to the registration/Contact flow, not a `mailto:`.
  - Next-event card is data-driven (reads the events data file) and shows the soonest future date.
  - One CTA color (`brand-red`) on the page.

### 4.2 Events (Calendar) — PRIMARY CONTENT, MULTI-VENUE, FULL 2026 SEASON
- **Purpose / conversion role:** the core of the business. Present the **entire 2026 season** — not just four dates — across **three venues**, with full exact times/classes/pricing, and drive each event to registration. **Most of this content is currently locked inside raster flyer images (HTML pass missed it); it MUST be re-authored as real, accessible, indexable HTML text** (a flyer image may remain as a supporting visual with descriptive alt text). This is the single biggest content-migration task (see §8).
- **Content (preserve → improved):**

  **Series name & overview:** Snook Summer Buckle Series / Jackpot (preserve item 6). Events overview intro **"Upcoming Events"** + the note **"A.M. Section Added, Please See Dates And Times Listed Under Flyer."** — the series runs both an A.M. and a P.M. race per date (preserve items 11, 28).

  **(A) Snook Summer Buckle Series / Jackpot — the four dated event cards (real machine-readable text on the page; corrected labels & number ranges, preserve items 7–10, 26).** Venue for all four: **Snook Rodeo Arena, 11538 FM 3058, Somerville, TX 77874** (preserve item 14). Card #4 is **"SNOOK JACKPOT"**, not a buckle-series date. Preserve the rider-number ranges and the two distinct morning schedules exactly:

  | # | Card title | Date | Exhibitions (AM) | A.M. Section Race | Exhibitions (PM) | P.M. Section Race | Venue |
  |---|-----------|------|------------------|-------------------|------------------|-------------------|-------|
  | 1 | Snook Summer Buckle Series | **May 30, 2026** | 9:30–10:45am | **11:00am (#1–200)** | 3:30–5:45pm | **6:00pm (#201–end)** | Snook Rodeo Arena |
  | 2 | Snook Summer Buckle Series | **June 6, 2026** | 9:30–10:45am | **11:00am (#1–200)** | 3:30–5:45pm | **6:00pm (#201–end)** | Snook Rodeo Arena |
  | 3 | Snook Summer Buckle Series | **June 13, 2026** | 9:00–10:00am | **10:15am (#1–200)** | 3:30–5:45pm | **6:00pm (#201–end)** | Snook Rodeo Arena |
  | 4 | **SNOOK JACKPOT** | **June 20, 2026** | 9:00–10:00am | **10:15am (#1–200)** | 3:30–5:45pm | **6:00pm (#201–end)** | Snook Rodeo Arena |

  **(B) Snook Summer Buckle Series — flyer detail (re-author from flyer image, preserve item 24).** The series flyer also lists **May 23, 2026** (a fifth series date the four cards omit) and **June 20, 2026 as the rain date** (June 20 is both the Snook Jackpot card AND the series rain date). Re-author as real text:
  - **Schedule:** Books open 3:30pm · Exhibitions 3:30pm–5:45pm · Race starts 6pm.
  - **Pre-entries:** open each Wednesday before the race @ 10am, close Friday at 6pm. **TEXT 832-857-2826.** Must Venmo a **$10 non-refundable office fee** to receive a draw number (Venmo handle partly obscured — owner-confirm). **Walk-up entries welcome.**
  - **Nominations:** **$20 per horse/rider combo per class** — not mandatory; the more that nominate, the larger the payout.
  - **Classes (with pricing):** **5D Open $50 · 3D Youth $30 · 2D PeeWee $20 · 3D Rookie $25 · 3D Senior $25 · 3D Novice Horse $25 · High Stakes $75 · Leadline (price TBC) · Office fee (amount TBC)** (lower rows partly obscured by the cookie banner — owner-confirm Leadline price and office-fee amount; Open Items).
  - **Rules:** **Negative Coggins Required · Cash Only.**

  **(C) 2026 Schedule — full season (re-author from the master schedule flyer, preserve item 23).** Multi-venue calendar:
  - **Day Shows:** Jan 3 Magnolia · Feb 21 Magnolia · Apr 11 Magnolia · Jun 20 Snook · Jul 17 Magnolia · Aug 21 Snook · Oct 17 Snook · Nov 7 Magnolia · Nov 21 Snook · Dec 5 Magnolia (plus a separately listed Sep 4–6). **Owner-confirm the full Day Shows date list** (Open Items).
  - **Waller Co. Fairgrounds — Shootout Qualifier & Finals:** **Mar 6–8** and **Sep 4–6**.
  - **Snook Rodeo Arena Series:** **May 23 · May 30 · Jun 6 · Jun 13**, rain date **Jun 20**.
  - **Pick Your Poison Playday:** Magnolia, **Oct 24**; rain date **Oct 31**.

  **(D) Three Magnolia Cowboy Church Playdays (re-author from three flyers, preserve item 25).** Venue: **Magnolia Cowboy Church, 2360 Dobbin Hufsmith Rd, Magnolia, TX 77354.** Dates: **June 27 · July 18 · August 29.** Per flyer (best-effort, owner-confirm partly-obscured details): age groups (Pee Wee 0–6 / 7–9 / 10–12 / 13–15 / 16–18 / 19 & over–Senior); Poles $10, Speed $10, Barrels $10, Exhibitions $5; processing fee $10/rider; order of events "Books open 4:30pm · Exhibition Poles 4:30–4:45 · Poles · Speed · Exhibition Barrels · Barrels"; pre-entries open Sunday (text 832-857-2826), walk-ups welcome, fees paid day of show, cash only; **Hi Point & Res. Hi Point awards per age group · 50% payout.**

  Per-venue NAP carried into each event and its schema (preserve item 14; new venues §7): Snook Rodeo Arena (Somerville); Magnolia Cowboy Church (Magnolia); Waller Co. Fairgrounds (Waller, exact address owner-confirm).

- **Layout/behavior (improvements, all cited to analysis gaps):**
  - Real multi-venue calendar/list UI (analysis gap: "no calendar"), filterable/groupable by venue and event type (Series · Jackpot · Day Shows · Shootout Qualifier/Finals · Playdays). Each event a card showing its full times, and — where applicable — its classes/pricing and rules as real text.
  - **All flyer-locked content re-authored as semantic HTML** (the central accessibility/SEO defect, Discard item 11). A flyer image may persist as a supporting visual with descriptive alt text.
  - **Add-to-calendar** (.ics) per event (analysis gap: "no add-to-calendar").
  - **"Register" / "Enter this event"** CTA per event routing to the registration flow (analysis gap: "no registration link per event").
  - Each event emits `schema.org/Event` JSON-LD with the correct venue `location` (analysis gap: "no machine-readable Event markup — major SEO miss"). See §7.
  - Events read from an editable typed data file so the owner can add/adjust season dates, venues, classes, and pricing without code changes.
- **Acceptance criteria:**
  - The **full 2026 season** is present (not just four dates): the Snook series cards (incl. the May 23 flyer date), the Snook Jackpot, the Day Shows, the Waller Co. Fairgrounds Shootout Qualifier & Finals, the Pick Your Poison Playday, and the three Magnolia Cowboy Church Playdays.
  - The four series/jackpot cards show **exact** times and number ranges as above; cards 1–2 use 9:30–10:45am / 11:00am(#1–200), cards 3–4 use 9:00–10:00am / 10:15am(#1–200); all PM races 6:00pm(#201–end); card #4 is titled **SNOOK JACKPOT** — the morning distinction and labels are preserved.
  - The buckle-series classes/pricing (5D Open $50 … High Stakes $75), pre-entry rules, nominations $20/combo, and "Negative Coggins Required · Cash Only" are present **as real text** (not images); obscured values flagged for owner confirmation rather than guessed.
  - The A.M. Section addition note is present in the overview.
  - **No core event content (schedule, classes, pricing, playday details) is presented only as a flyer image** — all of it is selectable, screen-reader-accessible HTML text.
  - Each event has a valid `Event` JSON-LD block pointing to its **correct venue** (validates in Rich Results Test) and an add-to-calendar action.
  - Each event has a working registration CTA (no raw `mailto:` as the sole path).

### 4.3 Results & Standings — FIRST-CLASS
- **Purpose / conversion role:** engagement and return-visit driver; surfaces series points.
- **Content (preserve → improved):**
  - **Series Points / standings** content with the destination data: the Rodeo Results App series points (preserve item 12). The underlying source today is `https://tinyurl.com/SnookSummerSeriesPoints`.
- **Layout/behavior (improvement, cited):**
  - **Replace the tinyurl** (Discard item 6 — "opaque, link-rot-prone, no branding, breaks trust/SEO") with a **branded, prominent link or an embedded standings view** of the Rodeo Results data, clearly labeled "Series Points — Rodeo Results App," opening the resolved destination (owner to confirm the canonical destination URL behind the tinyurl — Open Items). Prefer an embed if the Rodeo Results App supports one; otherwise a clearly branded outbound button with descriptive link text (not a bare shortened URL).
  - `pink` accent permitted here for standings/award emphasis (not as a CTA color); standings table on `cream`/`white`.
- **Acceptance criteria:**
  - No `tinyurl.com` link is exposed to the user as the visible link text; results are presented as a branded link/embed with descriptive text.
  - Results page is reachable from primary nav.

### 4.4 About
- **Purpose / conversion role:** trust/credibility; expands the brand story.
- **Content (preserve → improved):**
  - **Mission statement, verbatim** (preserve item 4): *"At Smokin' Guns Productions, we are dedicated to promoting barrel racing and pole bending events with good ground, great payout and a upbeat professional attitude. Our goal is to provide a fun and competitive environment for all levels of equine enthusiasts."*
  - **"Experience Thrilling Speed Events"** framing + imagery (preserve item 5) may anchor this page.
  - Business name lockup: **Smokin' Guns Productions LLC** (preserve item 1).
- **Copy correction (owner-approve, not a silent rewrite):** the mission contains a minor grammar issue — **"a upbeat" → "an upbeat."** This is flagged as an **owner-approved copy correction** (a typo fix, not a fabrication). Until the owner approves, render verbatim. (Open Items.)
- **Acceptance criteria:**
  - Mission statement present; rendered verbatim unless the owner approves the "an upbeat" correction.
  - No fabricated history, tenure, or claims beyond the source content.

### 4.5 Sponsors — FIRST-CLASS (real three-tier program + ≥8 named sponsors)
- **Purpose / conversion role:** acknowledge supporters, present the paid sponsorship program, and drive new sponsorships (ties to the contact copy "Ask about our 2026 Sponsorship Opportunity"). **This is real, populated content (screenshot-confirmed) — not a conditional/omittable stub.** The earlier "empty stub" finding was an HTML-only misread (corrected; the original Discard item 3 is removed in §8).
- **Content (preserve → improved):**
  - **Section heading "Join in"** as the lead-in to the sponsorship program (preserve item 20).
  - **2026 Sponsorship Opportunities — three-tier program** (preserve item 21; re-author from the teal flyer as real text). Tier names and prices are clearly legible; benefit bullets re-authored, owner-confirm final wording/numbers:
    - **Platinum — $5,000:** 2–4 (or 4×6) banners displayed at each event; logo/business on banner & wraps; social-media recognition; announcer/press recognition at each event; logo/business name on show flyers; 1-year live-stream coverage; no vendor fee.
    - **Gold — $1,500:** 2–3 (or 4×6) banners at each event; logo/business on banner & wraps; social-media recognition; announcer recognition at each event; logo/business name on show flyer; 6-month live-stream coverage; no vendor fee.
    - **Silver — $1,000:** 1× 4×4 banner displayed at each event; logo/business on banner & wraps; social-media recognition; announcer recognition at each event; **(lower benefit list partly obscured by the cookie banner — full Silver benefits owner-confirm, Open Items).**
  - **2026 Sponsors — sponsor wall (preserve item 22; capture each sponsor's name + contact info as real text beside the logo):**
    1. **Teal Services LLC** — Water and Wastewater Construction / General Contractor · **281-467-4407** · **Tealtexas.com**
    2. **Hay Girl Sales & Deliveries** — **281-686-8488** · Waller, TX · "Coastal Squares – Rolls – Alfalfa"
    3. **Rustic Building Systems** — **713-906-4070**
    4. **Charlotte's Saddlery** — "Everything for Riding Except the Horse"
    5. **Lavished Photography**
    6. **360 Equine**
    7. **MC Mechanical of Texas LLC**
    8. **The Jaeggi Team** — "Get Listed. Get Sold." (real estate)
- **Layout/behavior (improvements, cited):**
  - **Sponsor wall** — a coherent grid of sponsor logos, each paired with the sponsor's name + contact info as real text (the current grid mixes clashing logo styles; unify the surrounding card treatment on the brand palette while keeping each logo). Sponsor names/contact stored in an editable data file.
  - **Tier program** — the three tiers ($5,000 / $1,500 / $1,000) presented as real, accessible pricing/benefit cards on the `teal` brand ground (re-authored from the flyer image, Discard item 11).
  - **"Become a 2026 Sponsor" CTA** routing to Contact (`brand-red`), tying to the preserved contact copy.
- **Acceptance criteria:**
  - All three tiers present with **exact** prices ($5,000 / $1,500 / $1,000) and benefit lists as **real text** (not a flyer image); obscured Silver benefits flagged for owner confirmation, not invented.
  - All ≥8 named sponsors present, each with its name and any captured contact info (phone/site) as real text beside the logo.
  - A "Become a 2026 sponsor" CTA links to the Contact/registration path.
  - No core sponsor content is presented only as a raster image.

### 4.6 Contact / Location
- **Purpose / conversion role:** the primary conversion mechanism — registration/entry + contact + location.
- **Content (preserve → improved):**
  - **NAP, exact:** Snook Rodeo Arena, **11538 FM 3058, Somerville, TX 77874** (preserve item 14).
  - **Phone:** **832-857-2826** (`tel:8328572826`) (preserve item 15).
  - **Email:** **smokingunsproductions@gmail.com** (preserve item 16).
  - **Hours:** **Mon–Fri 9am–5pm; Sat–Sun Closed; closed major holidays unless events are scheduled** (preserve item 17).
  - **Contact/registration form field set** (preserve item 13): **Name**, **Email (required)**, **Message**, **File attachment**.
- **Layout/behavior (improvements, cited):**
  - **Define a real registration/entry path** (analysis: "registration path is missing… only conversion is a mailto + generic file-upload form"). The form becomes an explicit **"Enter a Race / Register"** flow: an event/date selector (which race), Name, Email (required), Message, and File attachment (e.g. coggins/payment proof — the analysis notes the upload field's likely registration use). Reuse the preserved field set; add the event selector. Keep `tel:`/`mailto:` available as secondary contact, not the sole conversion.
  - **Embedded map** of Snook Rodeo Arena (analysis: "no embedded map — adding one is a recommended improvement"). Self-hosted or privacy-respecting embed (see UX/consent).
  - Form posts via a static-site form backend (EmailJS — see Technical), with basic spam protection (analysis: "no spam protection visible").
- **Acceptance criteria:**
  - NAP, phone, email, hours rendered **exactly** as above and consistent with the schema (§7).
  - The form contains Name, Email (required), Message, and File attachment, plus an event/race selector; submission delivers to the business email.
  - A map of the venue is embedded.
  - A working registration/entry path exists (not a raw `mailto:` as the only route).

---

## 5. UX & Interaction
- **Navigation:** persistent top header with real multi-page nav (replaces the dead "More" menu, Discard item 2); mobile hamburger drawer; persistent `brand-red` "Register" CTA. Active-page state indicated.
- **Scroll/motion:** subtle fade/slide-in on event and standings cards; **all motion gated behind `prefers-reduced-motion: reduce`** (no animation when reduced motion is requested). No autoplay media.
- **Forms:** inline validation; Email required with clear error; file-attachment input with accepted-type hint and size guard; success and error states; spam protection (honeypot + provider-side). No floating-label GoDaddy chrome (Discard item 8).
- **Loading:** images lazy-loaded below the fold; responsive `srcset` for hero/action photos; explicit width/height to avoid layout shift.
- **Mobile:** event time tables reflow to stacked, readable cards; tap targets ≥ 44px; map and form full-width.
- **Cookie / consent:** replace the persistent red GoDaddy cookie banner + boilerplate Google policy links (Discard item 3) with an **owned, minimal, dismissible consent notice** and the business's own privacy statement. If the map embed sets third-party cookies, gate it behind consent or use a privacy-respecting embed.

---

## 6. Technical Requirements
- **Stack:** React + TypeScript + Tailwind, **static multi-page build via Vite**. No runtime backend server.
- **Content in data files:** the full 2026 season (all event types across all three venues, with per-event times, classes, and pricing), per-venue NAP/geo, hours, results destination, the three sponsorship tiers, and the sponsor list (names + contact info) live in editable typed data files so the owner/editor can update dates, times, classes/prices, standings links, and sponsors without touching components. Times, prices, class names, and NAP stored exactly as preserved.
- **Fonts:** self-host the chosen display + body families (no external font CDN; see SEO/CWV and consent).
- **Form backend:** **EmailJS** (or equivalent static-friendly handler) for the Contact/registration form; all keys in `VITE_*` environment variables (e.g. `VITE_EMAILJS_SERVICE_ID`), never hardcoded. File attachment supported per provider limits; if the provider can't attach files, fall back to an upload link / instruction.
- **Performance / Core Web Vitals:** LCP < 2.5s, CLS < 0.1, INP < 200ms on mid-tier mobile. Optimized/responsive images, no render-blocking third-party scripts, lazy-load map.
- **Responsive breakpoints:** mobile ≤ 640px, tablet 641–1024px, desktop > 1024px.
- **Hosting/build output:** static assets; clean URLs per page (`/events`, `/results`, `/about`, `/contact`, etc.).
- **No GoDaddy artifacts:** no `wsimg.com` assets, no `c1-*`/`data-ux` builder chrome, no "Powered by GoDaddy Airo" (Discard items 1, 8).

---

## 7. SEO Requirements (MANDATORY — local-aware)

### Universal SEO checklist
- **Semantic HTML + heading hierarchy:** one `<h1>` per page; logical `<h2>/<h3>`; `<nav>`, `<main>`, `<footer>`, `<address>` for NAP.
- **Per-page unique meta titles + descriptions** (now possible with the multi-page rebuild — the single-page build could not do this):
  - Home: *"Smokin' Guns Productions — Barrel Racing & Pole Bending Events | Somerville, TX"*
  - Events: *"2026 Snook Summer Buckle Series — Barrel Racing Events | Somerville TX"*
  - Results: *"Series Points & Standings — Snook Summer Buckle Series | Smokin' Guns Productions"*
  - About: *"About Smokin' Guns Productions — Barrel Racing & Pole Bending in the Brazos Valley"*
  - Contact: *"Contact & Register — Snook Rodeo Arena, Somerville TX | Smokin' Guns Productions"*
- **Fix the double-encoded meta-description entity** (Discard item 5 — the existing `&amp;#39;` builder bug). Write clean descriptions, e.g. Home: *"Join Smokin' Guns Productions for barrel racing and pole bending events at Snook Rodeo Arena in Somerville, TX. See the 2026 Snook Summer Buckle Series schedule and register today."* (apostrophe rendered correctly, single-encoded).
- **Open Graph + Twitter cards** per page: og:title, og:description (reuse tagline "WELCOME TO THE HOUSE OF SMOKIN' RUNS!" where apt), og:type, og:url, og:image (a real, high-fidelity brand image — not a `wsimg.com` blob), og:locale; Twitter `summary_large_image`.
- **`sitemap.xml`** listing every real page (replaces the single-URL `sitemap.website.xml`) + **`robots.txt`** (allow crawl; reference sitemap).
- **Canonical URLs** per page (none exist today).
- **Descriptive alt text** on all imagery (action photos described; any retained flyer images get descriptive alt); **descriptive link text** (no bare/short URLs — directly addresses the tinyurl, Discard item 6).
- **Core Web Vitals** targets per §6.

### Local-SEO block
- **Exact, consistent NAP** site-wide, character-for-character. The **primary/business NAP** (header/footer/Contact/org schema):
  - **Smokin' Guns Productions LLC**
  - **Snook Rodeo Arena, 11538 FM 3058, Somerville, TX 77874**
  - **832-857-2826**
  - **smokingunsproductions@gmail.com**
  - **Hours: Mon–Fri 9:00am–5:00pm; Sat–Sun closed; closed major holidays unless events scheduled**
- **Additional event venues need their own NAP + geo + schema `location`** (the season is multi-venue — corrected from the HTML-only single-venue assumption):
  - **Snook Rodeo Arena, 11538 FM 3058, Somerville, TX 77874** (primary).
  - **Magnolia Cowboy Church, 2360 Dobbin Hufsmith Rd, Magnolia, TX 77354** (Day Shows + the three Playdays).
  - **Waller Co. Fairgrounds, Waller, TX** (Shootout Qualifier & Finals — exact street address owner-confirm, Open Items).
  - Geocode each; each `Event`'s `location` must point to the correct venue, and each venue's NAP must be internally consistent wherever it appears.
- **`SportsActivityLocation` JSON-LD** (the closest schema.org subtype to an equestrian-events venue; **`LocalBusiness` is the safe fallback** if a narrower type is undesirable) for the business+primary venue, carrying: name, the exact NAP address, **geo coordinates** (latitude/longitude — owner/geocode to supply, Open Items), `telephone`, `openingHoursSpecification` from the hours, and `priceRange` if entry fees are confirmed (else omit). Include `email` and `url`.
- **`schema.org/Event` JSON-LD for EACH dated event across the WHOLE 2026 season — the headline SEO win** (the business is literally events; no `Event` markup exists today, and almost all of this content is currently flyer-locked, not even text). Emit `Event` markup for: the Snook Summer Buckle Series dates (incl. the May 23 flyer date), the **Snook Jackpot**, the **Day Shows** (Magnolia & Snook), the **Waller Co. Fairgrounds Shootout Qualifier & Finals** (Mar 6–8, Sep 4–6), the **Pick Your Poison Playday** (Oct 24, rain date Oct 31), and the **three Magnolia Cowboy Church Playdays** (Jun 27, Jul 18, Aug 29). Each Event includes:
  - `name` (e.g. "Snook Summer Buckle Series — June 13, 2026"; "Magnolia Cowboy Church Playday — June 27, 2026"),
  - `startDate` (ISO 8601 with the event's start time; for the Snook series/jackpot, model the P.M. race as a second `Event` or a `subEvent` so both the A.M. (11:00am / 10:15am) and 6:00pm P.M. times are expressed — preserve the AM/PM distinction and the two morning schedules),
  - `location` (the **correct venue** for that event, with its full address + geo — Snook Rodeo Arena, Magnolia Cowboy Church, or Waller Co. Fairgrounds),
  - `eventStatus` (`EventScheduled`),
  - `organizer` (Smokin' Guns Productions LLC),
  - `eventAttendanceMode` (`OfflineEventAttendanceMode`).
  - Encode the exact preserved times for the Snook cards: cards 1–2 A.M. Race 11:00am; cards 3–4 A.M. Race 10:15am; all P.M. Race 6:00pm.
- **Embedded map** of Snook Rodeo Arena on Contact/Location (and, where helpful, the secondary venues on their event detail).
- **Location + niche keywords** woven into titles, headings, and copy:
  - "barrel racing Somerville TX", "Snook summer series barrel racing", "pole bending events Texas", "barrel race near College Station / Bryan TX", "barrel racing buckle series Texas", "Snook Rodeo Arena events", "horse barrel race jackpot Burleson County", "barrel racing exhibitions Brazos Valley".
  - (newly-surfaced content) "barrel racing playday Magnolia TX", "Magnolia Cowboy Church playday", "barrel racing Waller County TX", "shootout qualifier barrel racing Texas", "pole bending playday Magnolia TX", and class-name terms "youth / peewee / rookie / senior barrel racing classes Texas".
- **Google Business Profile alignment:** site NAP must match the GBP character-for-character. Owner to confirm a GBP exists (creating one is recommended if not) — Open Items.
- **Review / aggregate-rating schema:** **only if/when the business has owned, rights-cleared reviews.** None exist today (analysis: no reviews present) — do **not** add rating schema or any review markup until owned reviews exist. (Reviews are rights-aware — see §8.)

### PRE-LAUNCH MUST-RESOLVE — Snook vs Somerville NAP consistency
The brand/series naming uses **"Snook"** (Snook Summer Buckle Series, Snook Rodeo Arena) while the postal city is **Somerville, TX 77874** — distinct nearby communities (Burleson County, near Bryan/College Station). **This split must be resolved before schema/NAP/GBP work** so the website, GBP, and directory citations all name one canonical city. **Interim rule:** treat the postal city **Somerville, TX 77874 as the authoritative NAP locality** and **"Snook" as a brand/series/venue name only.** Owner must confirm the canonical city before launch (Open Items). This is a hard pre-launch gate.

---

## 8. Content Migration Checklist

> **HEADLINE MIGRATION TASK — flyer-locked content (the single biggest job).** Most of the site's real content — the **2026 Schedule**, the **buckle-series detail** (schedule/pre-entries/classes/pricing/rules), the **three Magnolia Cowboy Church Playday** flyers, the **sponsorship tier program**, and the **sponsor logos** — is **raster images of text**, not machine-readable HTML. This is why the HTML crawl returned almost none of it, and it is a major accessibility + SEO defect (none of it is selectable, screen-reader-accessible, translatable, or indexable). **The rebuild must re-author every flyer's content as real, semantic HTML text** (a flyer image may remain only as a small decorative/supporting visual with descriptive alt text). Partly-obscured values (cookie banner / small print) are routed to owner confirmation (§10), never guessed.

### Real content to PRESERVE → destination page (28/28)
| # | Preserved item | Destination page |
|---|----------------|------------------|
| 1 | Business name (exact): **Smokin' Guns Productions LLC** | Header/footer (all pages); About |
| 2 | Tagline: **"WELCOME TO THE HOUSE OF SMOKIN' RUNS!"** | Home hero; OG descriptions |
| 3 | Hero CTA line: **"RUN WHERE THE MONEY IS AT"** | Home hero (→ registration, not mailto) |
| 4 | Mission statement (verbatim) | About (verbatim; "an upbeat" fix is owner-approve only); Home snippet |
| 5 | **"Experience Thrilling Speed Events"** + barrel-racing imagery intent | Home hero; About |
| 6 | Series name: **Snook Summer Buckle Series / Jackpot** | Events |
| 7 | Snook Summer Buckle Series — **May 30, 2026** (AM exh 9:30–10:45am · AM race 11:00am #1–200 · PM exh 3:30–5:45pm · PM race 6:00pm #201–end) | Events + Event JSON-LD |
| 8 | Snook Summer Buckle Series — **June 6, 2026** (AM exh 9:30–10:45am · AM race 11:00am #1–200 · PM exh 3:30–5:45pm · PM race 6:00pm #201–end) | Events + Event JSON-LD |
| 9 | Snook Summer Buckle Series — **June 13, 2026** (AM exh 9:00–10:00am · AM race 10:15am #1–200 · PM exh 3:30–5:45pm · PM race 6:00pm #201–end) | Events + Event JSON-LD |
| 10 | **SNOOK JACKPOT** — **June 20, 2026** (AM exh 9:00–10:00am · AM race 10:15am #1–200 · PM exh 3:30–5:45pm · PM race 6:00pm #201–end) — NOT a buckle-series date | Events + Event JSON-LD |
| 11 | Note re: **A.M. Section addition** to the series + "Upcoming Events" heading | Events overview |
| 12 | Series Points / results link (Rodeo Results App; src `tinyurl.com/SnookSummerSeriesPoints`) | Results & Standings (rebranded link/embed) |
| 13 | Contact form field set: **Name, Email (required), Message, File attachment** | Contact / Location (registration flow) |
| 14 | NAP — Address: **Snook Rodeo Arena, 11538 FM 3058, Somerville, TX 77874** | Contact; Events (venue); schema; footer |
| 15 | NAP — Phone: **832-857-2826** | Contact; header/footer; schema |
| 16 | NAP — Email: **smokingunsproductions@gmail.com** | Contact; schema |
| 17 | Hours: **Mon–Fri 9am–5pm; Sat–Sun Closed; closed major holidays unless events scheduled** | Contact; schema |
| 18 | Logo — **monochrome crossed-pistols "SMOKIN' GUNS PRODUCTIONS" emblem** (re-source at higher fidelity) | Header (all pages); OG image |
| 19 | **"Experience Thrilling Speed Events!"** heading + the genuine barrel-racing action photo (the one strong image) | Home hero; About |
| 20 | **"Join in"** sponsorship lead-in heading | Sponsors |
| 21 | **2026 Sponsorship Opportunities — tier program:** Platinum **$5,000**, Gold **$1,500**, Silver **$1,000** with benefit lists (re-author as text; Silver list owner-confirm) | Sponsors |
| 22 | **2026 Sponsors — ≥8 named sponsors w/ contact info:** Teal Services LLC (281-467-4407, Tealtexas.com) · Hay Girl Sales & Deliveries (281-686-8488, Waller TX) · Rustic Building Systems (713-906-4070) · Charlotte's Saddlery · Lavished Photography · 360 Equine · MC Mechanical of Texas LLC · The Jaeggi Team | Sponsors |
| 23 | **2026 Schedule — full multi-venue season:** Day Shows (Magnolia & Snook) · Waller Co. Fairgrounds Shootout Qualifier & Finals (Mar 6–8; Sep 4–6) · Snook Series (May 23, 30; Jun 6, 13; rain date Jun 20) · Pick Your Poison Playday (Magnolia, Oct 24; rain date Oct 31) | Events (calendar) + Event JSON-LD |
| 24 | **Snook buckle-series flyer detail:** schedule (books 3:30pm, exh 3:30–5:45pm, race 6pm); pre-entries (Wed 10am–Fri 6pm, TEXT 832-857-2826, $10 non-refundable Venmo office fee, walk-ups welcome); classes w/ pricing (5D Open $50, 3D Youth $30, 2D PeeWee $20, 3D Rookie $25, 3D Senior $25, 3D Novice Horse $25, High Stakes $75, Leadline TBC, office fee TBC); nominations $20/combo (not mandatory); Negative Coggins Required · Cash Only | Events (re-authored as text) |
| 25 | **Three Magnolia Cowboy Church Playdays** (Jun 27, Jul 18, Aug 29) at **2360 Dobbin Hufsmith Rd, Magnolia TX 77354** — age groups, Poles/Speed/Barrels $10 + Exhibitions $5, processing fee, "Books open 4:30pm" order of events, Hi Point & Res. Hi Point per age group, 50% payout (details owner-confirm) | Events + Event JSON-LD |
| 26 | The four cards' **exact race labels & number ranges** ("A.M. Section Race @ 11am #1–200" / "P.M. Section Race @ 6pm #201–end") and card #4 titled **SNOOK JACKPOT** | Events |
| 27 | **Contact intro copy:** "Better yet, see us in person! We love our competitors, spectators & sponsors. We definitely couldn't do it without your support! Ask about our 2026 Sponsorship Opportunity." | Contact / Location |
| 28 | **"22 Champion Buckles"** buckle-series banner line (Open, Youth, Rookie, PeeWee, Senior, Adult) | Events (series banner) |

**Cross-check: 28/28 preserved items carried into the PRD** (original 18 + 10 flyer-locked items surfaced by the screenshot review).

### Artifacts to DISCARD (12/12) — with evidence
> **Note:** the original "empty 2026 Sponsors stub" discard item has been **removed** — the screenshot review confirmed the Sponsors content is real, plural, and tiered (it was an HTML-only misread). Sponsors is now a first-class page (§4.5). Two discard items new to the screenshot review are added (11, 12).

| # | Artifact | Evidence (analysis) | Action |
|---|----------|---------------------|--------|
| 1 | "Powered by GoDaddy Airo" footer branding | observed footer; `generator` meta = GoDaddy WB 8.0.0000 | Remove |
| 2 | Dead / invisible **"More"** nav | "no visible nav menu at all on the rendered page" | Replace with real multi-page nav |
| 3 | **Persistent red cookie banner** + boilerplate Google policy links | observed fixed bottom-right across nearly every desktop shot, obscures content, never dismisses | Replace with an owned, dismissible consent notice + the business's own policy |
| 4 | Stale **"© 2025"** copyright | observed "© 2025" while events are 2026 — stale | Dynamic/current year |
| 5 | Double-encoded meta-description entity (`&amp;#39;`) | "builder encoding bug, renders incorrectly" | Clean single-encoded descriptions |
| 6 | **tinyurl** results link | "opaque, link-rot-prone, no branding, breaks trust/SEO" | Branded/embedded standings + descriptive link text |
| 7 | Raw **`mailto:`** as the only conversion path | "registration path is missing" | Real registration/entry flow |
| 8 | GoDaddy form/builder chrome (`c1-*`, `data-ux`, `wsimg.com` assets, chat-bubble widget, Wed auto-bold) | "obfuscated builder scaffolding" | Rebuild clean React form |
| 9 | GoDaddy default font stack (Abril Fatface / Chunkfive / Poppins / Muli) | "stock builder choices, not a brand system" | Deliberate self-hosted type system (§2) |
| 10 | Weak **ghost/outline CTAs** (hero, Series Points, SEND) | observed low-contrast outline buttons for primary actions | Solid, high-contrast `brand-red` buttons |
| 11 | **All content trapped in raster flyer images** (2026 Schedule, buckle-series detail, three playday flyers, sponsorship tiers) | observed flyers are images of text — inaccessible/unindexable | **Re-author every flyer's content as real, accessible, indexable HTML text** (flyer image optional as decorative visual w/ alt) — the single largest migration + accessibility/SEO fix |
| 12 | **Inconsistent per-flyer / per-logo styling** (each its own palette + fonts) | observed clashing clip-art templates flyer-to-flyer | Replace with one coherent brand system — red + teal + pink on warm cream (§2) |

### Reviews (rights-aware)
No reviews exist on the current site. If social proof is added later, the testimonials section must use **owned/collected testimonials** (gathered with permission, attributed) or an **embedded reviews widget with attribution** (e.g. Google reviews embed) — **never scraped verbatim third-party text.** Review themes may inform copy; review text is not copied onto the site. No review/rating schema until owned reviews exist (§7).

---

## 9. Acceptance Criteria

**Content fidelity (improve)**
- [ ] All 28 preserved content items appear on their mapped pages.
- [ ] The full 2026 season is present (Snook series incl. May 23 flyer date, Snook Jackpot, Day Shows, Waller Shootout Qualifier & Finals, Pick Your Poison Playday, three Magnolia Cowboy Church Playdays) — not just four dates.
- [ ] The four Snook cards show **exact** times and number ranges; cards 1–2 use 9:30–10:45am / 11:00am(#1–200), cards 3–4 use 9:00–10:00am / 10:15am(#1–200); all P.M. races 6:00pm(#201–end); card #4 titled **SNOOK JACKPOT** — morning distinction and labels preserved.
- [ ] Buckle-series classes/pricing (5D Open $50 … High Stakes $75), pre-entry rules, nominations $20/combo, and "Negative Coggins Required · Cash Only" present **as real text**; obscured values flagged for owner confirmation, not invented.
- [ ] **No core event/sponsor/schedule content is presented only as a flyer image** — all of it is selectable, screen-reader-accessible HTML text.
- [ ] NAP, phone, email, and hours rendered exactly and consistently across pages; each event's venue NAP (Snook / Magnolia Cowboy Church / Waller Co. Fairgrounds) is internally consistent.
- [ ] Mission statement rendered verbatim; the "a upbeat → an upbeat" fix applied only with owner approval.
- [ ] All 12 builder artifacts removed/replaced per the discard table.

**Functionality**
- [ ] Real multi-page navigation works (no dead "More" menu).
- [ ] A real registration/entry path exists (event selector + Name/Email(req)/Message/File attachment); not a raw `mailto:` as the sole route.
- [ ] Each event has an add-to-calendar action.
- [ ] Results & Standings presents a branded link/embed; no `tinyurl.com` shown as visible link text.
- [ ] Sponsors page ships with the real three-tier program ($5,000 / $1,500 / $1,000) and ≥8 named sponsors as real text, plus a "Become a 2026 sponsor" CTA.

**SEO (must pass)**
- [ ] Unique, clean (single-encoded) meta title + description per page.
- [ ] `SportsActivityLocation` (or `LocalBusiness`) JSON-LD present and valid, with exact NAP, geo, `openingHoursSpecification`, telephone.
- [ ] `schema.org/Event` JSON-LD present and valid for **every** dated event across the season, each pointing to its **correct venue** `location` (AM and PM times both expressed for the Snook cards), validating in the Rich Results Test.
- [ ] All three venues (Snook Rodeo Arena, Magnolia Cowboy Church, Waller Co. Fairgrounds) carry consistent NAP + geo in their schema `location`.
- [ ] NAP is character-for-character consistent across site, schema, and (once confirmed) GBP.
- [ ] **Snook-vs-Somerville canonical city resolved before launch** (interim: Somerville, TX 77874 authoritative).
- [ ] `sitemap.xml` (all pages) + `robots.txt` present; canonical URL per page.
- [ ] OG + Twitter cards per page with a real (non-`wsimg.com`) image; double-encoded entity bug fixed.
- [ ] Location keywords present in titles/headings/copy.
- [ ] Embedded venue map on Contact/Location.
- [ ] Semantic HTML, single `<h1>` per page, descriptive alt + link text.
- [ ] No review/rating schema unless owned reviews exist.

**Quality / non-functional**
- [ ] Responsive at all three breakpoints; event time tables reflow legibly on mobile; tap targets ≥ 44px.
- [ ] WCAG **AA** accessibility (contrast, focus states, labels, alt text); all motion honors `prefers-reduced-motion`.
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms (mid-tier mobile).
- [ ] Single CTA color (`brand-red`) site-wide (solid, not ghost/outline); `teal` used only for the sponsor program/sections and `pink` only as an accent — never as CTA colors.
- [ ] Dynamic copyright year; owned consent/policy in footer; no GoDaddy branding.
- [ ] Form keys in `VITE_*` env vars; spam protection present.

---

## 10. Open Items for the Client
1. **Logo / brand assets** at higher fidelity (vector or high-res) to replace the low-res `wsimg.com` monochrome crossed-pistols lockup; high-res barrel-racing action photography for hero/About/OG.
2. **Sponsor logo assets + permission:** supply each sponsor's logo at **high fidelity**, and **confirm permission to display** each sponsor's name, logo, and contact info on the site. (The Sponsors page itself is in scope — this is about asset quality and display rights, not whether to build it.)
3. **Obscured / partly-legible flyer values (confirm, do not guess):**
   - The **full Silver-tier benefit list** (lower portion was hidden behind the cookie banner).
   - The **Leadline class price** and the **office-fee amount** on the buckle-series flyer (lower rows obscured).
   - The buckle-series **Venmo handle** for the $10 office fee.
   - The **exact playday formats / age-group splits / per-event prices / payout wording** for the three Magnolia Cowboy Church Playdays (small flyer print, best-effort transcription).
4. **Confirm the full 2026 Day Shows date list** (Magnolia & Snook) and the Sep 4–6 listing, plus the Waller Co. Fairgrounds Shootout Qualifier & Finals dates.
5. **Waller Co. Fairgrounds exact street address** (only "Waller, TX" is legible) for its venue NAP + geo + schema.
6. **Canonical city — Snook vs Somerville (PRE-LAUNCH GATE):** confirm the single canonical city/locality for website + GBP + citations (interim authoritative = Somerville, TX 77874).
7. **Geo coordinates** (latitude/longitude) for all three venues — Snook Rodeo Arena (11538 FM 3058, Somerville, TX 77874), Magnolia Cowboy Church (2360 Dobbin Hufsmith Rd, Magnolia, TX 77354), and Waller Co. Fairgrounds — for schema + maps.
8. **Registration / entry process:** the real entry flow details — how riders enter, any **entry fees** (the class prices in §4.2 are flyer-transcribed — confirm), **payouts**, deadlines, what the file-attachment is for (coggins/payment proof?). Determines whether `priceRange` is added to schema.
9. **Confirm event schedules are current** (the four Snook cards' dates and two morning schedules, the full season dates, and whether more dates should be added).
10. **Confirm the Results destination URL** behind `tinyurl.com/SnookSummerSeriesPoints` (the real Rodeo Results App link) and whether an embed is available.
11. **Google Business Profile:** confirm whether a GBP exists; if so, share it for NAP reconciliation; if not, create one (recommended).
12. **Copy correction approval:** approve the mission grammar fix **"a upbeat" → "an upbeat"** (otherwise rendered verbatim).
13. **Owned testimonials:** any rights-cleared, attributable testimonials to feature (else none; no review schema).
14. **Privacy/consent:** confirm the business's own privacy statement / consent preference to replace GoDaddy boilerplate.
