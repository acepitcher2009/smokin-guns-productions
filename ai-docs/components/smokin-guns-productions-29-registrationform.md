# Component Build Story — RegistrationForm (Enter a Race / Register, EmailJS)

## Front Matter (required)
- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #27; §E Build Order #29)
- Conventions: `ai-docs/conventions/CONVENTIONS.md`
- PRD: `ai-docs/prd/smokin-guns-productions.md`
- Component: `RegistrationForm`
- Build-order position: `29`
- Test tier: `light`

---

## A. Story Summary (required)

As a rider, I need a real "Enter a Race / Register" form where I pick the event, give my name and email, add a message and an attachment, and submit — with the event pre-selected when I arrive from an event's Register button — so that I can enter a race directly instead of composing a raw email.

---

## B. Background / Context (required)

Build-order step 29 and the primary conversion mechanism. Per PRD §4.6 / §8 item 13 / §6 (EmailJS, `VITE_*` env) / §5 (validation, honeypot) and plan §C #27, `RegistrationForm` provides an event/race selector populated from `events.ts` (story 1: `season`), plus Name, Email (required), Message, and a File attachment with an accepted-type hint + size guard. It validates inline, shows success/error states, submits via `@emailjs/browser` using `import.meta.env.VITE_EMAILJS_*` keys (**never hardcoded**), includes a hidden **honeypot** field, and **pre-selects the event from `?event=<id>`** when the visitor arrives from an `EventCard` Register CTA (`/contact?event=<id>`). The submit button is the brand-red `Button` (story 3). A `mailto:` is at most a secondary fallback — never the sole path. No prior story builds a form.

---

## C. Acceptance Criteria (required)

1. Fields: an **event/race `<select>`** populated from `season` (`events.ts`), **Name**, **Email (required)**, **Message** (textarea), and a **File attachment** input with an accepted-type hint (`accept=...`) and a size guard (reject over a stated max with an inline error).
2. **Email is required and validated** — empty or malformed email shows an inline error and blocks submit.
3. **Honeypot:** a hidden field (visually hidden + `tabindex="-1"` + `autocomplete="off"`) that, when filled, silently aborts the submission (bot trap).
4. **Event pre-selection:** when the URL has `?event=<id>` matching a `season` event id, that event is pre-selected in the `<select>` on mount (from an `EventCard` Register CTA → `/contact?event=<id>`).
5. **EmailJS submit:** posts via `@emailjs/browser` using `import.meta.env.VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY` — **no keys hardcoded** in the component.
6. **Success/error states:** on success, a confirmation message replaces/augments the form; on failure, an inline error invites retry. Submitting is disabled while in-flight.
7. Submit button is the brand-red `Button` (`type="submit"`); the form is **not** a raw `mailto:` as the sole path.
8. Inputs are labeled (`<label htmlFor>`), keyboard-accessible, with visible focus and inline error text tied to the field (`aria-describedby`).
9. **Token-cleanliness:** only design-system tokens — `bg-white` fields, `text-ink`, `font-sans`, type-scale sizes, spacing scale, `rounded-md`, brand-red `Button`; focus/error styling via tokens. **No hardcoded color/spacing/size.** (Error text may use `text-brand-red` — the brand color as an emphasis/text color, not a button.)
10. `npm run typecheck` + `npm run lint` pass; renders at all breakpoints.

---

## D. Conventions Reference (required)

Follow `ai-docs/conventions/CONVENTIONS.md`:
- **§A Color role discipline** — `bg-white` fields; brand-red `Button` submit (the only solid CTA); error emphasis may use `text-brand-red` (text, not a button); no teal/pink.
- **§C Component Structure** — functional component, inline `interface RegistrationFormProps` (likely none), **named export** `export function RegistrationForm`, no `any`; imports `season` from `src/data/events`, `Button`, and `emailjs` from `@emailjs/browser`.
- **§D File Organization** — component in `src/components/`; event options from `src/data/events.ts`; keys from `import.meta.env.VITE_EMAILJS_*` (never hardcoded).
- **§E Token Consumption** — token classes only; motion (if any) behind `motion-safe:`.
- **§B Code Style** — single quotes, semicolons, import groups (external `react`/`react-router-dom`/`@emailjs/browser` → internal `./Button`, `../data/events`).

---

## E. Technical Implementation Details (required)

### E.1 Files to create / modify

| File | Action | Purpose |
|---|---|---|
| `src/components/RegistrationForm.tsx` | create | Enter-a-Race form: event selector, fields, validation, honeypot, EmailJS submit, query pre-select |

