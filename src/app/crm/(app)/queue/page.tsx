import Link from 'next/link';
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
 * The source CRM split by rep and store type (William/run, JCrow/bike). Here
 * it splits by owner alone: the segments are already a filter on the Leads
 * tab, and a second axis on a list this size just hides leads.
 */

const VIEWS = [
  { key: 'will', label: 'Will' },
  { key: 'cofounder', label: 'Co-founder' },
  { key: '', label: 'Unassigned' },
  { key: 'all', label: 'Everyone' },
];

export default async function QueuePage({
  searchParams,
}: {
  searchParams: Promise<{ owner?: string }>;
}) {
  if (!isCrmConfigured()) return <NotConfigured />;

  const { owner } = await searchParams;
  const view = owner ?? 'will';

  const [leads, everyone] = await Promise.all([
    listLeads({ owner: view, limit: 1000 }),
    listLeads({ limit: 2000 }),
  ]);

  const counts = {
    will: everyone.filter((l) => l.owner === 'will').length,
    cofounder: everyone.filter((l) => l.owner === 'cofounder').length,
    unassigned: everyone.filter((l) => !l.owner).length,
  };

  const active = leads.filter((l) => l.status !== 'no_interest');

  return (
    <>
      <SectionHead
        title="My Queue"
        blurb="Leads assigned to you. Assign from any lead card so the two of you never work the same name."
      />

      <div className="mb-6 flex flex-wrap gap-1.5">
        {VIEWS.map((v) => (
          <Link
            key={v.key}
            href={`/crm/queue?owner=${v.key}`}
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
          { label: 'Will', value: counts.will },
          { label: 'Co-founder', value: counts.cofounder },
          { label: 'Unassigned', value: counts.unassigned, tone: counts.unassigned ? 'warn' : 'default' },
        ]}
      />

      {leads.length === 0 ? (
        <Empty>
          Nothing assigned here yet. Use the owner dropdown on any lead card to fill this queue.
        </Empty>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      )}
    </>
  );
}
