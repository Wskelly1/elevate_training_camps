import Link from 'next/link';
import { notFound } from 'next/navigation';
import { crmOperators, operatorName } from '../../../../../auth.config';
import { isCrmConfigured } from '../../../../../lib/crm/db';
import { getLead, listNotes, listTouches } from '../../../../../lib/crm/leads';
import { SEGMENT_LABELS, SOURCE_LABELS, checkinState } from '../../../../../lib/crm/types';
import NotConfigured from '../../NotConfigured';
import NoteThread from '../../NoteThread';
import LeadDetailActions from './LeadDetailActions';
import { Card, CheckinPill, Field, StatusPill, formatDate, formatDateTime, relativeDays } from '../../ui';

export const dynamic = 'force-dynamic';

/**
 * One lead in full: every field, the note thread, and the activity log.
 *
 * Notes and touches are deliberately shown side by side. Notes are what a
 * person wrote; touches are what happened. Conflating them is how a CRM ends
 * up with an unreadable feed where a status change and a considered remark
 * carry the same weight.
 */
export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  if (!isCrmConfigured()) return <NotConfigured />;

  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) notFound();

  const [notes, touches] = await Promise.all([listNotes(id), listTouches(id)]);

  const name = [lead.firstName, lead.lastName].filter(Boolean).join(' ');

  return (
    <>
      <Link
        href="/crm"
        className="mb-4 inline-block text-xs uppercase tracking-[0.12em] text-muted-foreground hover:text-[var(--primary)]"
      >
        ← All leads
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--primary-deep)]">
            {lead.organization || name || lead.email}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusPill status={lead.status} />
            <span className="rounded border border-border px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.08em] text-muted-foreground">
              {SEGMENT_LABELS[lead.segment]}
            </span>
            {lead.status === 'booked' && <CheckinPill state={checkinState(lead.lastCheckinAt)} />}
            {lead.newsletterSubscribed && (
              <span className="rounded border border-[var(--primary)]/40 px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.08em] text-[var(--primary)]">
                Newsletter
              </span>
            )}
          </div>
        </div>

        <LeadDetailActions lead={lead} operators={crmOperators()} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="space-y-6">
          <Card>
            <h2 className="mb-4 font-[family-name:var(--font-display)] text-lg text-foreground">
              Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Name" value={name} />
              <Field
                label="Email"
                value={
                  lead.email ? (
                    <a href={`mailto:${lead.email}`} className="hover:text-[var(--primary)]">
                      {lead.email}
                    </a>
                  ) : null
                }
              />
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
              <Field label="Location" value={[lead.city, lead.state].filter(Boolean).join(', ')} />
              <Field label="Program / org" value={lead.organization} />
              <Field label="Website" value={lead.website} />

              {/* Segment-specific, so a coach card doesn't show athlete fields. */}
              <Field label="Squad size" value={lead.squadSize} />
              <Field label="Preferred weeks" value={lead.preferredWeeks} />
              <Field label="Graduation year" value={lead.gradYear} />
              <Field label="Interested in" value={lead.interest} />
              <Field label="Affiliation" value={lead.affiliation} />
              <Field label="Connection type" value={lead.connectionType} />
              <Field label="Business type" value={lead.businessType} />
              <Field label="Subject" value={lead.subject} />
              <Field label="School" value={lead.school} />
              <Field label="College destination" value={lead.collegeDestination} />
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 font-[family-name:var(--font-display)] text-lg text-foreground">
              Record
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Source" value={SOURCE_LABELS[lead.source]} />
              <Field
                label="Owner"
                value={lead.owner ? operatorName(lead.owner) : 'Unassigned'}
              />
              <Field label="First seen" value={formatDate(lead.createdAt)} />
              <Field
                label="Last contacted"
                value={lead.lastContactedAt ? relativeDays(lead.lastContactedAt) : 'never'}
              />
              <Field label="Callback" value={formatDateTime(lead.callbackAt)} />
              <Field
                label="Last check-in"
                value={lead.lastCheckinAt ? relativeDays(lead.lastCheckinAt) : 'never'}
              />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <NoteThread leadId={lead.id} notes={notes} />

          <Card>
            <h2 className="mb-4 font-[family-name:var(--font-display)] text-lg text-foreground">
              Activity
            </h2>
            {touches.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing recorded yet.</p>
            ) : (
              <ol className="space-y-3">
                {touches.map((t) => (
                  <li key={t.id} className="border-l-2 border-border pl-3">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-xs uppercase tracking-[0.1em] text-[var(--accent-trail)]">
                        {t.kind.replace(/_/g, ' ')}
                      </span>
                      {t.outcome && (
                        <span className="text-xs text-muted-foreground">— {t.outcome}</span>
                      )}
                      <span className="ml-auto font-[family-name:var(--font-geist-mono)] text-[0.65rem] text-muted-foreground">
                        {formatDateTime(t.createdAt)}
                      </span>
                    </div>
                    {t.detail && (
                      <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                        {t.detail}
                      </p>
                    )}
                    <div className="mt-0.5 text-[0.65rem] text-muted-foreground">{t.actor}</div>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
