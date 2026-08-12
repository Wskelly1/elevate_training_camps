'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import type { CheckinState, Lead } from '../../../../lib/crm/types';
import { actionMarkCheckedIn } from '../actions';
import { CheckinPill, relativeDays } from '../ui';

/** One team on the check-in clock, with the single button that resets it. */
export default function CheckinRow({ lead, state }: { lead: Lead; state: CheckinState }) {
  const [pending, startTransition] = useTransition();
  const name = [lead.firstName, lead.lastName].filter(Boolean).join(' ');
  const attention = state === 'overdue' || state === 'never';

  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border bg-surface px-4 py-3 transition-opacity ${
        attention ? 'border-[var(--destructive)]/30' : 'border-border'
      } ${pending ? 'opacity-60' : ''}`}
    >
      <div className="min-w-0 flex-1">
        <Link
          href={`/crm/lead/${lead.id}`}
          className="block truncate font-[family-name:var(--font-display)] text-lg text-[var(--primary-deep)] hover:underline"
        >
          {lead.organization || name || lead.email}
        </Link>
        <div className="truncate text-xs text-muted-foreground">
          {[name && lead.organization ? name : '', [lead.city, lead.state].filter(Boolean).join(', ')]
            .filter(Boolean)
            .join(' · ')}
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        Last touch: {relativeDays(lead.lastCheckinAt)}
      </div>

      <CheckinPill state={state} />

      {lead.phone && (
        <a
          href={`tel:${lead.phone}`}
          className="rounded border border-border px-2.5 py-1 text-xs text-muted-foreground hover:border-[var(--primary)] hover:text-[var(--primary)]"
        >
          Call
        </a>
      )}

      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(() => {
            void actionMarkCheckedIn(lead.id);
          })
        }
        className="rounded border border-[var(--primary)]/50 px-3 py-1 text-xs text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/10 disabled:opacity-40"
      >
        Mark checked in
      </button>
    </div>
  );
}
