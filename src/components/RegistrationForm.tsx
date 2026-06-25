import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';

import emailjs from '@emailjs/browser';

import { Button } from './Button';

import { upcomingSeason } from '../data/events';

// The brand-red Button submit is the single CTA. EmailJS keys come ONLY from
// import.meta.env.VITE_EMAILJS_* (PRD §6/§9) — never hardcoded in this file.
// `now` is injectable so tests pin the date; production uses the real current
// date. Only UPCOMING events are offered (you can't enter a past race).

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB guard
const ACCEPTED_TYPES = '.pdf,.jpg,.jpeg,.png';

// Shared field styling — token-only: white field, ink text, sans body, md radius,
// 12/16 spacing, brand-red focus ring. min-h-[44px] is the justified ≥44px tap floor.
const fieldClasses =
  'min-h-[44px] rounded-md bg-white px-4 py-3 font-sans text-base text-ink ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-dark ' +
  'focus-visible:ring-offset-2';

const labelClasses = 'font-sans text-sm text-ink';
const errorClasses = 'font-sans text-sm text-brand-red';

function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function RegistrationForm({ now }: { now?: Date } = {}) {
  const [searchParams] = useSearchParams();
  const [eventId, setEventId] = useState('');
  const [ageGroup, setAgeGroup] = useState(''); // single-select age group
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]); // multi-select classes
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [fileError, setFileError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [classError, setClassError] = useState('');
  const [state, setState] = useState<SubmitState>('idle');

  // Only upcoming events can be entered (past races are not offered).
  const events = upcomingSeason(now);

  // Class / age-group options depend on the selected event. Each renders as its
  // own control, shown only when the event defines it:
  //  • series → classes only; playday → both age groups + classes;
  //  • jackpot / day show → any standalone classes; none ⇒ neither control shows.
  // Classes are multi-select; age group is single-select.
  const selectedEvent = events.find((event) => event.id === eventId);
  const classOptions =
    selectedEvent?.seriesDetail?.classes ??
    selectedEvent?.playdayDetail?.classes ??
    selectedEvent?.classes ??
    [];
  const ageGroupOptions = selectedEvent?.playdayDetail?.ageGroups ?? [];

  // Pre-select the event from ?event=<id> when arriving from an EventCard CTA
  // (only if it's an upcoming event).
  useEffect(() => {
    const requested = searchParams.get('event');
    if (requested && events.some((event) => event.id === requested)) {
      setEventId(requested);
    }
  }, [searchParams, events]);

  function handleEventChange(e: ChangeEvent<HTMLSelectElement>) {
    setEventId(e.target.value);
    // Reset class/age-group selections when the event changes.
    setAgeGroup('');
    setSelectedClasses([]);
    setClassError('');
  }

  function toggleClass(className: string) {
    setClassError('');
    setSelectedClasses((prev) =>
      prev.includes(className) ? prev.filter((c) => c !== className) : [...prev, className]
    );
  }

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && file.size > MAX_FILE_BYTES) {
      setFileError('File is larger than 5 MB — please attach a smaller file.');
    } else {
      setFileError('');
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (honeypot) return; // bot trap — silently abort
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    // When the selected event has classes, at least one must be chosen.
    if (classOptions.length > 0 && selectedClasses.length === 0) {
      setClassError('Please select at least one class.');
      return;
    }
    setClassError('');
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
      <p role="status" className="font-sans text-xl text-ink">
        Thanks — your entry has been sent. We&rsquo;ll be in touch soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="event" className={labelClasses}>
          Which race are you entering?
        </label>
        <select
          id="event"
          name="event"
          className={fieldClasses}
          value={eventId}
          onChange={handleEventChange}
        >
          <option value="">Select an event</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title} — {new Date(event.startDate).toLocaleDateString('en-US')}
            </option>
          ))}
        </select>
      </div>

      {/* Age group — single-select; shown only when the event defines age groups. */}
      {ageGroupOptions.length > 0 ? (
        <div className="flex flex-col gap-2">
          <label htmlFor="age-group" className={labelClasses}>
            Age group
          </label>
          <select
            id="age-group"
            name="age_group"
            className={fieldClasses}
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value)}
          >
            <option value="">Select an age group</option>
            {ageGroupOptions.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {/* Classes — multi-select (check all that apply); shown only when the event
          defines classes. A hidden input carries the joined value to EmailJS. */}
      {classOptions.length > 0 ? (
        <fieldset
          className="flex flex-col gap-2"
          aria-invalid={classError ? true : undefined}
          aria-describedby={classError ? 'classes-error' : undefined}
        >
          <legend className={labelClasses}>Classes (select all that apply)</legend>
          <div className="flex flex-col">
            {classOptions.map((c) => (
              <label
                key={c.name}
                className="inline-flex min-h-[44px] items-center gap-3 font-sans text-base text-ink"
              >
                <input
                  type="checkbox"
                  checked={selectedClasses.includes(c.name)}
                  onChange={() => toggleClass(c.name)}
                  className="h-5 w-5 accent-brand-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-dark focus-visible:ring-offset-2"
                />
                {c.name} — {c.price}
              </label>
            ))}
          </div>
          {classError ? (
            <p id="classes-error" className={errorClasses}>
              {classError}
            </p>
          ) : null}
          <input type="hidden" name="classes" value={selectedClasses.join(', ')} />
        </fieldset>
      ) : null}

      <div className="flex flex-col gap-2">
        <label htmlFor="name" className={labelClasses}>
          Name
        </label>
        <input
          id="name"
          name="name"
          className={fieldClasses}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className={labelClasses}>
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
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? 'email-error' : undefined}
        />
        {emailError ? (
          <p id="email-error" className={errorClasses}>
            {emailError}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className={labelClasses}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className={fieldClasses}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="attachment" className={labelClasses}>
          Attachment (Coggins / payment proof) — PDF or image, max 5 MB
        </label>
        <input
          id="attachment"
          name="attachment"
          type="file"
          accept={ACCEPTED_TYPES}
          className={fieldClasses}
          onChange={handleFile}
          aria-invalid={fileError ? true : undefined}
          aria-describedby={fileError ? 'attachment-error' : undefined}
        />
        {fileError ? (
          <p id="attachment-error" className={errorClasses}>
            {fileError}
          </p>
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
        <p role="alert" className="font-sans text-base text-brand-red">
          Something went wrong sending your entry. Please try again or call us.
        </p>
      ) : null}

      <Button type="submit" disabled={state === 'submitting'}>
        {state === 'submitting' ? 'Sending…' : 'Register'}
      </Button>
    </form>
  );
}
