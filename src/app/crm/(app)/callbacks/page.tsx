import Link from 'next/link';
import { isCrmConfigured } from '../../../../lib/crm/db';
import { listLeads } from '../../../../lib/crm/leads';
import NotConfigured from '../NotConfigured';
import CallbackRow from './CallbackRow';
import { Empty, SectionHead, StatRow } from '../ui';

export const dynamic = 'force-dynamic';

/** Scheduled callbacks, soonest first, with overdue ones called out. */
export default async function CallbacksPage() {
  if (!isCrmConfigured()) return <NotConfigured />;

  const leads = (await listLeads({ callbacksOnly: true, limit: 500 })).sort((a, b) =>
    (a.callbackAt ?? '').localeCompare(b.callbackAt ?? ''),
  );

  const now = Date.now();
  const overdue = leads.filter((l) => new Date(l.callbackAt!).getTime() < now);
  const upcoming = leads.filter((l) => new Date(l.callbackAt!).getTime() >= now);

  return (
    <>
      <SectionHead
        title="Callbacks"
        blurb="Everyone who asked to be called back, and when. Marking a disposition clears the callback automatically."
      />

      <StatRow
        stats={[
          { label: 'Overdue', value: overdue.length, tone: overdue.length ? 'bad' : 'default' },
          { label: 'Upcoming', value: upcoming.length },
        ]}
      />

      {leads.length === 0 ? (
        <Empty>
          No callbacks scheduled. Hit <strong>Call back</strong> in Call Mode, or set a date on a
          lead, and it appears here.
        </Empty>
      ) : (
        <div className="space-y-6">
          {overdue.length > 0 && (
            <section>
              <h2 className="mb-3 text-[0.7rem] uppercase tracking-[0.18em] text-[var(--destructive)]">
                Overdue
              </h2>
              <div className="space-y-2">
                {overdue.map((l) => (
                  <CallbackRow key={l.id} lead={l} overdue />
                ))}
              </div>
            </section>
          )}

          {upcoming.length > 0 && (
            <section>
              <h2 className="mb-3 text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                Upcoming
              </h2>
              <div className="space-y-2">
                {upcoming.map((l) => (
                  <CallbackRow key={l.id} lead={l} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <p className="mt-8 text-xs text-muted-foreground">
        Working a queue instead? <Link href="/crm/call" className="hover:text-[var(--primary)]">Call Mode →</Link>
      </p>
    </>
  );
}
