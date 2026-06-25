import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

import emailjs from '@emailjs/browser';

import { Button } from './Button';

// General "drop us a line" contact form — distinct from event registration
// (RegistrationForm on /register). No event selector, no Coggins/payment
// attachment: this is for getting in touch with the organization. The brand-red
// Button submit is the single CTA. EmailJS keys come ONLY from
// import.meta.env.VITE_EMAILJS_* (PRD §6/§9) — never hardcoded here.

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

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [fileError, setFileError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [state, setState] = useState<SubmitState>('idle');

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
        Thanks — your message has been sent. We&rsquo;ll be in touch soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="contact-name" className={labelClasses}>
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          className={fieldClasses}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-email" className={labelClasses}>
          Email (required)
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          className={fieldClasses}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? 'contact-email-error' : undefined}
        />
        {emailError ? (
          <p id="contact-email-error" className={errorClasses}>
            {emailError}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-message" className={labelClasses}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          className={fieldClasses}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-attachment" className={labelClasses}>
          Attach a file (optional) — PDF or image, max 5 MB
        </label>
        <input
          id="contact-attachment"
          name="attachment"
          type="file"
          accept={ACCEPTED_TYPES}
          className={fieldClasses}
          onChange={handleFile}
          aria-invalid={fileError ? true : undefined}
          aria-describedby={fileError ? 'contact-attachment-error' : undefined}
        />
        {fileError ? (
          <p id="contact-attachment-error" className={errorClasses}>
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
          Something went wrong sending your message. Please try again or call us.
        </p>
      ) : null}

      <Button type="submit" disabled={state === 'submitting'}>
        {state === 'submitting' ? 'Sending…' : 'Send'}
      </Button>
    </form>
  );
}
