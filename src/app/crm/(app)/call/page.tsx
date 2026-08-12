import { isCrmConfigured } from '../../../../lib/crm/db';
import { listLeads } from '../../../../lib/crm/leads';
import CallMode from './CallMode';
import NotConfigured from '../NotConfigured';
import { Empty, SectionHead } from '../ui';

export const dynamic = 'force-dynamic';

/**
 * Call Mode — one lead at a time, with disposition buttons.
 *
 * The most valuable screen in the tool. It is what O-10 (call 8–10 target
 * coaches — the top unblock on the whole roadmap) gets worked through in, and
 * then the marketing plan's 120-coach funnel.
 *
 * The queue is coaches and organisers who have not been ruled out, oldest
 * contact first, so the list drains rather than cycling over the same few
 * names. Leads with a scheduled callback are excluded — those belong to the
 * Callbacks screen on their own date.
 */
export default async function CallModePage() {
  if (!isCrmConfigured()) return <NotConfigured />;

  const all = await listLeads({ limit: 2000 });

  const queue = all
    .filter((l) => l.status !== 'no_interest' && l.status !== 'booked')
    .filter((l) => !l.callbackAt)
    .sort((a, b) => {
      // Never contacted first, then longest since contact.
      if (!a.lastContactedAt && b.lastContactedAt) return -1;
      if (a.lastContactedAt && !b.lastContactedAt) return 1;
      if (!a.lastContactedAt && !b.lastContactedAt) {
        return a.createdAt.localeCompare(b.createdAt);
      }
      return a.lastContactedAt!.localeCompare(b.lastContactedAt!);
    });

  return (
    <>
      <SectionHead
        title="Call Mode"
        blurb="Work the queue one at a time. Every disposition is logged against the lead, so the funnel numbers come out of what actually happened."
      />

      {queue.length === 0 ? (
        <Empty>
          Nothing to call. Leads appear here once they exist and aren&rsquo;t booked, ruled out, or
          waiting on a scheduled callback.
        </Empty>
      ) : (
        <CallMode queue={queue} />
      )}
    </>
  );
}
