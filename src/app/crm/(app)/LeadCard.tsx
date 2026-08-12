'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import type { Lead, LeadStatus } from '../../../lib/crm/types';
import { STATUS_LABELS, STATUS_ORDER, SEGMENT_LABELS } from '../../../lib/crm/types';
import type { Operator } from '../../../auth.config';
import { actionSaveField, actionSetStatus } from './actions';
import OwnerSelect from './OwnerSelect';

/**
 * One lead, with the actions worth doing without leaving the list.
 *
 * The source CRM's best trait was that a phone number could be typed straight
 * into the card mid-call, with no modal and no save button to hunt for. That
 * is preserved: blur commits, and `saving` shows only while the write is in
 * flight.
 */

export default function LeadCard({
  lead,
  operators,
}: {
  lead: Lead;
  operators: Operator[];
}) {
  const [pending, startTransition] = useTransition();

  const name = [lead.firstName, lead.lastName].filter(Boolean).join(' ');
  const title = lead.organization || name || lead.email;
  const subtitle = lead.organization && name ? name : '';

  return (
    <div
      className={`rounded-lg border border-border bg-surface p-4 transition-opacity ${
        pending ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={`/crm/lead/${lead.id}`}
            className="block truncate font-[family-name:var(--font-display)] text-lg leading-tight text-[var(--primary-deep)] hover:underline"
          >
            {title}
          </Link>
          <div className="mt-0.5 truncate text-xs text-muted-foreground">
            {[subtitle, [lead.city, lead.state].filter(Boolean).join(', ')]
              .filter(Boolean)
              .join(' · ') || ' '}
          </div>
        </div>
        <span className="shrink-0 rounded border border-border px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.08em] text-muted-foreground">
          {SEGMENT_LABELS[lead.segment]}
        </span>
      </div>

      <div className="mt-3 space-y-1.5">
        <InlineField
          leadId={lead.id}
          field="phone"
          value={lead.phone}
          placeholder="Add phone…"
          type="tel"
        />
        <InlineField
          leadId={lead.id}
          field="email"
          value={lead.email}
          placeholder="Add email…"
          type="email"
        />
      </div>

      {/* The coach path's booking inputs, surfaced where they matter. */}
      {lead.segment === 'coach' && (lead.squadSize || lead.preferredWeeks) && (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {lead.squadSize && <span>Squad: {lead.squadSize}</span>}
          {lead.preferredWeeks && <span>Weeks: {lead.preferredWeeks}</span>}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <select
          aria-label="Status"
          value={lead.status}
          disabled={pending}
          onChange={(e) =>
            startTransition(() => {
              void actionSetStatus(lead.id, e.target.value as LeadStatus);
            })
          }
          className="rounded border border-border bg-background px-2 py-1 text-xs text-foreground"
        >
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>

        <OwnerSelect leadId={lead.id} owner={lead.owner} operators={operators} />

        <Link
          href={`/crm/lead/${lead.id}`}
          className="rounded border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
        >
          Open
        </Link>
      </div>
    </div>
  );
}

/**
 * A field that saves on blur.
 *
 * Only writes when the value actually changed, so tabbing through a card
 * doesn't generate a row of no-op updates.
 */
function InlineField({
  leadId,
  field,
  value,
  placeholder,
  type = 'text',
}: {
  leadId: string;
  field: 'phone' | 'email';
  value: string;
  placeholder: string;
  type?: string;
}) {
  const [draft, setDraft] = useState(value);
  const [, startTransition] = useTransition();

  return (
    <input
      type={type}
      value={draft}
      placeholder={placeholder}
      aria-label={field}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        if (draft === value) return;
        startTransition(() => {
          void actionSaveField(leadId, field, draft);
        });
      }}
      className="w-full rounded border border-transparent bg-background/60 px-2 py-1 font-[family-name:var(--font-geist-mono)] text-xs text-foreground transition-colors placeholder:text-muted-foreground/60 hover:border-border focus:border-[var(--primary)] focus:outline-none"
    />
  );
}
