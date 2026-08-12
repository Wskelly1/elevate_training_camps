'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import type { Lead, LeadStatus } from '../../../../lib/crm/types';
import { SEGMENT_LABELS, STATUS_LABELS, STATUS_ORDER } from '../../../../lib/crm/types';
import { actionSetStatus } from '../actions';
import { relativeDays } from '../ui';

/**
 * The dense funnel table.
 *
 * Keeps the source CRM's density — you can see thirty leads without
 * scrolling — on the cream ground rather than the terminal black. Scrolls
 * inside its own container so the page never scrolls sideways.
 */
export default function PipelineTable({ leads }: { leads: Lead[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[52rem] border-collapse bg-surface text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            {['Lead', 'Segment', 'Location', 'Phone', 'Last touch', 'Status'].map((h) => (
              <th
                key={h}
                className="px-4 py-2.5 text-[0.65rem] font-normal uppercase tracking-[0.15em] text-muted-foreground"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={pending ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
          {leads.map((lead) => {
            const name = [lead.firstName, lead.lastName].filter(Boolean).join(' ');
            return (
              <tr
                key={lead.id}
                className="border-b border-border/60 last:border-0 hover:bg-background/60"
              >
                <td className="max-w-[18rem] px-4 py-2.5">
                  <Link
                    href={`/crm/lead/${lead.id}`}
                    className="block truncate text-foreground hover:text-[var(--primary)]"
                  >
                    {lead.organization || name || lead.email}
                  </Link>
                  {lead.organization && name && (
                    <div className="truncate text-xs text-muted-foreground">{name}</div>
                  )}
                </td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">
                  {SEGMENT_LABELS[lead.segment]}
                </td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">
                  {[lead.city, lead.state].filter(Boolean).join(', ') || '—'}
                </td>
                <td className="px-4 py-2.5 font-[family-name:var(--font-geist-mono)] text-xs text-muted-foreground">
                  {lead.phone || '—'}
                </td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">
                  {relativeDays(lead.lastContactedAt)}
                </td>
                <td className="px-4 py-2.5">
                  <select
                    aria-label={`Status for ${lead.organization || name}`}
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