> Composition: rendered by the Contact page (story 31). This story builds the component only. Add the `VITE_EMAILJS_*` keys to `.env` (and document in `.env.example`) — keys are owner-supplied secrets, never committed (see Blockers).

### E.2 Component example

`src/components/RegistrationForm.tsx`:

```tsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import emailjs from '@emailjs/browser';

import { Button } from './Button';

import { season } from '../data/events';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB guard
const ACCEPTED_TYPES = '.pdf,.jpg,.jpeg,.png';

const fieldClasses =
  'rounded-md bg-white px-4 py-3 font-sans text-base text-ink ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-dark';

export function RegistrationForm() {
  const [searchParams] = useSearchParams();
  const [eventId, setEventId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [fileError, setFileError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [state, setState] = useState<SubmitState>('idle');

  // Pre-select the event from ?event=<id> when arriving from an EventCard CTA.
  useEffect(() => {
    const requested = searchParams.get('event');
    if (requested && season.some((event) => event.id === requested)) {
      setEventId(requested);
    }
  }, [searchParams]);

  function validateEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && file.size > MAX_FILE_BYTES) {
      setFileError('File is larger than 5 MB — please attach a smaller file.');
    } else {
      setFileError('');
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (honeypot) return; // bot trap — silently abort
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    if (fileError) return;

    setState('submitting');
    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        e.currentTarget,
        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
      );
      setState('success');
    } catch {
      setState('error');
    }
  }

  if (state === 'success') {
    return (
      <p className="font-sans text-xl text-ink">
        Thanks — your entry has been sent. We&rsquo;ll be in touch soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="event" className="font-sans text-sm text-ink">
          Which race are you entering?
        </label>
        <select
          id="event"
          name="event"
          className={fieldClasses}
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
        >
          <option value="">Select an event</option>
          {season.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title} — {new Date(event.startDate).toLocaleDateString('en-US')}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="font-sans text-sm text-ink">
          Name
        </label>
        <input id="name" name="name" className={fieldClasses} value={name}
          onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="font-sans text-sm text-ink">
          Email (required)
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className={fieldClasses}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-describedby={emailError ? 'email-error' : undefined}
        />
        {emailError ? (
          <p id="email-error" className="font-sans text-sm text-brand-red">
            {emailError}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="font-sans text-sm text-ink">
          Message
        </label>
        <textarea id="message" name="message" className={fieldClasses} value={message}
          onChange={(e) => setMessage(e.target.value)} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="attachment" className="font-sans text-sm text-ink">
          Attachment (Coggins / payment proof) — PDF or image, max 5 MB
        </label>
        <input id="attachment" name="attachment" type="file" accept={ACCEPTED_TYPES}
          className={fieldClasses} onChange={handleFile} />
        {fileError ? (
          <p className="font-sans text-sm text-brand-red">{fileError}</p>
        ) : null}
      </div>

      {/* Honeypot — visually hidden; bots fill it, humans don't. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        aria-hidden="true"
      />

      {state === 'error' ? (
        <p className="font-sans text-base text-brand-red">
          Something went wrong sending your entry. Please try again or call us.
        </p>
      ) : null}

      <Button type="submit" disabled={state === 'submitting'}>
        {state === 'submitting' ? 'Sending…' : 'Register'}
      </Button>
    </form>
  );
}
```

