import Link from 'next/link';
import { isCrmConfigured } from '../../../../lib/crm/db';
import { listLeads } from '../../../../lib/crm/leads';
import { CHECKIN_INTERVAL_DAYS, checkinState } from '../../../../lib/crm/types';
import type { CheckinState } from '../../../../lib/crm/types';
import CheckinRow from './CheckinRow';
import NotConfigured from '../NotConfigured';
import { Empty, SectionHead, StatRow } from '../ui';

export const dynamic = 'force-dynamic';

/**
 * The 30-day check-in clock, applied to booked teams and interested coaches.
 *
 * Straight from the source CRM, where it was the mechanism that kept
 * relationships alive without anyone having to remember them. Scoped to
 * booked and interested leads: a cold prospect belongs in Call Mode, not on a
 * maintenance cadence.
 */
export default async function CheckinsPage() {
  if (!isCrmConfigured()) return <NotConfigured />;

  const all = await listLeads({ limit: 2000 });
  const tracked = all.filter((l) => l.status === 'booked' || l.status === 'interested');

  const withState = tracked
    .map((lead) => ({ lead, state: checkinState(lead.lastCheckinAt) }))
    .sort((a, b) => {
      const rank: Record<CheckinState, number> = { overdue: 0, never: 1, due_soon: 2, current: 3 };
      return rank[a.state] - rank[b.state];
    });

  const count = (s: CheckinState) => withState.filter((x) => x.state === s).length;
  const needsAttention = count('overdue') + count('never');

  return (
    <>
      <SectionHead
        title="Check-ins"
        blurb={`Booked teams and interested coaches on a ${CHECKIN_INTERVAL_DAYS}-day cadence. Marking one done resets its clock.`}
      />

      <StatRow
        stats={[
          { label: 'Overdue', value: count('overdue'), tone: count('overdue') ? 'bad' : 'default' },
          { label: 'Never', value: count('never') },
          { label: 'Due soon', value: count('due_soon'), tone: 'warn' },
          { label: 'Current', value: count('current'), tone: 'good' },
        ]}
      />

      {withState.length === 0 ? (
        <Empty>
          Nothing on the check-in clock yet. Leads appear here once they are marked{' '}
          <strong>Interested</strong> or <strong>Booked</strong> — see{' '}
          <Link href="/crm/pipeline" className="hover:text-[var(--primary)]">
            Pipeline
          </Link>
          .
        </Empty>
      ) : (
        <>
          {needsAttention > 0 && (
            <p className="mb-4 text-sm text-muted-foreground">
              {needsAttention} {needsAttention === 1 ? 'team needs' : 'teams need'} a touch.
            </p>
          )}
          <div className="space-y-2">
            {withState.map(({ lead, state }) => (
              <CheckinRow key={lead.id} lead={lead} state={state} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
