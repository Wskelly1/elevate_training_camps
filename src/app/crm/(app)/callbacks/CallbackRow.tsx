'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import type { Lead } from '../../../../lib/crm/types';
import { actionLogCall, actionSetCallback, actionSetStatus } from '../actions';
import { formatDateTime } from '../ui';

/** One scheduled callback, with the two things you do to it: done, or move it. */
export default function CallbackRow({ lead, overdue = false }: { lead: Lead; overdue?: boolean }) {
  const [pending, startTransition] = useTransition();
  const name = [lead.firstName, lead.lastName].filter(Boolean).join(' ');

  function complete(outcome: string, status?: 'interested' | 'contacted' | 'no_interest') {
    startTransition(() => {
      void (async () => {
        await actionLogCall(lead.id, outcome);
        await actionSetCallback(lead.id, null);
        if (status) await actionSetStatus(lead.id, status);
      })();
    });
  }

  function postpone(days: number) {
    startTransition(() => {
      void actionSetCallback(lead.id, new Date(Date.now() + days * 86_400_000).toISOString());
    });
  }

  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border bg-surface px-4 py-3 transition-opacity ${
        overdue ? 'border-[var(--destructive)]/40' : 'border-border'
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
          {[name && lead.organization ? name : '', lead.phone].filter(Boolean).join(' · ')}
        </div>
      </div>

      <div
        className={`font-[family-name:var(--font-geist-mono)] text-xs ${
          overdue ? 'text-[var(--destructive)]' : 'text-muted-foreground'
        }`}
      >
        {formatDateTime(lead.callbackAt)}
      </div>

      {lead.phone && (
        <a
          href={`tel:${lead.phone}`}
          className="rounded border border-[var(--primary)]/50 px-3 py-1 text-xs text-[var(--primary)] hover:bg-[var(--primary)]/10"
        >
          Call
        </a>
      )}

      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          disabled={pending}
          onClick={() => complete('interested', 'interested')}
          className="rounded border border-[var(--primary)]/50 px-2.5 py-1 text-xs text-[var(--primary)] hover:bg-[var(--primary)]/10 disabled:opacity-40"
        >
          Interested
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => complete('reached', 'contacted')}
          className="rounded border border-border px-2.5 py-1 text-xs text-muted-foreground hover:border-foreground hover:text-foreground disabled:opacity-40"
        >
          Done
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => postpone(1)}
          className="rounded border border-border px-2.5 py-1 text-xs text-muted-foreground hover:border-foreground hover:text-foreground disabled:opacity-40"
        >
          +1d
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => postpone(7)}
          className="rounded border border-border px-2.5 py-1 text-xs text-muted-foreground hover:border-foreground hover:text-foreground disabled:opacity-40"
        >
          +1w
        </button>
      </div>
    </div>
  );
}
