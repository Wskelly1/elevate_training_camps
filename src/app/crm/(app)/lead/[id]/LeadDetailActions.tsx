'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import type { Lead, LeadStatus } from '../../../../../lib/crm/types';
import { STATUS_LABELS, STATUS_ORDER } from '../../../../../lib/crm/types';
import type { Operator } from '../../../../../auth.config';
import {
  actionArchive,
  actionMarkCheckedIn,
  actionSetCallback,
  actionSetStatus,
} from '../../actions';
import OwnerSelect from '../../OwnerSelect';

/** Status, owner, callback and check-in controls for one lead. */
export default function LeadDetailActions({
  lead,
  operators,
}: {
  lead: Lead;
  operators: Operator[];
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const control =
    'rounded border border-border bg-surface px-3 py-1.5 text-sm text-foreground focus:border-[var(--primary)] focus:outline-none disabled:opacity-50';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        aria-label="Status"
        value={lead.status}
        disabled={pending}
        onChange={(e) =>
          startTransition(() => {
            void actionSetStatus(lead.id, e.target.value as LeadStatus);
          })
        }
        className={control}
      >
        {STATUS_ORDER.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>

      <OwnerSelect
        leadId={lead.id}
        owner={lead.owner}
        operators={operators}
        className={control}
      />

      <label className="flex items-center gap-2 text-xs text-muted-foreground">
        Callback
        <input
          type="datetime-local"
          disabled={pending}
          defaultValue={lead.callbackAt ? toLocalInput(lead.callbackAt) : ''}
          onChange={(e) =>
            startTransition(() => {
              void actionSetCallback(
                lead.id,
                e.target.value ? new Date(e.target.value).toISOString() : null,
              );
            })
          }
          className={control}
        />
      </label>

      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(() => {
            void actionMarkCheckedIn(lead.id);
          })
        }
        className="rounded border border-[var(--primary)]/50 px-3 py-1.5 text-sm text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/10 disabled:opacity-50"
      >
        Mark checked in
      </button>

      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!confirm('Archive this lead? It stays in the database but leaves every list.')) return;
          startTransition(() => {
            void actionArchive(lead.id).then(() => router.push('/crm'));
          });
        }}
        className="rounded border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-[var(--destructive)] hover:text-[var(--destructive)] disabled:opacity-50"
      >
        Archive
      </button>
    </div>
  );
}

/**
 * ISO → the `YYYY-MM-DDTHH:mm` that <input type="datetime-local"> requires,
 * in local time. Slicing the ISO string directly would show UTC and quietly
 * shift every callback by the timezone offset.
 */
function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
