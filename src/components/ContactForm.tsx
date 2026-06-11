export default function ContactForm() {
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
            className="w-full bg-transparent border-b border-[var(--color-border)] focus:border-[var(--color-accent)] outline-none text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] py-1 transition-colors"
          />
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
            className="w-full bg-transparent border-b border-[var(--color-border)] focus:border-[var(--color-accent)] outline-none text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] py-1 transition-colors"
          />
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
            className="w-full bg-transparent border-b border-[var(--color-border)] focus:border-[var(--color-accent)] outline-none text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] py-1 resize-none transition-colors"
          />
        </div>

        {/* Send button */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            className="px-5 py-2.5 rounded text-sm font-semibold bg-[var(--color-accent)] text-[var(--color-bg)] hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            Send message →
          </button>
        </div>
      </div>
    </div>
  );
}
