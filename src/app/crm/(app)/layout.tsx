import Link from 'next/link';
import { redirect } from 'next/navigation';
import { currentOperator, signOut } from '../../../auth';
import CrmTabs from './CrmTabs';

/**
 * The authenticated CRM shell.
 *
 * Sits inside the `(app)` route group so `/crm/signin` — which is outside it —
 * does not inherit the auth check below. A signin page that redirects
 * unauthenticated visitors to itself is an infinite loop.
 *
 * Deliberately does NOT import the site `Layout`: no marketing nav, no footer,
 * no newsletter form. This is a tool, not a page.
 *
 * Metadata (including the no-index rule) is inherited from the parent
 * `crm/layout.tsx`, so every CRM route gets it whether or not it goes through
 * this shell.
 */

/** Never cache a page built from lead data. */
export const dynamic = 'force-dynamic';

export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  const operator = await currentOperator();

  // Middleware normally catches this first; the check is repeated because a
  // layout must not depend on middleware having run to keep records safe.
  if (!operator) redirect('/crm/signin');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-6 gap-y-2 px-6 py-3">
          <Link href="/crm" className="flex items-baseline gap-3">
            <span className="font-[family-name:var(--font-display)] text-2xl leading-none text-[var(--primary-deep)]">
              Elevate
            </span>
            <span className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
              CRM
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-4">
            <span className="hidden font-[family-name:var(--font-geist-mono)] text-xs text-muted-foreground sm:inline">
              {operator}
            </span>
            <form
              action={async () => {
                'use server';
                await signOut({ redirectTo: '/crm/signin' });
              }}
            >
              <button
                type="submit"
                className="rounded border border-border px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>

        <CrmTabs />
      </header>

      <main className="mx-auto max-w-[1600px] px-6 py-8">{children}</main>
    </div>
  );
}
