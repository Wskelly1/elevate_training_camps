/**
 * Shared CRM presentation.
 *
 * The translation of the source CRM's terminal look onto the Elevate token
 * layer (docs/12-crm-plan.md §5): the density survives, the black ground does
 * not. Every colour here is a token — no hex literals, per the Phase 2 rule.
 *
 * Status colour is functional, not decorative: three states only —
 * green for good, rock for attention, destructive for overdue.
 */

import type { CheckinState, LeadStatus, LeadSegment } from '../../../lib/crm/types';
import { STATUS_LABELS, SEGMENT_LABELS } from '../../../lib/crm/types';

/* ---------------------------------------------------------------- headings */

export function SectionHead({
  title,
  blurb,
  children,
}: {
  title: string;
  blurb?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--primary-deep)]">
          {title}
        </h1>
        {blurb && (
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">{blurb}</p>
        )}
      </div>
      {children}
    </div>
  );
}

/** The big number row the source CRM opens every tab with. */
export function StatRow({ stats }: { stats: Array<{ label: string; value: number | string; tone?: 'default' | 'good' | 'warn' | 'bad' }> }) {
  const tones = {
    default: 'text-foreground',
    good: 'text-[var(--primary)]',
    warn: 'text-[var(--accent-rock)]',
    bad: 'text-[var(--destructive)]',
  };
  return (
    <div className="mb-6 flex flex-wrap gap-x-10 gap-y-4">
      {stats.map((s) => (
        <div key={s.label}>
          <div
            className={`font-[family-name:var(--font-display)] text-3xl leading-none ${tones[s.tone ?? 'default']}`}
          >
            {s.value}
          </div>
          <div className="mt-1 text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ pills */

const STATUS_TONE: Record<LeadStatus, string> = {
  new: 'border-border text-muted-foreground',
  contacted: 'border-[var(--accent-trail)]/40 text-[var(--accent-trail)]',
  callback: 'border-[var(--accent-rock)]/50 text-[var(--accent-rock)]',
  interested: 'border-[var(--primary)]/50 text-[var(--primary)]',
  booked: 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary-deep)]',
  no_interest: 'border-border text-muted-foreground/60',
};

export function StatusPill({ status }: { status: LeadStatus }) {
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-[0.65rem] uppercase tracking-[0.1em] ${STATUS_TONE[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export function SegmentPill({ segment }: { segment: LeadSegment }) {
  return (
    <span className="inline-block rounded border border-border px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.08em] text-muted-foreground">
      {SEGMENT_LABELS[segment]}
    </span>
  );
}

const CHECKIN_TONE: Record<CheckinState, { label: string; cls: string }> = {
  overdue: { label: 'Overdue', cls: 'border-[var(--destructive)]/50 text-[var(--destructive)]' },
  due_soon: { label: 'Due soon', cls: 'border-[var(--accent-rock)]/50 text-[var(--accent-rock)]' },
  current: { label: 'Current', cls: 'border-[var(--primary)]/50 text-[var(--primary)]' },
  never: { label: 'Never checked in', cls: 'border-border text-muted-foreground' },
};

export function CheckinPill({ state }: { state: CheckinState }) {
  const t = CHECKIN_TONE[state];
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-[0.65rem] uppercase tracking-[0.1em] ${t.cls}`}
    >
      {t.label}
    </span>
  );
}

/* ---------------------------------------------------------------- shells */

export function Card({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border border-border bg-surface p-4 ${className}`}>{children}</div>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-border px-6 py-16 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}

/** Label above a value, the CRM's basic field unit. */
export function Field({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div>
      <div className="text-[0.6rem] uppercase tracking-[0.15em] text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm text-foreground">{value}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ dates */

export function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** "3 days ago" — the relative form the check-in and call screens read better in. */
export function relativeDays(iso: string | null): string {
  if (!iso) return 'never';
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? 'a month ago' : `${months} months ago`;
}
