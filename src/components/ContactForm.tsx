import { useState } from 'react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WEB3FORMS_URL = 'https://api.web3forms.com/submit';

type Errors = { name?: string; email?: string; message?: string };
type Status = 'idle' | 'loading' | 'success' | 'error';

function validate(name: string, email: string, message: string): Errors {
  const errors: Errors = {};
  if (!name.trim()) errors.name = '[!] Name is required.';
  if (!email.trim()) {
    errors.email = '[!] Email is required.';
  } else if (!EMAIL_RE.test(email.trim())) {
    errors.email = '[!] Enter a valid email address.';
  }
  if (!message.trim()) errors.message = '[!] Message is required.';
  return errors;
}

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [botcheck, setBotcheck] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit() {
    const errs = validate(name, email, message);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus('loading');
    try {
      const res = await fetch(WEB3FORMS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: import.meta.env.PUBLIC_WEB3FORMS_KEY,
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          botcheck,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        console.error('[ContactForm] Web3Forms rejected submission:', data);
        setStatus('error');
      }
    } catch (err) {
      console.error('[ContactForm] Network error:', err);
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div
        className="rounded-lg border border-[var(--color-border)] overflow-hidden"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        <div className="flex items-center gap-2 px-4 py-3 bg-[var(--color-bg-subtle)] border-b border-[var(--color-border)]">
          <span className="w-3 h-3 rounded-full bg-red-400"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
          <span className="w-3 h-3 rounded-full bg-green-400"></span>
          <span className="ml-3 text-xs text-[var(--color-text-muted)]">
            Zain Altaf Terminal [v1.0] — contact form
          </span>
        </div>
        <div className="p-6 bg-[var(--color-bg)] space-y-3">
          <p className="text-sm text-[var(--color-accent)]">Guest@zain:~$ init-contact</p>
          <p className="text-sm text-green-500">[✓] Message sent. I'll be in touch soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg border border-[var(--color-border)] overflow-hidden"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      {/* Terminal header bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[var(--color-bg-subtle)] border-b border-[var(--color-border)]">
        <span className="w-3 h-3 rounded-full bg-red-400"></span>
        <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
        <span className="w-3 h-3 rounded-full bg-green-400"></span>
        <span className="ml-3 text-xs text-[var(--color-text-muted)]">
          Zain Altaf Terminal [v1.0] — contact form
        </span>
      </div>

      {/* Terminal body */}
      <div className="p-6 bg-[var(--color-bg)] space-y-5">
        {/* Prompt line */}
        <p className="text-sm text-[var(--color-accent)]">
          Guest@zain:~$ init-contact
        </p>

        {/* Name field */}
        <div className="space-y-1">
          <label htmlFor="cf-name" className="block text-xs text-[var(--color-text-muted)]">
            [?] Your name:
          </label>
          <input
            id="cf-name"
            type="text"
            name="name"
            placeholder="Jane Smith"
            value={name}
            onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: undefined })); }}
            disabled={status === 'loading'}
            className="w-full bg-transparent border-b border-[var(--color-border)] focus:border-[var(--color-accent)] outline-none text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] py-1 transition-colors disabled:opacity-50"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* Email field */}
        <div className="space-y-1">
          <label htmlFor="cf-email" className="block text-xs text-[var(--color-text-muted)]">
            [?] Your email:
          </label>
          <input
            id="cf-email"
            type="email"
            name="email"
            placeholder="jane@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: undefined })); }}
            disabled={status === 'loading'}
            className="w-full bg-transparent border-b border-[var(--color-border)] focus:border-[var(--color-accent)] outline-none text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] py-1 transition-colors disabled:opacity-50"
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        {/* Message field */}
        <div className="space-y-1">
          <label htmlFor="cf-message" className="block text-xs text-[var(--color-text-muted)]">
            [?] Message:
          </label>
          <textarea
            id="cf-message"
            name="message"
            rows={4}
            placeholder="Tell me about it..."
            value={message}
            onChange={(e) => { setMessage(e.target.value); if (errors.message) setErrors((p) => ({ ...p, message: undefined })); }}
            disabled={status === 'loading'}
            className="w-full bg-transparent border-b border-[var(--color-border)] focus:border-[var(--color-accent)] outline-none text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] py-1 resize-none transition-colors disabled:opacity-50"
          />
          {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
        </div>

        {/* Honeypot — hidden from real users, catches bots that fill all fields */}
        <input
          type="checkbox"
          name="botcheck"
          checked={botcheck === 'on'}
          onChange={(e) => setBotcheck(e.target.checked ? 'on' : '')}
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Submission error */}
        {status === 'error' && (
          <p className="text-xs text-red-500">[!] Something went wrong. Try again or email dev@zainaltaf.com directly.</p>
        )}

        {/* Send button */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={status === 'loading'}
            className="px-5 py-2.5 rounded text-sm font-semibold bg-[var(--color-accent)] text-[var(--color-bg)] hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Sending...' : 'Send message →'}
          </button>
        </div>
      </div>
    </div>
  );
}
