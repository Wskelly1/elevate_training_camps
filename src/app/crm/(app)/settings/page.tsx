import { allowedEmails } from '../../../../auth.config';
import { isCrmConfigured } from '../../../../lib/crm/db';
import { leadCounts } from '../../../../lib/crm/leads';
import AddLeadForm from './AddLeadForm';
import NotConfigured from '../NotConfigured';
import { Card, SectionHead } from '../ui';

export const dynamic = 'force-dynamic';

/**
 * Settings — backup, manual entry, and who can get in.
 *
 * The access list is shown read-only on purpose. It lives in the
 * `CRM_ALLOWED_EMAILS` environment variable, so granting access requires a
 * deploy — which is the point: it cannot be changed by anyone who merely has
 * a session, including someone using a stolen one.
 */
export default async function SettingsPage() {
  if (!isCrmConfigured()) return <NotConfigured />;

  const counts = await leadCounts();
  const allowed = allowedEmails();

  return (
    <>
      <SectionHead title="Settings" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-[family-name:var(--font-display)] text-lg text-foreground">Backup</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Downloads every lead, note and activity entry as JSON — the same escape hatch the
            original tool had, so the data is never trapped in here.
          </p>
          <a
            href="/api/crm/export"
            download
            className="mt-4 inline-block rounded bg-[var(--primary)] px-4 py-2 text-sm text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary-hover)]"
          >
            Export all data
          </a>
          <p className="mt-3 text-xs text-muted-foreground">
            {counts.total} {counts.total === 1 ? 'lead' : 'leads'} currently stored.
          </p>
        </Card>

        <Card>
          <h2 className="font-[family-name:var(--font-display)] text-lg text-foreground">Access</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Sign-in is Google Workspace SSO, so no password is stored anywhere in this app. These
            accounts can open the CRM:
          </p>
          <ul className="mt-3 space-y-1">
            {allowed.map((email) => (
              <li
                key={email}
                className="font-[family-name:var(--font-geist-mono)] text-xs text-foreground"
              >
                {email}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            To add or remove someone, change <code>CRM_ALLOWED_EMAILS</code> in Vercel and redeploy.
            Removing an address takes effect on their next request, not at session expiry.
          </p>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="font-[family-name:var(--font-display)] text-lg text-foreground">
            Add a lead by hand
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            For coaches you meet rather than ones who fill in the form. If the email already exists,
            this fills in the blanks on that lead instead of creating a duplicate.
          </p>
          <AddLeadForm />
        </Card>
      </div>

      <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
        Paste-import and the printable pipeline report are Phase 9.6 — see{' '}
        <code>docs/12-crm-plan.md</code> §8.
      </p>
    </>
  );
}
