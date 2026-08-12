'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useTransition } from 'react';

/**
 * Search and filter controls, written into the URL.
 *
 * Keeping filter state in the query string means a filtered view is a link —
 * shareable with the co-founder, and restorable on back/forward. The search
 * box debounces so typing doesn't fire a query per keystroke.
 */

type Option = { value: string; label: string };

export default function LeadFilters({
  states,
  segments,
  statuses,
}: {
  states: string[];
  segments: Option[];
  statuses: Option[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  function set(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    startTransition(() => router.replace(`/crm?${next.toString()}`, { scroll: false }));
  }

  // A ref, not a local: a local would be re-created on every render, so the
  // clearTimeout would never find the pending timer and the debounce would
  // silently do nothing.
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function setSearch(value: string) {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => set('q', value), 250);
  }

  const select =
    'rounded border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-[var(--primary)] focus:outline-none';

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <input
        type="search"
        defaultValue={params.get('q') ?? ''}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search name, program, email, phone…"
        aria-label="Search leads"
        className="min-w-[16rem] flex-1 rounded border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--primary)] focus:outline-none"
      />

      <select
        aria-label="Filter by segment"
        value={params.get('segment') ?? ''}
        onChange={(e) => set('segment', e.target.value)}
        className={select}
      >
        <option value="">All segments</option>
        {segments.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <select
        aria-label="Filter by status"
        value={params.get('status') ?? ''}
        onChange={(e) => set('status', e.target.value)}
        className={select}
      >
        <option value="">All statuses</option>
        {statuses.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <select
        aria-label="Filter by state"
        value={params.get('state') ?? ''}
        onChange={(e) => set('state', e.target.value)}
        className={select}
      >
        <option value="">All states</option>
        {states.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}