> **No hardcoded keys:** the service/template/public keys come from `import.meta.env.VITE_EMAILJS_*` — never literals (PRD §6 / §9). **Event pre-select:** `useSearchParams().get('event')` is matched against `season` ids and sets the `<select>` on mount, so a visitor arriving at `/contact?event=snook-jackpot-2026-06-20` lands with that event chosen. **Honeypot** `company` field is `className="hidden"` + `tabIndex={-1}` + `aria-hidden` — filling it aborts submit. **Email required + validated** before submit. **File guard** rejects > 5 MB with an inline error (note: EmailJS file-attachment support is provider-limited; if the configured template can't carry the file, the builder falls back to an upload-instruction per PRD §6 — the field + guard still apply). The submit `Button` is the brand-red primitive; this is a real submission path, **not** a `mailto:`.
>
> **`disabled` on `Button`:** the brand-red `Button` (story 3) supports `disabled` on its `<button>` variant — used here to block double-submit while in-flight.

### E.4 Design tokens used

- **Color:** `bg-white` (fields), `text-ink` (labels/inputs), `text-brand-red` (inline error text), `ring-brand-red-dark` (focus ring); brand-red `Button` submit
- **Font family:** `font-sans`
- **Type size:** `text-base` (inputs), `text-sm` (labels/errors), `text-xl` (success)
- **Spacing:** `gap-6` (24px), `gap-2` (8px), `px-4` (16px), `py-3` (12px) — approved scale
- **Radius:** `rounded-md` (8px)

### E.5 Interactions / behavior

- Controlled inputs; inline email validation; file size/type guard; honeypot abort; async EmailJS submit with `idle`/`submitting`/`success`/`error` states; double-submit prevented via `disabled`.
- Query-param pre-select on mount.

### E.6 Responsive behavior

- Single-column, full-width fields on mobile; comfortable max-width on desktop (the page container constrains it). Tap targets ≥44px.

### E.7 Accessibility

- Every input has an associated `<label htmlFor>`; required email marked `required`; error text linked via `aria-describedby`.
- Honeypot `aria-hidden` + `tabindex="-1"` (skipped by AT and keyboard).
- Visible focus ring; success/error states are real text (announced).

---

## F. Testing Strategy (required — Tier: light)

Create `src/components/RegistrationForm.test.tsx` (render inside `MemoryRouter`; mock `@emailjs/browser` with `vi.mock('@emailjs/browser')`). Concrete tests:

- **Required email validates:** submit with an empty/invalid email → an inline error appears ("valid email") and `emailjs.sendForm` is **not** called.
- With a valid email (and required fields), submit → `emailjs.sendForm` **is** called (mocked) and a success message appears.
- **Honeypot:** fill the hidden `company` field, then submit with a valid email → `emailjs.sendForm` is **not** called (silent abort).
- **Event pre-select:** render at `/contact?event=snook-jackpot-2026-06-20` (set the `MemoryRouter` `initialEntries`); the event `<select>` value equals `snook-jackpot-2026-06-20`.
- The event `<select>` lists options from `season` (e.g. an option whose text includes "SNOOK JACKPOT").

**Manual check (all tiers):**
1. With real `VITE_EMAILJS_*` keys in `.env`, submit a test entry → arrives at the business email.
2. From `/events`, click a card's Register → lands on `/contact` with that event pre-selected.
3. Submit an invalid email → inline error; attach a >5 MB file → file error.

---

## G. Definition of Done (required)

- [ ] Event selector (from `events.ts`) + Name + Email (required) + Message + File (type hint + size guard).
- [ ] Email required & validated; honeypot present and aborts on fill.
- [ ] Event pre-selected from `?event=<id>`.
- [ ] Submits via `@emailjs/browser` using `import.meta.env.VITE_EMAILJS_*` (no hardcoded keys); success/error states; double-submit blocked.
- [ ] Brand-red `Button` submit; not a raw `mailto:` as the sole path.
- [ ] Labeled, keyboard-accessible inputs; errors via `aria-describedby`.
- [ ] Only design-system tokens (no hardcoded color/spacing/size).
- [ ] TypeScript zero new errors; lint passes.
- [ ] Light smoke test (required-email + honeypot + event pre-select) present and passing.
- [ ] Renders correctly at mobile / tablet / desktop.

---

## H. Dependencies & Blockers (required)

- **Depends on:** `@emailjs/browser` (installed), `Button` (3), `events.ts` (`season`, story 1), `react-router-dom` (`useSearchParams`). Composed by Contact page (31).
- **Blockers:** None for the build. The `VITE_EMAILJS_SERVICE_ID` / `_TEMPLATE_ID` / `_PUBLIC_KEY` values are owner-supplied secrets set in `.env` (document in `.env.example`); the registration/entry process specifics and what the attachment is for are owner-pending (PRD §10 item 8) — the form structure is complete and unaffected. EmailJS file-attachment support is provider-limited; fall back to an upload instruction if the template can't carry files (PRD §6).

---

## I. References (required)

- Source plan: `ai-docs/components/smokin-guns-productions-plan.md` (§C #27, §E #29)
- Conventions: `ai-docs/conventions/CONVENTIONS.md` (§A, §C, §D, §E)
- PRD: `ai-docs/prd/smokin-guns-productions.md` (§4.6, §5, §6, §8 item 13, §9, §10 item 8)
- Related components: `Button` (3), `events.ts` (1); composed by Contact (31); receives `?event=<id>` from `EventCard` (12) Register CTAs.
