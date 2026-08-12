import Link from 'next/link';
import { crmOperators } from '../../../../auth.config';
import { currentOperator } from '../../../../auth';
import { isCrmConfigured } from '../../../../lib/crm/db';
import { listLeads } from '../../../../lib/crm/leads';
import LeadCard from '../LeadCard';
import NotConfigured from '../NotConfigured';
import { Empty, SectionHead, StatRow } from '../ui';

export const dynamic = 'force-dynamic';

/**
 * My Queue — leads split by owner, so two people can work one list without
 * calling the same coach twice.
 *
 * The owner list is derived from `CRM_ALLOWED_EMAILS`, not hardcoded: whoever
 * can sign in is whoever can be assigned. The source CRM hardcoded its two
 * reps (William/run, JCrow/bike), which is exactly the sort of list that goes
 * stale the first time the team changes.
 *
 * Defaults to *your* queue — the signed-in operator — rather than a fixed
 * person, so the tab means the same thing to everyone.
 */
export default async function QueuePage({
  searchParams,
}: {
  searchParams: Promise<{ owner?: string }>;
}) {
  if (!isCrmConfigured()) return <NotConfigured />;

  const { owner } = await searchParams;
  const operators = crmOperators();
  const me = await currentOperator();

  // '' is a real value (unassigned), so distinguish "not supplied" from "empty".
  const view = owner ?? me ?? 'all';

  const [leads, everyone] = await Promise.all([
    listLeads({ owner: view, limit: 1000 }),
    listLeads({ limit: 2000 }),
  ]);

  const views = [
    ...operators.map((o) => ({
      key: o.email,
      label: o.email === me ? `${o.name} (you)` : o.name,
    })),
    { key: '', label: 'Unassigned' },
    { key: 'all', label: 'Everyone' },
  ];

  const active = leads.filter((l) => l.status !== 'no_interest');
  const unassigned = everyone.filter((l) => !l.owner).length;

  return (
    <>
      <SectionHead
        title="My Queue"
        blurb="Leads assigned to you. Assign from any lead card so the two of you never work the same name."
      />

      <div className="mb-6 flex flex-wrap gap-1.5">
        {views.map((v) => (
          <Link
            key={v.key || 'unassigned'}
            href={`/crm/queue?owner=${encodeURIComponent(v.key)}`}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              view === v.key
                ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary-deep)]'
                : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
            }`}
          >
            {v.label}
          </Link>
        ))}
      </div>

      <StatRow
        stats={[
          { label: 'In this view', value: leads.length },
          { label: 'Still active', value: active.length, tone: 'good' },
          ...operators.map((o) => ({
            label: o.name,
            value: everyone.filter((l) => l.owner === o.email).length,
          })),
          { label: 'Unassigned', value: unassigned, tone: unassigned ? ('warn' as const) : undefined },
        ]}
      />

      {leads.length === 0 ? (
        <Empty>
          Nothing assigned here yet. Use the owner dropdown on any lead card to fill this queue —
          the names come from whoever can sign in.
        </Empty>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} operators={operators} />
          ))}
        </div>
      )}
    </>
  );
}
