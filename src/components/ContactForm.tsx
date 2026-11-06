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
        className="rounded-[10px] border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden"
        style={{ fontFamily: "'JetBrains Mono', monospace", boxShadow: 'var(--shadow-lg)' }}
      >
        <div
          className="flex items-center gap-2 px-4 py-3 border-b border-white/10"
          style={{
            background: 'linear-gradient(135deg, #1e1e2e 0%, #2d2b55 50%, #4f46e5 100%)',
          }}
        >
          <span className="w-3 h-3 rounded-full bg-[#e11d48]"></span>
          <span className="w-3 h-3 rounded-full bg-[#d97706]"></span>
          <span className="w-3 h-3 rounded-full bg-[#10b981]"></span>
          <span className="ml-3 text-xs text-white/80 font-medium">
            Zain Altaf Terminal [v1.0] — contact form
          </span>
        </div>
        <div className="p-6 bg-[var(--bg-card)] space-y-3">
          <p className="text-sm font-semibold text-[var(--primary)]">Guest@zain:~$ init-contact</p>
          <div
            className="rounded-[6px] px-3.5 py-2.5 text-[13px] font-medium"
            style={{
              background: 'var(--health-green-bg)',
              color: 'var(--health-green)',
              border: '1px solid var(--health-green-border)',
            }}
          >
            [✓] Message sent. I'll be in touch soon.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-[10px] border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden"
      style={{ fontFamily: "'JetBrains Mono', monospace", boxShadow: 'var(--shadow-lg)' }}
    >
      {/* Terminal header bar (Template 4.3 Top Bar gradient) */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b border-white/10"
        style={{
          background: 'linear-gradient(135deg, #1e1e2e 0%, #2d2b55 50%, #4f46e5 100%)',
        }}
      >
        <span className="w-3 h-3 rounded-full bg-[#e11d48]"></span>
        <span className="w-3 h-3 rounded-full bg-[#d97706]"></span>
        <span className="w-3 h-3 rounded-full bg-[#10b981]"></span>
        <span className="ml-3 text-xs text-white/80 font-medium">
          Zain Altaf Terminal [v1.0] — contact form
        </span>
      </div>

      {/* Terminal body (Template 5.6 Forms & Inputs) */}
      <div className="p-6 bg-[var(--bg-card)] space-y-5">
        {/* Prompt line */}
        <p className="text-sm font-semibold text-[var(--primary)]">
          Guest@zain:~$ init-contact
        </p>

        {/* Name field */}
        <div className="space-y-1.5">
          <label htmlFor="cf-name" className="block text-[12px] font-semibold text-[var(--text-primary)]">
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
            className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[6px] px-3 py-2 focus:border-[var(--primary)] focus:bg-[var(--bg-secondary)] outline-none text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-all duration-150 disabled:opacity-50"
          />
          {errors.name && <p className="text-xs text-[var(--health-red)] mt-1">{errors.name}</p>}
        </div>

        {/* Email field */}
        <div className="space-y-1.5">
          <label htmlFor="cf-email" className="block text-[12px] font-semibold text-[var(--text-primary)]">
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
            className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[6px] px-3 py-2 focus:border-[var(--primary)] focus:bg-[var(--bg-secondary)] outline-none text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-all duration-150 disabled:opacity-50"
          />
          {errors.email && <p className="text-xs text-[var(--health-red)] mt-1">{errors.email}</p>}
        </div>

        {/* Message field */}
        <div className="space-y-1.5">
          <label htmlFor="cf-message" className="block text-[12px] font-semibold text-[var(--text-primary)]">
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
            className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[6px] px-3 py-2 focus:border-[var(--primary)] focus:bg-[var(--bg-secondary)] outline-none text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none transition-all duration-150 disabled:opacity-50"
          />
          {errors.message && <p className="text-xs text-[var(--health-red)] mt-1">{errors.message}</p>}
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

        {/* Submission error (Template 5.8 .flash-error) */}
        {status === 'error' && (
          <div
            className="rounded-[6px] px-3.5 py-2.5 text-xs font-medium"
            style={{
              background: 'var(--health-red-bg)',
              color: 'var(--health-red)',
              border: '1px solid var(--health-red-border)',
            }}
          >
            [!] Something went wrong. Try again or email dev@zainaltaf.com directly.
          </div>
        )}

        {/* Send button (Template 5.1 .btn-primary) */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={status === 'loading'}
            className="px-5 py-2.5 rounded-[6px] text-[13px] font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] hover:-translate-y-px transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            style={{ boxShadow: 'var(--shadow-sm)' }}
          >
            {status === 'loading' ? 'Sending...' : 'Send message →'}
          </button>
        </div>
      </div>
    </div>
  );
}
