/**
 * Shown when `DATABASE_URL` is missing.
 *
 * Every CRM screen renders this rather than throwing, so an unconfigured
 * deploy produces instructions instead of a stack trace — and, more
 * importantly, so the rest of the site is never taken down by the CRM being
 * half-installed.
 */
export default function NotConfigured() {
  return (
    <div className="mx-auto max-w-xl rounded-lg border border-[var(--accent-rock)]/40 bg-[var(--accent-rock)]/5 p-8">
      <h1 className="font-[family-name:var(--font-display)] text-2xl text-[var(--primary-deep)]">
        The CRM has no database yet
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        <code className="rounded bg-background px-1.5 py-0.5 text-xs">DATABASE_URL</code> is not
        set, so there is nowhere to read leads from. Everything else on the site is unaffected —
        the contact form still emails you, it just isn&rsquo;t filing anything.
      </p>
      <ol className="mt-5 space-y-3 text-sm text-foreground">
        <li>
          <span className="text-muted-foreground">1.</span> Provision the database:
          <pre className="mt-1 overflow-x-auto rounded border border-border bg-background px-3 py-2 font-[family-name:var(--font-geist-mono)] text-xs">
            npx vercel integration add neon
          </pre>
        </li>
        <li>
          <span className="text-muted-foreground">2.</span> Pull the variable it created:
          <pre className="mt-1 overflow-x-auto rounded border border-border bg-background px-3 py-2 font-[family-name:var(--font-geist-mono)] text-xs">
            npx vercel env pull .env.local
          </pre>
        </li>
        <li>
          <span className="text-muted-foreground">3.</span> Create the tables:
          <pre className="mt-1 overflow-x-auto rounded border border-border bg-background px-3 py-2 font-[family-name:var(--font-geist-mono)] text-xs">
            npm run crm:migrate
          </pre>
        </li>
      </ol>
      <p className="mt-5 text-xs text-muted-foreground">
        Full runbook: <code>docs/13-crm-setup.md</code>
      </p>
    </div>
  );
}
