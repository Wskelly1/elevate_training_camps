import { isCrmConfigured } from '../../../../lib/crm/db';
import { leadCounts, listLeads } from '../../../../lib/crm/leads';
import { STATUS_LABELS, STATUS_ORDER } from '../../../../lib/crm/types';
import type { LeadStatus } from '../../../../lib/crm/types';
import NotConfigured from '../NotConfigured';
import PipelineTable from './PipelineTable';
import { Empty, SectionHead } from '../ui';

export const dynamic = 'force-dynamic';

/**
 * The whole funnel in one table — the source CRM's Outreach tab.
 *
 * This is the screen the marketing plan's numbers are read off: 120 coaches
 * contacted, converging on 3–4 founding teams. The conversion line under the
 * filters states that ratio explicitly, because a funnel you have to compute
 * by hand is a funnel nobody checks.
 */
export default async function PipelinePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  if (!isCrmConfigured()) return <NotConfigured />;

  const { status } = await searchParams;
  const [leads, counts] = await Promise.all([
    listLeads({ status: (status as LeadStatus) || 'all', limit: 2000 }),
    leadCounts(),
  ]);

  const worked = counts.total - counts.byStatus.new;
  const rate = worked > 0 ? Math.round((counts.byStatus.booked / worked) * 100) : 0;

  return (
    <>
      <SectionHead
        title="Pipeline"
        blurb="Every lead and where it sits. Change a status here and it moves everywhere else."
      />

      <div className="mb-4 flex flex-wrap gap-1.5">
        <FilterChip href="/crm/pipeline" label={`All (${counts.total})`} active={!status} />
        {STATUS_ORDER.map((s) => (
          <FilterChip
            key={s}
            href={`/crm/pipeline?status=${s}`}
            label={`${STATUS_LABELS[s]} (${counts.byStatus[s]})`}
            active={status === s}
          />
        ))}
      </div>

      {counts.total > 0 && (
        <p className="mb-6 text-xs text-muted-foreground">
          {counts.byStatus.booked} booked from {worked} worked ({rate}%). The marketing plan targets
          3–4 founding teams from ~120 coaches.
        </p>
      )}

      {leads.length === 0 ? (
        <Empty>No leads in this stage.</Empty>
      ) : (
        <PipelineTable leads={leads} />
      )}
    </>
  );
}

function FilterChip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <a
      href={href}
      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
        active
          ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary-deep)]'
          : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
      }`}
    >
      {label}
    </a>
  );
}
