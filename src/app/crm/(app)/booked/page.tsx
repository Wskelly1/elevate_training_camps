import Link from 'next/link';
import { isCrmConfigured } from '../../../../lib/crm/db';
import { listLeads } from '../../../../lib/crm/leads';
import { checkinState } from '../../../../lib/crm/types';
import NotConfigured from '../NotConfigured';
import { Card, CheckinPill, Empty, Field, SectionHead, StatRow, relativeDays } from '../ui';

export const dynamic = 'force-dynamic';

/**
 * Booked teams — the source CRM's "Licensed retailers", in camp terms.
 *
 * A booked team is not a different object from a lead; it is a lead at
 * `status = 'booked'`. This screen is the reading of that stage that matters
 * operationally: who is coming, how many, when, and when they were last
 * spoken to.
 *
 * Deliberately thin on promises. Gate-5 forbids any screen asserting a safety
 * practice, credential or track record that isn't yet true, and no season has
 * run — so this shows facts about the booking and nothing about delivery.
 */
export default async function BookedPage() {
  if (!isCrmConfigured()) return <NotConfigured />;

  const booked = await listLeads({ status: 'booked', limit: 500 });

  // The revenue floor from the business plan: a ~8-10 athlete minimum on the
  // two-part tariff. Squad sizes are free text off the form, so this counts
  // teams rather than inventing an athlete total from unparsed strings.
  const withSquad = booked.filter((l) => l.squadSize).length;

  return (
    <>
      <SectionHead
        title="Booked teams"
        blurb="Programs that have committed. Prices are never typed here — quotes come from the canonical tariff."
      />

      <StatRow
        stats={[
          { label: 'Booked teams', value: booked.length, tone: 'good' },
          { label: 'Squad size known', value: `${withSquad}/${booked.length}` },
        ]}
      />

      {booked.length === 0 ? (
        <Empty>
          No teams booked yet. Move a lead to <strong>Booked</strong> in{' '}
          <Link href="/crm/pipeline" className="hover:text-[var(--primary)]">
            Pipeline
          </Link>{' '}
          once a deposit is agreed.
        </Empty>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {booked.map((lead) => {
            const name = [lead.firstName, lead.lastName].filter(Boolean).join(' ');
            return (
              <Card key={lead.id}>
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/crm/lead/${lead.id}`}
                    className="font-[family-name:var(--font-display)] text-xl leading-tight text-[var(--primary-deep)] hover:underline"
                  >
                    {lead.organization || name || lead.email}
                  </Link>
                  <CheckinPill state={checkinState(lead.lastCheckinAt)} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Field label="Contact" value={name} />
                  <Field label="Location" value={[lead.city, lead.state].filter(Boolean).join(', ')} />
                  <Field label="Squad size" value={lead.squadSize} />
                  <Field label="Preferred weeks" value={lead.preferredWeeks} />
                  <Field
                    label="Phone"
                    value={
                      lead.phone ? (
                        <a href={`tel:${lead.phone}`} className="hover:text-[var(--primary)]">
                          {lead.phone}
                        </a>
                      ) : null
                    }
                  />
                  <Field label="Last touch" value={relativeDays(lead.lastContactedAt)} />
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
        Onboarding (deposit, waivers, roster with graduation years, rooming) and the coach packet
        are Phase 9.5 — see <code>docs/12-crm-plan.md</code> §8.
      </p>
    </>
  );
}
