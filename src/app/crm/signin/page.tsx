import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { currentOperator, signIn } from '../../../auth';

export const metadata: Metadata = {
  title: 'Sign in — Elevate CRM',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

/**
 * The CRM sign-in page.
 *
 * No password field, by design (decision D5): sign-in is Google Workspace
 * SSO, so this app stores no credential and inherits the 2-Step Verification
 * already on the Workspace account.
 *
 * The error copy stays deliberately vague — "not authorised" rather than
 * "that address isn't on the list" — so this page cannot be used to probe
 * which addresses have access.
 */
export default async function CrmSignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await currentOperator()) redirect('/crm');

  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="font-[family-name:var(--font-display)] text-4xl text-[var(--primary-deep)]">
            Elevate
          </div>
          <div className="mt-1 text-[0.7rem] uppercase tracking-[0.25em] text-muted-foreground">
            Camps CRM
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-8">
          <h1 className="font-[family-name:var(--font-display)] text-xl text-foreground">
            Sign in
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            This tool holds contact details for coaches, athletes and families.
            Access is limited to named Elevate accounts.
          </p>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded border border-[var(--destructive)]/40 bg-[var(--destructive)]/5 px-3 py-2 text-sm text-[var(--destructive)]"
            >
              That account is not authorised for the CRM.
            </p>
          )}

          <form
            action={async () => {
              'use server';
              await signIn('google', { redirectTo: '/crm' });
            }}
          >
            <button
              type="submit"
              className="mt-6 flex w-full items-center justify-center gap-3 rounded border border-border bg-background px-4 py-3 text-sm text-foreground transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary)]/5"
            >
              <GoogleMark />
              Continue with Google
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
          Sessions last 12 hours. Every sign-in is logged.
        </p>
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.46 14.97.5 12 .5a11 11 0 0 0-9.82 6.05l3.66 2.84c.87-2.6 3.3-4.64 6.16-4.64Z"
      />
    </svg>
  );
}
