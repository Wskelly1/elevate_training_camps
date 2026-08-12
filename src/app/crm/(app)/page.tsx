import { isCrmConfigured } from '../../../lib/crm/db';
import { leadCounts, listLeads, listStates } from '../../../lib/crm/leads';
import type { LeadSegment, LeadStatus } from '../../../lib/crm/types';
import { SEGMENT_LABELS, STATUS_LABELS, STATUS_ORDER } from '../../../lib/crm/types';
import LeadCard from './LeadCard';
import LeadFilters from './LeadFilters';
import { Empty, SectionHead, StatRow } from './ui';
import NotConfigured from './NotConfigured';

/**
 * Leads — the database, and the default view.
 *
 * Filters live in the URL rather than component state so a filtered list is
 * a link: "every unassigned Arizona coach" can be bookmarked or pasted to
 * the co-founder.
 */

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; segment?: string; status?: string; state?: string }>;
}) {
  if (!isCrmConfigured()) return <NotConfigured />;

  const params = await searchParams;
  const [leads, counts, states] = await Promise.all([
    listLeads({
      search: params.q,
      segment: (params.segment as LeadSegment) || 'all',
      status: (params.status as LeadStatus) || 'all',
      state: params.state || 'all',
    }),
    leadCounts(),
    listStates(),
  ]);

  return (
    <>
      <SectionHead
        title="Leads"
        blurb="Every coach, athlete, family and partner who has reached the site or been added by hand. Contact-form submissions land here automatically."
      />

      <StatRow
        stats={[
          { label: 'Total', value: counts.total },
          { label: 'New', value: counts.byStatus.new },
          { label: 'Interested', value: counts.byStatus.interested, tone: 'good' },
          { label: 'Booked', value: counts.byStatus.booked, tone: 'good' },
          { label: 'Callbacks', value: counts.callbacks, tone: 'warn' },
          { label: 'Unassigned', value: counts.unassigned },
        ]}
      />

      <LeadFilters
        states={states}
        segments={Object.entries(SEGMENT_LABELS).map(([value, label]) => ({ value, label }))}
        statuses={STATUS_ORDER.map((s) => ({ value: s, label: STATUS_LABELS[s] }))}
      />

      {leads.length === 0 ? (
        <Empty>
          {counts.total === 0
            ? 'No leads yet. The next contact-form submission will appear here automatically.'
            : 'No leads match those filters.'}
        </Empty>
      ) : (
        <>
          <div className="mb-3 text-xs text-muted-foreground">
            Showing {leads.length} of {counts.total}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {leads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
